<template>
  <q-page class="q-px-md q-mt-xl bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <!-- Loading overlay for product and brand requests -->
    <q-inner-loading :showing="loading || brandLoading">
      <q-spinner-gears size="42px" color="secondary" />
      <div class="q-mt-sm text-grey-7">Carregando…</div>
    </q-inner-loading>

    <div class="animate__animated animate__fadeInDown animate__delay-3s animate__slower q-my-md bg-primary q-pa-md header-bar">
      <q-breadcrumbs class="text-secondary">
        <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
        <q-breadcrumbs-el
          class="text-bold"
          label="Catálogo"
          :to="`/catalogo?min=${filters.precoMin ?? ''}&max=${filters.precoMax ?? ''}&limit=${limit}&page=${page}&orderBy=${orderBy}`"
        />
      </q-breadcrumbs>
    </div>

    <!-- Filters -->
    <div class="q-pa-md bg-white rounded-borders q-mb-md shadow-1">
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
            hint="Furadeira, Bomba, Martelo"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Brand: remote suggestions with debounce -->
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
            hint="Selecione uma marca"
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
                  <span v-if="(brandInput || '').length < 2">Digite para buscar.</span>
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

        <div class="col-12">
          <div class="row justify-center q-gutter-x-md items-center no-wrap">
            <q-btn flat color="secondary" label="Limpar" @click="resetFilters" />
            <q-btn
              color="secondary"
              label="Consultar"
              icon-right="search"
              :loading="loading"
              @click="applyFilters(true)"
            />
          </div>
        </div>
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
          @remove="filters.precoMin=null; filters.precoMax=null; priceMinStr=''; priceMaxStr=''; applyFilters(true)"
        >
          {{ (filters.precoMin != null ? money(filters.precoMin) : '—') }} →
          {{ (filters.precoMax != null ? money(filters.precoMax) : '—') }}
        </q-chip>
      </div>
    </div>

    <div class="row items-center q-mb-sm q-gutter-sm">
      <div class="row justify-between w100 text-grey-8">
        <div class="w100 row justify-center q-gutter-x-sm q-gutter-y-sm q-mb-sm">
          <q-select
            color="secondary"
            v-model="orderBy"
            :options="orderOptions"
            dense
            outlined
            style="min-width: 210px"
            emit-value
            map-options
            @update:model-value="onOrderChange"
          />
          <q-select
            color="secondary"
            v-model="limit"
            :options="[15, 30, 45, 100]"
            dense
            outlined
            style="width: 100px"
            label="Limite"
            @update:model-value="onLimitChange"
          />
        </div>
      </div>
    </div>

    <!-- Grid -->
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
        <q-card v-for="p in items" :key="p.codProduto ?? p.id ?? p._id" class="product-card">
          <q-img
            :src="resolveImage(p)"
            :alt="p.descricao"
            spinner-color="primary"
            fit="contain"
            class="product-img"
          >
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-2 text-grey-8">
                <q-img :src="fallbackImage" style="width:64px; height:64px" />
              </div>
            </template>
          </q-img>

          <q-card-section class="q-pt-xs q-pb-sm">
            <div class="row items-center q-mt-xs q-col-gutter-sm">
              <div class="col-auto">
                <q-badge v-if="p.marca" color="primary" class="text-bold q-pa-xs" text-color="blue-10" :label="p.marca" />
              </div>
            </div>

            <div class="text-subtitle2 text-weight-medium ellipsis-2 q-mt-xs">
              {{ p.descricao }}
            </div>

            <div class="q-mt-xs">
              <div v-if="p.precoPromocao && p.precoPromocao > 0" class="column">
                <div class="text-caption text-negative">
                  <s>{{ money(p.preco) }}</s>
                </div>
                <div class="text-subtitle1 text-positive">{{ money(p.precoPromocao) }}</div>
              </div>
              <div v-else class="text-subtitle1">
                {{ money(p.precoEfetivo ?? p.preco) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="">
            <q-btn class="w100 " color="secondary" icon-right="visibility" @click="openDetails(p)" label="Detalhes" />
          </q-card-actions>
        </q-card>
      </template>
    </div>

    <div class="w100 row justify-between items-center q-mt-md">
      <span v-if="!loading">{{ total }} resultado(s)</span>
      <span v-else>Carregando…</span>

      <q-pagination
        color="secondary"
        v-model="page"
        :max="maxPage"
        :max-pages="6"
        boundary-numbers
        direction-links
        dense
        @update:model-value="onPageChange"
      />
    </div>

    <div class="w100 q-pt-md"></div>

  </q-page>
  <!-- Footer (mantido) -->
  <footer class="footer q-pt-sm bg-primary">
    <div class="container footer-grid q-pb-md">
      <div>
        <div class="brand">
          <div class="logo">
            <q-img
              style="border-radius: 20%;"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="Eletro Nogueira Logo"
            />
          </div>
          <div class="brand-text">
            <strong class="text-secondary">EletroNogueira</strong>
            <small>Em frente à BR-040 • Valparaíso de Goiás</small>
          </div>
        </div>
        <p class="foot-copy q-pt-sm">
          Soluções em elétrica, hidráulica, automação e agro.<br />Pronta-entrega e
          suporte técnico.<br /><br />CNPJ • <strong>26.931.014/0001-12.</strong>
        </p>
      </div>

      <div class="column">
        <q-btn
          unelevated
          color="positive"
          class="text-shadow btn whats q-ml-xs"
          glossy
          type="a"
          target="_blank"
          rel="noopener"
          href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento."
        >
          WhatsApp
          <q-img
            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
            alt="EN"
            style="border-radius:100%; width:30px; height:30px"
          />
        </q-btn>

        <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm" href="tel:+556136290040" label="(61) 3629-0040" />
        <q-btn icon-right="phone" color="secondary" class="btn q-mt-sm" href="tel:+556136296858" label="(61) 3629-6858" />
      </div>
    </div>

    <div class="w100 column justify-center items-center text-center">
      Siga-nos no Instagram!!
      <br /><br />
      <q-btn
        unelevated
        color="warning"
        class="text-shadow btn whats q-ml-sm"
        glossy
        type="a"
        target="_blank"
        rel="noopener"
        href="https://www.instagram.com/nogueiravalparaiso/"
      >
        @nogueiravalparaiso
        <q-img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
          alt="Logo Instagram"
          style="border-radius:100%; width:30px; height:30px"
        />
      </q-btn>
    </div>

    <div class="copy q-mt-md">© Eletro Nogueira — 26.931.014/0001-12.</div>
  </footer>
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

const page = ref(1)
const limit = ref(12)
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

function safeUrl(url) {
  if (!url) return null
  const s = String(url).trim()
  if (!s) return null
  // evita quebrar URL com espaços (teu S3 vem com "Produto 6762 3851.jpg")
  return s.replace(/ /g, '%20')
}

function resolveImage(p) {
  if (!p) return fallbackImage

  // prioriza IMG_PATH (é o que tua API realmente manda)
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

const maxPage = computed(() =>
  Math.max(1, Math.ceil((Number(total.value) || 0) / (Number(limit.value) || 12)))
)
const offset = computed(() => (page.value - 1) * limit.value)

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

function readFromURL() {
  const qs = new URLSearchParams(window.location.search)

  const marcaFromUrl = (qs.get('marca') || '').trim()
  if (marcaFromUrl) {
    const upper = marcaFromUrl.toUpperCase()
    filters.value.descricaoMarca = upper

    // ✅ preenche o select mesmo sem chamar API
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

  limit.value = Number(qs.get('limit')) || 12
  page.value = Number(qs.get('page')) || 1
  orderBy.value = qs.get('orderBy') || 'updated_desc'
}

function writeToURL() {
  if (isHydrating.value) return

  const qs = new URLSearchParams()

  if (filters.value.descricaoProduto) qs.set('q', filters.value.descricaoProduto)

  const marca = (selectedBrand.value?.marca || filters.value.descricaoMarca || '').trim()
  if (marca) qs.set('marca', marca.toUpperCase()) // ✅ garante uppercase

  if (filters.value.precoMin != null) qs.set('min', String(filters.value.precoMin))
  if (filters.value.precoMax != null) qs.set('max', String(filters.value.precoMax))

  qs.set('limit', String(limit.value))
  qs.set('page', String(page.value))
  qs.set('orderBy', orderBy.value || 'updated_desc')

  window.history.replaceState(null, '', `${location.pathname}?${qs.toString()}`)
}

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
    update(() => {
      brandOptions.value = []
    })
    return
  }

  const mySeq = ++brandReqSeq
  brandLoading.value = true

  api
    .get('/marcas/', { params: { limit: 4, offset: 0, descricaoMarca: term } })
    .then(({ data }) => {
      if (mySeq !== brandReqSeq) return
      const opts = normalizeBrandsResponse(data).slice(0, 4)
      update(() => {
        brandOptions.value = opts
      })
    })
    .catch(() => {
      if (mySeq !== brandReqSeq) return
      update(() => {
        brandOptions.value = []
      })
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

async function applyFilters(updateURL = true) {
  loading.value = true
  try {
    normalizePrice('min')
    normalizePrice('max')

    const L = Number(limit.value) || 12
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

    const raw =
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.results) && data.results) ||
      (Array.isArray(data) ? data : [])

    items.value = raw.map((p) => {
      // ✅ teu backend manda IMG_PATH + HAS_IMAGE + IMG (id) — então a URL real é IMG_PATH
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

        // ✅ aqui é o ponto principal
        imgPath: safeUrl(imgPath),
        imagemUrl: safeUrl(imgPath), // mantém compatibilidade com teu openDetails()

        dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null,

        // se quiser, guarda também os flags
        hasImage: p.HAS_IMAGE ?? p.hasImage ?? null,
        imgId: p.IMG ?? p.img ?? null
      }
    })

    const apiTotal = pickTotalFromResponse(data)
    if (apiTotal != null) {
      total.value = apiTotal
      const newMax = Math.max(1, Math.ceil(apiTotal / L))
      if (page.value > newMax) page.value = newMax
    } else {
      total.value = (page.value - 1) * L + items.value.length
    }

    if (updateURL) writeToURL()
  } catch (err) {
    console.error('[Catalogo] erro ao buscar:', err)
    $q.notify({ type: 'negative', message: 'Falha ao buscar produtos.' })
    items.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

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
    // ✅ garante que vai com a URL correta pro detalhe
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

watch([page, limit], () => writeToURL())
</script>

<style scoped>
.header-bar {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(150px, 1fr));
  gap: 10px;
}

@media (max-width: 1400px) {
  .catalog-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 1200px) {
  .catalog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .catalog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .catalog-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.12s ease;
}
.product-card:hover {
  transform: translateY(-2px);
}

.card-skel {
  height: 210px;
  border-radius: 12px;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-img {
  height: 150px;
}

.product-img :deep(img),
.product-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}
</style>
