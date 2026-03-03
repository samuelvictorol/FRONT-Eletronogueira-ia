<template>
  <q-page class="catalog-page bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : 'q-pb-lg q-px-md'">
    <!-- Loading overlay -->
    <q-inner-loading :showing="loading || brandLoading">
      <q-spinner-gears size="42px" color="secondary" />
      <div class="q-mt-sm text-grey-7">Carregando…</div>
    </q-inner-loading>

    <!-- HEADER -->
    <div
      class="header-wrap bg-primary q-pa-md q-mt-xl q-mb-md animate__animated animate__fadeInDown animate__delay-2s animate__slower"
      style="position: sticky; top: 50px; z-index: 9;">
      <div class="row items-center justify-between">
        <div class="col">
          <q-breadcrumbs class="text-secondary">
            <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
            <!-- ✅ não usa mais page no link, pra não “sujar” URL com page do infinite -->
            <q-breadcrumbs-el class="text-bold" label="Catálogo" :to="`/catalogo?limit=15&orderBy=${orderBy}`" />
          </q-breadcrumbs>

          <div class="row items-center q-mt-md no-wrap">
            <div class="text-h5 text-secondary text-weight-bolder">Catálogo</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTERS PANEL -->
    <div class="filters-card bg-white rounded-borders shadow-1 q-pa-md q-mb-md">
      <div class="row q-col-gutter-md items-end">
        <div class="col-12 col-md-6">
          <!-- ✅ ao consultar, sempre reseta para página 1 -->
          <q-input @keyup.enter="searchNow" color="secondary" v-model="filters.descricaoProduto"
            label="Buscar por produto" dense outlined clearable hint="Ex.: furadeira, bomba, martelo">
            <template #prepend>
              <q-icon name="search" color="secondary" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-6">
          <q-select v-model="selectedBrand" color="secondary" label="Marca" dense outlined clearable use-input
            fill-input hide-selected input-debounce="350" :options="brandOptions" :loading="brandLoading"
            option-label="label" option-value="value" hint="Digite para sugerir" behavior="menu" @filter="onBrandFilter"
            @clear="clearBrand(false)" @update:model-value="onBrandModelChanged">
            <template #prepend>
              <q-icon name="sell" color="secondary" />
            </template>

            <template #no-option>
              <q-item>
                <q-item-section class="text-grey-7">
                  <span v-if="(brandInput || '').length < 2">Digite pelo menos 2 letras.</span>
                  <span v-else>Nenhuma marca encontrada.</span>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- PREÇO MIN / MAX (comentado conforme pedido) -->
        <!-- ... -->

        <div class="col-12 q-mb-md">
          <div class="row justify-center q-gutter-sm items-center">
            <q-btn flat color="secondary" label="Limpar" @click="resetFilters" />
            <!-- ✅ consultar chama searchNow (reseta page) -->
            <q-btn color="secondary" label="Consultar" icon-right="search" :loading="loading" @click="searchNow" />
          </div>
        </div>
      </div>

      <div class="row items-center justify-between q-col-gutter-sm">
        <div class="col-12 col-md-auto">
          <q-select color="secondary" v-model="orderBy" :options="orderOptions" dense outlined emit-value map-options
            label="Ordenar" style="min-width: 220px" @update:model-value="onOrderChange" />
        </div>

        <div v-if="hasAnyFilter" class="row q-mt-sm q-gutter-sm items-center">
          <q-chip v-if="filters.descricaoProduto" color="grey-2" text-color="grey-9" icon="search" removable
            @remove="filters.descricaoProduto = ''; searchNow()">
            {{ filters.descricaoProduto }}
          </q-chip>

          <q-chip v-if="selectedBrand" color="grey-2" text-color="grey-9" icon="sell" removable
            @remove="clearBrand(true);">
            {{ selectedBrand.label }}
          </q-chip>
        </div>

        <!-- itens por página (comentado conforme pedido) -->
        <!-- ... -->
      </div>
    </div>

    <!-- GRID -->
    <div class="catalog-grid">
      <template v-if="loading && items.length === 0">
        <q-skeleton v-for="i in limit" :key="'sk' + i" type="rect" class="card-skel" />
      </template>

      <template v-else-if="items.length === 0">
        <div class="q-pa-lg bg-white rounded-borders shadow-1 text-grey-7">
          Nenhum item encontrado com os filtros atuais.
          <q-btn flat color="primary" class="q-ml-sm" label="Limpar filtros" @click="resetFilters" />
        </div>
      </template>

      <template v-else>
        <q-card v-for="p in items" :key="p.codProduto ?? p.id ?? p._id"
          class="bg-secondary text-white relative product-card" flat bordered @click="openDetails(p)"
          style="cursor: pointer;">
          <q-img :src="resolveImage(p)" :alt="p.descricao" spinner-color="secondary" fit="contain" class="product-img">
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-2 text-grey-8">
                <q-img :src="fallbackImage" style="width:64px; height:64px" />
              </div>
            </template>
          </q-img>
          <div class="w100 row no-wrap justify-between items-center q-px-sm q-pt-sm q-pb-md">
            <div class="w100 text-subtitle2 text-weight-medium">
              {{ p.descricao }}
            </div>

            <div class="text-weight-bold text-white q-px-sm q-py-sm rounded-borders absolute-top-left bg-secondary"
              style="font-size: .9rem;">
              {{ money(p.precoEfetivo ?? p.preco) }}
            </div>
          </div>
          <!-- <q-card-section class="q-pt-sm q-pb-sm">
            <div class="row items-start justify-between q-col-gutter-sm">
              <div class="col"> -->
                <q-badge v-if="p.marca" color="primary" text-color="secondary"
                  class="text-bold q-mb-xs q-pa-xs absolute-top-right">
                  {{ p.marca }}
                </q-badge>
              <!-- </div> -->

              <!-- <div class="w100 row no-wrap justify-end items-center">
                <q-btn  class="bg-green-14 text-secondary" icon="add_shopping_cart" @click.stop="confirmAddToCart(p)" />
                <q-btn dense icon-right="visibility" @click.stop="openDetails(p)"
                  class="bg-secondary"/>
              </div> -->
            <!-- </div> -->
          <!-- </q-card-section> -->
        </q-card>
      </template>
    </div>

    <!-- LOADING MAIS (infinite) -->
    <div class="row justify-center q-mt-md q-mb-xl">
      <q-spinner-dots v-if="loadingMore" size="32px" color="secondary" />
      <div v-else-if="!loading && isLastPage && items.length > 0" class="text-grey-7 q-mt-sm">
        Você chegou ao final.
      </div>
      <!-- sentinela -->
      <div ref="sentinelEl" style="height: 1px; width: 1px;"></div>
    </div>

    <!-- “floating actions” no mobile -->
    <div v-if="isMobile" class="mobile-actions">
      <q-btn round color="secondary" class="shadow-2" size="md" icon="search" @click="toTopPage()" />
      <q-btn round color="green-14" class="shadow-2" size="md" icon="shopping_cart"
        @click="cart.state.drawerOpen = true">
        <q-badge v-if="cart.count.value > 0" color="negative" floating>
          {{ cart.count.value }}
        </q-badge>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'
import { useCart } from 'src/composables/useCart'

const isHydrating = ref(true)
const $q = useQuasar()
const isMobile = $q.screen.lt.md
const router = useRouter()

const cart = useCart()

const loading = ref(false)
const loadingMore = ref(false)

const items = ref([])
const total = ref(0)

// paginação (interna)
const page = ref(1)

// ✅ sempre 15 (fixo)
const limit = ref(15)

const apiOffset = ref(0)
const apiIsLastPage = ref(false)

const orderBy = ref('updated_desc')

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: null,
  precoMin: null,
  precoMax: null
})

const orderOptions = [
  { label: 'Mais recentes', value: 'updated_desc' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais relevante', value: 'created_desc' }
]

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

function toTopPage() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function safeUrl(url) {
  if (!url) return null
  const s = String(url).trim()
  if (!s) return null
  return s.replace(/ /g, '%20')
}

function resolveImage(p) {
  if (!p) return fallbackImage

  const fromImgsPath =
    Array.isArray(p.IMGS_PATH) && p.IMGS_PATH.length ? p.IMGS_PATH[0] :
      Array.isArray(p.imgsPath) && p.imgsPath.length ? p.imgsPath[0] :
        Array.isArray(p.imagensPath) && p.imagensPath.length ? p.imagensPath[0] :
          null

  const legacy =
    p.imgPath ||
    p.IMG_PATH ||
    p.imagemUrl ||
    p.IMAGEM_URL ||
    p.img_url ||
    (p.IMG && (p.IMG.link || p.IMG.url)) ||
    null

  return safeUrl(fromImgsPath || legacy) || fallbackImage
}

const offset = computed(() => Math.max(0, (Number(page.value) - 1) * 15))

const maxPage = computed(() => {
  const t = Number(total.value) || 0
  return Math.max(1, Math.ceil(t / 15))
})

const isLastPage = computed(() => {
  if (typeof apiIsLastPage.value === 'boolean') return apiIsLastPage.value
  return Number(page.value) >= maxPage.value
})

const nextOffset = computed(() => offset.value + 15)

const hasAnyFilter = computed(() => Boolean((filters.value.descricaoProduto || '').trim() || selectedBrand.value))

function money(n) {
  if (n == null) return '—'
  try {
    return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${String(n)}`
  }
}

/**
 * ✅ BUGFIX 1: não “persistir page” na URL durante infinite scroll
 * - readFromURL só aplica page se o usuário explicitamente mandou page (e se você quiser)
 * - aqui, vamos IGNORAR page do QS e sempre começar 1
 */
function readFromURL() {
  const qs = new URLSearchParams(window.location.search)

  const marcaFromUrl = (qs.get('marca') || '').trim()
  if (marcaFromUrl) {
    const upper = marcaFromUrl.toUpperCase()
    filters.value.descricaoMarca = upper
    selectedBrand.value = { label: upper, marca: upper, value: upper, codMarca: null }
  } else {
    filters.value.descricaoMarca = null
    selectedBrand.value = null
  }

  filters.value.descricaoProduto = qs.get('q') || ''

  // ✅ sempre começa no 1 (resolve teu bug)
  page.value = 1
  limit.value = 15
  orderBy.value = qs.get('orderBy') || 'updated_desc'
}

/**
 * ✅ BUGFIX 2: writeToURL não grava page quando veio do infinite scroll.
 * A URL representa os filtros, não o estado de scroll.
 */
function writeToURL() {
  if (isHydrating.value) return

  const qs = new URLSearchParams()

  if ((filters.value.descricaoProduto || '').trim()) qs.set('q', (filters.value.descricaoProduto || '').trim())

  const marca = (selectedBrand.value?.marca || filters.value.descricaoMarca || '').trim()
  if (marca) qs.set('marca', marca.toUpperCase())

  qs.set('limit', '15')
  qs.set('orderBy', orderBy.value || 'updated_desc')

  // ✅ não setar page aqui
  window.history.replaceState(null, '', `${location.pathname}?${qs.toString()}`)
}

/** Marcas (autocomplete) */
const brandLoading = ref(false)
const brandOptions = ref([])
const brandInput = ref('')
const selectedBrand = ref(null)

function normalizeBrandsResponse(data) {
  const raw = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  return raw
    .map((m) => {
      const cod = m?.CODMARCA ?? m?.codMarca ?? m?.id ?? null
      const name = (m?.MARCA ?? m?.marca ?? '').trim()
      if (cod == null || !name) return null
      return { label: name, value: cod, codMarca: cod, marca: name }
    })
    .filter(Boolean)
}

let brandReqSeq = 0
function onBrandFilter(val, update) {
  const term = (val || '').trim()
  brandInput.value = term

  if (term.length < 2) {
    update(() => (brandOptions.value = []))
    return
  }

  const mySeq = ++brandReqSeq
  brandLoading.value = true

  api
    .get('/marcas/', { params: { limit: 6, offset: 0, descricaoMarca: term } })
    .then(({ data }) => {
      if (mySeq !== brandReqSeq) return
      update(() => (brandOptions.value = normalizeBrandsResponse(data).slice(0, 6)))
    })
    .catch(() => {
      if (mySeq !== brandReqSeq) return
      update(() => (brandOptions.value = []))
    })
    .finally(() => {
      if (mySeq !== brandReqSeq) return
      brandLoading.value = false
    })
}

function onBrandModelChanged(v) {
  if (!v) {
    filters.value.descricaoMarca = null
    return
  }
  filters.value.descricaoMarca = v.marca
  searchNow()
}

function clearBrand(runSearch = false) {
  selectedBrand.value = null
  brandOptions.value = []
  brandInput.value = ''
  filters.value.descricaoMarca = null
  if (runSearch) searchNow()
}

/** ✅ busca "oficial" (sempre reseta estado de scroll/página) */
async function searchNow() {
  // trava observer durante reset/busca
  isResetting.value = true

  page.value = 1
  items.value = []
  total.value = 0
  apiIsLastPage.value = false

  // ✅ manter URL “limpa” (sem page)
  writeToURL()

  await applyFilters(false, { append: false })

  // libera observer
  isResetting.value = false
}

/** eventos */
function onOrderChange() {
  searchNow()
}

function resetFilters() {
  filters.value = { descricaoProduto: '', descricaoMarca: null, precoMin: null, precoMax: null }
  clearBrand(false)
  searchNow()
}

function pickTotalFromResponse(data) {
  const candidates = [data?.totalCount, data?.total, data?.count, data?.meta?.total, data?.pagination?.total].map((x) =>
    Number(x)
  )
  const found = candidates.find((n) => Number.isFinite(n) && n >= 0)
  return Number.isFinite(found) ? found : null
}

function normalizeProdutos(data) {
  const raw =
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.results) && data.results) ||
    (Array.isArray(data) ? data : [])

  return raw.map((p) => {
    const preco = p.PRECO ?? p.preco ?? null
    const promo = p.PRECOPROMOCAO ?? p.precoPromocao ?? 0
    const efetivo = p.PRECO_EFETIVO ?? p.precoEfetivo ?? (Number(promo) > 0 ? promo : preco)

    const imgsPathRaw = p.IMGS_PATH ?? p.imgsPath ?? p.imagensPath ?? null
    const imgsPath = Array.isArray(imgsPathRaw)
      ? imgsPathRaw.filter(Boolean).map((u) => safeUrl(u))
      : (typeof imgsPathRaw === 'string' && imgsPathRaw ? [safeUrl(imgsPathRaw)] : [])

    const legacyImgPath = p.IMG_PATH ?? p.imgPath ?? null
    const legacyUrl = safeUrl(legacyImgPath)

    return {
      id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      codProduto: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      descricao: p.DESCRICAO ?? p.descricao ?? '',
      codOriginal: p.CODORIGINAL ?? p.codOriginal ?? null,
      marca: p.MARCA ?? p.marca ?? '',
      preco: preco != null ? Number(preco) : null,
      precoPromocao: promo != null ? Number(promo) : null,
      precoEfetivo: efetivo != null ? Number(efetivo) : null,

      imgsPath,
      imgs: Array.isArray(p.IMGS) ? p.IMGS : (p.IMGS != null ? [p.IMGS] : null),

      imgPath: legacyUrl,
      imagemUrl: imgsPath?.[0] || legacyUrl || null,

      dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null,
      hasImage: p.HAS_IMAGE ?? p.hasImage ?? null
    }
  })
}

/** ✅ anti-race: cada request tem um token; só o último aplica */
let reqSeq = 0
const isResetting = ref(false)

async function applyFilters(updateURL = true, { append = false } = {}) {
  const mySeq = ++reqSeq

  if (!append) loading.value = true
  else loadingMore.value = true

  try {
    const params = {
      limit: 15,
      offset: offset.value,
      descricaoProduto: (filters.value.descricaoProduto || '').trim() || null,
      descricaoMarca: selectedBrand.value?.marca || filters.value.descricaoMarca || null,
      precoMin: filters.value.precoMin,
      precoMax: filters.value.precoMax,
      orderBy: orderBy.value || 'updated_desc'
    }

    const { data } = await api.get('/produtos/', { params })

    // ✅ se chegou uma resposta antiga, ignora
    if (mySeq !== reqSeq) return

    const newItems = normalizeProdutos(data)

    if (append) items.value = [...items.value, ...newItems]
    else items.value = newItems

    apiOffset.value = Number(data?.offset ?? offset.value) || 0

    const apiTotal = pickTotalFromResponse(data)
    if (apiTotal != null) total.value = apiTotal
    else total.value = (page.value - 1) * 15 + newItems.length

    if (typeof data?.is_last_page === 'boolean') {
      apiIsLastPage.value = data.is_last_page
    } else {
      apiIsLastPage.value = nextOffset.value >= (Number(total.value) || 0)
    }

    // ✅ só atualiza URL quando for busca “manual” (não scroll)
    if (updateURL && !append) {
      writeToURL()
      sessionStorage.setItem('catalog:lastUrl', `${location.pathname}${location.search}`)
    }
  } catch (err) {
    if (mySeq !== reqSeq) return
    console.error('[Catalogo] erro ao buscar:', err)
    $q.notify({ type: 'negative', message: 'Falha ao buscar produtos.' })

    if (!append) {
      items.value = []
      total.value = 0
      apiIsLastPage.value = true
    }
  } finally {
    if (mySeq !== reqSeq) return
    loading.value = false
    loadingMore.value = false
  }
}

/** infinite scroll (IntersectionObserver) */
const sentinelEl = ref(null)
let io = null

async function loadNextPageIfPossible() {
  if (loading.value || loadingMore.value) return
  if (isResetting.value) return
  if (isLastPage.value) return

  // ✅ incrementa page interno, mas NÃO grava na URL
  page.value = Number(page.value) + 1
  await applyFilters(false, { append: true })
}

function setupObserver() {
  if (!sentinelEl.value) return
  if (io) io.disconnect()

  io = new IntersectionObserver(
    (entries) => {
      const first = entries[0]
      if (!first?.isIntersecting) return
      loadNextPageIfPossible()
    },
    { root: null, rootMargin: '900px 0px', threshold: 0.01 }
  )

  io.observe(sentinelEl.value)
}

/** detalhe */
function openDetails(p) {
  sessionStorage.setItem('catalog:lastUrl', `${location.pathname}${location.search}`)

  const slugify = (s = '') =>
    String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

  const desc = p.descricao || ''
  const brand = p.marca || ''
  const id = p.id ?? p.codProduto ?? ''
  const sku = p.codOriginal ?? null

  const prod = {
    id,
    CODPRODUTO: id,
    descricao: desc,
    marca: brand,
    sku,
    codOriginal: sku,
    preco: p.preco,
    precoPromocao: p.precoPromocao,
    precoEfetivo: p.precoEfetivo,
    imagemUrl: p.imagemUrl || null,
    IMGS_PATH: Array.isArray(p.imgsPath) ? p.imgsPath : [],
    IMGS: Array.isArray(p.imgs) ? p.imgs : null,
    updatedAt: p.dataAtualizacao ?? null
  }

  const slug = `${slugify(`${desc} ${brand}`)}-${id}`
  sessionStorage.setItem(`prod:${id}`, JSON.stringify(prod))

  router.push({
    path: `/catalogo/produto/${slug}`,
    state: { product: prod }
  })
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

onMounted(async () => {
  isHydrating.value = true
  readFromURL()

  // ✅ primeira carga sempre page 1
  await applyFilters(false, { append: false })

  isHydrating.value = false

  // ✅ URL “limpa” sem page
  writeToURL()

  await nextTick()
  setupObserver()
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
})

watch(orderBy, () => {
  if (isHydrating.value) return
  searchNow()
})
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
}

.header-wrap {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.filters-card,
.toolbar {
  border-radius: 16px;
}

.catalog-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
}

@media (max-width: 1400px) {
  .catalog-grid {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}

@media (max-width: 1200px) {
  .catalog-grid {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }
}

@media (max-width: 900px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}

@media (max-width: 520px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
}

@media (max-width: 390px) {
  .catalog-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.1);
}

.card-skel {
  height: 250px;
  border-radius: 16px;
}

.product-img {
  height: 170px;
  background: #fff;
}

.product-img :deep(img),
.product-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}

.mobile-actions {
  position: fixed;
  right: 12px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}
</style>