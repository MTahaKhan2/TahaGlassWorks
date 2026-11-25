import { validate, sendInquiry } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  if (body.website) return res.status(200).json({ ok: true }); // honeypot: bots fill this
  const { d, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Please fix the highlighted fields.', errors });
  try {
    const sent = await sendInquiry(d);
    if (!sent) return res.status(503).json({ error: 'Quote requests are not set up yet. Please message us on WhatsApp.' });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Could not send your request. Please message us on WhatsApp.' });
  }
}
