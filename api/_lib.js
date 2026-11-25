import nodemailer from 'nodemailer';

export const SERVICES = ['Glass Installation', 'Glass Partitions', 'Graphics & Animations', 'Decorative Glass', 'Custom Glass Work', 'Aluminium Windows', 'Aluminium Doors', 'Custom Aluminium Work'];

export function siteConfig(env = process.env) {
  const wa = (env.WHATSAPP_NUMBER || '923103516389').replace(/\D/g, '');
  return { whatsapp: `https://wa.me/${wa}`, instagram: env.INSTAGRAM_URL || 'https://instagram.com/', facebook: env.FACEBOOK_URL || 'https://facebook.com/', services: SERVICES };
}

export function validate(b = {}) {
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

// Returns false when SMTP is not configured (nothing was sent)
export async function sendInquiry(d, env = process.env) {
  if (!env.SMTP_HOST) return false;
  const tx = nodemailer.createTransport({ host: env.SMTP_HOST, port: +env.SMTP_PORT || 587, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } });
  await tx.sendMail({
    from: env.SMTP_USER, to: env.MAIL_TO, replyTo: d.email || undefined,
    subject: `New quote request from ${d.name}`,
    text: `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nService: ${d.service || '-'}\n\n${d.message || '(no message)'}`,
  });
  return true;
}
