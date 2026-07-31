import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/home/claude/haidrun-site';

const META = {
  'home':                 { url: '/',                              file: 'index.astro',                         title: 'Haidrun — Stablecoin & Digital Money Infrastructure', desc: 'Turnkey, private blockchain infrastructure for regulated institutions to issue stablecoins, run payments and tokenize real-world assets — live in weeks.' },
  'platform':             { url: '/platform',                      file: 'platform.astro',                      title: 'The Platform — Haidrun', desc: 'A private Layer 1 built for regulated digital money: issuance, payments, tokenization and treasury on one deterministic, high-throughput network.' },
  'solutions':            { url: '/solutions',                     file: 'solutions/index.astro',               title: 'Solutions — Haidrun', desc: 'Stablecoin issuance, payments & settlement, tokenization, RWA, treasury and consumer experiences — end to end on Haidrun.' },
  'stablecoin-issuance':  { url: '/solutions/stablecoin-issuance', file: 'solutions/stablecoin-issuance.astro', title: 'Stablecoin Issuance — Haidrun', desc: 'Issue and manage compliant, fully-backed stablecoins with reserve management, token lifecycle and white-label readiness.' },
  'payments':             { url: '/solutions/payments',            file: 'solutions/payments.astro',            title: 'Payments & Settlement — Haidrun', desc: 'Instant, low-cost transactions and settlement — cross-border and domestic, B2B and B2C.' },
  'tokenization':         { url: '/solutions/tokenization',        file: 'solutions/tokenization.astro',        title: 'Tokenization — Haidrun', desc: 'Turn assets into programmable digital tokens with compliance built in.' },
  'treasury':             { url: '/solutions/treasury',            file: 'solutions/treasury.astro',            title: 'Treasury & Reserves — Haidrun', desc: 'Manage reserves, balances and flows with full visibility and on-chain attestation.' },
  'consumer':             { url: '/solutions/consumer',            file: 'solutions/consumer.astro',            title: 'Consumer & B2C — Haidrun', desc: 'Extend to retail: branded wallets, P2P transfers and payment experiences.' },
  'rwa':                  { url: '/rwa',                           file: 'rwa.astro',                           title: 'Real-World Assets — Haidrun', desc: 'Tokenize securities, funds, real estate, credit, commodities and carbon — end to end.' },
  'security':             { url: '/security',                      file: 'security.astro',                      title: 'Security & Compliance — Haidrun', desc: 'Built for compatibility with MiCA, GENIUS, FATF and VARA. Private-chain security, governance and on-chain attestation.' },
  'developers':           { url: '/developers',                    file: 'developers.astro',                    title: 'Developers — Haidrun', desc: 'APIs, SDKs and documentation to build on Haidrun.' },
  'company':              { url: '/company',                       file: 'company.astro',                       title: 'Company — Haidrun', desc: 'Haidrun AB — the team building private infrastructure for regulated digital money.' },
  'contact':              { url: '/contact',                       file: 'contact.astro',                       title: 'Request a demo — Haidrun', desc: 'Talk to our team and see the platform in depth.' },
};

// relative import path from a page file back to src/
function rel(file) {
  const depth = file.split('/').length - 1; // 0 for top-level, 1 for solutions/*
  return '../'.repeat(depth + 1); // pages live in src/pages/, need to reach src/
}

for (const [id, m] of Object.entries(META)) {
  const r = rel(m.file);
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const body = `---
import Layout from '${r}layouts/Layout.astro';
import body from '${r}content/${id}.html?raw';
---
<Layout title="${esc(m.title)}" description="${esc(m.desc)}" path="${m.url}">
  <Fragment set:html={body} />
</Layout>
`;
  const dest = path.join(ROOT, 'src/pages', m.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body);
  console.log('wrote', 'src/pages/' + m.file, '->', id + '.html');
}
