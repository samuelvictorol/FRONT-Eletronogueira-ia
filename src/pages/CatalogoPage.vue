<template>
  <q-page class="q-px-md q-mt-md bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <div
      class="animate__animated animate__fadeInDown animate__delay-3s animate__slower q-my-md bg-primary q-pa-md header-bar"
    >
      <q-breadcrumbs class="text-secondary">
        <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
        <q-breadcrumbs-el
          class="text-bold"
          label="Catálogo"
          :to="`/catalogo?min=${filters.precoMin ?? ''}&max=${filters.precoMax ?? ''}&limit=${limit}&page=${page}&orderBy=${orderBy}`"
        />
      </q-breadcrumbs>
    </div>

    <!-- 🔎 FILTROS -->
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

        <!-- ✅ Marcas: mantém simples (sem buscar por descrição no backend) -->
        <div class="col-12 col-md-3">
          <q-input
            @keyup.enter="applyFilters(true)"
            color="secondary"
            v-model="filters.descricaoMarca"
            label="Buscar por marca"
            dense
            outlined
            clearable
            hint="Ex.: makita, bosch, fortlev"
          >
            <template #prepend>
              <q-icon name="sell" />
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
          v-if="filters.descricaoMarca"
          color="grey-2"
          text-color="grey-9"
          icon="sell"
          removable
          @remove="filters.descricaoMarca = ''; applyFilters(true)"
        >
          {{ filters.descricaoMarca }}
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
            :options="[12, 24, 36, 50]"
            dense
            outlined
            style="width: 100px"
            label="Limite"
            @update:model-value="onLimitChange"
          />
        </div>
      </div>
    </div>

    <!-- Grid de produtos -->
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
          <q-img :src="resolveImage(p)" :alt="p.descricao" spinner-color="primary" fit="contain" class="product-img" />

          <q-card-section class="q-pt-sm">
            <div class="row items-center q-mt-xs q-col-gutter-sm">
              <div class="col-auto">
                <q-badge
                  v-if="p.marca"
                  color="primary"
                  class="text-bold q-pa-xs"
                  text-color="blue-10"
                  :label="p.marca"
                />
              </div>
            </div>

            <div class="text-subtitle1 text-weight-medium ellipsis-2">
              <br />
              {{ p.descricao }}
            </div>

            <div class="q-mt-sm">
              <div v-if="p.precoPromocao && p.precoPromocao > 0" class="column">
                <div class="text-caption text-negative">
                  <s>{{ money(p.preco) }}</s>
                </div>
                <div class="text-h6 text-positive">{{ money(p.precoPromocao) }}</div>
              </div>
              <div v-else class="text-h6">
                {{ money(p.precoEfetivo ?? p.preco) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn class="w100" color="secondary" icon-right="visibility" @click="openDetails(p)" label="Detalhes" />
          </q-card-actions>
        </q-card>
      </template>
    </div>

    <!-- ✅ paginação agora correta: max vem do total da API -->
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

    <!-- Detalhes -->
    <q-dialog v-model="showDetails">
      <q-card style="min-width: 360px; max-width: 720px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalhes do produto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-img :src="resolveImage(detailItem)" :alt="detailItem?.descricao" fit="contain" class="product-img" />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 q-mb-xs">{{ detailItem?.descricao }}</div>
              <div class="text-caption text-grey-7 q-mb-sm">
                Marca: {{ detailItem?.marca || '—' }}
              </div>
              <div class="text-h6 q-mb-xs">
                {{ detailItem ? priceBlock(detailItem) : '' }}
              </div>
              <div class="text-caption text-grey-7">
                Cód.: {{ detailItem?.codProduto ?? detailItem?.id ?? detailItem?._id }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="secondary"
            icon="attach_money"
            :href="detailItem ? whatsLink(detailItem) : '#'"
            target="_blank"
            label="Pedir orçamento"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="w100 q-py-xl"></div>

    <!-- Footer mantido -->
    <footer class="footer q-pt-xl">
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
              <strong class="text-secondary">Eletro Nogueira</strong>
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

          <q-btn
            outline
            icon-right="phone"
            color="secondary"
            class="btn outline q-mt-sm"
            href="tel:+556136290040"
            label="(61) 3629-0040"
          />
          <q-btn
            icon-right="phone"
            color="secondary"
            class="btn q-mt-sm"
            href="tel:+556136296858"
            label="(61) 3629-6858"
          />
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
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const isMobile = $q.screen.lt.md
const router = useRouter()

/** ---------------- State base ---------------- */
const loading = ref(false)
const items = ref([])
const total = ref(0)

const page = ref(1)
const limit = ref(12)
const orderBy = ref('relevance')

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: '',
  precoMin: null,
  precoMax: null
})

const priceMinStr = ref('')
const priceMaxStr = ref('')

const orderOptions = [
  { label: 'Mais relevantes', value: 'relevance' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais recentes', value: 'updated_desc' }
]

/** ---------------- Helpers ---------------- */
const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

function resolveImage(p) {
  if (!p) return fallbackImage
  return p.imagemUrl || p.IMAGEM_URL || p.img_url || fallbackImage
}

const maxPage = computed(() => Math.max(1, Math.ceil((Number(total.value) || 0) / (Number(limit.value) || 12))))
const offset = computed(() => (page.value - 1) * limit.value)

const hasAnyFilter = computed(() => {
  return Boolean(
    (filters.value.descricaoProduto || '').trim() ||
      (filters.value.descricaoMarca || '').trim() ||
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
function priceBlock(p) {
  if (p.precoPromocao && p.precoPromocao > 0) return `${money(p.precoPromocao)} (de ${money(p.preco)})`
  return money(p.precoEfetivo ?? p.preco)
}
function whatsLink(p) {
  const base = 'https://wa.me/556136290040'
  const text = encodeURIComponent(
    `Olá! Pode me enviar o preço e disponibilidade deste item?\n\n${p.descricao} (${p.marca ?? '—'})\nCód.: ${
      p.codProduto ?? p.id ?? p._id
    }`
  )
  return `${base}?text=${text}`
}

/** ---------------- Normalização de preços ---------------- */
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

/** ---------------- Persistência em URL ---------------- */
function readFromURL() {
  const qs = new URLSearchParams(window.location.search)

  filters.value.descricaoProduto = qs.get('q') || ''
  filters.value.descricaoMarca = qs.get('marca') || ''

  const m1 = qs.get('min')
  const m2 = qs.get('max')
  filters.value.precoMin = m1 ? Number(m1) : null
  filters.value.precoMax = m2 ? Number(m2) : null

  if (filters.value.precoMin != null) priceMinStr.value = numberToBR(filters.value.precoMin)
  if (filters.value.precoMax != null) priceMaxStr.value = numberToBR(filters.value.precoMax)

  limit.value = Number(qs.get('limit')) || 12
  page.value = Number(qs.get('page')) || 1
  orderBy.value = qs.get('orderBy') || 'relevance'
}

function writeToURL() {
  const qs = new URLSearchParams()
  if (filters.value.descricaoProduto) qs.set('q', filters.value.descricaoProduto)
  if (filters.value.descricaoMarca) qs.set('marca', filters.value.descricaoMarca)
  if (filters.value.precoMin != null) qs.set('min', String(filters.value.precoMin))
  if (filters.value.precoMax != null) qs.set('max', String(filters.value.precoMax))
  qs.set('limit', String(limit.value))
  qs.set('page', String(page.value))
  qs.set('orderBy', orderBy.value)
  window.history.replaceState(null, '', `${location.pathname}?${qs.toString()}`)
}

/** ---------------- Integração Produtos (GET /produtos) + paginação correta ----------------
 * Regras:
 * - Passa limit/offset como querystring.
 * - Tenta ler total de vários formatos do backend.
 * - Se o backend NÃO mandar total, aplica fallback mínimo (desabilita paginação correta).
 */
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
  filters.value = { descricaoProduto: '', descricaoMarca: '', precoMin: null, precoMax: null }
  priceMinStr.value = ''
  priceMaxStr.value = ''
  page.value = 1
  applyFilters(true)
}

function pickTotalFromResponse(data) {
  const candidates = [
    data?.totalCount,
    data?.total,
    data?.count,
    data?.meta?.total,
    data?.pagination?.total
  ].map((x) => Number(x))

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
      descricaoProduto: filters.value.descricaoProduto || null,
      descricaoMarca: filters.value.descricaoMarca || null,
      precoMin: filters.value.precoMin,
      precoMax: filters.value.precoMax,
      // orderBy: orderBy.value || 'relevance'
    }

    const { data } = await api.get('/produtos/', { params })

    // lista
    const raw =
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.results) && data.results) ||
      (Array.isArray(data) ? data : [])

    items.value = raw.map((p) => {
      const imagemUrl =
        (p.IMG && (p.IMG.link || p.IMG.url)) ||
        p.IMAGEM_URL ||
        p.imagemUrl ||
        p.img_url ||
        p.IMAGEM ||
        p.imagem ||
        null

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
        imagemUrl,
        dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null
      }
    })

    // ✅ total -> paginação correta
    const apiTotal = pickTotalFromResponse(data)
    if (apiTotal != null) {
      total.value = apiTotal
      // se mudou filtro e a página ficou fora do range, ajusta
      const newMax = Math.max(1, Math.ceil(apiTotal / L))
      if (page.value > newMax) page.value = newMax
    } else {
      // fallback (sem total vindo da API) -> paginação vira “estimada”
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

/** ---------------- Detalhes ---------------- */
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
    imagemUrl: p.imagemUrl || null,
    updatedAt: p.dataAtualizacao ?? null
  }

  const slug = `${slugify(`${desc} ${brand}`)}-${id}`
  sessionStorage.setItem(`prod:${id}`, JSON.stringify(prod))
  router.push({
    path: `/catalogo/produto/${slug}`,
    state: { product: prod }
  })
}

/** ---------------- Lifecycle ---------------- */
onMounted(async () => {
  readFromURL()
  await applyFilters(false)
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
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 14px;
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
  border-radius: 14px;
  transition: transform 0.12s ease;
}
.product-card:hover {
  transform: translateY(-2px);
}

.card-skel {
  height: 260px;
  border-radius: 14px;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-img {
  height: 220px;
}

.product-img :deep(img),
.product-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}
</style>
