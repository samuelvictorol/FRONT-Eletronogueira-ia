<template>
  <q-page
    ref="pageEl"
    class="catalog-page bg-grey-2 q-pt-lg"
    :class="isMobile ? 'q-px-md q-pb-xl' : 'q-px-xl q-pb-xl'"
  >
    <q-inner-loading :showing="loading && items.length === 0">
      <q-spinner-gears size="42px" color="secondary" />
      <div class="q-mt-sm text-grey-7">Carregando produtos...</div>
    </q-inner-loading>

    <!-- HEADER STICKY -->
    <div
      ref="stickyHeaderEl"
      class="catalog-sticky-header bg-primary q-px-md q-py-md q-mt-lg q-mb-md"
    >
      <div class="row items-center justify-between no-wrap q-col-gutter-md">
        <div class="col-auto">
          <q-breadcrumbs class="text-secondary">
            <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
            <q-breadcrumbs-el class="text-bold" label="Catálogo" :to="`/catalogo?limit=${limit}&orderBy=${orderBy}`" />
          </q-breadcrumbs>

          <div class="row items-center no-wrap q-mt-sm">
            <div class="text-h5 text-weight-bolder text-secondary">Catálogo</div>
          </div>
        </div>

        <div class="col row justify-end items-center no-wrap q-gutter-sm sticky-actions-wrap">
          <transition name="fade-slide">
            <div v-if="showStickySearch" class="sticky-search-wrap">
              <q-input
                v-model="filters.descricaoProduto"
                dense
                outlined
                clearable
                bg-color="white"
                color="secondary"
                placeholder="Pesquisar..."
                @keyup.enter="searchNow"
                @clear="searchNow"
              >
                <template #append>
                  <q-btn
                    flat
                    dense
                    icon="search"
                    color="secondary"
                    @click="searchNow"
                  />
                </template>
              </q-input>
            </div>
          </transition>

          <q-btn
            v-if="!isMobile"
            unelevated
            color="secondary"
            text-color="white"
            icon="tune"
            label="Ajustes"
            class="sticky-filter-btn"
            @click="openFiltersModal"
          >
            <q-badge
              v-if="activeExtraFiltersCount > 0"
              color="negative"
              floating
            >
              {{ activeExtraFiltersCount }}
            </q-badge>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- BUSCA PRINCIPAL -->
    <div
      ref="mainSearchEl"
      class="main-search-card bg-white rounded-borders shadow-1 q-pa-md q-mb-md"
    >
      <div class="row ">
        <div class="w100">
          <q-input
            v-model="filters.descricaoProduto"
            dense
            outlined
            clearable
            color="secondary"
            label="O que você precisa?"
            hint="Ex.: furadeira, martelo, parafusadeira, disco 3M"
            @keyup.enter="searchNow"
            @clear="searchNow"
          >
            <template #prepend>
              <q-icon name="search" color="secondary" />
            </template>

            <template #append>
              <q-btn
                unelevated
                color="secondary"
                icon="search"
                @click="searchNow"
              />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- CHIPS DE FILTROS ATIVOS -->
    <div
      v-if="hasAnyFilter"
      class="row items-center q-gutter-sm q-mb-md"
    >
      <q-chip
        v-if="(filters.descricaoProduto || '').trim()"
        removable
        color="grey-3"
        text-color="grey-9"
        icon="search"
        @remove="clearSearchOnly"
      >
        {{ filters.descricaoProduto }}
      </q-chip>

      <q-chip
        v-if="currentBrandName"
        removable
        color="grey-3"
        text-color="grey-9"
        icon="sell"
        @remove="clearBrandAndSearch"
      >
        {{ currentBrandName }}
      </q-chip>

      <q-chip
        v-if="filters.precoMin !== null && filters.precoMin !== ''"
        removable
        color="grey-3"
        text-color="grey-9"
        icon="attach_money"
        @remove="removePrecoMin"
      >
        Min: {{ money(filters.precoMin) }}
      </q-chip>

      <q-chip
        v-if="filters.precoMax !== null && filters.precoMax !== ''"
        removable
        color="grey-3"
        text-color="grey-9"
        icon="payments"
        @remove="removePrecoMax"
      >
        Máx: {{ money(filters.precoMax) }}
      </q-chip>

      <q-chip
        v-if="orderBy !== 'updated_desc'"
        removable
        color="grey-3"
        text-color="grey-9"
        icon="sort"
        @remove="resetOrderOnly"
      >
        {{ currentOrderLabel }}
      </q-chip>
    </div>

    <!-- GRID -->
    <div class="catalog-grid">
      <template v-if="loading && items.length === 0">
        <q-skeleton
          v-for="i in limit"
          :key="`sk-${i}`"
          type="rect"
          class="card-skeleton"
        />
      </template>

      <template v-else-if="!loading && items.length === 0">
        <div class="col-12">
          <q-card flat bordered class="bg-white rounded-borders q-pa-lg text-center">
            <div class="text-subtitle1 text-grey-8">
              Nenhum item encontrado com os filtros atuais.
            </div>
            <div class="q-mt-sm text-grey-7">
              Tente outro termo ou limpe os ajustes.
            </div>

            <div class="row justify-center q-gutter-sm q-mt-md">
              <q-btn flat color="secondary" label="Limpar busca" @click="clearSearchOnly" />
              <q-btn unelevated color="secondary" label="Limpar tudo" @click="resetAllFilters" />
            </div>
          </q-card>
        </div>
      </template>

      <template v-else>
        <q-card
          v-for="p in items"
          :key="String(p.codProduto ?? p.id ?? p._id)"
          flat
          bordered
          class="product-card bg-grad-secondary text-white"
          @click="openDetails(p)"
        >
          <div class="product-image-wrap">
            <q-img
              :src="resolveImage(p)"
              :alt="p.descricao"
              fit="contain"
              class="product-img"
              spinner-color="secondary"
            >
              <template #error>
                <div class="absolute-full flex flex-center bg-white">
                  <q-img :src="fallbackImage" fit="contain" style="width: 72px; height: 72px;" />
                </div>
              </template>
            </q-img>

            <q-badge
              v-if="p.marca"
              class="brand-badge text-weight-bold bg-primary text-secondary"
            >
              {{ p.marca }}
            </q-badge>

            <div class="price-tag text-weight-bold">
              {{ money(p.precoEfetivo ?? p.preco) }}
            </div>

            <q-btn
              round
              dense
              glossy
              color="green-14"
              icon="add_shopping_cart"
              class="cart-btn"
              @click.stop="confirmAddToCart(p)"
            />
          </div>

          <q-card-section class="q-pt-md q-pb-md bg-grad-secondary">
            <div class="product-title  text-subtitle2 text-weight-medium ellipsis-2-lines ">
              {{ p.descricao }}
            </div>
          </q-card-section>
        </q-card>
      </template>
    </div>

    <!-- STATUS LOAD -->
    <div class="row justify-center q-mt-lg q-mb-xl">
      <q-spinner-dots v-if="loadingMore" size="34px" color="secondary" />
      <div
        v-else-if="!loading && isLastPage && items.length > 0"
        class="text-grey-7 text-center"
      >
        Você chegou ao final.
      </div>
    </div>

    <!-- FAB MOBILE -->
    <q-page-sticky
      v-if="isMobile" style="z-index: 9;"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        round
        size="lg"
        color="primary"
        text-color="secondary" glossy
        icon="tune"
        class="shadow-8"
        @click="openFiltersModal"
      >
        <q-badge
          v-if="activeExtraFiltersCount > 0"
          color="negative"
          floating
        >
          {{ activeExtraFiltersCount }}
        </q-badge>
      </q-btn>
    </q-page-sticky>

    <!-- MODAL FILTROS -->
    <q-dialog v-model="filtersDialog">
      <q-card class="filters-modal-card">
        <q-card-section class="row items-center justify-between bg-primary">
          <div class="text-h6 text-weight-bold text-secondary">Ajustes do catálogo</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-select
            v-model="modalOrderBy"
            :options="orderOptions"
            emit-value
            map-options
            outlined
            dense
            color="secondary"
            label="Ordenar"
          />

          <q-select
            v-model="modalSelectedBrand"
            :options="modalBrandOptions"
            option-label="label"
            option-value="value"
            use-input
            fill-input
            hide-selected
            input-debounce="350"
            outlined
            dense
            clearable
            color="secondary"
            label="Marca"
            hint="Digite para buscar marcas ou escolha uma sugestão"
            :loading="modalBrandLoading"
            behavior="menu"
            @filter="onModalBrandFilter"
            @clear="clearModalBrand"
            @update:model-value="onModalBrandChanged"
          >
            <template #prepend>
              <q-icon name="sell" color="secondary" />
            </template>

            <template #no-option>
              <q-item>
                <q-item-section class="text-grey-7">
                  Digite pelo menos 2 letras ou escolha uma sugestão.
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="row q-gutter-sm">
            <q-chip
              v-for="brand in suggestedBrands"
              :key="brand.value"
              clickable
              color="grey-3"
              text-color="grey-9"
              icon="sell"
              @click="applySuggestedBrand(brand)"
            >
              {{ brand.label }}
            </q-chip>
          </div>

          <div class="row q-pl-md q-pt-md q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="modalFilters.precoMin"
                outlined
                dense
                color="secondary"
                label="Preço mínimo"
                mask="####,##"
                reverse-fill-mask
              >
                <template #prepend>
                  <q-icon name="payments" color="secondary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="modalFilters.precoMax"
                outlined
                dense
                color="secondary"
                label="Preço máximo"
                mask="####,##"
                reverse-fill-mask
              >
                <template #prepend>
                  <q-icon name="attach_money" color="secondary" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat color="secondary" label="Limpar filtros" @click="clearModalFilters" />
          <div class="row no-wrap justify-between w100 q-gutter-sm">
            <q-btn flat color="grey-7" label="Cancelar" v-close-popup />
            <q-btn
              unelevated
              color="secondary"
              label="Aplicar"
              icon-right="search"
              :loading="loading"
              @click="applyModalFilters"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const router = useRouter()
const cart = useCart()

const isMobile = computed(() => $q.screen.lt.md)

const pageEl = ref(null)
const stickyHeaderEl = ref(null)
const mainSearchEl = ref(null)

const loading = ref(false)
const loadingMore = ref(false)

const items = ref([])
const total = ref(0)

const page = ref(1)
const limit = ref(15)
const apiIsLastPage = ref(false)

const orderBy = ref('updated_desc')

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: null,
  precoMin: null,
  precoMax: null
})

const filtersDialog = ref(false)

const modalFilters = ref({
  precoMin: null,
  precoMax: null,
  descricaoMarca: null
})
const modalOrderBy = ref('updated_desc')
const modalSelectedBrand = ref(null)
const modalBrandOptions = ref([])
const modalBrandLoading = ref(false)
const modalBrandInput = ref('')

const showStickySearch = ref(false)

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

const orderOptions = [
  { label: 'Mais recentes', value: 'updated_desc' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais relevante', value: 'created_desc' }
]

const suggestedBrands = [
  { label: 'Black & Decker', value: 'BLACK & DECKER', marca: 'Black & Decker', codMarca: null },
  { label: 'Stanley', value: 'STANLEY', marca: 'Stanley', codMarca: null },
  { label: '3M', value: '3M', marca: '3M', codMarca: null }
]

const currentBrandName = computed(() => {
  return (selectedBrand.value?.marca || filters.value.descricaoMarca || '').trim()
})

const currentOrderLabel = computed(() => {
  return orderOptions.find(o => o.value === orderBy.value)?.label || 'Ordenação'
})

const hasAnyFilter = computed(() => {
  return Boolean(
    (filters.value.descricaoProduto || '').trim() ||
    currentBrandName.value ||
    filters.value.precoMin !== null ||
    filters.value.precoMax !== null ||
    orderBy.value !== 'updated_desc'
  )
})

const activeExtraFiltersCount = computed(() => {
  let count = 0
  if (currentBrandName.value) count++
  if (filters.value.precoMin !== null && filters.value.precoMin !== '') count++
  if (filters.value.precoMax !== null && filters.value.precoMax !== '') count++
  if (orderBy.value !== 'updated_desc') count++
  return count
})

const offset = computed(() => Math.max(0, (Number(page.value) - 1) * Number(limit.value)))

const maxPage = computed(() => {
  const t = Number(total.value) || 0
  return Math.max(1, Math.ceil(t / Number(limit.value || 15)))
})

const isLastPage = computed(() => {
  if (typeof apiIsLastPage.value === 'boolean') return apiIsLastPage.value
  return Number(page.value) >= maxPage.value
})

const selectedBrand = ref(null)

let reqSeq = 0
let scrollTarget = null
let scrollTicking = false
let brandReqSeq = 0
let resizeHandler = null

function money(n) {
  if (n == null || n === '') return '—'
  try {
    return Number(n).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  } catch {
    return `R$ ${String(n)}`
  }
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : null
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
    Array.isArray(p.IMGS_PATH) && p.IMGS_PATH.length ? p.IMGS_PATH[0]
      : Array.isArray(p.imgsPath) && p.imgsPath.length ? p.imgsPath[0]
        : Array.isArray(p.imagensPath) && p.imagensPath.length ? p.imagensPath[0]
          : null

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

function pickTotalFromResponse(data) {
  const candidates = [
    data?.totalCount,
    data?.total,
    data?.count,
    data?.meta?.total,
    data?.pagination?.total
  ].map(x => Number(x))

  const found = candidates.find(n => Number.isFinite(n) && n >= 0)
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
      ? imgsPathRaw.filter(Boolean).map(u => safeUrl(u))
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

function normalizeBrandsResponse(data) {
  const raw = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []

  return raw
    .map((m) => {
      const cod = m?.CODMARCA ?? m?.codMarca ?? m?.id ?? null
      const name = (m?.MARCA ?? m?.marca ?? '').trim()
      if (!name) return null

      return {
        label: name,
        value: cod ?? name.toUpperCase(),
        codMarca: cod,
        marca: name
      }
    })
    .filter(Boolean)
}

function uniqueBrandOptions(options = []) {
  const map = new Map()

  for (const item of options) {
    const key = String(item?.marca || item?.label || '').trim().toUpperCase()
    if (!key) continue
    if (!map.has(key)) {
      map.set(key, item)
    }
  }

  return Array.from(map.values())
}

function readFromURL() {
  const qs = new URLSearchParams(window.location.search)

  filters.value.descricaoProduto = qs.get('q') || ''
  filters.value.precoMin = normalizeNumber(qs.get('min'))
  filters.value.precoMax = normalizeNumber(qs.get('max'))
  orderBy.value = qs.get('orderBy') || 'updated_desc'

  const marca = (qs.get('marca') || '').trim()
  if (marca) {
    selectedBrand.value = {
      label: marca,
      value: marca.toUpperCase(),
      codMarca: null,
      marca
    }
    filters.value.descricaoMarca = marca
  } else {
    selectedBrand.value = null
    filters.value.descricaoMarca = null
  }

  page.value = 1
  limit.value = 15
}

function writeToURL() {
  const qs = new URLSearchParams()

  const q = (filters.value.descricaoProduto || '').trim()
  const marca = currentBrandName.value

  if (q) qs.set('q', q)
  if (marca) qs.set('marca', marca)
  if (filters.value.precoMin !== null && filters.value.precoMin !== '') qs.set('min', String(filters.value.precoMin))
  if (filters.value.precoMax !== null && filters.value.precoMax !== '') qs.set('max', String(filters.value.precoMax))
  if (orderBy.value) qs.set('orderBy', orderBy.value)
  qs.set('limit', String(limit.value))

  const queryString = qs.toString()
  window.history.replaceState(null, '', `${location.pathname}${queryString ? `?${queryString}` : ''}`)
}

async function applyFilters({ append = false, updateURL = true } = {}) {
  const mySeq = ++reqSeq

  if (append) loadingMore.value = true
  else loading.value = true

  try {
    const params = {
      limit: Number(limit.value),
      offset: Number(offset.value),
      descricaoProduto: (filters.value.descricaoProduto || '').trim() || null,
      descricaoMarca: currentBrandName.value || null,
      precoMin: normalizeNumber(filters.value.precoMin),
      precoMax: normalizeNumber(filters.value.precoMax),
      orderBy: orderBy.value || 'updated_desc'
    }

    const { data } = await api.get('/produtos/', { params })

    if (mySeq !== reqSeq) return

    const newItems = normalizeProdutos(data)

    if (append) {
      const merged = new Map(items.value.map(item => [String(item.id), item]))
      for (const item of newItems) {
        merged.set(String(item.id), item)
      }
      items.value = Array.from(merged.values())
    } else {
      items.value = newItems
    }

    const apiTotal = pickTotalFromResponse(data)
    if (apiTotal != null) {
      total.value = apiTotal
    } else {
      total.value = append
        ? items.value.length
        : ((Number(page.value) - 1) * Number(limit.value)) + newItems.length
    }

    if (typeof data?.is_last_page === 'boolean') {
      apiIsLastPage.value = data.is_last_page
    } else {
      apiIsLastPage.value = newItems.length < Number(limit.value) || items.value.length >= Number(total.value || 0)
    }

    if (updateURL && !append) {
      writeToURL()
      sessionStorage.setItem('catalog:lastUrl', `${location.pathname}${location.search}`)
    }
  } catch (err) {
    if (mySeq !== reqSeq) return

    console.error('[Catalogo] erro ao buscar produtos:', err)
    $q.notify({
      type: 'negative',
      message: 'Falha ao buscar produtos.'
    })

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

async function searchNow() {
  page.value = 1
  items.value = []
  total.value = 0
  apiIsLastPage.value = false

  await applyFilters({ append: false, updateURL: true })
  await nextTick()
  updateStickySearchVisibility()
  await ensureViewportFilled()
}

async function loadNextPageIfPossible() {
  if (loading.value || loadingMore.value || isLastPage.value) return
  page.value = Number(page.value) + 1
  await applyFilters({ append: true, updateURL: false })
  await nextTick()
  updateStickySearchVisibility()
}

function getScrollTarget(el) {
  let parent = el?.parentElement

  while (parent) {
    const style = window.getComputedStyle(parent)
    const overflowY = style.overflowY
    const isScrollable = /(auto|scroll|overlay)/i.test(overflowY)
    if (isScrollable) return parent
    parent = parent.parentElement
  }

  return window
}

function getScrollMeasurements() {
  if (scrollTarget && scrollTarget !== window) {
    return {
      scrollTop: scrollTarget.scrollTop,
      clientHeight: scrollTarget.clientHeight,
      scrollHeight: scrollTarget.scrollHeight
    }
  }

  const doc = document.documentElement
  const body = document.body

  return {
    scrollTop: window.scrollY || doc.scrollTop || body.scrollTop || 0,
    clientHeight: window.innerHeight,
    scrollHeight: Math.max(
      doc.scrollHeight,
      body.scrollHeight,
      doc.offsetHeight,
      body.offsetHeight
    )
  }
}

function isNearBottom(buffer = 900) {
  const { scrollTop, clientHeight, scrollHeight } = getScrollMeasurements()
  return scrollTop + clientHeight >= scrollHeight - buffer
}

function updateStickySearchVisibility() {
  if (!mainSearchEl.value || !stickyHeaderEl.value) {
    showStickySearch.value = false
    return
  }

  const mainSearchRect = mainSearchEl.value.getBoundingClientRect()
  const headerRect = stickyHeaderEl.value.getBoundingClientRect()

  showStickySearch.value = mainSearchRect.bottom <= headerRect.bottom + 8
}

function onScroll() {
  if (scrollTicking) return

  scrollTicking = true

  requestAnimationFrame(async () => {
    scrollTicking = false
    updateStickySearchVisibility()

    if (isNearBottom()) {
      await loadNextPageIfPossible()
    }
  })
}

async function ensureViewportFilled(maxRounds = 4) {
  for (let i = 0; i < maxRounds; i++) {
    if (loading.value || loadingMore.value || isLastPage.value) break
    if (!isNearBottom(250)) break
    await loadNextPageIfPossible()
  }
}

function bindScrollListener() {
  scrollTarget = getScrollTarget(pageEl.value?.$el || pageEl.value)

  if (scrollTarget && scrollTarget !== window) {
    scrollTarget.addEventListener('scroll', onScroll, { passive: true })
  } else {
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  resizeHandler = () => onScroll()
  window.addEventListener('resize', resizeHandler, { passive: true })
}

function unbindScrollListener() {
  if (scrollTarget && scrollTarget !== window) {
    scrollTarget.removeEventListener('scroll', onScroll)
  } else {
    window.removeEventListener('scroll', onScroll)
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  scrollTarget = null
  resizeHandler = null
}

function openFiltersModal() {
  modalFilters.value = {
    precoMin: filters.value.precoMin,
    precoMax: filters.value.precoMax,
    descricaoMarca: filters.value.descricaoMarca
  }

  modalOrderBy.value = orderBy.value
  modalSelectedBrand.value = selectedBrand.value ? { ...selectedBrand.value } : null
  modalBrandOptions.value = uniqueBrandOptions([
    ...suggestedBrands,
    ...(modalSelectedBrand.value ? [modalSelectedBrand.value] : [])
  ])

  filtersDialog.value = true
}

function onModalBrandChanged(v) {
  if (!v) {
    modalFilters.value.descricaoMarca = null
    return
  }
  modalFilters.value.descricaoMarca = v.marca || v.label || null
}

function clearModalBrand() {
  modalSelectedBrand.value = null
  modalFilters.value.descricaoMarca = null
  modalBrandInput.value = ''
  modalBrandOptions.value = [...suggestedBrands]
}

function applySuggestedBrand(brand) {
  modalSelectedBrand.value = { ...brand }
  modalFilters.value.descricaoMarca = brand.marca
  modalBrandOptions.value = uniqueBrandOptions([brand, ...suggestedBrands])
}

async function onModalBrandFilter(val, update) {
  const term = (val || '').trim()
  modalBrandInput.value = term

  if (!term) {
    update(() => {
      modalBrandOptions.value = [...suggestedBrands]
    })
    return
  }

  if (term.length < 2) {
    const filteredSuggestions = suggestedBrands.filter(b =>
      String(b.label).toLowerCase().includes(term.toLowerCase())
    )

    update(() => {
      modalBrandOptions.value = filteredSuggestions.length ? filteredSuggestions : [...suggestedBrands]
    })
    return
  }

  const mySeq = ++brandReqSeq
  modalBrandLoading.value = true

  try {
    const { data } = await api.get('/marcas/', {
      params: {
        limit: 8,
        offset: 0,
        descricaoMarca: term
      }
    })

    if (mySeq !== brandReqSeq) return

    const apiOptions = normalizeBrandsResponse(data)
    const suggestionMatches = suggestedBrands.filter(b =>
      String(b.label).toLowerCase().includes(term.toLowerCase())
    )

    update(() => {
      modalBrandOptions.value = uniqueBrandOptions([
        ...suggestionMatches,
        ...apiOptions
      ])
    })
  } catch (err) {
    if (mySeq !== brandReqSeq) return

    update(() => {
      modalBrandOptions.value = suggestedBrands.filter(b =>
        String(b.label).toLowerCase().includes(term.toLowerCase())
      )
    })
  } finally {
    if (mySeq !== brandReqSeq) return
    modalBrandLoading.value = false
  }
}

function clearModalFilters() {
  modalFilters.value = {
    precoMin: null,
    precoMax: null,
    descricaoMarca: null
  }
  modalOrderBy.value = 'updated_desc'
  modalSelectedBrand.value = null
  modalBrandInput.value = ''
  modalBrandOptions.value = [...suggestedBrands]
}

async function applyModalFilters() {
  filters.value.precoMin = normalizeNumber(modalFilters.value.precoMin)
  filters.value.precoMax = normalizeNumber(modalFilters.value.precoMax)
  orderBy.value = modalOrderBy.value || 'updated_desc'

  if (modalSelectedBrand.value) {
    selectedBrand.value = { ...modalSelectedBrand.value }
    filters.value.descricaoMarca = modalSelectedBrand.value.marca || modalSelectedBrand.value.label || null
  } else {
    selectedBrand.value = null
    filters.value.descricaoMarca = null
  }

  filtersDialog.value = false
  await searchNow()
}

function clearSearchOnly() {
  filters.value.descricaoProduto = ''
  searchNow()
}

function clearBrandAndSearch() {
  selectedBrand.value = null
  filters.value.descricaoMarca = null
  searchNow()
}

function removePrecoMin() {
  filters.value.precoMin = null
  searchNow()
}

function removePrecoMax() {
  filters.value.precoMax = null
  searchNow()
}

function resetOrderOnly() {
  orderBy.value = 'updated_desc'
  searchNow()
}

function resetAllFilters() {
  filters.value = {
    descricaoProduto: '',
    descricaoMarca: null,
    precoMin: null,
    precoMax: null
  }

  selectedBrand.value = null
  orderBy.value = 'updated_desc'
  searchNow()
}

function confirmAddToCart(p) {
  const name = p?.descricao || 'Produto'

  $q.dialog({
    title: '🛒 Adicionar ao carrinho',
    message: `Adicionar "${name}" ao carrinho?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Adicionar', color: 'green-14' },
    cancel: { label: 'Cancelar', color: 'grey-7' }
  }).onOk(() => {
    cart.addItem(p, 1)
    cart.state.drawerOpen = true

    $q.notify({
      type: 'secondary',
      message: 'Adicionado ao carrinho!'
    })
  })
}

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

onMounted(async () => {
  readFromURL()

  await nextTick()
  bindScrollListener()

  await searchNow()
  await nextTick()
  updateStickySearchVisibility()
})

onBeforeUnmount(() => {
  unbindScrollListener()
})
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
}

.catalog-sticky-header {
  position: sticky;
  top: 56px;
  z-index: 20;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.main-search-card {
  border-radius: 18px;
}

.sticky-actions-wrap {
  min-width: 0;
}

.sticky-search-wrap {
  width: min(420px, 42vw);
}

.sticky-filter-btn {
  white-space: nowrap;
}

.catalog-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
}

@media (max-width: 1500px) {
  .catalog-grid {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}

@media (max-width: 1180px) {
  .catalog-grid {
    grid-template-columns: repeat(3, minmax(170px, 1fr));
  }

  .sticky-search-wrap {
    width: min(320px, 40vw);
  }
}

@media (max-width: 860px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(155px, 1fr));
  }
}

@media (max-width: 520px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(145px, 1fr));
    gap: 12px;
  }

  .catalog-sticky-header {
    top: 50px;
  }
}

@media (max-width: 390px) {
  .catalog-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.14s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
}

.product-image-wrap {
  position: relative;
  background: #fff;
  min-height: 190px;
}

.product-img {
  height: 190px;
  background: #fff;
}

.product-img :deep(img),
.product-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}

.brand-badge {
  position: absolute;
  top: 162px;
  left: 10px;
  z-index: 2;
  border-radius: 10px;
  opacity: .8;
}

.price-tag {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
  background: rgba(24, 36, 54, 0.95);
  color: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.cart-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 2;
}

.product-title {
  min-height: 44px;
  line-height: 1.3;
}

.card-skeleton {
  height: 270px;
  border-radius: 18px;
}

.filters-modal-card {
  width: min(94vw, 620px);
  border-radius: 20px;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>