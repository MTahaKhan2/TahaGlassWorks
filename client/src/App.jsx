import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Instagram, Facebook, Close } from './Icons.jsx';
import logo from './assets/Logo.svg';
import logoWhite from './assets/Logo-white.svg';
import waIcon from './assets/whatsapp.svg';
import luckyLogo from './assets/lucky.svg';
import hero from './assets/images/hero.jpg';
import craft from './assets/images/craftsmanship.png';
import quality from './assets/images/quality.png';
import precision from './assets/images/precision.png';
import durability from './assets/images/durability.png';
import ctaBg from './assets/images/cta-bg.png';
import p1 from './assets/images/project-1.png';
import p2 from './assets/images/project-2.png';
import p3 from './assets/images/project-3.png';
import p4 from './assets/images/project-4.png';
import chawla from './assets/brands/chawla.png';
import prime from './assets/brands/prime.png';
import ghani from './assets/brands/ghani.png';
import tariq from './assets/brands/tariq.png';

const PHONE = '+92 310 3516389';
const EMAIL = 'info@tahaglasswork.com';
const ADDRESS = 'Old Palace cinema, Sir Syed Rd, Muslimabad, Mirpur Khās, 69000';
const DEFAULTS = { whatsapp: 'https://wa.me/923103516389', instagram: 'https://instagram.com/', facebook: 'https://facebook.com/', services: [] };

const NAV = [['Home', '#home'], ['About Us', '#approach'], ['What We Do', '#values'], ['Our Services', '#expertise'], ['Our Projects', '#projects']];
const PROJECTS = [[p1, 'Glass door in a kitchen opening onto a courtyard'], [p2, 'Aluminium French doors with one leaf open'], [p3, 'Frosted glass bathroom door with a slim black frame'], [p4, 'Aluminium entrance door with frosted panes and a side panel']];
const BRANDS = [[chawla, 'Chawla Aluminium'], [prime, 'Prime Aluminium Industries'], [luckyLogo, 'Lucky Aluminum'], [ghani, 'Ghani Glass'], [tariq, 'Tariq Float Glass']];
const STATS = [['Glass work experience', '20+', 'Years of expertise in quality glasswork and craftsmanship.'], ['Aluminium work experience', '8+', 'Years of experience in aluminium solutions and installation.'], ['Trusted suppliers', '02', 'Trusted glass sources: Ghani Glass and Tariq Float.']];
const EXPERTISE = [['Home', '#home'], ['About Us', '#approach'], ['Services', '#expertise'], ['Our Work', '#projects'], ['Contact Us', '#contact']];
const AREAS = [['Glass Installation', 'Glass Partitions', 'Graphics & Animations', 'Decorative Glass', 'Custom Glass Work'], ['Aluminium Windows', 'Aluminium Doors', 'Custom Aluminium Work']];

const Btn = ({ children, ...rest }) => <button type="button" className="btn" {...rest}>{children}</button>;
const WaPill = ({ site, light }) => (
  <a className={`pill ${light ? 'pill-light' : ''}`} href={site.whatsapp} target="_blank" rel="noreferrer">
    <img src={waIcon} alt="" width="22" height="22" />{PHONE}
  </a>
);
const Label = ({ children }) => <div className="label"><span className="dot"><ArrowUpRight /></span><span>{children}</span></div>;

function ContactModal({ open, onClose, services }) {
  const ref = useRef(null);
  const [state, setState] = useState({ status: 'idle', errors: {}, message: '' });
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setState({ status: 'sending', errors: {}, message: '' });
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) return setState({ status: 'error', errors: data.errors || {}, message: data.error || 'Something went wrong.' });
      form.reset();
      setState({ status: 'done', errors: {}, message: '' });
    } catch {
      setState({ status: 'error', errors: {}, message: 'Could not reach the server. Please message us on WhatsApp.' });
    }
  }
  const err = (k) => state.errors[k] && <span className="err">{state.errors[k]}</span>;
  const close = () => { setState({ status: 'idle', errors: {}, message: '' }); onClose(); };

  return (
    <dialog ref={ref} className="modal" onClose={close} onClick={(e) => e.target === ref.current && close()}>
      <div className="modal-box">
        <button className="x" onClick={close} aria-label="Close"><Close /></button>
        {state.status === 'done' ? (
          <div className="done"><h3>Request sent</h3><p>Thank you. We will call you back on the number you gave us.</p><Btn onClick={close}>Close</Btn></div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h3>Get a free quote</h3>
            <p className="muted">Tell us what you need. We will get back to you soon.</p>
            <input className="hp" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <label>Name<input name="name" required autoComplete="name" />{err('name')}</label>
            <label>Phone<input name="phone" type="tel" required autoComplete="tel" />{err('phone')}</label>
            <label>Email (optional)<input name="email" type="email" autoComplete="email" />{err('email')}</label>
            <label>Service<select name="service" defaultValue=""><option value="">Choose a service</option>{services.map((s) => <option key={s}>{s}</option>)}</select>{err('service')}</label>
            <label>Message (optional)<textarea name="message" rows="3" maxLength="1000" />{err('message')}</label>
            {state.message && <p className="err" role="alert">{state.message}</p>}
            <Btn type="submit" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending…' : 'Send request'}</Btn>
          </form>
        )}
      </div>
    </dialog>
  );
}

export default function App() {
  const [site, setSite] = useState(DEFAULTS);
  const [open, setOpen] = useState(false);
  useEffect(() => { fetch('/api/site').then((r) => r.json()).then((d) => setSite({ ...DEFAULTS, ...d })).catch(() => {}); }, []);
  const quote = () => setOpen(true);
  const track = [...PROJECTS, ...PROJECTS];

  return (
    <>
      <header className="nav wrap">
        <a href="#home" aria-label="TGW home"><img src={logo} alt="TGW" className="logo" /></a>
        <nav aria-label="Main">{NAV.map(([t, h], i) => <a key={t} href={h} className={i === 0 ? 'on' : ''}>{t}</a>)}</nav>
        <Btn onClick={quote}>Get in Touch</Btn>
      </header>

      <main>
        <section id="home" className="wrap">
          <div className="hero" style={{ '--hero': `url(${hero})` }}>
            <h1><b>Premium Glass &amp; Aluminium</b><br />Solutions for <b>Modern Spaces.</b></h1>
            <p>Quality craftsmanship. Reliable materials. Professional installation.</p>
            <div className="row"><a className="btn" href="#projects">Explore Our Work</a><WaPill site={site} light /></div>
          </div>
        </section>

        <section id="approach" className="wrap split">
          <Label>Our Approach</Label>
          <div>
            <h2 className="big">From selecting quality materials to delivering precise workmanship, we focus on every detail to bring your vision to life.</h2>
            <p className="lead">We combine experience, precision, and quality to create solutions that elevate every space.</p>
            <Btn onClick={quote}>Get in Touch</Btn>
          </div>
        </section>

        <section id="values" className="wrap">
          <div className="head"><h2 className="title">Our <em>Main</em> <b>values</b></h2><p>We believe in building lasting relationships through quality craftsmanship, trusted materials, and a commitment to excellence in every project.</p></div>
          <div className="bento">
            <article className="card c-craft"><img src={craft} alt="" /><div><h3>Craftsmanship</h3><p>Delivering exceptional glass and aluminium work with attention to detail, experience, and professional finishing.</p></div></article>
            <article className="card c-qual"><img src={quality} alt="" /><div><h3>Quality Materials</h3><p>We source quality glass materials from trusted suppliers like Ghani Glass and Tariq Float.</p></div></article>
            <article className="card"><img src={precision} alt="" /><div><h3>Precision</h3><p>From accurate measurements to flawless installation, we focus on getting every detail right.</p></div></article>
            <article className="card"><img src={durability} alt="" /><div><h3>Durability</h3><p>Creating strong, functional, and long-lasting glass and aluminium solutions for every space.</p></div></article>
          </div>
        </section>

        <section id="projects">
          <div className="wrap head"><h2 className="title">Our <em>Projects</em></h2><p>Explore our work across residential and commercial spaces, showcasing quality craftsmanship, modern designs, and attention to every detail.</p></div>
          <div className="marquee" aria-label="Project gallery">
            <ul className="track">
              {track.map(([src, alt], i) => <li key={i} aria-hidden={i >= PROJECTS.length}><img src={src} alt={i < PROJECTS.length ? alt : ''} loading="lazy" /></li>)}
            </ul>
          </div>
          <div className="wrap stats">
            {STATS.map(([t, n, d], i) => <div key={t} className={`stat ${i === 0 ? 'stat-on' : ''}`}><h3>{t}</h3><strong>{n}</strong><p>{d}</p></div>)}
          </div>
          <div className="center"><a className="btn" href={`${site.whatsapp}?text=${encodeURIComponent('Hi, I would like to see more of your projects.')}`} target="_blank" rel="noreferrer">View All Projects</a></div>
        </section>

        <section id="materials" className="wrap split">
          <Label>Quality Materials We Choose</Label>
          <div>
            <h2 className="big">We carefully select quality glass and aluminium materials from established brands to ensure reliable performance, durability, and excellent finishing.</h2>
            <p className="lead">We source materials from <b>trusted brands</b> to <b>deliver quality you can rely on.</b></p>
            <ul className="brands">{BRANDS.map(([s, n]) => <li key={n}><img src={s} alt={n} loading="lazy" /></li>)}</ul>
            <div className="row"><Btn onClick={quote}>Get in Touch</Btn><WaPill site={site} /></div>
          </div>
        </section>

        <section className="wrap">
          <div className="cta" style={{ '--bg': `url(${ctaBg})` }}>
            <h2>Ready to Transform Your Space?</h2>
            <p>Looking for premium glass and aluminium solutions? Let our experience and craftsmanship bring your vision to life. Get in touch and let's build something exceptional together.</p>
            <button className="btn btn-white" onClick={quote}>Get a Free Quote</button>
          </div>
        </section>

        <section id="contact" className="wrap contact">
          <p className="tag"><b>Quality craftsmanship.</b> Glass &amp; Aluminium built to last.</p>
          <div className="info">
            <dl>
              <dt>Call us</dt><dd><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></dd>
              <dt>Email</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
              <dd className="faint">{ADDRESS}</dd>
            </dl>
            <div><span className="faint">Follow Us</span>
              <ul className="follow">
                <li><a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
                <li><a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
                <li><a href={site.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer id="expertise">
        <div className="wrap">
          <h2 className="title">Our <em>areas</em> of <b>expertise</b></h2>
          <div className="fgrid">
            <h3>Quick Links</h3>
            <ul>{EXPERTISE.map(([t, h]) => <li key={t}><a href={h}>{t}</a></li>)}</ul>
            {AREAS.map((col, i) => <ul key={i}>{col.map((t) => <li key={t}>{t}</li>)}</ul>)}
            <ul><li>{PHONE}</li><li>{EMAIL}</li><li>{ADDRESS}</li></ul>
          </div>
          <div className="fbar">
            <img src={logoWhite} alt="TGW" className="logo" />
            <div className="social">
              <a href={site.facebook} target="_blank" rel="noreferrer"><Facebook />Facebook</a>
              <a href={site.instagram} target="_blank" rel="noreferrer"><Instagram />Instagram</a>
              <a href={site.whatsapp} target="_blank" rel="noreferrer"><img src={waIcon} alt="" width="20" height="20" />WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>
      <ContactModal open={open} onClose={() => setOpen(false)} services={site.services} />
    </>
  );
}
