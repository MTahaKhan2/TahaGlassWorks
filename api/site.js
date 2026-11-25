import { siteConfig } from './_lib.js';
export default function handler(_req, res) {
  res.setHeader('Cache-Control', 's-maxage=300');
  res.status(200).json(siteConfig());
}
