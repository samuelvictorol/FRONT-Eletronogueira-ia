<template>
  <q-page class="q-pa-md bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <!-- Filtros -->
    <!-- 🔎 FILTROS -->
    <div class="q-pa-md bg-white rounded-borders q-mb-md shadow-1">
      <div class="row q-col-gutter-md items-end">
        <div class="col-12 col-md-4">
          <q-input @keyup.enter="applyFilters(true)" color="secondary" v-model="filters.descricaoProduto"
            label="Buscar por produto" dense outlined clearable hint="Ex.: furadeira, bomba, martelo">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-input @keyup.enter="applyFilters(true)" color="secondary" v-model="filters.descricaoMarca"
            label="Buscar por marca" dense outlined clearable hint="Ex.: makita, bosch, fortlev">
            <template #prepend>
              <q-icon name="sell" />
            </template>
          </q-input>

        </div>

        <div class="col-6 col-md-2">
          <q-input @keyup.enter="applyFilters(true)" color="secondary" maxlength="9" prefix="R$" mask="####,##"
            reverse-fill-mask v-model="priceMinStr" label="Preço mín." dense outlined clearable hint="Ex.: 199,90">
            <template #prepend>
              <q-icon name="payments" />
            </template>
          </q-input>
        </div>

        <div class="col-6 col-md-2">
          <q-input @keyup.enter="applyFilters(true)" color="secondary" maxlength="9" prefix="R$" mask="####,##"
            reverse-fill-mask v-model="priceMaxStr" label="Preço máx." dense outlined clearable hint="Ex.: 1299,00">
            <template #prepend>
              <q-icon name="price_check" />
            </template>
          </q-input>
        </div>

        <div class="w100 row justify-center q-gutter-x-md items-center no-wrap">
          <q-btn flat color="secondary" label="Limpar" @click="resetFilters" />
          <q-btn color="secondary" label="Consultar" icon-right="search" :loading="loading"
            @click="applyFilters(true)" />
        </div>
      </div>
    </div>

    <div class="row items-center q-mb-sm q-gutter-sm">
      <div class="row justify-between w100 text-grey-8">
        <div class="w100 row justify-center q-gutter-x-sm q-gutter-y-sm q-mb-sm">
          <q-select color="secondary" v-model="orderBy" :options="orderOptions" dense outlined style="min-width: 210px"
            emit-value map-options @update:model-value="onOrderChange" />
          <q-select color="secondary" v-model="limit" :options="[12, 24, 36, 50]" dense outlined style="width: 90px"
            label="Limite" @update:model-value="onLimitChange" />
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
          <q-img :src="p.imagemUrl || fallbackImage" ratio="16/9" spinner-color="primary" :alt="p.descricao" />
          <q-card-section class="q-pt-sm">
            <div class="row items-center q-mt-xs q-col-gutter-sm">
              <div class="col-auto">
                <q-badge v-if="p.marca" color="primary" class="text-bold q-pa-xs" text-color="blue-10"
                  :label="p.marca" />
              </div>
              <div class="text-subtitle1 text-weight-medium ellipsis-2">{{ p.descricao }}</div>
            </div>

            <div class="q-mt-sm">
              <div v-if="p.precoPromocao && p.precoPromocao > 0" class="column">
                <div class="text-caption text-negative">
                  <s>{{ money(p.preco) }}</s>
                </div>
                <div class="text-h6 text-positive">{{ money(p.precoPromocao) }}</div>
              </div>
              <div v-else class="text-h6">{{ money(p.precoEfetivo ?? p.preco) }}</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn class="w100" flat color="positive" icon-right="add_shopping_cart" label="Orçar" :href="whatsLink(p)"
              target="_blank" />
            <q-btn class="w100" flat color="secondary" icon-right="visibility" @click="openDetails(p)"
              label="Detalhes" />
          </q-card-actions>
        </q-card>
      </template>
    </div>
    <div class="w100 row justify-between items-center q-mt-md">
      <span v-if="!loading">{{ total - 1 }} resultado(s)</span>
      <span v-else>Carregando…</span>
      <q-pagination color="secondary" v-model="page" :max="maxPage" :max-pages="6" boundary-numbers direction-links
        dense @update:model-value="onPageChange" />
    </div>

    <!-- Detalhes (simples) -->
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
              <q-img :src="detailItem?.imagemUrl || fallbackImage" ratio="16/9" />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 q-mb-xs">{{ detailItem?.descricao }}</div>
              <div class="text-caption text-grey-7 q-mb-sm">Marca: {{ detailItem?.marca || '—' }}</div>
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
          <q-btn color="secondary" icon="attach_money" :href="detailItem ? whatsLink(detailItem) : '#'" target="_blank"
            label="Pedir orçamento" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      <div class="copy q-mt-md">© {{ year }} Eletro Nogueira — 26.931.014/0001-12.</div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { api } from 'boot/axios'

const isMobile = useQuasar().screen.lt.md
const $q = useQuasar()

/** ---------------- State base ---------------- */
const loading = ref(false)
const items = ref([])
const total = ref(0)

const page = ref(0)
const limit = ref(12)
const orderBy = ref('relevance') // 'relevance' | 'price_asc' | 'price_desc' | 'updated_desc'

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: '',
  precoMin: 'null',
  precoMax: null
})

// inputs de preço em string (vírgula)
const priceMinStr = ref('')
const priceMaxStr = ref('')

// opções de ordenação
const orderOptions = [
  { label: 'Mais relevantes', value: 'relevance' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais recentes', value: 'updated_desc' }
]

/** ---------------- Helpers ---------------- */
const fallbackImage = 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?q=80&w=1200&auto=format&fit=crop'
const maxPage = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))
const offset = computed(() => (page.value - 1) * limit.value)
const totalHint = computed(() => total.value ? `${total.value} resultado(s)` : '')

function brToNumber(s) {
  // "1.234,56" -> 1234.56
  if (!s) return null
  const t = String(s).replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(t)
  return Number.isNaN(n) ? null : n
}
function numberToBR(n) {
  if (n == null) return ''
  try {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } catch { return String(n) }
}
function money(n) {
  if (n == null) return '—'
  try {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch { return `R$ ${numberToBR(n)}` }
}
const priceChip = computed(() => {
  const a = filters.value.precoMin
  const b = filters.value.precoMax
  if (a != null && b != null) return `R$ ${numberToBR(a)} — R$ ${numberToBR(b)}`
  if (a != null) return `≥ R$ ${numberToBR(a)}`
  if (b != null) return `≤ R$ ${numberToBR(b)}`
  return ''
})

function priceBlock(p) {
  if (p.precoPromocao && p.precoPromocao > 0) {
    return `${money(p.precoPromocao)} (de ${money(p.preco)})`
  }
  return money(p.precoEfetivo ?? p.preco)
}
function whatsLink(p) {
  const base = 'https://wa.me/556136290040'
  const text = encodeURIComponent(`Olá! Pode me enviar o preço e disponibilidade deste item?\n\n${p.descricao} (${p.marca ?? '—'})\nCód.: ${p.codProduto ?? p.id ?? p._id}`)
  return `${base}?text=${text}`
}

/** ---------------- Marcas (auto-suggest) ---------------- */
const brandOptions = ref([])

async function fetchBrandSuggestions(term) {
  // Ajuste aqui se tiver um endpoint real (ex.: /marcas/sugerir?term=...)
  // Fallback: tenta deduzir a partir dos itens atuais
  try {
    const q = term?.trim()
    // SE tiver endpoint:
    // const { data } = await api.get('/marcas/sugerir', { params: { term: q || '' } })
    // brandOptions.value = (data?.items || data || []).map(m => m.nome ?? m)
    // return

    // fallback simples
    const set = new Set(items.value.map(i => (i.marca || '').trim()).filter(Boolean))
    const all = Array.from(set).sort()
    brandOptions.value = q ? all.filter(x => x.toLowerCase().includes(q.toLowerCase())) : all
  } catch (e) {
    // silencioso
  }
}
function filterBrand(val, update) {
  update(async () => {
    await fetchBrandSuggestions(val)
  })
}

/** ---------------- Normalização de preços ---------------- */
function normalizePrice(which) {
  if (which === 'min') {
    const n = brToNumber(priceMinStr.value)
    filters.value.precoMin = n
    priceMinStr.value = (n != null) ? numberToBR(n) : ''
  } else {
    const n = brToNumber(priceMaxStr.value)
    filters.value.precoMax = n
    priceMaxStr.value = (n != null) ? numberToBR(n) : ''
  }
}

/** ---------------- Persistência em URL ---------------- */
function readFromURL() {
  const qs = new URLSearchParams(window.location.search)
  filters.value.descricaoProduto = qs.get('q') || ''
  filters.value.descricaoMarca = qs.get('marca') || ''
  const m1 = qs.get('min'); const m2 = qs.get('max')
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
  const url = `${location.pathname}?${qs.toString()}`
  window.history.replaceState(null, '', url)
}

/** ---------------- Busca no backend ---------------- */
let debounceId = null
function onFiltersChanged() {
  // normaliza os preços quando usuário muda qualquer coisa
  normalizePrice('min'); normalizePrice('max')
  // reinicia página
  page.value = 1
  // debounce
  clearTimeout(debounceId)
  debounceId = setTimeout(() => applyFilters(true), 300)
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
  filters.value = { descricaoProduto: '', descricaoMarca: '', precoMin: null, precoMax: null }
  priceMinStr.value = ''
  priceMaxStr.value = ''
  page.value = 1
  applyFilters(true)
}

async function applyFilters(updateURL = true) {
  loading.value = true
  try {
    // Normaliza preços vindos dos inputs mascarados
    normalizePrice('min')
    normalizePrice('max')

    // Overfetch: pede +1 para detectar se existe próxima página
    const L = Number(limit.value) || 12
    const body = {
      descricaoProduto: filters.value.descricaoProduto || null,
      descricaoMarca: filters.value.descricaoMarca || null,
      precoMin: filters.value.precoMin,
      precoMax: filters.value.precoMax,
      limit: L + 1,                 // 👈 overfetch +1
      offset: offset.value,
      // Envie a ordenação se o backend aceitar
      orderBy: orderBy.value || 'relevance'
    }

    const { data } = await api.post('/catalogo/produtos/buscar', body)

    // Normaliza a coleção vinda do backend
    const raw =
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.results) && data.results) ||
      (Array.isArray(data) ? data : [])

    const hasNext = raw.length > L
    const arr = hasNext ? raw.slice(0, L) : raw

    // Mapeia para o shape do front
    items.value = arr.map(p => ({
      id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      descricao: p.DESCRICAO ?? p.descricao,
      marca: p.MARCA ?? p.marca,
      preco: p.PRECO ?? p.preco,
      precoPromocao: p.PRECOPROMOCAO ?? p.precoPromocao,
      precoEfetivo: p.PRECO_EFETIVO ?? p.precoEfetivo ?? (p.PRECOPROMOCAO > 0 ? p.PRECOPROMOCAO : p.PRECO),
      imagemUrl: p.IMAGEM_URL ?? p.imagemUrl ?? null,
      dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null
    }))

    // Usa total do backend se existir; caso contrário, estima só para liberar paginação
    const apiTotal = Number(data?.total ?? data?.count ?? data?.totalCount)
    if (Number.isFinite(apiTotal) && apiTotal >= 0) {
      total.value = apiTotal
    } else {
      total.value = hasNext
        ? (Number(page.value) * L) + 1
        : ((Number(page.value) - 1) * L) + items.value.length
    }

    if (updateURL) writeToURL()
    await fetchBrandSuggestions('')
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
  detailItem.value = p
  showDetails.value = true
}

/** ---------------- Lifecycle ---------------- */
onMounted(async () => {
  readFromURL()
  await applyFilters(false)
})

/** ---------------- Watchers úteis ---------------- */
watch([page, limit], () => {
  // paginação já chama applyFilters; aqui só reflete URL
  writeToURL()
})
</script>

<style scoped>
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(180px, 1fr));
  gap: 14px;
}

@media (max-width: 1400px) {
  .catalog-grid {
    grid-template-columns: repeat(5, 1fr)
  }
}

@media (max-width: 1200px) {
  .catalog-grid {
    grid-template-columns: repeat(4, 1fr)
  }
}

@media (max-width: 900px) {
  .catalog-grid {
    grid-template-columns: repeat(3, 1fr)
  }
}

@media (max-width: 680px) {
  .catalog-grid {
    grid-template-columns: repeat(2, 1fr)
  }
}

@media (max-width: 420px) {
  .catalog-grid {
    grid-template-columns: 1fr
  }
}

.product-card {
  overflow: hidden;
  border-radius: 14px;
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
</style>
