import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/home/claude/haidrun-site';
const raw = fs.readFileSync(path.join(ROOT, '_prototype.html'), 'utf8');

// ---- 1. Collect all <style> blocks -> global.css, and remove from doc ----
const styleRe = /<style>([\s\S]*?)<\/style>/g;
let styles = [];
let doc = raw.replace(styleRe, (_, css) => { styles.push(css); return ''; });
let globalCss = styles.join('\n\n');
// Multipage fix: pages must all be visible (kill the SPA router hiding)
globalCss = globalCss
  .replace('.page{display:none}', '.page{display:block}')
  .replace('.page.active{display:block; animation:fade .4s ease}', '.page{animation:none}');

// ---- 2. Collect all <script> blocks; classify ----
const scriptRe = /<script>([\s\S]*?)<\/script>/g;
let scripts = [];
doc = doc.replace(scriptRe, (_, js) => { scripts.push(js); return ''; });
// Drop the SPA hash-router (the one toggling .page active on hash). Keep guarded animation scripts.
const keptScripts = scripts.filter(s => !(s.includes("querySelectorAll('.page')") && s.includes('location.hash')));

// ---- 3. Extract header inner and footer ----
const header = doc.match(/<header class="site">([\s\S]*?)<\/header>/)[0];
const footer = doc.match(/<footer class="site">([\s\S]*?)<\/footer>/)[0];

// ---- 4. Split page sections ----
// Pages are siblings between </header> and <footer, each starts at col0 with <div class="page
const bodyStart = doc.indexOf('</header>') + '</header>'.length;
const bodyEnd = doc.indexOf('<footer class="site">');
let region = doc.slice(bodyStart, bodyEnd);
// split on line-start page divs
const parts = region.split(/\n(?=<div class="page)/);
const pages = [];
for (let seg of parts) {
  seg = seg.trim();
  if (!seg.startsWith('<div class="page')) continue;
  const idm = seg.match(/id="page-([^"]+)"/);
  if (!idm) continue;
  pages.push({ id: idm[1], html: seg });
}

// ---- 5. Metadata per page: url + title + description ----
const META = {
  'home':                 { url: '/',                              file: 'index.astro',                       title: 'Haidrun — Stablecoin & Digital Money Infrastructure', desc: 'Turnkey, private blockchain infrastructure for regulated institutions to issue stablecoins, run payments and tokenize real-world assets — live in weeks.' },
  'platform':             { url: '/platform',                      file: 'platform.astro',                    title: 'The Platform — Haidrun', desc: 'A private Layer 1 built for regulated digital money: issuance, payments, tokenization and treasury on one deterministic, high-throughput network.' },
  'solutions':            { url: '/solutions',                     file: 'solutions/index.astro',             title: 'Solutions — Haidrun', desc: 'Stablecoin issuance, payments & settlement, tokenization, RWA, treasury and consumer experiences — end to end on Haidrun.' },
  'stablecoin-issuance':  { url: '/solutions/stablecoin-issuance', file: 'solutions/stablecoin-issuance.astro', title: 'Stablecoin Issuance — Haidrun', desc: 'Issue and manage compliant, fully-backed stablecoins with reserve management, token lifecycle and white-label readiness.' },
  'payments':             { url: '/solutions/payments',            file: 'solutions/payments.astro',          title: 'Payments & Settlement — Haidrun', desc: 'Instant, low-cost transactions and settlement — cross-border and domestic, B2B and B2C.' },
  'tokenization':         { url: '/solutions/tokenization',        file: 'solutions/tokenization.astro',      title: 'Tokenization — Haidrun', desc: 'Turn assets into programmable digital tokens with compliance built in.' },
  'treasury':             { url: '/solutions/treasury',            file: 'solutions/treasury.astro',          title: 'Treasury & Reserves — Haidrun', desc: 'Manage reserves, balances and flows with full visibility and on-chain attestation.' },
  'consumer':             { url: '/solutions/consumer',            file: 'solutions/consumer.astro',          title: 'Consumer & B2C — Haidrun', desc: 'Extend to retail: branded wallets, P2P transfers and payment experiences.' },
  'rwa':                  { url: '/rwa',                           file: 'rwa.astro',                         title: 'Real-World Assets — Haidrun', desc: 'Tokenize securities, funds, real estate, credit, commodities and carbon — end to end.' },
  'security':             { url: '/security',                      file: 'security.astro',                    title: 'Security & Compliance — Haidrun', desc: 'Built for compatibility with MiCA, GENIUS, FATF and VARA. Private-chain security, governance and on-chain attestation.' },
  'developers':           { url: '/developers',                    file: 'developers.astro',                  title: 'Developers — Haidrun', desc: 'APIs, SDKs and documentation to build on Haidrun.' },
  'company':              { url: '/company',                       file: 'company.astro',                     title: 'Company — Haidrun', desc: 'Haidrun AB — the team building private infrastructure for regulated digital money.' },
  'contact':              { url: '/contact',                       file: 'contact.astro',                     title: 'Request a demo — Haidrun', desc: 'Talk to our team and see the platform in depth.' },
};

// nav map data-nav -> url
const NAVMAP = Object.fromEntries(pages.map(p => [p.id, META[p.id]?.url ?? '/'+p.id]));

// ---- 6. Write outputs ----
fs.mkdirSync(path.join(ROOT, 'src/content'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'src/pages/solutions'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'src/layouts'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'src/styles'), { recursive: true });

fs.writeFileSync(path.join(ROOT, 'src/styles/global.css'), globalCss);
fs.writeFileSync(path.join(ROOT, 'src/content/_header.html'), header);
fs.writeFileSync(path.join(ROOT, 'src/content/_footer.html'), footer);
fs.writeFileSync(path.join(ROOT, 'src/content/_scripts.js'), keptScripts.join('\n\n/* ---- */\n\n'));
fs.writeFileSync(path.join(ROOT, 'src/content/_navmap.json'), JSON.stringify(NAVMAP, null, 2));

for (const p of pages) {
  const m = META[p.id];
  if (!m) { console.log('NO META for', p.id); continue; }
  fs.writeFileSync(path.join(ROOT, 'src/content', p.id + '.html'), p.html);
}

console.log('pages:', pages.map(p => p.id).join(', '));
console.log('kept scripts:', keptScripts.length, '/ total', scripts.length);
console.log('global.css bytes:', globalCss.length);
console.log('navmap:', JSON.stringify(NAVMAP));
