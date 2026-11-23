import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-change-this',
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 8 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Demo-only users. Replace with a database and password hashing before deployment.
const users = [
  { id: 1, email: 'admin@example.com', password: 'ChangeMe123!', role: 'admin', name: 'Master Admin' },
  { id: 2, email: 'user@example.com', password: 'ChangeMe123!', role: 'customer', name: 'Demo Customer' }
];
const providers = []; // Store encrypted secrets in a real database, never in client code.
const apiLogs = [];

function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Please log in' });
  next();
}
function requireAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect' });
  req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
  res.json({ user: req.session.user });
});
app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/me', (req, res) => res.json({ user: req.session.user || null }));
app.get('/api/dashboard', requireLogin, (req, res) => res.json({
  user: req.session.user,
  stats: { orders: 18, sales: 12450, activeKeys: 42, customers: 126 }
}));
app.get('/api/admin/providers', requireLogin, requireAdmin, (req, res) =>
  res.json({ providers: providers.map(({ id, name, baseUrl, enabled }) => ({ id, name, baseUrl, enabled })) })
);
app.post('/api/admin/providers', requireLogin, requireAdmin, (req, res) => {
  const { name, baseUrl, secret } = req.body || {};
  if (!name || !baseUrl || !secret) return res.status(400).json({ error: 'Name, base URL and secret are required' });
  let parsed;
  try { parsed = new URL(baseUrl); } catch { return res.status(400).json({ error: 'Invalid URL' }); }
  if (parsed.protocol !== 'https:') return res.status(400).json({ error: 'Use HTTPS API endpoints' });
  const provider = { id: Date.now(), name, baseUrl, secret, enabled: true };
  providers.push(provider);
  res.status(201).json({ id: provider.id, name, baseUrl, enabled: true, note: 'Demo memory only; encrypt secrets in production.' });
});
app.post('/api/admin/providers/:id/test', requireLogin, requireAdmin, async (req, res) => {
  const provider = providers.find(p => String(p.id) === req.params.id);
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  // Provider-specific test calls should be implemented from the provider's official API docs.
  apiLogs.unshift({ at: new Date().toISOString(), provider: provider.name, status: 'test-scaffold' });
  res.json({ ok: true, message: 'Provider saved. Add the authorized provider-specific test request here.' });
});
app.get('/api/admin/logs', requireLogin, requireAdmin, (req, res) => res.json({ logs: apiLogs }));
app.post('/api/webhooks/example', (req, res) => {
  // Verify provider signature and event authenticity before processing in production.
  res.status(202).json({ accepted: true, message: 'Webhook scaffold received; signature verification is not implemented.' });
});
app.listen(process.env.PORT || 3000, () => console.log(`Panel Store running on port ${process.env.PORT || 3000}`));
