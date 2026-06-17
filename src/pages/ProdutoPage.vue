<template>
  <q-page class="product-page animate__animated animate__fadeIn">
    <div class="product-topbar">
      <q-btn
        flat
        color="secondary"
        icon="arrow_back"
        label="Catálogo"
        @click="goBackToCatalog"
      />

      <q-space />

      <q-chip
        v-if="product"
        dense
        square
        :color="isOutOfStock ? 'negative' : 'green-14'"
        text-color="white"
        :icon="isOutOfStock ? 'block' : 'check_circle'"
      >
        {{ stockStatusLabel }}
      </q-chip>
    </div>

    <div class="w100 q-mt-xl q-pt-xl"></div>

    <q-card
      flat
      bordered
      class="product-main-card animate__animated animate__fadeInUp"
      :class="{ 'product-main-card--out-stock': isOutOfStock }"
    >
      <q-card-section>
        <div v-if="!product && loading" class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <q-skeleton type="rect" class="product-skeleton-image" />
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
          <div class="col-12 col-md-6">
            <div class="product-gallery-card">
              <div
                v-if="isOutOfStock"
                class="out-stock-watermark"
              >
                SEM ESTOQUE
              </div>

              <q-badge
                v-if="isOutOfStock"
                class="out-stock-badge"
                color="negative"
                text-color="white"
                icon="block"
              >
                Produto indisponível
              </q-badge>

              <div v-if="images.length" class="w100">
                <q-carousel
                  v-model="activeSlide"
                  swipeable
                  animated
                  arrows
                  navigation
                  height="420px"
                  class="product-carousel"
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
                      <div class="absolute-bottom-right q-pa-sm">
                        <q-chip
                          dense
                          color="secondary"
                          text-color="white"
                          icon="zoom_in"
                        >
                          Ampliar
                        </q-chip>
                      </div>
                    </q-img>
                  </q-carousel-slide>
                </q-carousel>

                <div class="thumbs-row">
                  <q-img
                    v-for="(src, idx) in images"
                    :key="'thumb-' + src + idx"
                    :src="src"
                    fit="cover"
                    class="thumb-img cursor-pointer"
                    :class="{ 'thumb-active': idx === activeSlide }"
                    @click="activeSlide = idx"
                    @error="onThumbImageError(idx)"
                  />
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

          <div class="col-12 col-md-6">
            <div class="product-info-panel">
              <div class="row items-center q-col-gutter-sm">
                <q-badge
                  v-if="product?.marca"
                  color="primary"
                  class="text-bold q-pa-sm"
                  text-color="blue-10"
                  :label="product.marca"
                />

                <q-chip
                  :color="isOutOfStock ? 'negative' : 'green-14'"
                  text-color="white"
                  :icon="isOutOfStock ? 'block' : 'check_circle'"
                >
                  {{ stockStatusLabel }}
                </q-chip>

                <q-chip
                  v-if="stockQuantity !== null"
                  color="grey-2"
                  text-color="grey-9"
                  icon="inventory_2"
                >
                  Estoque: {{ stockQuantity }}
                </q-chip>
              </div>

              <h1 class="product-title">
                {{ product?.descricao || 'Produto' }}
              </h1>

              <div class="product-code-line">
                Cód.: {{ product?.id || product?.CODPRODUTO || '—' }}
                <span>•</span>
                SKU: {{ skuText }}
                <span v-if="barcodeText">•</span>
                <span v-if="barcodeText">Cód. barras: {{ barcodeText }}</span>
              </div>

              <q-card
                flat
                bordered
                class="price-card"
                :class="{ 'price-card--out-stock': isOutOfStock }"
              >
                <q-card-section>
                  <div class="text-caption text-grey-7">
                    Preço
                  </div>

                  <div v-if="hasPromotion" class="column">
                    <div class="old-price">
                      {{ money(product.preco) }}
                    </div>

                    <div class="product-price product-price--promo">
                      {{ money(product.precoPromocao) }}
                    </div>

                    <q-chip
                      dense
                      color="negative"
                      text-color="white"
                      icon="local_offer"
                      class="q-mt-sm fit-content"
                    >
                      Promoção
                    </q-chip>
                  </div>

                  <div v-else class="product-price">
                    {{ money(product?.precoEfetivo ?? product?.preco) }}
                  </div>

                  <q-banner
                    v-if="isOutOfStock"
                    rounded
                    class="out-stock-banner q-mt-md"
                  >
                    <template #avatar>
                      <q-icon name="block" color="negative" />
                    </template>

                    Este produto está sem estoque no momento. Você ainda pode compartilhar o link ou consultar disponibilidade com a loja.
                  </q-banner>
                </q-card-section>
              </q-card>

              <div class="q-mt-md">
                <div class="q-mb-xs text-body2 text-weight-bold text-grey-9 row items-center q-gutter-sm">
                  <span>Detalhes do produto</span>

                  <q-spinner-dots
                    v-if="aiDescriptionLoading"
                    color="secondary"
                    size="22px"
                  />
                </div>

                <q-card flat bordered class="description-card">
                  <q-card-section>
                    <div v-if="aiDescriptionLoading">
                      <q-skeleton type="text" class="q-mb-sm" />
                      <q-skeleton type="text" class="q-mb-sm" />
                      <q-skeleton type="text" class="q-mb-sm" />
                      <q-skeleton type="text" class="q-mb-sm" width="90%" />
                      <q-skeleton type="text" class="q-mb-sm" width="85%" />
                      <q-skeleton type="text" width="75%" />
                    </div>

                    <div
                      v-else
                      class="ai-description-text"
                      v-html="aiDescriptionHtml"
                    />
                  </q-card-section>
                </q-card>
              </div>

              <div class="q-mt-lg row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-btn
                    unelevated
                    :color="isOutOfStock ? 'grey-6' : 'green-14'"
                    :icon="isOutOfStock ? 'block' : 'add_shopping_cart'"
                    class="w100 text-bold product-action-btn"
                    :label="isOutOfStock ? 'Sem estoque' : 'Adicionar ao carrinho'"
                    :disable="!product || isOutOfStock"
                    @click="confirmAddToCart(product)"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <q-btn
                    outline
                    color="secondary"
                    icon="share"
                    class="w100 product-action-btn"
                    label="Compartilhar"
                    @click="shareOrCopy"
                  />
                </div>
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
      <q-btn
        flat
        color="secondary"
        icon="arrow_back"
        label="Voltar ao catálogo"
        @click="goBackToCatalog"
      />
    </div>

    <q-dialog
      v-model="fullscreen.open"
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card class="bg-black text-white">
        <q-bar class="bg-black text-white">
          <div class="text-caption ellipsis">
            {{ product?.descricao || 'Imagem' }}
          </div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="q-pa-none fullscreen-body">
          <q-img
            :src="fullscreen.src"
            fit="contain"
            class="fullscreen-img"
            @error="onFullscreenError"
          />
        </q-card-section>

        <q-card-section class="bg-black q-pt-none">
          <div class="row items-center justify-center q-gutter-sm">
            <q-btn
              dense
              flat
              icon="chevron_left"
              :disable="!images.length"
              @click="prevImage"
            />

            <div class="text-caption">
              {{ images.length ? (activeSlide + 1) : 0 }} / {{ images.length }}
            </div>

            <q-btn
              dense
              flat
              icon="chevron_right"
              :disable="!images.length"
              @click="nextImage"
            />
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
import { api_ia } from 'boot/axios-ia'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const cart = useCart()

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

const loading = ref(false)
const product = ref(null)

const aiDescriptionLoading = ref(false)
const aiDescription = ref('-')
const lastAiRequestKey = ref('')
const aiDescriptionLoadedKey = ref('')
const aiDescriptionInFlightKey = ref('')

const activeSlide = ref(0)
const images = ref([])

const fullscreen = ref({
  open: false,
  src: ''
})

function safeUrl (url) {
  if (!url) return null

  const s = String(url).trim()
  if (!s) return null

  return s.replace(/ /g, '%20')
}

function escapeHtml (value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeTitleKey (value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/:$/, '')
    .toUpperCase()
    .trim()
}

function isAiSectionTitle (line) {
  const key = normalizeTitleKey(line)

  return [
    'DESCRICAO DO PRODUTO',
    'DESTAQUES',
    'APLICACOES INDICADAS',
    'FICHA TECNICA',
    'DICAS DE USO',
    'CUIDADOS E SEGURANCA',
    'ANTES DE COMPRAR',
    'DADOS DO CADASTRO'
  ].includes(key)
}

function formatAIDescriptionToHtml (text) {
  const raw = String(text || '').trim()

  if (!raw || raw === '-') {
    return '<div class="ai-line-paragraph">Descrição indisponível no momento.</div>'
  }

  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  return lines.map((line) => {
    const safe = escapeHtml(line)

    if (isAiSectionTitle(line)) {
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

function normalizeNumber (value) {
  if (value === null || value === undefined || value === '') return null

  const normalized = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const n = Number(normalized)

  return Number.isFinite(n) ? n : null
}

function normalizeStockValue (p) {
  if (!p) return null

  const candidates = [
    p.ESTOQUE,
    p.estoque,
    p.QTDESTOQUE,
    p.qtdEstoque,
    p.QTD_ESTOQUE,
    p.qtd_estoque,
    p.SALDO,
    p.saldo,
    p.QTDATUAL,
    p.qtdAtual,
    p.QUANTIDADE,
    p.quantidade
  ]

  for (const value of candidates) {
    const n = normalizeNumber(value)

    if (n !== null) return n
  }

  return null
}

function normalizeBarcodeValue (p) {
  if (!p) return ''

  return String(
    p.CODBARRAS ??
    p.codBarras ??
    p.COD_BARRAS ??
    p.codigoBarras ??
    p.barcode ??
    ''
  ).trim()
}

function isInactiveValue (value) {
  if (typeof value === 'string') {
    const normalized = value.trim().toUpperCase()
    return normalized === 'T' || normalized === 'S' || normalized === 'TRUE' || normalized === '1'
  }

  return value === true || value === 1
}

function isProductOutOfStock (p) {
  if (!p) return false

  if (isInactiveValue(p.inativoFlag ?? p.INATIVO ?? p.inativo)) {
    return true
  }

  const stock = normalizeStockValue(p)

  return stock !== null && stock <= 0
}

function normalizeProduct (p) {
  if (!p) return null

  const imgsPathRaw = p.IMGS_PATH ?? p.imgsPath ?? p.imagensPath ?? p.IMGS_PATHS ?? null

  const imgsPath = Array.isArray(imgsPathRaw)
    ? imgsPathRaw.filter(Boolean).map((u) => safeUrl(u)).filter(Boolean)
    : (typeof imgsPathRaw === 'string' && imgsPathRaw ? [safeUrl(imgsPathRaw)].filter(Boolean) : [])

  const legacyUrl =
    (p.IMG && typeof p.IMG === 'object' && (p.IMG.link || p.IMG.url))
      ? safeUrl(p.IMG.link || p.IMG.url)
      : safeUrl(p.imagemUrl ?? p.IMAGEM_URL ?? p.imgPath ?? p.IMG_PATH ?? null)

  const estoque = normalizeStockValue(p)
  const codBarras = normalizeBarcodeValue(p)

  return {
    id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p.ID,
    CODPRODUTO: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p.ID,
    descricao: p.DESCRICAO ?? p.descricao,
    marca: p.MARCA ?? p.marca,
    preco: p.PRECO ?? p.preco,
    precoPromocao: p.PRECOPROMOCAO ?? p.precoPromocao,
    precoEfetivo: p.PRECO_EFETIVO ?? p.precoEfetivo ?? p.PRECO ?? p.preco,
    CODORIGINAL: p.CODORIGINAL ?? p.codOriginal ?? p.sku,
    CODBARRAS: codBarras,
    codBarras,
    estoque,
    ESTOQUE: estoque,
    INATIVO: p.INATIVO ?? p.inativo,
    HAS_IMAGE: p.HAS_IMAGE ?? p.hasImage ?? null,
    IMGS_PATH: imgsPath.length ? imgsPath : (legacyUrl ? [legacyUrl] : []),
    imagemUrl: legacyUrl || (imgsPath[0] || null),
    ...p
  }
}

function setImagesFromProduct (p) {
  const arr = Array.isArray(p?.IMGS_PATH)
    ? p.IMGS_PATH.filter(Boolean).map(String)
    : []

  images.value = arr.length ? arr : []
  activeSlide.value = 0
}

function applyProduct (payload) {
  if (!payload) return null

  const normalized = normalizeProduct(payload)

  product.value = normalized
  setImagesFromProduct(normalized)

  return normalized
}

const stateProduct = typeof history !== 'undefined' && history?.state?.product
  ? history.state.product
  : null

function extractIdFromSlug (slug) {
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

      if (cached) {
        applyProduct(JSON.parse(cached))
      }
    } catch {}
  }
}

const stockQuantity = computed(() => {
  return normalizeStockValue(product.value)
})

const isOutOfStock = computed(() => {
  return isProductOutOfStock(product.value)
})

const stockStatusLabel = computed(() => {
  if (!product.value) return 'Produto'

  if (isOutOfStock.value) return 'Sem estoque'

  if (stockQuantity.value !== null) {
    return `${stockQuantity.value} em estoque`
  }

  return 'Disponível'
})

const hasPromotion = computed(() => {
  const p = product.value

  if (!p) return false

  const preco = Number(p.preco ?? p.PRECO ?? 0)
  const promo = Number(p.precoPromocao ?? p.PRECOPROMOCAO ?? 0)

  return promo > 0 && (!preco || promo < preco)
})

const skuText = computed(() => {
  const p = product.value

  if (!p) return '—'

  const sku = p.sku ?? p.CODORIGINAL ?? p.codOriginal ?? p.codoriginal

  return sku ? String(sku) : '—'
})

const barcodeText = computed(() => {
  return normalizeBarcodeValue(product.value)
})

const shortDesc = computed(() => {
  return product.value?.descricao
    ? String(product.value.descricao).slice(0, 220)
    : 'Ferramentas, elétrica, hidráulica e manutenção com atendimento especializado.'
})

const aiDescriptionText = computed(() => {
  const txt = String(aiDescription.value || '').trim()

  return txt || '-'
})

const aiDescriptionHtml = computed(() => {
  return formatAIDescriptionToHtml(aiDescriptionText.value)
})

function money (n) {
  if (n === null || n === undefined || n === '') return '—'

  const parsed = Number(String(n).replace(',', '.'))

  if (!Number.isFinite(parsed)) return '—'

  return parsed.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function slugify (s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function buildSlug (p) {
  const desc = (p.DESCRICAO ?? p.descricao) || ''
  const brand = (p.MARCA ?? p.marca) || ''
  const id = p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id ?? ''

  return `${slugify(`${desc} ${brand}`)}-${id}`
}

function goBackToCatalog () {
  const last = sessionStorage.getItem('catalog:lastUrl')

  if (last) return router.push(last)
  if (window.history.length > 1) return router.back()

  return router.push({
    path: '/catalogo'
  })
}

function confirmAddToCart (p) {
  if (!p) return

  if (isProductOutOfStock(p)) {
    $q.notify({
      type: 'warning',
      position: 'top',
      message: 'Este produto está sem estoque no momento.'
    })

    return
  }

  const name = p?.descricao || 'Produto'

  $q.dialog({
    title: '🛒 Adicionar ao carrinho',
    message: `Adicionar "${name}" ao carrinho?`,
    cancel: true,
    persistent: true,
    ok: {
      label: 'Adicionar',
      color: 'green-14'
    },
    cancel: {
      label: 'Cancelar',
      color: 'grey-6'
    }
  }).onOk(() => {
    cart.addItem(p, 1)

    if (cart.state) {
      cart.state.drawerOpen = true
    }

    $q.notify({
      type: 'positive',
      message: 'Adicionado ao carrinho!'
    })
  })
}

function extractGeneratedDescription (payload) {
  const root = payload?.data ?? payload

  return (
    root?.descricaoGeradaIA ||
    root?.descricao_gerada_ia ||
    root?.descricaoGeradaIa ||
    root?.descricao ||
    '-'
  )
}

async function loadAIDescription (p) {
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

  if (
    aiDescriptionLoadedKey.value === requestKey &&
    aiDescription.value &&
    aiDescription.value !== '-'
  ) {
    return
  }

  if (
    aiDescriptionInFlightKey.value === requestKey &&
    aiDescriptionLoading.value
  ) {
    return
  }

  lastAiRequestKey.value = requestKey
  aiDescriptionInFlightKey.value = requestKey
  aiDescriptionLoading.value = true
  aiDescription.value = '-'

  try {
    const { data } = await api_ia.post(
      '/catalog/generate-description',
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
    aiDescriptionLoadedKey.value = requestKey
  } catch (err) {
    console.error('[ProductPage] erro ao gerar descrição com IA:', err)

    if (lastAiRequestKey.value === requestKey) {
      aiDescription.value = '-'
    }
  } finally {
    if (lastAiRequestKey.value === requestKey) {
      aiDescriptionLoading.value = false
      aiDescriptionInFlightKey.value = ''
    }
  }
}

async function loadProduct () {
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
      (data?.ok && data?.data)
        ? data.data
        : (Array.isArray(data?.data) ? data.data[0] : data?.data) ||
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

async function load () {
  try {
    loading.value = !product.value

    const resolved = await loadProduct()
    const targetProduct = resolved || product.value

    if (targetProduct) {
      await loadAIDescription(targetProduct)
      return
    }

    aiDescriptionLoading.value = false
    aiDescription.value = '-'

    $q.notify({
      type: 'warning',
      message: 'Produto não encontrado. Abra a partir do catálogo.'
    })
  } catch (err) {
    console.error('[ProductPage] erro:', err)

    aiDescriptionLoading.value = false
    aiDescription.value = '-'

    if (!product.value) {
      $q.notify({
        type: 'negative',
        message: 'Falha ao carregar o produto.'
      })
    }
  } finally {
    loading.value = false
  }
}

async function shareOrCopy () {
  const url = location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url
      })
    } else {
      await navigator.clipboard.writeText(url)

      $q.notify({
        type: 'positive',
        message: 'Link copiado!'
      })
    }
  } catch {}
}

function openFullscreen (src) {
  fullscreen.value.src = src || fallbackImage
  fullscreen.value.open = true
}

function onCarouselImageError (idx) {
  if (images.value[idx]) {
    images.value[idx] = fallbackImage
  }
}

function onThumbImageError (idx) {
  if (images.value[idx]) {
    images.value[idx] = fallbackImage
  }
}

function onFullscreenError () {
  fullscreen.value.src = fallbackImage
}

function prevImage () {
  if (!images.value.length) return

  const next = (activeSlide.value - 1 + images.value.length) % images.value.length

  activeSlide.value = next
  fullscreen.value.src = images.value[next] || fallbackImage
}

function nextImage () {
  if (!images.value.length) return

  const next = (activeSlide.value + 1) % images.value.length

  activeSlide.value = next
  fullscreen.value.src = images.value[next] || fallbackImage
}

watch(activeSlide, (idx) => {
  if (fullscreen.value.open && images.value[idx]) {
    fullscreen.value.src = images.value[idx]
  }
})

watch(() => route.params.slug, () => {
  aiDescription.value = '-'
  aiDescriptionLoading.value = false
  lastAiRequestKey.value = ''
  aiDescriptionLoadedKey.value = ''
  aiDescriptionInFlightKey.value = ''

  load()
})

useMeta(() => {
  const p = product.value
  const img = images.value[0] || fallbackImage
  const title = p
    ? `${p.descricao || p.DESCRICAO} | Eletro Nogueira`
    : 'Produto | Eletro Nogueira'
  const desc = shortDesc.value
  const canonical = `${location.origin}/catalogo/produto/${route.params.slug}`

  return {
    title,
    meta: [
      {
        name: 'description',
        content: desc
      },
      {
        property: 'og:title',
        content: title
      },
      {
        property: 'og:description',
        content: desc
      },
      {
        property: 'og:type',
        content: 'product'
      },
      {
        property: 'og:url',
        content: canonical
      },
      {
        property: 'og:image',
        content: img
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: canonical
      }
    ],
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
          brand: p?.marca
            ? {
                '@type': 'Brand',
                name: p.marca
              }
            : undefined,
          offers: {
            '@type': 'Offer',
            url: canonical,
            priceCurrency: 'BRL',
            price: Number(p?.precoEfetivo ?? p?.PRECO_EFETIVO ?? p?.preco ?? p?.PRECO ?? 0).toFixed(2),
            availability: isOutOfStock.value
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'Eletro Nogueira'
            }
          }
        })
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  }
})

onMounted(load)
</script>

<style scoped>
.product-page {
  --en-yellow: #F7D102;
  --en-blue: #021E58;
  --en-blue-dark: #03122E;

  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(247, 209, 2, 0.16), transparent 34%),
    radial-gradient(circle at 82% 12%, rgba(247, 209, 2, 0.1), transparent 28%),
    linear-gradient(135deg, var(--en-blue) 0%, var(--en-blue-dark) 100%);
}

.product-topbar {
  position: sticky;
  top: 60px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(100%, 1240px);
  margin: 0 auto 18px;
  padding: 10px 12px;
  border-radius: 0 0 22px 22px;
  background: rgba(247, 209, 2, 0.96);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(12px);
}

.product-main-card {
  position: relative;
  width: min(100%, 1240px);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(247, 209, 2, 0.22);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.26);
}

.product-main-card--out-stock {
  border-color: rgba(220, 38, 38, 0.34);
}

.product-main-card--out-stock::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      -35deg,
      rgba(220, 38, 38, 0.035) 0,
      rgba(220, 38, 38, 0.035) 12px,
      transparent 12px,
      transparent 28px
    );
}

.product-skeleton-image {
  height: 420px;
  border-radius: 22px;
}

.product-gallery-card {
  position: relative;
  overflow: hidden;
  min-height: 460px;
  padding: 16px;
  border-radius: 26px;
  background:
    radial-gradient(circle at center, rgba(247, 209, 2, 0.08), transparent 54%),
    linear-gradient(180deg, #ffffff 0%, #f7f7f7 100%);
  border: 1px solid rgba(2, 30, 88, 0.08);
}

.product-carousel {
  border-radius: 22px;
  background: #ffffff;
}

.product-detail-img {
  width: 100%;
  max-width: 620px;
  height: 390px;
  border-radius: 18px;
}

.product-detail-img :deep(img),
.product-detail-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}

.thumbs-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
}

.thumb-img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  background: #ffffff;
  opacity: 0.76;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    border-color 0.16s ease;
}

.thumb-img:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.thumb-active {
  opacity: 1;
  border-color: var(--en-yellow);
  box-shadow: 0 8px 18px rgba(2, 30, 88, 0.18);
}

.out-stock-watermark {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: rgba(220, 38, 38, 0.14);
  font-size: clamp(38px, 7vw, 86px);
  font-weight: 950;
  letter-spacing: -0.06em;
  transform: rotate(-16deg);
  text-align: center;
  text-transform: uppercase;
}

.out-stock-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 6;
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(220, 38, 38, 0.18);
}

.product-info-panel {
  height: 100%;
  padding: 4px 2px;
}

.product-title {
  margin: 14px 0 8px;
  color: #111827;
  font-size: clamp(26px, 3vw, 42px);
  line-height: 1.04;
  font-weight: 950;
  letter-spacing: -0.055em;
}

.product-code-line {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.price-card {
  margin-top: 18px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(247, 209, 2, 0.12), transparent 38%),
    #ffffff;
}

.price-card--out-stock {
  background:
    radial-gradient(circle at top right, rgba(220, 38, 38, 0.1), transparent 38%),
    #ffffff;
}

.product-price {
  color: var(--en-blue-dark);
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.06em;
}

.product-price--promo {
  color: #0f9f5c;
}

.old-price {
  width: fit-content;
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 16px;
  font-weight: 800;
}

.fit-content {
  width: fit-content;
}

.out-stock-banner {
  color: #7f1d1d;
  background: rgba(254, 226, 226, 0.86);
  border: 1px solid rgba(220, 38, 38, 0.18);
}

.description-card {
  min-height: 150px;
  border-radius: 20px;
  background: #f9fafb;
}

.product-action-btn {
  min-height: 48px;
  border-radius: 999px;
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
  white-space: normal;
  min-height: 110px;
  color: #37474f;
  line-height: 1.7;
}

.ai-line-title {
  margin-top: 14px;
  margin-bottom: 8px;
  color: #1f2937;
  font-size: 15px;
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

.footer {
  padding: 18px;
  text-align: center;
}

@media (max-width: 900px) {
  .product-page {
    padding: 68px 12px 64px;
  }

  .product-topbar {
    top: 54px;
  }

  .product-main-card {
    border-radius: 24px;
  }

  .product-gallery-card {
    min-height: auto;
    padding: 10px;
  }

  .product-detail-img {
    height: 300px;
  }

  .product-carousel {
    height: 320px !important;
  }

  .product-title {
    font-size: 28px;
  }

  .out-stock-watermark {
    font-size: clamp(34px, 13vw, 64px);
  }
}

@media (max-width: 520px) {
  .product-page {
    padding-left: 8px;
    padding-right: 8px;
  }

  .product-topbar {
    border-radius: 0 0 18px 18px;
  }

  .product-detail-img {
    height: 250px;
  }

  .product-carousel {
    height: 280px !important;
  }

  .thumb-img {
    width: 54px;
    height: 54px;
  }

  .product-price {
    font-size: 34px;
  }
}
</style>