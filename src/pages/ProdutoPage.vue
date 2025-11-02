<template>
  <q-page class="q-pa-md bg-grey-3 animate__animated animate__fadeInLeft animate__slower"
    :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <div class="q-mb-md">
      <q-btn flat color="secondary" icon="arrow_back" @click="$router.back()" label="Voltar" />
    </div>

    <q-card flat bordered class="bg-white rounded-borders shadow-1 animate__animated animate__fadeInLeft animate__slower">
      <q-card-section>
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <q-skeleton v-if="loading" type="rect" style="height: 360px; border-radius: 14px" />
            <q-img v-else :src="product?.imagemUrl || fallbackImage" ratio="16/9" spinner-color="primary"
              :alt="product?.descricao" style="border-radius: 14px" />
          </div>

          <div class="col-12 col-md-6">
            <div class="row items-center q-col-gutter-sm">
              <q-badge v-if="product?.marca" color="primary" class="text-bold q-pa-sm" text-color="blue-10"
                :label="product.marca" />
              <q-chip v-if="inStock" color="secondary" text-color="white" icon="check_circle">Em estoque</q-chip>
              <q-chip v-else color="grey-6" text-color="white" icon="hourglass_empty">Sob consulta</q-chip>
            </div>

            <div class="text-h5 text-weight-bold q-mt-xs">{{ product?.descricao || 'Produto' }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Cód.: {{ product?.id || product?.CODPRODUTO || '—' }} • SKU: {{ skuText }}
            </div>

            <div class="q-mt-md">
              <div v-if="product?.precoPromocao && product.precoPromocao > 0" class="column">
                <div class="text-caption text-negative">
                  <s>{{ money(product.precoEfetivo) }}</s>
                </div>
                <div class="text-h5 text-positive">{{ money(product.precoPromocao) }}</div>
              </div>
              <div v-else class="text-h5">{{ money(product?.precoEfetivo ?? product?.preco) }}</div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-body2 text-grey-8">
              <div class="q-mb-xs"><strong>Descrição:</strong></div>
              <div>{{ shortDesc }} <br>Marca:{{ product.marca }}</div>
            </div>
            <div class="q-mt-lg row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-btn unelevated color="positive" icon-right="whatsapp" class="w100"
                  :href="product ? whatsLink(product) : '#'" target="_blank" label="Pedir orçamento" />
              </div>
              <div class="col-12 col-sm-6">
                <q-btn outline color="secondary" icon="share" class="w100" @click="shareOrCopy" label="Compartilhar" />
              </div>
            </div>

          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="q-mt-lg">
      <q-btn flat color="secondary" icon="arrow_back" @click="$router.back()" label="Voltar" />
    </div>
    <div class="w100 q-py-xl"></div>
    <footer class="footer q-pt-xl">
      <div class="container footer-grid q-pb-md">
        <div>
          <div class="brand">
            <div class="logo"><q-img style="border-radius: 20%;"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                alt="Eletro Nogueira Logo" /></div>
            <div class="brand-text">
              <strong class="text-secondary">Eletro Nogueira</strong>
              <small>Em frente à BR-040 • Valparaíso de Goiás</small>
            </div>
          </div>
          <p class="foot-copy q-pt-sm">Soluções em elétrica, hidráulica, automação e agro.<br>Pronta-entrega e
            suporte técnico.<br><br>CNPJ • <strong>26.931.014/0001-12.</strong>
          </p>
        </div>
        <div class="column">
          <q-btn unelevated color="positive" class="text-shadow btn whats q-ml-xs" glossy type="a" target="_blank"
            rel="noopener"
            href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
            WhatsApp
            <q-img
              src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
              alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
          <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm" href="tel:+556136290040"
            label="(61) 3629-0040" />
          <q-btn icon-right="phone" color="secondary" class=" btn q-mt-sm" href="tel:+556136296858"
            label="(61) 3629-6858" />
        </div>
      </div>
      <div class="w100 column justify-center items-center text-center">Siga-nos no Instagram!! <br></br><br><q-btn
          unelevated color="warning" class="text-shadow btn whats q-ml-sm" glossy type="a" target="_blank"
          rel="noopener" href="https://www.instagram.com/nogueiravalparaiso/">
          @nogueiravalparaiso
          <q-img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
            alt="Logo Instagram" style="border-radius:100%; width:30px; height:30px" /></q-btn></div>
      <div class="copy q-mt-md">© Eletro Nogueira — 26.931.014/0001-12.</div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'

const $q = useQuasar()
const isMobile = $q.screen.lt.md
const route = useRoute()
const router = useRouter()

const fallbackImage = 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1200&auto=format&fit=crop'

const loading = ref(true)
const product = ref(null)

/** ---------- Recupera produto sem endpoint ---------- */
// 1) tenta via history.state
const stateProduct = (history && history.state && history.state.product) || null
if (stateProduct) {
  product.value = stateProduct
} else {
  // 2) fallback: sessionStorage pelo ID no slug
  const idFromSlug = extractIdFromSlug(route.params.slug)
  if (idFromSlug) {
    try {
      const cached = sessionStorage.getItem(`prod:${idFromSlug}`)
      if (cached) product.value = JSON.parse(cached)
    } catch { }
  }
}

const inStock = computed(() => {
  const p = product.value
  if (!p) return false
  const flag = p.inativoFlag ?? p.INATIVO
  return typeof flag === 'string' ? flag.toUpperCase() !== 'T' : true
})

const skuText = computed(() => {
  const p = product.value
  if (!p) return '—'
  const sku = p.sku ?? p.CODORIGINAL ?? p.codOriginal ?? p.codoriginal
  return sku ? String(sku) : '—'
})

const shortDesc = computed(() =>
  (product.value && product.value.descricao)
    ? product.value.descricao.slice(0, 180)
    : 'Ferramentas e bombas com pronta-entrega em Valparaíso de Goiás.'
)

function money(n) {
  if (n == null) return '—'
  try { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
  catch { return `R$ ${String(n)}` }
}
function whatsLink(p) {
  const base = 'https://wa.me/556136290040'
  const text = encodeURIComponent(
    `Olá! Pode me enviar o preço e disponibilidade deste item?\n\n${p.descricao} (${p.marca || '—'})\nCód.: ${p.id || '—'}\nLink: ${location.href}`
  )
  return `${base}?text=${text}`
}
function slugify(s = '') {
  return String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
function extractIdFromSlug(slug) {
  const m = String(slug).match(/-(\d+)$/) || String(slug).match(/-(\w{6,})$/)
  return m ? m[1] : null
}
function buildSlug(p) {
  const desc = (p.DESCRICAO ?? p.descricao) || ''
  const brand = (p.MARCA ?? p.marca) || ''
  const id = p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id ?? ''
  return `${slugify(`${desc} ${brand}`)}-${id}`
}
function goBackToCatalog() {
  // Se veio do catálogo, voltar preserva tudo (query, paginação, etc.)
  if (window.history.length > 1) {
    router.back()
    return
  }
  // Fallback: se não há histórico, tenta último URL do catálogo salvo
  const last = sessionStorage.getItem('catalog:lastUrl')
  if (last) {
    router.push(last)
  } else {
    router.push({ path: '/catalogo' })
  }
}
async function load() {
  loading.value = true
  try {
    const slug = route.params.slug

    if (product.value) {
      const canonicalSlug = buildSlug(product.value)
      if (canonicalSlug && canonicalSlug !== slug) {
        router.replace(`/catalogo/produto/${canonicalSlug}`)
      }
    } else {
      $q.notify({ type: 'warning', message: 'Produto não encontrado. Abra a partir do catálogo.' })
    }
    updateHead()
  } catch (err) {
    console.error('[ProductPage] erro:', err)
    $q.notify({ type: 'negative', message: 'Falha ao carregar o produto.' })
  } finally {
    loading.value = false
  }
}

function updateHead() {
  const p = product.value
  useMeta(() => {
    const title = p ? `${p.descricao} | Eletro Nogueira` : 'Produto | Eletro Nogueira'
    const desc = shortDesc.value
    const canonical = `${location.origin}/catalogo/produto/${route.params.slug}`

    return {
      title,
      meta: [
        { name: 'description', content: desc },
        { property: 'og:title', content: title },
        { property: 'og:description', content: desc },
        { property: 'og:type', content: 'product' },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: p?.imagemUrl || fallbackImage }
      ],
      link: [{ rel: 'canonical', href: canonical }],
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": p?.descricao || 'Produto',
          "image": [p?.imagemUrl || fallbackImage],
          "description": desc,
          "sku": p?.sku || p?.CODORIGINAL || String(p?.id || ''),
          "brand": p?.marca ? { "@type": "Brand", "name": p.marca } : undefined,
          "offers": {
            "@type": "Offer",
            "url": canonical,
            "priceCurrency": "BRL",
            "price": Number(p?.precoEfetivo ?? p?.preco ?? 0).toFixed(2),
            "availability": inStock.value ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": { "@type": "Organization", "name": "Eletro Nogueira" }
          }
        })
      }],
      __dangerouslyDisableSanitizers: ['script']
    }
  })
}

async function shareOrCopy() {
  const url = location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      $q.notify({ type: 'positive', message: 'Link copiado!' })
    }
  } catch { }
}

onMounted(load)
</script>
