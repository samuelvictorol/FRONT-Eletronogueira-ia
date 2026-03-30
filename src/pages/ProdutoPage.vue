<template>
  <q-page class="q-px-md q-mt-xl q-pt-xs bg-grey-3 animate__animated animate__fadeInLeft animate__slowerr relative">
    <div
      class="q-mb-lg bg-primary animate__animated animate__fadeInDown animate__delay-3s animate__slower"
      style="border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; position: sticky; top: 55px; z-index: 9;"
    >
      <q-btn flat color="secondary" icon="arrow_back" @click="goBackToCatalog" label="Catálogo" />
    </div>

    <q-card
      flat
      bordered
      class="bg-white rounded-borders shadow-1 animate__animated animate__fadeInLeft animate__slower"
    >
      <q-card-section>
        <div v-if="!product && loading" class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <q-skeleton type="rect" style="height: 360px; border-radius: 14px" />
          </div>

          <div class="col-12 col-md-6">
            <q-skeleton type="text" class="q-mb-sm" width="35%" />
            <q-skeleton type="text" class="q-mb-sm" width="90%" />
            <q-skeleton type="text" class="q-mb-md" width="45%" />
            <q-skeleton type="text" class="q-mb-sm" width="30%" />
            <q-skeleton type="text" class="q-mb-md" width="40%" />

            <q-separator class="q-my-md" />

            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="text" class="q-mb-md" width="75%" />

            <q-card flat bordered class="bg-grey-1">
              <q-card-section>
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="text" width="80%" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else-if="product" class="row q-col-gutter-xl">
          <!-- IMAGENS -->
          <div class="col-12 col-md-6">
            <div class="w100 row justify-center">
              <div v-if="images.length" class="w100">
                <q-carousel
                  v-model="activeSlide"
                  swipeable
                  animated
                  arrows
                  navigation
                  height="360px"
                  class="rounded-borders bg-grey-3"
                >
                  <q-carousel-slide
                    v-for="(src, idx) in images"
                    :key="src + idx"
                    :name="idx"
                    class="flex flex-center"
                  >
                    <q-img
                      :src="src"
                      :alt="product?.descricao || 'Imagem do produto'"
                      fit="contain"
                      class="product-detail-img cursor-pointer"
                      @click="openFullscreen(src)"
                      @error="onCarouselImageError(idx)"
                    >
                      <div class="absolute-bottom-right q-pa-sm bg-secondary">
                        <q-chip dense color="secondary" text-color="white" icon="zoom_in">
                          Ampliar
                        </q-chip>
                      </div>
                    </q-img>
                  </q-carousel-slide>
                </q-carousel>

                <div class="row q-col-gutter-sm q-mt-sm justify-center">
                  <div v-for="(src, idx) in images" :key="'thumb-' + src + idx" class="col-auto">
                    <q-img
                      :src="src"
                      fit="cover"
                      class="thumb-img cursor-pointer"
                      :class="idx === activeSlide ? 'thumb-active' : ''"
                      @click="activeSlide = idx"
                      @error="onThumbImageError(idx)"
                    />
                  </div>
                </div>
              </div>

              <div v-else class="w100 row justify-center">
                <q-img
                  :src="fallbackImage"
                  :alt="product?.descricao || 'Imagem do produto'"
                  fit="contain"
                  class="product-detail-img"
                />
              </div>
            </div>
          </div>

          <!-- DETALHES -->
          <div class="col-12 col-md-6">
            <div class="row items-center q-col-gutter-sm">
              <q-badge
                v-if="product?.marca"
                color="primary"
                class="text-bold q-pa-sm"
                text-color="blue-10"
                :label="product.marca"
              />
              <q-chip v-if="inStock" color="secondary" text-color="white" icon="check_circle">
                Em estoque
              </q-chip>
              <q-chip v-else color="grey-6" text-color="white" icon="hourglass_empty">
                Sob consulta
              </q-chip>
            </div>

            <div class="text-h5 text-weight-bold q-mt-xs">
              {{ product?.descricao || 'Produto' }}
            </div>

            <div class="text-caption text-grey-7 q-mt-xs">
              Cód.: {{ product?.id || product?.CODPRODUTO || '—' }} • SKU: {{ skuText }}
            </div>

            <div class="q-mt-md">
              <div v-if="product?.precoPromocao && product.precoPromocao > 0" class="column">
                <div class="text-caption text-negative">
                  <s>{{ money(product.precoEfetivo) }}</s>
                </div>
                <div class="text-h5 text-positive">
                  {{ money(product.precoPromocao) }}
                </div>
              </div>

              <div v-else class="text-h5">
                {{ money(product?.precoEfetivo ?? product?.preco) }}
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- <div class="text-body2 text-grey-8">
              <div class="q-mb-xs"><strong>Descrição:</strong></div>
              <div>
                {{ shortDesc }} <br />
                Marca: {{ product?.marca || '—' }}
              </div>
            </div> -->

            <div class="q-mt-md">
              <div class="q-mb-xs text-body2 text-weight-bold text-grey-9 row items-center q-gutter-sm">
                <!-- <span>Descrição gerada por IA</span> -->
                <q-spinner-dots v-if="aiDescriptionLoading" color="secondary" size="22px" />
              </div>

              <q-card flat bordered class="bg-grey-1">
                <q-card-section>
                  <div v-if="aiDescriptionLoading">
                    <q-skeleton type="text" class="q-mb-sm" />
                    <q-skeleton type="text" class="q-mb-sm" />
                    <q-skeleton type="text" class="q-mb-sm" />
                    <q-skeleton type="text" class="q-mb-sm" width="90%" />
                    <q-skeleton type="text" class="q-mb-sm" width="85%" />
                    <q-skeleton type="text" width="75%" />
                  </div>

                  <div v-else class="ai-description-text" v-html="aiDescriptionHtml"></div>
                </q-card-section>
              </q-card>
            </div>

            <div class="q-mt-lg row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-btn
                  unelevated
                  color="green-14"
                  icon="add_shopping_cart"
                  class="w100 text-bold"
                  label="Adicionar ao carrinho"
                  :disable="!product"
                  @click="confirmAddToCart(product)"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-btn
                  outline
                  color="secondary"
                  icon="share"
                  class="w100"
                  @click="shareOrCopy"
                  label="Compartilhar"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center q-py-xl text-grey-7">
          Produto não encontrado.
        </div>
      </q-card-section>
    </q-card>

    <div class="q-mt-lg">
      <q-btn flat color="secondary" icon="arrow_back" @click="goBackToCatalog" label="Catálogo" />
    </div>

    <q-dialog v-model="fullscreen.open" maximized transition-show="fade" transition-hide="fade">
      <q-card class="bg-black text-white">
        <q-bar class="bg-black text-white">
          <div class="text-caption ellipsis">{{ product?.descricao || 'Imagem' }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="q-pa-none fullscreen-body">
          <q-img :src="fullscreen.src" fit="contain" class="fullscreen-img" @error="onFullscreenError" />
        </q-card-section>

        <q-card-section class="bg-black q-pt-none">
          <div class="row items-center justify-center q-gutter-sm">
            <q-btn dense flat icon="chevron_left" :disable="!images.length" @click="prevImage" />
            <div class="text-caption">{{ images.length ? (activeSlide + 1) : 0 }} / {{ images.length }}</div>
            <q-btn dense flat icon="chevron_right" :disable="!images.length" @click="nextImage" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <footer class="footer bg-primary">
    <div class="copy q-mt-md text-secondary text-bold">
      © Eletro Nogueira — 26.931.014/0001-12.
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'
import { api } from 'boot/axios'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const cart = useCart()

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'
const IA_BACKEND_URL = String(
  import.meta.env.VITE_IA_BACKEND_URL ||
  import.meta.env.IA_BACKEND_URL ||
  'http://localhost:10000'
).replace(/\/+$/, '')

const loading = ref(false)
const product = ref(null)

const aiDescriptionLoading = ref(false)
const aiDescription = ref('-')
const lastAiRequestKey = ref('')

const activeSlide = ref(0)
const images = ref([])

const fullscreen = ref({ open: false, src: '' })

function safeUrl(url) {
  if (!url) return null
  const s = String(url).trim()
  if (!s) return null
  return s.replace(/ /g, '%20')
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatAIDescriptionToHtml(text) {
  const raw = String(text || '').trim()
  if (!raw || raw === '-') return '-'

  const lines = raw.split('\n').map(line => line.trim()).filter(Boolean)

  return lines.map((line) => {
    const safe = escapeHtml(line)

    if (safe === 'DESCRICAO DO PRODUTO:' || safe === 'DESTAQUES:' || safe === 'DADOS DO CADASTRO:') {
      return `<div class="ai-line-title"><strong>${safe}</strong></div>`
    }

    if (safe.startsWith('- ')) {
      const content = safe.slice(2)
      const idx = content.indexOf(':')
      if (idx > -1) {
        const label = content.slice(0, idx + 1)
        const value = content.slice(idx + 1).trim()
        return `<div class="ai-line-bullet">• <strong>${label}</strong> ${value}</div>`
      }
      return `<div class="ai-line-bullet">• ${content}</div>`
    }

    return `<div class="ai-line-paragraph">${safe}</div>`
  }).join('')
}

const aiDescriptionHtml = computed(() => formatAIDescriptionToHtml(aiDescriptionText.value))

function normalizeProduct(p) {
  if (!p) return null

  const imgsPathRaw = p.IMGS_PATH ?? p.imgsPath ?? p.imagensPath ?? p.IMGS_PATHS ?? null
  const imgsPath = Array.isArray(imgsPathRaw)
    ? imgsPathRaw.filter(Boolean).map((u) => safeUrl(u))
    : (typeof imgsPathRaw === 'string' && imgsPathRaw ? [safeUrl(imgsPathRaw)] : [])

  const legacyUrl =
    (p.IMG && typeof p.IMG === 'object' && (p.IMG.link || p.IMG.url))
      ? safeUrl(p.IMG.link || p.IMG.url)
      : (p.imagemUrl ? safeUrl(p.imagemUrl) : null)

  return {
    id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p.ID,
    CODPRODUTO: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p.ID,
    descricao: p.DESCRICAO ?? p.descricao,
    marca: p.MARCA ?? p.marca,
    preco: p.PRECO ?? p.preco,
    precoPromocao: p.PRECOPROMOCAO ?? p.precoPromocao,
    precoEfetivo: p.PRECO_EFETIVO ?? p.precoEfetivo ?? p.PRECO ?? p.preco,
    CODORIGINAL: p.CODORIGINAL ?? p.codOriginal ?? p.sku,
    INATIVO: p.INATIVO ?? p.inativo,
    HAS_IMAGE: p.HAS_IMAGE ?? p.hasImage ?? null,
    IMGS_PATH: imgsPath.length ? imgsPath : (legacyUrl ? [legacyUrl] : []),
    imagemUrl: legacyUrl || (imgsPath[0] || null),
    ...p
  }
}

function setImagesFromProduct(p) {
  const arr = Array.isArray(p?.IMGS_PATH) ? p.IMGS_PATH.filter(Boolean).map(String) : []
  images.value = arr.length ? arr : []
  activeSlide.value = 0
}

function applyProduct(payload) {
  if (!payload) return null
  const normalized = normalizeProduct(payload)
  product.value = normalized
  setImagesFromProduct(normalized)
  updateHead()
  return normalized
}

const stateProduct = (history && history.state && history.state.product) || null

function extractIdFromSlug(slug) {
  const m = String(slug).match(/-(\d+)$/) || String(slug).match(/-(\w{6,})$/)
  return m ? m[1] : null
}

if (stateProduct) {
  applyProduct(stateProduct)
} else {
  const idFromSlug = extractIdFromSlug(route.params.slug)
  if (idFromSlug) {
    try {
      const cached = sessionStorage.getItem(`prod:${idFromSlug}`)
      if (cached) applyProduct(JSON.parse(cached))
    } catch {}
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
  product.value?.descricao
    ? String(product.value.descricao).slice(0, 220)
    : 'Ferramentas e bombas com pronta-entrega em Valparaíso de Goiás.'
)

const aiDescriptionText = computed(() => {
  const txt = String(aiDescription.value || '').trim()
  return txt || '-'
})

function money(n) {
  if (n == null) return '—'
  try {
    return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${String(n)}`
  }
}

function slugify(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function buildSlug(p) {
  const desc = (p.DESCRICAO ?? p.descricao) || ''
  const brand = (p.MARCA ?? p.marca) || ''
  const id = p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id ?? ''
  return `${slugify(`${desc} ${brand}`)}-${id}`
}

function goBackToCatalog() {
  const last = sessionStorage.getItem('catalog:lastUrl')
  if (last) return router.push(last)
  if (window.history.length > 1) return router.back()
  return router.push({ path: '/catalogo' })
}

function confirmAddToCart(p) {
  const name = p?.descricao || 'Produto'
  $q.dialog({
    title: '🛒 Adicionar ao carrinho',
    message: `Adicionar "${name}" ao carrinho?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Adicionar', color: 'green-14' },
    cancel: { label: 'Cancelar', color: 'grey-6' }
  }).onOk(() => {
    cart.addItem(p, 1)
    cart.state.drawerOpen = true
    $q.notify({ type: 'secondary', message: 'Adicionado ao carrinho!' })
  })
}

function updateHead() {
  const p = product.value
  const img = images.value[0] || fallbackImage

  useMeta(() => {
    const title = p ? `${p.descricao || p.DESCRICAO} | Eletro Nogueira` : 'Produto | Eletro Nogueira'
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
        { property: 'og:image', content: img }
      ],
      link: [{ rel: 'canonical', href: canonical }],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p?.descricao || p?.DESCRICAO || 'Produto',
            image: images.value.length ? images.value : [img],
            description: desc,
            sku: p?.sku || p?.CODORIGINAL || String(p?.id || ''),
            brand: p?.marca ? { '@type': 'Brand', name: p.marca } : undefined,
            offers: {
              '@type': 'Offer',
              url: canonical,
              priceCurrency: 'BRL',
              price: Number(p?.precoEfetivo ?? p?.PRECO_EFETIVO ?? p?.preco ?? p?.PRECO ?? 0).toFixed(2),
              availability: inStock.value ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
              itemCondition: 'https://schema.org/NewCondition',
              seller: { '@type': 'Organization', name: 'Eletro Nogueira' }
            }
          })
        }
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  })
}

function extractGeneratedDescription(payload) {
  const root = payload?.data ?? payload
  return (
    root?.descricaoGeradaIA ||
    root?.descricao_gerada_ia ||
    root?.descricaoGeradaIa ||
    root?.descricao ||
    '-'
  )
}

async function loadAIDescription(p) {
  const codProduto = p?.CODPRODUTO ?? p?.codProduto ?? p?.id
  const produtoNome = p?.descricao ?? p?.DESCRICAO ?? ''
  const marca = p?.marca ?? p?.MARCA ?? ''
  const sku = p?.CODORIGINAL ?? p?.codOriginal ?? p?.sku ?? ''
  const requestKey = [codProduto, produtoNome, marca, sku].join('|')

  if (!codProduto || !produtoNome) {
    aiDescription.value = '-'
    aiDescriptionLoading.value = false
    return
  }

  lastAiRequestKey.value = requestKey
  aiDescriptionLoading.value = true
  aiDescription.value = '-'

  try {
    const { data } = await api.post(
      `${IA_BACKEND_URL}/catalog/generate-description`,
      {
        codProduto,
        produto: produtoNome,
        marca,
        sku
      },
      {
        timeout: 95000
      }
    )

    if (lastAiRequestKey.value !== requestKey) return
    aiDescription.value = extractGeneratedDescription(data) || '-'
  } catch (err) {
    console.error('[ProductPage] erro ao gerar descrição com IA:', err)
    if (lastAiRequestKey.value === requestKey) {
      aiDescription.value = '-'
    }
  } finally {
    if (lastAiRequestKey.value === requestKey) {
      aiDescriptionLoading.value = false
    }
  }
}

async function loadProduct() {
  const slug = route.params.slug
  const idFromSlug = extractIdFromSlug(slug)

  if (!idFromSlug) {
    product.value = null
    return null
  }

  const shouldBlockPage = !product.value
  if (shouldBlockPage) loading.value = true

  try {
    const { data } = await api.get(`/catalogo/produtos/${idFromSlug}`)

    const payload =
      (data?.ok && data?.data) ? data.data :
        (Array.isArray(data?.data) ? data.data[0] : data?.data) ||
        (Array.isArray(data) ? data[0] : data)

    if (!payload) return null

    const resolved = applyProduct(payload)

    try {
      sessionStorage.setItem(`prod:${idFromSlug}`, JSON.stringify(resolved))
    } catch {}

    const canonicalSlug = buildSlug(resolved)
    if (canonicalSlug && canonicalSlug !== slug) {
      router.replace(`/catalogo/produto/${canonicalSlug}`)
    }

    return resolved
  } catch (err) {
    console.error('[ProductPage] erro ao buscar na API:', err)
    return product.value || null
  } finally {
    loading.value = false
  }
}

async function load() {
  try {
    if (product.value) {
      loading.value = false
      loadAIDescription(product.value)
    } else {
      loading.value = true
    }

    const resolved = await loadProduct()

    if (resolved) {
      loadAIDescription(resolved)
    } else if (!product.value) {
      aiDescriptionLoading.value = false
      aiDescription.value = '-'
      $q.notify({ type: 'warning', message: 'Produto não encontrado. Abra a partir do catálogo.' })
    }
  } catch (err) {
    console.error('[ProductPage] erro:', err)
    aiDescriptionLoading.value = false
    aiDescription.value = '-'
    if (!product.value) {
      $q.notify({ type: 'negative', message: 'Falha ao carregar o produto.' })
    }
    loading.value = false
  }
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
  } catch {}
}

function openFullscreen(src) {
  fullscreen.value.src = src || fallbackImage
  fullscreen.value.open = true
}

function onCarouselImageError(idx) {
  if (images.value[idx]) images.value[idx] = fallbackImage
}

function onThumbImageError(idx) {
  if (images.value[idx]) images.value[idx] = fallbackImage
}

function onFullscreenError() {
  fullscreen.value.src = fallbackImage
}

function prevImage() {
  if (!images.value.length) return
  const next = (activeSlide.value - 1 + images.value.length) % images.value.length
  activeSlide.value = next
  fullscreen.value.src = images.value[next] || fallbackImage
}

function nextImage() {
  if (!images.value.length) return
  const next = (activeSlide.value + 1) % images.value.length
  activeSlide.value = next
  fullscreen.value.src = images.value[next] || fallbackImage
}

watch(activeSlide, (idx) => {
  if (fullscreen.value.open && images.value[idx]) fullscreen.value.src = images.value[idx]
})

watch(() => route.params.slug, () => {
  aiDescription.value = '-'
  aiDescriptionLoading.value = false
  lastAiRequestKey.value = ''
  load()
})

onMounted(load)
</script>

<style scoped>
.product-detail-img {
  width: 100%;
  max-width: 520px;
  height: 320px;
  border-radius: 14px;
}

.product-detail-img :deep(img),
.product-detail-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}

.thumb-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
}

.thumb-active {
  border-color: rgba(25, 118, 210, 0.9);
}

.fullscreen-body {
  height: calc(100vh - 96px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-img {
  width: 100%;
  height: 100%;
}

.ai-description-text {
  white-space: pre-line;
  line-height: 1.6;
  color: #37474f;
  min-height: 110px;
}

.ai-description-text {
  white-space: normal;
  line-height: 1.7;
  color: #37474f;
  min-height: 110px;
}

.ai-line-title {
  margin-top: 10px;
  margin-bottom: 8px;
  color: #1f2937;
}

.ai-line-title:first-child {
  margin-top: 0;
}

.ai-line-paragraph {
  margin-bottom: 10px;
}

.ai-line-bullet {
  margin-bottom: 6px;
}
</style>