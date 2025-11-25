# Deployment Guide for The Three Path Life

## Prerequisites

Before deploying to Vercel, ensure you have:

1. A Vercel account
2. All required environment variables configured
3. Database set up and accessible
4. Stripe account configured
5. OpenAI API key
6. AWS S3 bucket for file storage (optional)

## Environment Variables

You need to configure the following environment variables in your Vercel project settings:

### Application Configuration
- `VITE_APP_LOGO` - Path to your app logo (e.g., `/logo.png`)
- `VITE_APP_TITLE` - Your application title
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint URL (optional)
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID (optional)

### Database Configuration
- `DATABASE_URL` - MySQL connection string (format: `mysql://user:password@host:port/database`)

### OpenAI Configuration
- `OPENAI_API_KEY` - Your OpenAI API key for AI interpretations

### Stripe Configuration
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

### AWS S3 Configuration (Optional)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `AWS_S3_BUCKET` - S3 bucket name

### Authentication
- `JWT_SECRET` - Secret key for JWT token generation (use a strong random string)

### Server Configuration
- `NODE_ENV` - Set to `production`
- `PORT` - Server port (default: 3000)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables in the project settings
6. Deploy

## Post-Deployment Configuration

### 1. Configure Stripe Webhook

After deployment, you need to configure the Stripe webhook:

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Click "Add endpoint"
4. Enter your webhook URL: `https://your-domain.vercel.app/api/stripe/webhook`
5. Select the events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copy the webhook signing secret and add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 2. Configure Database

Ensure your database is accessible from Vercel's servers. If using a cloud database:
- Add Vercel's IP addresses to your database firewall rules
- Or use a service like PlanetScale, Supabase, or Railway that works well with Vercel

### 3. Test Your Deployment

1. Visit your deployed URL
2. Test the calculator functionality
3. Test user registration and login
4. Test payment flows (use Stripe test mode)
5. Verify AI interpretations are working

## Troubleshooting

### Build Fails

- Check that all dependencies are listed in `package.json`
- Verify that the build command completes successfully locally
- Check Vercel build logs for specific error messages

### Environment Variables Not Working

- Ensure all required environment variables are set in Vercel project settings
- Variables starting with `VITE_` need to be set at build time
- Redeploy after adding new environment variables

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database firewall rules
- Ensure database is accessible from Vercel's servers

### API Routes Not Working

- Verify the `vercel.json` configuration is correct
- Check that the API routes are properly defined
- Review Vercel function logs for errors

## Performance Optimization

### Reduce Bundle Size

The current build produces a large JavaScript bundle (>500KB). Consider:

1. **Code Splitting**: Use dynamic imports for large components
   ```javascript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. **Tree Shaking**: Ensure unused code is removed
   - Import only what you need from libraries
   - Use ES6 imports instead of CommonJS

3. **Optimize Dependencies**: 
   - Review and remove unused dependencies
   - Consider lighter alternatives for heavy libraries

### Caching Strategy

Configure appropriate cache headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring

- Enable Vercel Analytics for performance monitoring
- Set up error tracking (e.g., Sentry)
- Monitor Stripe webhooks in the Stripe Dashboard
- Set up uptime monitoring

## Support

For issues specific to Vercel deployment, consult:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
