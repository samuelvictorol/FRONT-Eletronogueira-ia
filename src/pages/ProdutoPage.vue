<!-- ProductPage.vue (COM CARROUSEL + FULLSCREEN, LÊ IMGS_PATH DO BACKEND / STATE / CACHE) -->
<template>
  <q-page class="q-px-md q-mt-xl q-pt-xs bg-grey-3 animate__animated animate__fadeInLeft animate__slowerr relative">
    <div class="q-mb-lg bg-primary animate__animated animate__fadeInDown animate__delay-3s animate__slower"
      style="border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;position: sticky;top: 55px;z-index: 9;">
      <q-btn flat color="secondary" icon="arrow_back" @click="goBackToCatalog" label="Voltar" />
    </div>

    <q-card flat bordered
      class="bg-white rounded-borders shadow-1 animate__animated animate__fadeInLeft animate__slower">
      <q-card-section>
        <div class="row q-col-gutter-xl">
          <!-- IMAGENS -->
          <div class="col-12 col-md-6">
            <q-skeleton v-if="loading" type="rect" style="height: 360px; border-radius: 14px" />

            <div v-else class="w100 row justify-center">
              <div v-if="images.length" class="w100">
                <q-carousel v-model="activeSlide" swipeable animated arrows navigation height="360px"
                  class="rounded-borders bg-grey-3">
                  <q-carousel-slide v-for="(src, idx) in images" :key="src + idx" :name="idx" class="flex flex-center">
                    <q-img :src="src" :alt="product?.descricao || 'Imagem do produto'" fit="contain"
                      class="product-detail-img cursor-pointer" @click="openFullscreen(src)"
                      @error="onCarouselImageError(idx)">
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
                    <q-img :src="src" fit="cover" class="thumb-img cursor-pointer"
                      :class="idx === activeSlide ? 'thumb-active' : ''" @click="activeSlide = idx"
                      @error="onThumbImageError(idx)" />
                  </div>
                </div>
              </div>

              <div v-else class="w100 row justify-center">
                <q-img :src="fallbackImage" :alt="product?.descricao || 'Imagem do produto'" fit="contain"
                  class="product-detail-img" />
              </div>
            </div>
          </div>

          <!-- DETALHES -->
          <div class="col-12 col-md-6">
            <div class="row items-center q-col-gutter-sm">
              <q-badge v-if="product?.marca" color="primary" class="text-bold q-pa-sm" text-color="blue-10"
                :label="product.marca" />
              <q-chip v-if="inStock" color="secondary" text-color="white" icon="check_circle">Em estoque</q-chip>
              <q-chip v-else color="grey-6" text-color="white" icon="hourglass_empty">Sob consulta</q-chip>
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

            <div class="text-body2 text-grey-8">
              <div class="q-mb-xs"><strong>Descrição:</strong></div>
              <div>
                {{ shortDesc }} <br />
                Marca: {{ product?.marca || '—' }}
              </div>
            </div>

            <div class="q-mt-lg row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-btn unelevated color="green-14" icon="add_shopping_cart" class="w100 text-bold"
                  label="Adicionar ao carrinho" :disable="!product" @click="confirmAddToCart(product)" />
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
      <q-btn flat color="secondary" icon="arrow_back" @click="goBackToCatalog" label="Voltar" />
    </div>

    <!-- FULLSCREEN -->
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
    <div class="copy q-mt-md text-secondary text-bold">© Eletro Nogueira — 26.931.014/0001-12.</div>
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

const loading = ref(true)
const product = ref(null)

// carousel
const activeSlide = ref(0)
const images = ref([])

// fullscreen
const fullscreen = ref({ open: false, src: '' })

function safeUrl(url) {
  if (!url) return null
  const s = String(url).trim()
  if (!s) return null
  return s.replace(/ /g, '%20')
}

// --------- normalização ---------
function normalizeProduct(p) {
  if (!p) return null

  const imgsPathRaw = p.IMGS_PATH ?? p.imgsPath ?? p.imagensPath ?? p.IMGS_PATHS ?? null
  const imgsPath = Array.isArray(imgsPathRaw)
    ? imgsPathRaw.filter(Boolean).map((u) => safeUrl(u))
    : (typeof imgsPathRaw === 'string' && imgsPathRaw ? [safeUrl(imgsPathRaw)] : [])

  const legacyUrl =
    (p.IMG && typeof p.IMG === 'object' && (p.IMG.link || p.IMG.url)) ? safeUrl(p.IMG.link || p.IMG.url) :
      (p.imagemUrl ? safeUrl(p.imagemUrl) : null)

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

    // ✅ imagens
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

// tenta pegar do history.state ou session cache
const stateProduct = (history && history.state && history.state.product) || null

function extractIdFromSlug(slug) {
  const m = String(slug).match(/-(\d+)$/) || String(slug).match(/-(\w{6,})$/)
  return m ? m[1] : null
}

if (stateProduct) {
  product.value = normalizeProduct(stateProduct)
  setImagesFromProduct(product.value)
} else {
  const idFromSlug = extractIdFromSlug(route.params.slug)
  if (idFromSlug) {
    try {
      const cached = sessionStorage.getItem(`prod:${idFromSlug}`)
      if (cached) {
        product.value = normalizeProduct(JSON.parse(cached))
        setImagesFromProduct(product.value)
      }
    } catch { }
  }
}

// --------- computeds ---------
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

/** carrinho */
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

// --------- SEO ---------
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

// --------- carregar do backend ---------
async function load() {
  loading.value = true
  try {
    const slug = route.params.slug
    const idFromSlug = extractIdFromSlug(slug)

    if (idFromSlug) {
      try {
        const { data } = await api.get(`/catalogo/produtos/${idFromSlug}`)
        // seu backend às vezes vem { data: [ ... ] }, às vezes { ok, data }
        const payload =
          (data?.ok && data?.data) ? data.data :
            (Array.isArray(data?.data) ? data.data[0] : data?.data) ||
            (Array.isArray(data) ? data[0] : data)

        if (payload) {
          product.value = normalizeProduct(payload)
          setImagesFromProduct(product.value)

          try {
            sessionStorage.setItem(`prod:${idFromSlug}`, JSON.stringify(product.value))
          } catch { }
        }
      } catch (err) {
        console.error('[ProductPage] erro ao buscar na API:', err)
      }
    }

    if (product.value) {
      const canonicalSlug = buildSlug(product.value)
      if (canonicalSlug && canonicalSlug !== slug) {
        router.replace(`/catalogo/produto/${canonicalSlug}`)
      }
      updateHead()
    } else {
      $q.notify({ type: 'warning', message: 'Produto não encontrado. Abra a partir do catálogo.' })
    }
  } catch (err) {
    console.error('[ProductPage] erro:', err)
    $q.notify({ type: 'negative', message: 'Falha ao carregar o produto.' })
  } finally {
    loading.value = false
  }
}

// --------- share ---------
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

// --------- fullscreen ---------
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
</style>