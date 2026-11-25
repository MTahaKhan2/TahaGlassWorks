# TGW – Glass & Aluminium landing page
React (Vite) + Node/Express.

## Run (development)
1. `npm run install:all`
2. `cp server/.env.example server/.env` and set INSTAGRAM_URL / FACEBOOK_URL (and SMTP_* if you want email)
3. `npm run dev` → site on http://localhost:5173, API on :5000

## Production
`npm run build && npm start` → Express serves the built site and the API on one port.

Inquiries are saved in `server/data/inquiries.json` (and emailed if SMTP is set).
To change the hero photo, replace `client/src/assets/images/hero.jpg`.
