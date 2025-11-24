import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { saveMatrix, getMatrixById, hasFullUnlock, getUserSubscription, saveQuestion } from "./db";
import { ENV } from "./_core/env";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { users, payments, subscriptions, matrices } from "../drizzle/schema";
import { getDb } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  matrix: router({
    calculate: publicProcedure
      .input(z.object({
        name: z.string(),
        birthDate: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/),
        gender: z.enum(["male", "female"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const { calculateMatrix } = await import("@shared/matrixCalculator");
        const calculation = calculateMatrix(input.birthDate);
        
        // Save to database
        const matrixData = {
          userId: ctx.user?.id,
          name: input.name,
          birthDate: input.birthDate,
          gender: input.gender,
          arcanaNumbers: JSON.stringify(calculation.allArcana),
          matrixData: JSON.stringify(calculation),
        };
        
        const result = await saveMatrix(matrixData) as any;
        const matrixId = Number(result[0]?.insertId || result.insertId);
        
        return {
          id: matrixId,
          calculation,
          hasAccess: false, // Free tier - no access to AI interpretation
        };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const matrix = await getMatrixById(input.id);
        if (!matrix) throw new Error("Matrix not found");
        
        const hasAccess = await hasFullUnlock(input.id, ctx.user?.id);
        
        return {
          matrix,
          calculation: JSON.parse(matrix.matrixData),
          hasAccess,
        };
      }),
    
    checkAccess: publicProcedure
      .input(z.object({ matrixId: z.number() }))
      .query(async ({ input, ctx }) => {
        const hasAccess = await hasFullUnlock(input.matrixId, ctx.user?.id);
        return { hasAccess };
      }),
  }),

  payment: router({
    createCheckout: protectedProcedure
      .input(z.object({
        productType: z.enum(["full_unlock", "single_question", "monthly_subscription"]),
        matrixId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(ENV.stripeSecretKey, { apiVersion: "2025-10-29.clover" });
        const { PRODUCTS } = await import("./products");
        
        const product = input.productType === "full_unlock" ? PRODUCTS.FULL_UNLOCK :
                       input.productType === "single_question" ? PRODUCTS.SINGLE_QUESTION :
                       PRODUCTS.MONTHLY_SUBSCRIPTION;
        
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        
        const sessionConfig: any = {
          mode: product.type === "subscription" ? "subscription" : "payment",
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            product_type: input.productType,
            matrix_id: input.matrixId?.toString() || "",
          },
          success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/matrix/${input.matrixId || ""}`,
          allow_promotion_codes: true,
        };
        
        if (product.type === "subscription") {
          sessionConfig.line_items = [{
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
              },
              recurring: {
                interval: product.interval,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          }];
        } else {
          sessionConfig.line_items = [{
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          }];
        }
        
        const session = await stripe.checkout.sessions.create(sessionConfig);
        
        return { checkoutUrl: session.url };
      }),
    
    checkSubscription: protectedProcedure
      .query(async ({ ctx }) => {
        const subscription = await getUserSubscription(ctx.user.id);
        return { hasSubscription: !!subscription, subscription };
      }),
  }),

  ai: router({
    generateInterpretation: protectedProcedure
      .input(z.object({ matrixId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Check if user has access
        const hasAccess = await hasFullUnlock(input.matrixId, ctx.user.id);
        if (!hasAccess) {
          throw new Error("You need to unlock the full matrix to access AI interpretations");
        }
        
        const matrix = await getMatrixById(input.matrixId);
        if (!matrix) throw new Error("Matrix not found");
        
        const calculation = JSON.parse(matrix.matrixData);
        const { invokeLLM } = await import("./_core/llm");
        const { ARCANA_DATA } = await import("@shared/arcanaData");
        
        // Build context with arcana meanings
        const arcanaContext = calculation.allArcana.map((num: number, idx: number) => {
          const arcana = ARCANA_DATA[num];
          return `Position ${idx + 1} - Arcana ${num} (${arcana.name}): ${arcana.keywords.join(", ")}`;
        }).join("\n");
        
        const prompt = `You are an expert in Destiny Matrix numerology. Analyze this person's matrix and provide a comprehensive interpretation.

Name: ${matrix.name}
Birth Date: ${matrix.birthDate}

Key Numbers:
- Destiny: ${calculation.destiny}
- Purpose: ${calculation.purpose}
- Money: ${calculation.money}
- Health: ${calculation.health}
- Talents: ${calculation.talents}
- Relationships: ${calculation.relationships}
- Spiritual: ${calculation.spiritual}

All 22 Arcana Positions:
${arcanaContext}

Provide a detailed, personalized interpretation covering:
1. Life Purpose & Destiny
2. Natural Talents & Abilities
3. Career & Money
4. Relationships & Love
5. Health & Wellbeing
6. Spiritual Path
7. Key Challenges & Lessons

Make it personal, insightful, and actionable. Use a warm, mystical tone.`;
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a wise Destiny Matrix expert who provides deep, personalized insights." },
            { role: "user", content: prompt },
          ],
        });
        
        const interpretation = response.choices[0].message.content;
        
        return { interpretation };
      }),
    
    askQuestion: protectedProcedure
      .input(z.object({
        matrixId: z.number(),
        question: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if user has subscription or paid for this question
        const subscription = await getUserSubscription(ctx.user.id);
        if (!subscription) {
          throw new Error("You need an active subscription or pay per question to ask questions");
        }
        
        const matrix = await getMatrixById(input.matrixId);
        if (!matrix) throw new Error("Matrix not found");
        
        const calculation = JSON.parse(matrix.matrixData);
        const { invokeLLM } = await import("./_core/llm");
        
        const prompt = `Based on this Destiny Matrix:

Name: ${matrix.name}
Key Numbers: Destiny ${calculation.destiny}, Purpose ${calculation.purpose}, Money ${calculation.money}, Health ${calculation.health}, Talents ${calculation.talents}, Relationships ${calculation.relationships}

Question: ${input.question}

Provide a detailed, insightful answer based on their matrix numbers.`;
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a Destiny Matrix expert answering specific questions." },
            { role: "user", content: prompt },
          ],
        });
        
        const answer = response.choices[0].message.content as string;
        
        // Save question and answer
        await saveQuestion({
          userId: ctx.user.id,
          matrixId: input.matrixId,
          question: input.question,
          answer: answer || "",
          paymentId: null, // For subscribers
        });
        
        return { answer };
      }),
  }),

  // Admin router with OSINT capabilities (owner only)
  admin: router({
    listUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      return await db.select().from(users);
    }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const allUsers = await db.select().from(users);
      const allPayments = await db.select().from(payments);
      const allSubscriptions = await db.select().from(subscriptions);
      const allMatrices = await db.select().from(matrices);
      
      const totalRevenue = allPayments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0);
      
      const activeSubscriptions = allSubscriptions.filter(s => s.status === "active").length;
      
      return {
        totalUsers: allUsers.length,
        totalRevenue,
        activeSubscriptions,
        totalMatrices: allMatrices.length,
      };
    }),

    listPayments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      return await db.select().from(payments);
    }),

    addCredits: protectedProcedure
      .input(z.object({ userId: z.number(), amount: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
        if (user.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        
        const newCredits = user[0].credits + input.amount;
        await db.update(users).set({ credits: newCredits }).where(eq(users.id, input.userId));
        
        return { success: true, newCredits };
      }),

    removeCredits: protectedProcedure
      .input(z.object({ userId: z.number(), amount: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
        if (user.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        
        const newCredits = Math.max(0, user[0].credits - input.amount);
        await db.update(users).set({ credits: newCredits }).where(eq(users.id, input.userId));
        
        return { success: true, newCredits };
      }),

    updateUserOSINT: protectedProcedure
      .input(z.object({
        userId: z.number(),
        phone: z.string().optional(),
        ipAddress: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        const { userId, ...updates } = input;
        await db.update(users).set(updates).where(eq(users.id, userId));
        
        return { success: true };
      }),

    exportUserData: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const allUsers = await db.select().from(users);
      
      // Format for OSINT analysis
      const osintData = allUsers.map(user => ({
        id: user.id,
        fullName: user.name || "N/A",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        ipAddress: user.ipAddress || "N/A",
        country: user.country || "N/A",
        city: user.city || "N/A",
        userAgent: user.userAgent || "N/A",
        registeredAt: user.createdAt,
        lastSeen: user.lastSignedIn,
        role: user.role,
        credits: user.credits,
      }));
      
      return osintData;
    }),
  }),
});

export type AppRouter = typeof appRouter;
