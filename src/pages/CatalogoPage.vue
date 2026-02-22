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
    >
      <div class="row items-center justify-between">
        <div class="col">
          <q-breadcrumbs class="text-secondary">
            <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
            <q-breadcrumbs-el
              class="text-bold"
              label="Catálogo"
              :to="`/catalogo?min=${filters.precoMin ?? ''}&max=${filters.precoMax ?? ''}&limit=${limit}&page=${page}&orderBy=${orderBy}`"
            />
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
        <div class="col-12 col-md-4">
          <q-input
            @keyup.enter="applyFilters(true)"
            color="secondary"
            v-model="filters.descricaoProduto"
            label="Buscar por produto"
            dense
            outlined
            clearable
            hint="Ex.: furadeira, bomba, martelo"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedBrand"
            color="secondary"
            label="Marca"
            dense
            outlined
            clearable
            use-input
            fill-input
            hide-selected
            input-debounce="350"
            :options="brandOptions"
            :loading="brandLoading"
            option-label="label"
            option-value="value"
            hint="Digite para sugerir"
            behavior="menu"
            @filter="onBrandFilter"
            @clear="clearBrand(false)"
            @update:model-value="onBrandModelChanged"
          >
            <template #prepend>
              <q-icon name="sell" />
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

        <div class="col-6 col-md-2">
          <q-input
            @keyup.enter="applyFilters(true)"
            color="secondary"
            maxlength="9"
            prefix="R$"
            mask="####,##"
            reverse-fill-mask
            v-model="priceMinStr"
            label="Preço mín."
            dense
            outlined
            clearable
            hint="Ex.: 199,90"
            @blur="normalizePrice('min')"
          >
            <template #prepend>
              <q-icon name="payments" />
            </template>
          </q-input>
        </div>

        <div class="col-6 col-md-2">
          <q-input
            @keyup.enter="applyFilters(true)"
            color="secondary"
            maxlength="9"
            prefix="R$"
            mask="####,##"
            reverse-fill-mask
            v-model="priceMaxStr"
            label="Preço máx."
            dense
            outlined
            clearable
            hint="Ex.: 1299,00"
            @blur="normalizePrice('max')"
          >
            <template #prepend>
              <q-icon name="price_check" />
            </template>
          </q-input>
        </div>

        <div class="col-12 q-mb-md">
          <div class="row justify-center q-gutter-sm items-center">
            <q-btn flat color="secondary" label="Limpar" @click="resetFilters" />
            <q-btn color="secondary" label="Consultar" icon-right="search" :loading="loading" @click="applyFilters(true)" />
          </div>
        </div>
      </div>

      <div class="row items-center justify-between q-col-gutter-sm">
        <div class="col-12 col-md-auto">
          <q-select
            color="secondary"
            v-model="orderBy"
            :options="orderOptions"
            dense
            outlined
            emit-value
            map-options
            label="Ordenar"
            style="min-width: 220px"
            @update:model-value="onOrderChange"
          />
        </div>

        <div v-if="hasAnyFilter" class="row q-mt-sm q-gutter-sm items-center">
          <q-chip
            v-if="filters.descricaoProduto"
            color="grey-2"
            text-color="grey-9"
            icon="search"
            removable
            @remove="filters.descricaoProduto = ''; applyFilters(true)"
          >
            {{ filters.descricaoProduto }}
          </q-chip>

          <q-chip
            v-if="selectedBrand"
            color="grey-2"
            text-color="grey-9"
            icon="sell"
            removable
            @remove="clearBrand(true); applyFilters(true)"
          >
            {{ selectedBrand.label }}
          </q-chip>

          <q-chip
            v-if="filters.precoMin != null || filters.precoMax != null"
            color="grey-2"
            text-color="grey-9"
            icon="payments"
            removable
            @remove="filters.precoMin = null; filters.precoMax = null; priceMinStr = ''; priceMaxStr = ''; applyFilters(true)"
          >
            {{ (filters.precoMin != null ? money(filters.precoMin) : '—') }} →
            {{ (filters.precoMax != null ? money(filters.precoMax) : '—') }}
          </q-chip>
        </div>

        <div class="col-12 col-md-auto">
          <q-select
            color="secondary"
            v-model="limit"
            :options="[10, 15, 30, 45, 100]"
            dense
            outlined
            label="Itens por página"
            style="min-width: 180px"
            @update:model-value="onLimitChange"
          />
        </div>
      </div>
    </div>

    <!-- GRID -->
    <div class="catalog-grid">
      <template v-if="loading">
        <q-skeleton v-for="i in limit" :key="'sk' + i" type="rect" class="card-skel" />
      </template>

      <template v-else-if="items.length === 0">
        <div class="q-pa-lg bg-white rounded-borders shadow-1 text-grey-7">
          Nenhum item encontrado com os filtros atuais.
          <q-btn flat color="primary" class="q-ml-sm" label="Limpar filtros" @click="resetFilters" />
        </div>
      </template>

      <template v-else>
        <q-card
          v-for="p in items"
          :key="p.codProduto ?? p.id ?? p._id"
          class="bg-secondary text-white relative product-card"
          flat
          bordered
          @click="openDetails(p)"
          style="cursor: pointer;"
        >
          <q-img :src="resolveImage(p)" :alt="p.descricao" spinner-color="secondary" fit="contain" class="product-img">
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-2 text-grey-8">
                <q-img :src="fallbackImage" style="width:64px; height:64px" />
              </div>
            </template>
          </q-img>

          <q-card-section class="q-pt-sm q-pb-sm">
            <div class="row items-start justify-between q-col-gutter-sm">
              <div class="col">
                <q-badge v-if="p.marca" color="primary" text-color="secondary" class="text-bold q-mb-xs">
                  {{ p.marca }}
                </q-badge>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <div class="w100 row no-wrap justify-between items-center q-px-sm q-pt-sm q-pb-md">
            <div class="w100 text-subtitle2 text-weight-medium">
              {{ p.descricao }}
            </div>

            <div
              class="text-weight-bold text-white q-px-sm q-py-sm rounded-borders absolute-top-left bg-green-14"
              style="font-size: 1rem;"
            >
              {{ money(p.precoEfetivo ?? p.preco) }}
            </div>
          </div>

          <q-card-actions class="q-pa-sm absolute-top-right" style="top: 130px; opacity: .6;">
            <q-btn color="secondary" unelevated size="sm" icon-right="visibility" @click.stop="openDetails(p)" />
          </q-card-actions>
        </q-card>
      </template>
    </div>

    <!-- PAGINATION -->
    <div class="row justify-between items-center q-mt-md q-pb-sm">
      <div class="text-grey-7">
        <span v-if="!loading">{{ total }} produto(s)</span>
        <span v-else>Carregando…</span>

        <span v-if="!loading && total > 0" class="q-ml-sm">
          • Página {{ page }} de {{ maxPage }}
        </span>
      </div>

      <div class="row items-center q-gutter-xs">
        <q-btn
          dense
          flat
          color="secondary"
          icon="first_page"
          :disable="isFirstPage || loading"
          @click="goFirst"
        />
        <q-btn
          dense
          flat
          color="secondary"
          icon="chevron_left"
          :disable="isFirstPage || loading"
          @click="goPrev"
        />

        <q-pagination
          color="secondary"
          v-model="page"
          :max="maxPage"
          :max-pages="6"
          boundary-numbers
          direction-links
          dense
          :disable="loading"
          @update:model-value="onPageChange"
        />

        <q-btn
          dense
          flat
          color="secondary"
          icon="chevron_right"
          :disable="isLastPage || loading"
          @click="goNext"
        />
        <q-btn
          dense
          flat
          color="secondary"
          icon="last_page"
          :disable="isLastPage || loading"
          @click="goLast"
        />
      </div>
    </div>

    <!-- “floating actions” no mobile (opcional) -->
    <div v-if="isMobile" class="mobile-actions">
      <q-btn round color="secondary" class="shadow-2" size="md" icon="search" @click="toTopPage()" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const isHydrating = ref(true)
const $q = useQuasar()
const isMobile = $q.screen.lt.md
const router = useRouter()

const loading = ref(false)
const items = ref([])
const total = ref(0)

// paginação
const page = ref(1)
const limit = ref(10)

// backend já devolve isso (mas eu recalculo também pra garantir)
const apiOffset = ref(0)
const apiIsLastPage = ref(false)

const orderBy = ref('updated_desc')

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: null,
  precoMin: null,
  precoMax: null
})

const priceMinStr = ref('')
const priceMaxStr = ref('')

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

  const url =
    p.imgPath ||
    p.IMG_PATH ||
    p.imagemUrl ||
    p.IMAGEM_URL ||
    p.img_url ||
    (p.IMG && (p.IMG.link || p.IMG.url)) ||
    null

  return safeUrl(url) || fallbackImage
}

const maxPage = computed(() => {
  const t = Number(total.value) || 0
  const L = Number(limit.value) || 10
  return Math.max(1, Math.ceil(t / L))
})

// offset do request (sempre derivado de page/limit)
const offset = computed(() => {
  const L = Number(limit.value) || 10
  return Math.max(0, (Number(page.value) - 1) * L)
})

// flags calculados (e também respeitam o retorno do backend)
const isFirstPage = computed(() => Number(page.value) <= 1 || offset.value <= 0)

const isLastPage = computed(() => {
  // prioridade: backend
  if (typeof apiIsLastPage.value === 'boolean') return apiIsLastPage.value
  // fallback: quando tiver total
  return Number(page.value) >= maxPage.value
})

const nextOffset = computed(() => offset.value + (Number(limit.value) || 10))
const prevOffset = computed(() => Math.max(0, offset.value - (Number(limit.value) || 10)))

const hasAnyFilter = computed(() => {
  return Boolean(
    (filters.value.descricaoProduto || '').trim() ||
      selectedBrand.value ||
      filters.value.precoMin != null ||
      filters.value.precoMax != null
  )
})

function brToNumber(s) {
  if (!s) return null
  const t = String(s).replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(t)
  return Number.isNaN(n) ? null : n
}

function numberToBR(n) {
  if (n == null) return ''
  try {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } catch {
    return String(n)
  }
}

function money(n) {
  if (n == null) return '—'
  try {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${numberToBR(n)}`
  }
}

function normalizePrice(which) {
  if (which === 'min') {
    const n = brToNumber(priceMinStr.value)
    filters.value.precoMin = n
    priceMinStr.value = n != null ? numberToBR(n) : ''
  } else {
    const n = brToNumber(priceMaxStr.value)
    filters.value.precoMax = n
    priceMaxStr.value = n != null ? numberToBR(n) : ''
  }
}

/** URL sync */
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

  const m1 = qs.get('min')
  const m2 = qs.get('max')
  filters.value.precoMin = m1 ? Number(m1) : null
  filters.value.precoMax = m2 ? Number(m2) : null

  if (filters.value.precoMin != null) priceMinStr.value = numberToBR(filters.value.precoMin)
  if (filters.value.precoMax != null) priceMaxStr.value = numberToBR(filters.value.precoMax)

  limit.value = Number(qs.get('limit')) || 10
  page.value = Number(qs.get('page')) || 1
  orderBy.value = qs.get('orderBy') || 'updated_desc'
}

function writeToURL() {
  if (isHydrating.value) return

  const qs = new URLSearchParams()

  if (filters.value.descricaoProduto) qs.set('q', filters.value.descricaoProduto)

  const marca = (selectedBrand.value?.marca || filters.value.descricaoMarca || '').trim()
  if (marca) qs.set('marca', marca.toUpperCase())

  if (filters.value.precoMin != null) qs.set('min', String(filters.value.precoMin))
  if (filters.value.precoMax != null) qs.set('max', String(filters.value.precoMax))

  qs.set('limit', String(limit.value))
  qs.set('page', String(page.value))
  qs.set('orderBy', orderBy.value || 'updated_desc')

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
      const opts = normalizeBrandsResponse(data).slice(0, 6)
      update(() => (brandOptions.value = opts))
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
  page.value = 1
  applyFilters(true)
}

function clearBrand(runSearch = false) {
  selectedBrand.value = null
  brandOptions.value = []
  brandInput.value = ''
  filters.value.descricaoMarca = null
  if (runSearch) {
    page.value = 1
    applyFilters(true)
  }
}

/** eventos */
function onOrderChange() {
  page.value = 1
  applyFilters(true)
}

function onLimitChange() {
  page.value = 1
  applyFilters(true)
}

function onPageChange() {
  applyFilters(false)
}

function goFirst() {
  if (isFirstPage.value) return
  page.value = 1
}

function goPrev() {
  if (isFirstPage.value) return
  page.value = Math.max(1, Number(page.value) - 1)
}

function goNext() {
  if (isLastPage.value) return
  page.value = Math.min(maxPage.value, Number(page.value) + 1)
}

function goLast() {
  if (isLastPage.value) return
  page.value = maxPage.value
}

function resetFilters() {
  filters.value = { descricaoProduto: '', descricaoMarca: null, precoMin: null, precoMax: null }
  priceMinStr.value = ''
  priceMaxStr.value = ''
  clearBrand(false)
  page.value = 1
  applyFilters(true)
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
    const imgPath = p.IMG_PATH ?? p.imgPath ?? null

    const preco = p.PRECO ?? p.preco ?? null
    const promo = p.PRECOPROMOCAO ?? p.precoPromocao ?? 0
    const efetivo = p.PRECO_EFETIVO ?? p.precoEfetivo ?? (Number(promo) > 0 ? promo : preco)

    return {
      id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      codProduto: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      descricao: p.DESCRICAO ?? p.descricao ?? '',
      codOriginal: p.CODORIGINAL ?? p.codOriginal ?? null,
      marca: p.MARCA ?? p.marca ?? '',
      preco: preco != null ? Number(preco) : null,
      precoPromocao: promo != null ? Number(promo) : null,
      precoEfetivo: efetivo != null ? Number(efetivo) : null,

      imgPath: safeUrl(imgPath),
      imagemUrl: safeUrl(imgPath),

      dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null,
      hasImage: p.HAS_IMAGE ?? p.hasImage ?? null,
      imgId: p.IMG ?? p.img ?? null
    }
  })
}

/**
 * ✅ Busca paginada integrada ao backend:
 * - envia limit/offset
 * - usa total/limit/offset do response
 * - calcula is_first_page e is_last_page (com prioridade pro backend)
 * - calcula next page automaticamente via page/limit
 */
async function applyFilters(updateURL = true) {
  loading.value = true
  try {
    normalizePrice('min')
    normalizePrice('max')

    const L = Number(limit.value) || 10
    const params = {
      limit: L,
      offset: offset.value,
      descricaoProduto: (filters.value.descricaoProduto || '').trim() || null,
      descricaoMarca: (selectedBrand.value?.marca || filters.value.descricaoMarca || null),
      precoMin: filters.value.precoMin,
      precoMax: filters.value.precoMax,
      orderBy: orderBy.value || 'updated_desc'
    }

    const { data } = await api.get('/produtos/', { params })

    items.value = normalizeProdutos(data)

    // paginação do backend
    apiOffset.value = Number(data?.offset ?? offset.value) || 0

    const apiTotal = pickTotalFromResponse(data)
    if (apiTotal != null) total.value = apiTotal
    else total.value = (page.value - 1) * L + items.value.length

    // prioridade: is_last_page do backend; fallback: cálculo por total
    if (typeof data?.is_last_page === 'boolean') {
      apiIsLastPage.value = data.is_last_page
    } else {
      apiIsLastPage.value = nextOffset.value >= (Number(total.value) || 0)
    }

    // se o usuário caiu numa página acima do máximo, corrige
    const newMax = Math.max(1, Math.ceil((Number(total.value) || 0) / L))
    if (page.value > newMax) page.value = newMax

    if (updateURL) writeToURL()
  } catch (err) {
    console.error('[Catalogo] erro ao buscar:', err)
    $q.notify({ type: 'negative', message: 'Falha ao buscar produtos.' })
    items.value = []
    total.value = 0
    apiIsLastPage.value = true
  } finally {
    loading.value = false
  }
}

/** detalhe */
const showDetails = ref(false)
const detailItem = ref(null)

function openDetails(p) {
  const slugify = (s = '') =>
    String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

  detailItem.value = p
  showDetails.value = true

  const desc = p.descricao || ''
  const brand = p.marca || ''
  const id = p.id ?? p.codProduto ?? ''
  const sku = p.codOriginal ?? null

  const prod = {
    id,
    descricao: desc,
    marca: brand,
    sku,
    preco: p.preco,
    precoPromocao: p.precoPromocao,
    precoEfetivo: p.precoEfetivo,
    imagemUrl: p.imagemUrl || p.imgPath || null,
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
  isHydrating.value = true
  readFromURL()
  await applyFilters(false)
  isHydrating.value = false
})

/**
 * ✅ controla URL e busca:
 * - page/limit mudaram => refaz consulta
 * - filtros já chamam applyFilters(true) diretamente
 */
watch([page, limit], async () => {
  if (isHydrating.value) return
  writeToURL()
  await applyFilters(false)
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

/* ações flutuantes no mobile */
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