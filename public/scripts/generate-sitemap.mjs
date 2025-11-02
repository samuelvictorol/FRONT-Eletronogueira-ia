// scripts/generate-sitemap.mjs
import fs from 'node:fs/promises'
import axios from 'axios'

const BASE = process.env.APP_BASE_URL
// Ajuste esta URL do seu backend para listar slugs/ids dos produtos:
const API = process.env.PROD_SLUGS_API

function xmlEscape(s=''){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

const { data } = await axios.get(API)  // espere { slugs: ["furadeira-bosch-123", ...] }
const slugs = Array.isArray(data?.slugs) ? data.slugs : []

const urls = slugs.map(slug => `
  <url>
    <loc>${xmlEscape(`${BASE}/catalogo/produto/${slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

await fs.writeFile('public/sitemap-products.xml', xml, 'utf8')

// (Opcional) também crie um sitemap-index se quiser separar:
const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE}/sitemap.xml</loc></sitemap>
  <sitemap><loc>${BASE}/sitemap-products.xml</loc></sitemap>
</sitemapindex>`
await fs.writeFile('public/sitemap-index.xml', index, 'utf8')

console.log(`Gerado: public/sitemap-products.xml (${slugs.length} URLs) e sitemap-index.xml`)
