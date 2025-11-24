import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  matrices, 
  InsertMatrix,
  payments,
  InsertPayment,
  subscriptions,
  InsertSubscription,
  questions,
  InsertQuestion
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Matrix operations
export async function saveMatrix(matrix: InsertMatrix) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(matrices).values(matrix);
  return result;
}

export async function getMatrixById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(matrices).where(eq(matrices.id, id)).limit(1);
  return result[0] || null;
}

export async function getUserMatrices(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(matrices).where(eq(matrices.userId, userId));
}

// Payment operations
export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(payment);
  return result;
}

export async function getPaymentsByMatrixId(matrixId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).where(eq(payments.matrixId, matrixId));
}

export async function hasFullUnlock(matrixId: number, userId: number | undefined) {
  const db = await getDb();
  if (!db) return false;
  
  // Check if user has active subscription
  if (userId) {
    const sub = await db.select().from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      ))
      .limit(1);
    if (sub.length > 0) return true;
  }
  
  // Check if matrix has full unlock payment
  const payment = await db.select().from(payments)
    .where(and(
      eq(payments.matrixId, matrixId),
      eq(payments.type, "full_unlock"),
      eq(payments.status, "completed")
    ))
    .limit(1);
  
  return payment.length > 0;
}

// Subscription operations
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(subscriptions)
    .where(and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active")
    ))
    .limit(1);
  
  return result[0] || null;
}

export async function createSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(subscriptions).values(subscription);
  return result;
}

// Question operations
export async function saveQuestion(question: InsertQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(questions).values(question);
  return result;
}

export async function getQuestionsByMatrixId(matrixId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(questions).where(eq(questions.matrixId, matrixId));
}
