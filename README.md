# Student Lead Portal — Vercel + Supabase

A full-stack Next.js student registration site with a Supabase database and protected admin dashboard.

## Included
- Public registration form (name, email, mobile, WhatsApp, promo code, consent)
- Server-side validation and active promo-code check
- Secure admin login via Supabase Auth
- Admin-only leads API (server checks the `admins` table)
- Search, status filter, WhatsApp, call, CSV export and delete
- Supabase SQL schema

## 1. Create Supabase project
1. Create a project at https://supabase.com
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. In **Authentication > Users**, create your admin user with email/password.
4. Copy that user's UUID. In SQL Editor run:
   ```sql
   insert into public.admins(user_id) values ('YOUR-ADMIN-USER-UUID');
   ```
5. In the `promo_codes` table, change `START2026` to your actual promo code or add more codes:
   ```sql
   insert into public.promo_codes(code, description, active)
   values ('YOURCODE', 'Your campaign', true);
   ```
6. Copy Project URL, anon/public key, and service_role key from **Project Settings > API**.

## 2. Run locally
```bash
cp .env.example .env.local
# Fill in the three Supabase values in .env.local
npm install
npm run dev
```
Open http://localhost:3000

## 3. Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Add these Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Redeploy after changing environment variables.

## Admin
- Open `/admin` and sign in with the admin user created in Supabase.
- The user must also have a row in `public.admins`; otherwise access is denied.
- Dashboard: `/admin/dashboard`.

## Important before going live
- Replace the sample brand name, copy, and privacy notice with your own.
- Use your actual promo code(s) in `promo_codes`. Unknown or inactive codes are rejected.
- The service-role key is highly privileged. Put it ONLY in server environment variables on Vercel. Never use it in any `NEXT_PUBLIC_` variable or browser code.
- Configure Supabase Auth email/password policies and enable appropriate project security settings.
- This starter does not send admin email notifications or automated WhatsApp messages. WhatsApp buttons open a pre-filled chat for a staff member to send manually.
- For production at scale, add a persistent rate limiter/CAPTCHA, audit logging, backup policy, and an email provider. The sample API's honeypot is only basic spam friction.
- Publish a complete privacy notice and collect consent consistent with your applicable privacy/data-protection requirements.
