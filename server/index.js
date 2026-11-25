import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { siteConfig, validate, sendInquiry } from '../api/_lib.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '../client/dist');
const dataFile = path.join(__dirname, 'data/inquiries.json');
const env = process.env;

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '20kb' }));

// Public site settings (social links come from .env so they can change without a rebuild)
app.get('/api/site', (_req, res) => res.json(siteConfig()));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again in a few minutes.' } });

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
    await sendInquiry(d).catch((e) => console.error('mail failed', e.message));
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
