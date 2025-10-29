<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Filtros -->
    <!-- 🔎 FILTROS -->
    <div class="q-pa-md bg-white rounded-borders q-mb-md shadow-1">
      <div class="row q-col-gutter-md items-end">
        <div class="col-12 col-md-4">
          <q-input color="secondary" v-model="filters.descricaoProduto" label="Buscar por produto" dense outlined
            clearable hint="Ex.: furadeira, bomba, martelo">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-select color="secondary" v-model="filters.descricaoMarca" label="Marca (opcional)" dense outlined clearable
            use-input fill-input :options="brandOptions" @filter="filterBrand" hint="Digite para sugerir marcas">
            <template #prepend>
              <q-icon name="sell" />
            </template>
          </q-select>
        </div>

        <div class="col-6 col-md-2">
          <q-input color="secondary" maxlength="9" prefix="R$" mask="####,##" reverse-fill-mask v-model="priceMinStr"
            label="Preço mín." dense outlined clearable hint="Ex.: 199,90">
            <template #prepend>
              <q-icon name="payments" />
            </template>
          </q-input>
        </div>

        <div class="col-6 col-md-2">
          <q-input color="secondary" maxlength="9" prefix="R$" mask="####,##" reverse-fill-mask v-model="priceMaxStr"
            label="Preço máx." dense outlined clearable hint="Ex.: 1299,00">
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
      <div class="col-grow text-grey-8">
        <span v-if="!loading">{{ total }} resultado(s)</span>
        <span v-else>Carregando…</span>
      </div>
      <div class="col-auto">
        <q-select v-model="orderBy" :options="orderOptions" dense outlined style="min-width: 210px" emit-value
          map-options @update:model-value="onOrderChange" />
      </div>
      <div class="col-auto">
        <q-select v-model="limit" :options="[10, 24, 48, 96]" dense outlined style="width: 90px" label="Limite"
          @update:model-value="onLimitChange" />
      </div>
      <div class="col-auto">
        <q-pagination v-model="page" :max="maxPage" :max-pages="6" boundary-numbers direction-links dense
          @update:model-value="onPageChange" />
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
            <div class="text-subtitle1 text-weight-medium ellipsis-2">{{ p.descricao }}</div>
            <div class="row items-center q-mt-xs q-col-gutter-sm">
              <div class="col-auto">
                <q-badge v-if="p.marca" color="blue-2" text-color="blue-10" :label="p.marca" />
              </div>
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
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

/** ---------------- State base ---------------- */
const loading = ref(false)
const items = ref([])
const total = ref(0)

const page = ref(1)
const limit = ref(10)
const orderBy = ref('relevance') // 'relevance' | 'price_asc' | 'price_desc' | 'updated_desc'

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: '',
  precoMin: null,
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
  limit.value = Number(qs.get('limit')) || 10
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
    normalizePrice('min')
    normalizePrice('max')

    const body = {
      descricaoProduto: filters.value.descricaoProduto || null,
      descricaoMarca: filters.value.descricaoMarca || null,
      precoMin: filters.value.precoMin,
      precoMax: filters.value.precoMax,
      limit: limit.value,
      offset: offset.value
    }

    const { data } = await api.post('/catalogo/produtos/buscar', body)

    // 💡 Normaliza campos para minúsculas
    const arr = data.data ?? data.items ?? data.results ?? data
    items.value = (arr || []).map(p => ({
      id: p.CODPRODUTO,
      descricao: p.DESCRICAO,
      marca: p.MARCA,
      preco: p.PRECO,
      precoPromocao: p.PRECOPROMOCAO,
      precoEfetivo: p.PRECO_EFETIVO,
      imagemUrl: p.IMAGEM_URL || null,
      dataAtualizacao: p.DATAATUALIZACAO
    }))

    total.value = data.count ?? items.value.length
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
