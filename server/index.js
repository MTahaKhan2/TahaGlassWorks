import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '../client/dist');
const dataFile = path.join(__dirname, 'data/inquiries.json');
const env = process.env;
const SERVICES = ['Glass Installation', 'Glass Partitions', 'Graphics & Animations', 'Decorative Glass', 'Custom Glass Work', 'Aluminium Windows', 'Aluminium Doors', 'Custom Aluminium Work'];

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '20kb' }));

// Public site settings (social links come from .env so they can change without a rebuild)
app.get('/api/site', (_req, res) => {
  const wa = (env.WHATSAPP_NUMBER || '923103516389').replace(/\D/g, '');
  res.json({
    whatsapp: `https://wa.me/${wa}`,
    instagram: env.INSTAGRAM_URL || 'https://instagram.com/',
    facebook: env.FACEBOOK_URL || 'https://facebook.com/',
    services: SERVICES,
  });
});
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again in a few minutes.' } });

function validate(b = {}) {
  const t = (v) => (typeof v === 'string' ? v.trim() : '');
  const d = { name: t(b.name), phone: t(b.phone), email: t(b.email), service: t(b.service), message: t(b.message) };
  const errors = {};
  if (d.name.length < 2 || d.name.length > 80) errors.name = 'Enter your name.';
  if (!/^[+\d\s()-]{7,20}$/.test(d.phone)) errors.phone = 'Enter a valid phone number.';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.email = 'Enter a valid email address.';
  if (d.service && !SERVICES.includes(d.service)) errors.service = 'Choose a service from the list.';
  if (d.message.length > 1000) errors.message = 'Keep your message under 1000 characters.';
  return { d, errors };
}

app.post('/api/contact', limiter, async (req, res) => {
  if (req.body?.website) return res.json({ ok: true }); // honeypot: bots fill this
  const { d, errors } = validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Please fix the highlighted fields.', errors });
  const entry = { id: Date.now().toString(36), ...d, createdAt: new Date().toISOString() };
  try {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    const list = JSON.parse(await fs.readFile(dataFile, 'utf8').catch(() => '[]'));
    list.push(entry);
    await fs.writeFile(dataFile, JSON.stringify(list, null, 2));
    if (env.SMTP_HOST) {
      const tx = nodemailer.createTransport({ host: env.SMTP_HOST, port: +env.SMTP_PORT || 587, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } });
      await tx.sendMail({
        from: env.SMTP_USER, to: env.MAIL_TO, replyTo: d.email || undefined,
        subject: `New quote request from ${d.name}`,
        text: `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nService: ${d.service || '-'}\n\n${d.message || '(no message)'}`,
      });
    }
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not send your request. Please message us on WhatsApp.' });
  }
});

if (env.NODE_ENV === 'production') {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}
app.listen(env.PORT || 5000, () => console.log(`TGW server on :${env.PORT || 5000}`));
