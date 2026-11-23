# Panel Store Starter

A premium-looking starter for a digital-product/key store with a customer login, admin dashboard, theme color controls, click animations, and a server-side API integration scaffold.

## Run locally
1. Install Node.js 20+
2. In this folder run `npm install`
3. Copy `.env.example` to `.env` and set a long random `SESSION_SECRET`
4. Run `npm start`
5. Open http://localhost:3000

Demo login (local starter only):
- Admin: `admin@example.com` / `ChangeMe123!`
- Customer: `user@example.com` / `ChangeMe123!`

Change these credentials before deployment. This starter uses in-memory demo data and is NOT production-ready.

## Included
- Responsive premium dashboard UI
- Admin/customer role separation in the demo
- Product/key catalogue and order history examples
- Theme accent selector and animated click feedback
- Server-side API provider configuration scaffold
- API connection test endpoint and request logs
- Webhook example endpoint

## Important before real payments / launch
- Replace demo in-memory users and data with a database.
- Add password hashing, rate limiting, CSRF protection, secure session storage, audit logs, backups, and account recovery.
- Connect only APIs you are authorized to use. Keep provider secrets in server environment variables; never put secret keys in browser code.
- Implement each provider's documented authentication, signature verification, idempotency, and webhook validation.
- Use a licensed payment gateway. Never store card/UPI credentials.
- Do not use this system to distribute cheats, hacks, anti-cheat bypasses, or unauthorized game modifications.
- Android app can later use the same backend API; this ZIP currently contains the responsive website/backend starter, not a compiled APK.
