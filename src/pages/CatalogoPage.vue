<!-- CatalogoPage.vue - Eletro Nogueira -->
<template>
  <q-page ref="pageEl" class="catalog-page" :class="{ 'catalog-page--mobile': isMobile }">
    <q-inner-loading :showing="loading && items.length === 0">
      <q-spinner-gears size="42px" color="primary" />
      <div class="q-mt-sm text-white">Carregando produtos...</div>
    </q-inner-loading>

    <div ref="stickyHeaderEl" class="catalog-sticky-header animate__animated animate__fadeInDown animate__delay-1s animate__slower">
      <div class="sticky-main-row"  v-if="showStickySearch || isMobile">
        <div class="sticky-actions">
          <transition name="fade-slide">
            <q-input v-model="filters.descricaoProduto" dense outlined clearable bg-color="white" color="secondary"
              placeholder="Pesquisar no catálogo..." class="sticky-search" @keyup.enter="searchNow"
              @clear="clearSearchOnly">
              <template #prepend>
                <q-icon name="search" color="secondary" />
              </template>

              <template #append>
                <q-btn flat dense round icon="arrow_forward" color="secondary" @click="searchNow" />
              </template>
            </q-input>
          </transition>

          <q-btn unelevated class="sticky-filter-btn" icon="tune" :label="isMobile ? '' : 'Filtros'"
            @click="openFiltersModal">
            <q-badge v-if="activeExtraFiltersCount > 0" color="negative" floating>
              {{ activeExtraFiltersCount }}
            </q-badge>
          </q-btn>
        </div>
      </div>

      <div v-if="visibleNavSections.length > 1" class="sticky-section-tabs">
        <q-btn v-for="section in visibleNavSections" :key="section.key" dense flat rounded no-caps :icon="section.icon"
          :label="section.label" class="section-tab" :class="{ 'section-tab--active': activeSection === section.key }"
          @click="scrollToSection(section.key)" />
      </div>
    </div>

    <main class="catalog-shell q-pt-xl">
      <section ref="mainSearchEl" class=" q-mt-xl catalog-hero" v-if="!isMobile">
        <div class="hero-copy">
          <!-- <div class="hero-kicker">
            Ferramentas, elétrica, hidráulica e manutenção
          </div> -->

          <h1>
            Encontre os melhores produtos na EletroNogueira
          </h1>
          <div class="hero-metrics">
            <div>
              <q-icon name="local_offer" />
              <span>Promoções Imperdíveis</span>
            </div>
            <div>
              <q-icon name="sell" />
              <span>Marcas Selecionadas</span>
            </div>
            <div>
              <q-icon name="bolt" />
              <span>Suporte Especializado</span>
            </div>
          </div>
        </div>

        <div class="hero-search-card">
          <div class="hero-search-title">O que você precisa hoje?</div>

          <q-input v-model="filters.descricaoProduto" outlined clearable bg-color="white" color="secondary"
            label="Buscar produto" hint="Ex.: furadeira, extensão, bomba, Makita, 3M..." debounce="350"
            @keyup.enter="searchNow" @clear="clearSearchOnly">
            <template #prepend>
              <q-icon name="search" color="secondary" />
            </template>

            <template #append>
              <q-btn unelevated color="secondary" text-color="white" icon="search" @click="searchNow" />
            </template>
          </q-input>

          <div class="quick-filter-row">
            <q-chip clickable :color="filters.isPromotion ? 'negative' : 'white'"
              :text-color="filters.isPromotion ? 'white' : 'secondary'" icon="local_offer"
              @click="togglePromotionQuickFilter">
              Promoção
            </q-chip>

            <q-chip v-for="brand in quickBrandChips" :key="brand.value" clickable color="white" text-color="secondary"
              icon="sell" @click="applyBrandFilter(brand)">
              {{ brand.label }}
            </q-chip>
          </div>

          <div class="hero-actions">
            <q-btn unelevated color="secondary" text-color="white" icon="tune" label="Filtros avançados"
              @click="openFiltersModal" />

            <q-btn flat color="secondary" icon="restart_alt" label="Limpar tudo" @click="resetAllFilters" />
          </div>
        </div>
      </section>

      <section v-if="hasAnyFilter" class="active-filters-card">
        <div class="active-filters-title">Filtros aplicados</div>

        <div class="active-filters-row">
          <q-chip v-if="(filters.descricaoProduto || '').trim()" removable color="white" text-color="secondary"
            icon="search" @remove="clearSearchOnly">
            {{ filters.descricaoProduto }}
          </q-chip>

          <q-chip v-if="currentBrandName" removable color="white" text-color="secondary" icon="sell"
            @remove="clearBrandAndSearch">
            {{ currentBrandName }}
          </q-chip>

          <q-chip v-if="filters.isPromotion" removable color="negative" text-color="white" icon="local_offer"
            @remove="removePromotionOnly">
            Somente promoção
          </q-chip>

          <q-chip v-if="filters.precoMin !== null && filters.precoMin !== ''" removable color="white"
            text-color="secondary" icon="payments" @remove="removePrecoMin">
            Mín: {{ money(filters.precoMin) }}
          </q-chip>

          <q-chip v-if="filters.precoMax !== null && filters.precoMax !== ''" removable color="white"
            text-color="secondary" icon="attach_money" @remove="removePrecoMax">
            Máx: {{ money(filters.precoMax) }}
          </q-chip>

          <q-chip v-if="orderBy !== DEFAULT_ORDER" removable color="white" text-color="secondary" icon="sort"
            @remove="resetOrderOnly">
            {{ currentOrderLabel }}
          </q-chip>

          <q-btn flat dense color="white" icon="close" label="Limpar" @click="resetAllFilters" />
        </div>
      </section>

      <section v-if="showcaseProducts.length" ref="promotionsSectionEl" class="catalog-section">
        <div class="section-heading">
          <div>
            <div class="section-kicker section-kicker--promo">Ofertas e destaques</div>
            <h2>Produtos em promoção</h2>
          </div>

          <q-chip color="negative" text-color="white" icon="local_offer">
            {{ showcaseProducts.length }} destaque(s)
          </q-chip>
        </div>

        <div class="promo-rail">
          <q-card v-for="p in showcaseProducts" :key="`promo-${productKey(p)}`" flat bordered
            class="catalog-product-card catalog-product-card--promo" @click="openDetails(p)">
            <div class="product-image-wrap">
              <q-img :src="resolveImage(p)" :alt="p.descricao" fit="contain" class="product-img"
                spinner-color="secondary">
                <template #error>
                  <div class="absolute-full flex flex-center bg-white">
                    <q-icon name="image_not_supported" size="42px" color="grey-5" />
                  </div>
                </template>
              </q-img>

              <q-badge class="promo-badge" color="negative" icon="local_offer">
                Promoção
              </q-badge>

              <q-badge v-if="p.marca" class="brand-badge">
                {{ p.marca }}
              </q-badge>

              <div class="price-tag" :class="{ 'price-tag--promo': hasPromotion(p) }">
                <template v-if="hasPromotion(p) && p.precoPromocao">
                  <div class="old-price">{{ money(p.preco) }}</div>
                  <div class="promo-price">{{ money(p.precoPromocao) }}</div>
                </template>
                <template v-else>
                  {{ money(p.precoEfetivo ?? p.preco) }}
                </template>
              </div>

              <q-btn round dense glossy color="green-14" icon="add_shopping_cart" class="cart-btn"
                @click.stop="confirmAddToCart(p)" />
            </div>

            <q-card-section class="product-info">
              <div class="product-title ellipsis-3-lines">{{ p.descricao }}</div>
            </q-card-section>
          </q-card>
        </div>
      </section>

      <section v-if="brandTopics.length" ref="brandsSectionEl" class="catalog-section">
        <div class="section-heading">
          <div>
            <div class="section-kicker">Marcas encontradas</div>
            <h2>Produtos por marca</h2>
          </div>

          <q-chip color="primary" text-color="secondary" icon="sell">
            {{ brandTopics.length }} marca(s)
          </q-chip>
        </div>

        <div class="brand-topics">
          <article v-for="topic in brandTopics" :key="topic.key" class="brand-topic-card">
            <header class="brand-topic-header">
              <div class="brand-topic-title-wrap">
                <q-avatar color="primary" text-color="secondary" size="46px" font-size="22px">
                  <q-icon name="sell" />
                </q-avatar>

                <div>
                  <h3>{{ topic.label }}</h3>
                  <div class="brand-topic-meta">
                    {{ topic.total }} produto(s)
                    <span v-if="topic.promoCount"> · {{ topic.promoCount }} oferta(s)</span>
                  </div>
                </div>
              </div>

              <q-btn flat rounded color="primary" text-color="primary" icon-right="arrow_forward" label="Ver marca"
                @click="applyBrandFilter({ label: topic.label, value: topic.key, marca: topic.label })" />
            </header>

            <div class="brand-products-grid">
              <q-card v-for="p in topic.products" :key="`brand-${topic.key}-${productKey(p)}`" flat bordered
                class="catalog-product-card catalog-product-card--compact" @click="openDetails(p)">
                <div class="product-image-wrap">
                  <q-img :src="resolveImage(p)" :alt="p.descricao" fit="contain" class="product-img"
                    spinner-color="secondary">
                    <template #error>
                      <div class="absolute-full flex flex-center bg-white">
                        <q-icon name="image_not_supported" size="36px" color="grey-5" />
                      </div>
                    </template>
                  </q-img>

                  <q-badge v-if="hasPromotion(p)" class="promo-badge" color="negative">
                    Oferta
                  </q-badge>

                  <div class="price-tag" :class="{ 'price-tag--promo': hasPromotion(p) }">
                    <template v-if="hasPromotion(p) && p.precoPromocao">
                      <div class="old-price">{{ money(p.preco) }}</div>
                      <div class="promo-price">{{ money(p.precoPromocao) }}</div>
                    </template>
                    <template v-else>
                      {{ money(p.precoEfetivo ?? p.preco) }}
                    </template>
                  </div>

                  <q-btn round dense glossy color="green-14" icon="add_shopping_cart" class="cart-btn"
                    @click.stop="confirmAddToCart(p)" />
                </div>

                <q-card-section class="product-info">
                  <div class="product-title ellipsis-3-lines">{{ p.descricao }}</div>
                </q-card-section>
              </q-card>
            </div>
          </article>
        </div>
      </section>

      <section ref="resultsSectionEl" class="catalog-section catalog-results-section">
        <div class="section-heading">
          <div>
            <div class="section-kicker">Todos os resultados</div>
            <h2>Catálogo completo</h2>
          </div>

          <q-chip color="primary" text-color="secondary" icon="inventory_2">
            {{ resultsCounterLabel }}
          </q-chip>
        </div>

        <div v-if="loading && items.length === 0" class="catalog-grid">
          <q-skeleton v-for="i in PAGE_LIMIT" :key="`sk-${i}`" type="rect" class="card-skeleton" />
        </div>

        <q-card v-else-if="!loading && items.length === 0" flat bordered class="empty-card">
          <q-icon name="inventory_2" size="56px" color="primary" />
          <div class="text-h6 text-weight-bold q-mt-md">Nenhum produto encontrado</div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            Tente buscar por outro termo, mudar a marca ou limpar os filtros.
          </div>

          <div class="row justify-center q-gutter-sm q-mt-md">
            <q-btn flat color="secondary" label="Limpar busca" @click="clearSearchOnly" />
            <q-btn unelevated color="secondary" label="Limpar tudo" @click="resetAllFilters" />
          </div>
        </q-card>

        <div v-else class="catalog-grid">
          <q-card v-for="p in items" :key="`result-${productKey(p)}`" flat bordered class="catalog-product-card"
            @click="openDetails(p)">
            <div class="product-image-wrap">
              <q-img :src="resolveImage(p)" :alt="p.descricao" fit="contain" class="product-img"
                spinner-color="secondary">
                <template #error>
                  <div class="absolute-full flex flex-center bg-white">
                    <q-icon name="image_not_supported" size="42px" color="grey-5" />
                  </div>
                </template>
              </q-img>

              <q-badge v-if="hasPromotion(p)" class="promo-badge" color="negative" text-color="white"
                icon="local_offer">
                Promoção
              </q-badge>

              <q-badge v-if="p.marca" class="brand-badge">
                {{ p.marca }}
              </q-badge>

              <div class="price-tag" :class="{ 'price-tag--promo': hasPromotion(p) }">
                <template v-if="hasPromotion(p) && p.precoPromocao">
                  <div class="old-price">{{ money(p.preco) }}</div>
                  <div class="promo-price">{{ money(p.precoPromocao) }}</div>
                </template>

                <template v-else>
                  {{ money(p.precoEfetivo ?? p.preco) }}
                </template>
              </div>

              <q-btn round dense glossy color="green-14" icon="add_shopping_cart" class="cart-btn"
                @click.stop="confirmAddToCart(p)" />
            </div>

            <q-card-section class="product-info">
              <div class="product-title ellipsis-3-lines">
                {{ p.descricao }}
              </div>

              <div class="product-meta">
                <span v-if="p.marca">{{ p.marca }}</span>
                <span v-if="p.codProduto">#{{ p.codProduto }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="pagination-feedback">
          <q-spinner-dots v-if="loadingMore" size="38px" color="primary" />

          <div v-else-if="!loading && isLastPage && items.length > 0" class="last-page-alert">
            <q-icon name="done_all" size="22px" />
            Você chegou ao final. {{ resultsCounterLabel }}.
          </div>

          <q-btn v-else-if="!loading && !isLastPage && items.length > 0" outline rounded color="primary"
            :loading="loadingMore" icon="expand_more" label="Carregar mais" @click="loadNextPageIfPossible" />
        </div>
      </section>
    </main>

    <q-page-sticky v-if="isMobile" style="z-index: 45;" position="bottom-right" :offset="[18, 18]">
      <q-btn round size="lg" color="primary" text-color="secondary" glossy icon="tune" class="shadow-8"
        @click="openFiltersModal">
        <q-badge v-if="activeExtraFiltersCount > 0" color="negative" floating>
          {{ activeExtraFiltersCount }}
        </q-badge>
      </q-btn>
    </q-page-sticky>

    <q-dialog v-model="filtersDialog" :position="isMobile ? 'bottom' : 'standard'">
      <q-card class="filters-modal-card">
        <q-card-section class="filters-modal-header">
          <div>
            <div class="text-h6 text-weight-bold">Ajustar filtros</div>
          </div>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-select v-model="modalOrderBy" :options="orderOptions" emit-value map-options outlined dense
            color="secondary" label="Ordenar" />

          <q-toggle v-model="modalFilters.isPromotion" color="negative" checked-icon="local_offer" unchecked-icon="sell"
            label="Mostrar somente produtos em promoção" />

          <q-select v-model="modalSelectedBrand" :options="modalBrandOptions" option-label="label" option-value="value"
            use-input fill-input hide-selected input-debounce="350" outlined dense clearable color="secondary"
            label="Marca" hint="Digite para buscar marcas ou escolha uma sugestão" :loading="modalBrandLoading"
            behavior="menu" @filter="onModalBrandFilter" @clear="clearModalBrand"
            @update:model-value="onModalBrandChanged">
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

          <div class="col-12 col-sm-6">
            <q-input v-model="modalFilters.precoMin" outlined dense color="secondary" label="Preço mínimo"
              inputmode="decimal" placeholder="0,00">
              <template #prepend>
                <q-icon name="payments" color="secondary" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input v-model="modalFilters.precoMax" outlined dense color="secondary" label="Preço máximo"
              inputmode="decimal" placeholder="999,99">
              <template #prepend>
                <q-icon name="attach_money" color="secondary" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between" class="q-pa-md w100 row no-wrap">
            <q-btn flat color="grey-7" label="Cancelar" v-close-popup />
            <q-btn flat color="negative" label="Limpar" @click="clearModalFilters" />
            <q-btn unelevated color="secondary" icon-right="search" label="Buscar" :loading="loading"
              @click="applyModalFilters" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useCart } from 'src/composables/useCart'

const PAGE_LIMIT = 25
const DEFAULT_ORDER = 'updated_desc'
const PROMO_LIMIT = 12

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const cart = useCart()

const isMobile = computed(() => $q.screen.lt.md)

const pageEl = ref(null)
const stickyHeaderEl = ref(null)
const mainSearchEl = ref(null)
const promotionsSectionEl = ref(null)
const brandsSectionEl = ref(null)
const resultsSectionEl = ref(null)

const loading = ref(false)
const loadingMore = ref(false)
const loadingPromos = ref(false)

const items = ref([])
const promotionItems = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(PAGE_LIMIT)
const apiIsLastPage = ref(false)

const orderBy = ref(DEFAULT_ORDER)
const filters = ref({
  descricaoProduto: '',
  descricaoMarca: null,
  precoMin: null,
  precoMax: null,
  isPromotion: false
})

const selectedBrand = ref(null)
const filtersDialog = ref(false)
const modalFilters = ref({
  precoMin: null,
  precoMax: null,
  descricaoMarca: null,
  isPromotion: false
})
const modalOrderBy = ref(DEFAULT_ORDER)
const modalSelectedBrand = ref(null)
const modalBrandOptions = ref([])
const modalBrandLoading = ref(false)
const modalBrandInput = ref('')

const showStickySearch = ref(false)
const activeSection = ref('results')

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

const orderOptions = [
  { label: 'Mais recentes', value: 'updated_desc' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais relevante', value: 'created_desc' }
]

const baseSuggestedBrands = [
  { label: 'BLACK & DECKER', value: 'BLACK & DECKER', marca: 'BLACK & DECKER', codMarca: null },
  { label: 'MAKITA', value: 'MAKITA', marca: 'MAKITA', codMarca: null },
  { label: '3M', value: '3M', marca: '3M', codMarca: null },
  { label: 'BOSCH', value: 'BOSCH', marca: 'BOSCH', codMarca: null },
  { label: 'DEWALT', value: 'DEWALT', marca: 'DEWALT', codMarca: null },
  { label: 'TRAMONTINA', value: 'TRAMONTINA', marca: 'TRAMONTINA', codMarca: null },
  { label: 'TIGRE', value: 'TIGRE', marca: 'TIGRE', codMarca: null }
]

const currentBrandName = computed(() => {
  return String(selectedBrand.value?.marca || filters.value.descricaoMarca || '').trim()
})

const currentOrderLabel = computed(() => {
  return orderOptions.find(o => o.value === orderBy.value)?.label || 'Ordenação'
})

const hasAnyFilter = computed(() => {
  return Boolean(
    String(filters.value.descricaoProduto || '').trim() ||
    currentBrandName.value ||
    filters.value.isPromotion ||
    filters.value.precoMin !== null ||
    filters.value.precoMax !== null ||
    orderBy.value !== DEFAULT_ORDER
  )
})

const activeExtraFiltersCount = computed(() => {
  let count = 0

  if (currentBrandName.value) count++
  if (filters.value.isPromotion) count++
  if (filters.value.precoMin !== null && filters.value.precoMin !== '') count++
  if (filters.value.precoMax !== null && filters.value.precoMax !== '') count++
  if (orderBy.value !== DEFAULT_ORDER) count++

  return count
})

const offset = computed(() => {
  return Math.max(0, (Number(page.value) - 1) * Number(limit.value || PAGE_LIMIT))
})

const maxPage = computed(() => {
  const t = Number(total.value) || 0
  return Math.max(1, Math.ceil(t / Number(limit.value || PAGE_LIMIT)))
})

const isLastPage = computed(() => {
  if (typeof apiIsLastPage.value === 'boolean') return apiIsLastPage.value
  return Number(page.value) >= maxPage.value
})

const resultsCounterLabel = computed(() => {
  const loaded = Number(items.value.length) || 0
  const t = Number(total.value) || 0

  if (loading.value && loaded === 0) return 'Buscando produtos...'
  if (!loaded) return 'Nenhum produto encontrado'
  if (t && t > loaded) return `${loaded} de ${t} produtos`
  if (loaded === 1) return '1 produto encontrado'

  return `${loaded} produtos encontrados`
})

const showcaseProducts = computed(() => {
  const map = new Map()

  const source = [
    ...promotionItems.value,
    ...items.value.filter(hasPromotion)
  ]

  for (const p of source) {
    const key = productKey(p)
    if (!key || map.has(key)) continue
    map.set(key, p)
  }

  return sortProductsForShowcase(Array.from(map.values())).slice(0, PROMO_LIMIT)
})

const brandTopics = computed(() => {
  const grouped = new Map()

  for (const product of items.value) {
    const brand = String(product?.marca || '').trim()
    if (!brand) continue

    const key = normalizeKey(brand)

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        label: brand,
        products: [],
        promoCount: 0,
        total: 0
      })
    }

    const group = grouped.get(key)
    group.products.push(product)
    group.total++

    if (hasPromotion(product)) {
      group.promoCount++
    }
  }

  return Array.from(grouped.values())
    .map(group => ({
      ...group,
      products: sortProductsForShowcase(group.products).slice(0, 8)
    }))
    .filter(group => group.products.length >= 2)
    .sort((a, b) => {
      if (b.promoCount !== a.promoCount) return b.promoCount - a.promoCount
      return b.total - a.total
    })
    .slice(0, 8)
})

const quickBrandChips = computed(() => {
  const fromItems = brandTopics.value.map(topic => ({
    label: topic.label,
    value: topic.key,
    marca: topic.label,
    codMarca: null
  }))

  return uniqueBrandOptions([...fromItems, ...baseSuggestedBrands]).slice(0, isMobile.value ? 4 : 7)
})

const modalSuggestedBrands = computed(() => {
  const fromTopics = brandTopics.value.map(topic => ({
    label: topic.label,
    value: topic.key,
    marca: topic.label,
    codMarca: null
  }))

  return uniqueBrandOptions([...fromTopics, ...baseSuggestedBrands]).slice(0, 12)
})

const visibleNavSections = computed(() => {
  const sections = []

  if (showcaseProducts.value.length) {
    sections.push({ key: 'promos', label: 'Promoções', icon: 'local_offer' })
  }

  if (brandTopics.value.length) {
    sections.push({ key: 'brands', label: 'Marcas', icon: 'sell' })
  }

  sections.push({ key: 'results', label: 'Todos', icon: 'inventory_2' })

  return sections
})

let reqSeq = 0
let promoReqSeq = 0
let brandReqSeq = 0
let scrollTarget = null
let scrollTicking = false
let resizeHandler = null
let routeWatchLocked = false

function money(value) {
  if (value === null || value === undefined || value === '') return '—'

  const n = Number(String(value).replace(',', '.'))

  if (!Number.isFinite(n)) return '—'

  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === '') return null

  const normalized = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const n = Number(normalized)

  return Number.isFinite(n) ? n : null
}

function normalizeBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

function normalizeOrderValue(value) {
  const allowed = orderOptions.map(option => option.value)
  return allowed.includes(String(value || '')) ? String(value) : DEFAULT_ORDER
}

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
}

function safeUrl(url) {
  if (!url) return null

  const s = String(url).trim()
  if (!s) return null

  return s.replace(/ /g, '%20')
}

function productKey(product) {
  return String(product?.codProduto ?? product?.id ?? product?._id ?? product?.CODPRODUTO ?? '')
}

function hasPromotion(product) {
  const preco = Number(product?.preco ?? product?.PRECO ?? 0)
  const promo = Number(product?.precoPromocao ?? product?.PRECOPROMOCAO ?? 0)

  return Boolean(
    product?.isPromotion === true ||
    product?.isPromotion === 1 ||
    product?.ISPROMOTION === true ||
    product?.ISPROMOTION === 1 ||
    (promo > 0 && (!preco || promo < preco))
  )
}

function getFinalPrice(product) {
  const preco = Number(product?.preco ?? 0)
  const promo = Number(product?.precoPromocao ?? 0)

  if (hasPromotion(product) && promo > 0) return promo

  return product?.precoEfetivo ?? preco
}

function sortProductsForShowcase(products = []) {
  return products.slice().sort((a, b) => {
    const imgA = resolveImage(a) !== fallbackImage ? 1 : 0
    const imgB = resolveImage(b) !== fallbackImage ? 1 : 0

    if (imgA !== imgB) return imgB - imgA

    const promoA = hasPromotion(a) ? 1 : 0
    const promoB = hasPromotion(b) ? 1 : 0

    if (promoA !== promoB) return promoB - promoA

    return Number(getFinalPrice(b) || 0) - Number(getFinalPrice(a) || 0)
  })
}

function resolveImage(product) {
  if (!product) return fallbackImage

  const imgsPathRaw =
    product.IMGS_PATH ??
    product.imgsPath ??
    product.imagensPath ??
    product.images ??
    null

  if (Array.isArray(imgsPathRaw) && imgsPathRaw.length) {
    const first = imgsPathRaw.find(Boolean)
    if (typeof first === 'string') return safeUrl(first) || fallbackImage
    if (first?.url) return safeUrl(first.url) || fallbackImage
  }

  const legacy =
    product.imgPath ||
    product.IMG_PATH ||
    product.imagemUrl ||
    product.IMAGEM_URL ||
    product.imageUrl ||
    product.img_url ||
    (product.IMG && (product.IMG.link || product.IMG.url)) ||
    null

  return safeUrl(legacy) || fallbackImage
}

function normalizeProdutos(data) {
  const raw =
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.results) && data.results) ||
    (Array.isArray(data) ? data : [])

  return raw.map((p) => {
    const preco = p.PRECO ?? p.preco ?? null
    const promo = p.PRECOPROMOCAO ?? p.precoPromocao ?? null

    const isPromotion = Boolean(
      p.ISPROMOTION === 1 ||
      p.ISPROMOTION === true ||
      p.isPromotion === true ||
      p.isPromotion === 1 ||
      (Number(promo) > 0 && (!Number(preco) || Number(promo) < Number(preco)))
    )

    const efetivo =
      p.PRECO_EFETIVO ??
      p.precoEfetivo ??
      (isPromotion && Number(promo) > 0 ? promo : preco)

    const imgsPathRaw = p.IMGS_PATH ?? p.imgsPath ?? p.imagensPath ?? null
    const imgsPath = Array.isArray(imgsPathRaw)
      ? imgsPathRaw.filter(Boolean).map(u => safeUrl(u))
      : (typeof imgsPathRaw === 'string' && imgsPathRaw ? [safeUrl(imgsPathRaw)] : [])

    const legacyUrl = safeUrl(p.IMG_PATH ?? p.imgPath ?? p.imagemUrl ?? p.IMAGEM_URL ?? null)

    return {
      id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      codProduto: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
      descricao: p.DESCRICAO ?? p.descricao ?? p.title ?? '',
      codOriginal: p.CODORIGINAL ?? p.codOriginal ?? p.sku ?? null,
      marca: p.MARCA ?? p.marca ?? '',
      preco: preco !== null && preco !== undefined ? Number(preco) : null,
      precoPromocao: promo !== null && promo !== undefined ? Number(promo) : null,
      precoEfetivo: efetivo !== null && efetivo !== undefined ? Number(efetivo) : null,
      isPromotion,
      imgsPath: imgsPath.filter(Boolean),
      imgs: Array.isArray(p.IMGS) ? p.IMGS : (p.IMGS != null ? [p.IMGS] : null),
      imgPath: legacyUrl,
      imagemUrl: imgsPath?.[0] || legacyUrl || null,
      dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null,
      dataCadastro: p.DATACADASTRO ?? p.dataCadastro ?? null,
      hasImage: p.HAS_IMAGE ?? p.hasImage ?? null,
      raw: p
    }
  })
}

function normalizeBrandsResponse(data) {
  const raw =
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.results) && data.results) ||
    (Array.isArray(data) ? data : [])

  return raw
    .map((m) => {
      const cod = m?.CODMARCA ?? m?.codMarca ?? m?.id ?? null
      const name = String(m?.MARCA ?? m?.marca ?? m?.descricaoMarca ?? '').trim()

      if (!name) return null

      return {
        label: name,
        value: cod ?? normalizeKey(name),
        codMarca: cod,
        marca: name
      }
    })
    .filter(Boolean)
}

function uniqueBrandOptions(options = []) {
  const map = new Map()

  for (const item of options) {
    const name = String(item?.marca || item?.label || '').trim()
    if (!name) continue

    const key = normalizeKey(name)

    if (!map.has(key)) {
      map.set(key, {
        label: name,
        value: item?.value ?? key,
        codMarca: item?.codMarca ?? null,
        marca: name
      })
    }
  }

  return Array.from(map.values())
}

function pickTotalFromResponse(data, newItems = []) {
  const candidates = [
    data?.totalCount,
    data?.total,
    data?.count,
    data?.meta?.total,
    data?.pagination?.total
  ].map(x => Number(x))

  const found = candidates.find(n => Number.isFinite(n) && n >= 0)
  if (Number.isFinite(found)) return found

  if (typeof data?.is_last_page === 'boolean' && data.is_last_page) {
    return ((Number(page.value) - 1) * Number(limit.value)) + newItems.length
  }

  return null
}

function readFromURL() {
  const q = route.query

  filters.value.descricaoProduto = String(q.q || '')
  filters.value.precoMin = normalizeNumber(q.min)
  filters.value.precoMax = normalizeNumber(q.max)
  filters.value.isPromotion = normalizeBoolean(q.isPromotion)
  orderBy.value = normalizeOrderValue(q.orderBy)

  limit.value = PAGE_LIMIT
  page.value = 1

  const marca = String(q.marca || '').trim()

  if (marca) {
    selectedBrand.value = {
      label: marca,
      value: normalizeKey(marca),
      codMarca: null,
      marca
    }
    filters.value.descricaoMarca = marca
  } else {
    selectedBrand.value = null
    filters.value.descricaoMarca = null
  }
}

function getURLQuery() {
  const query = {}

  const q = String(filters.value.descricaoProduto || '').trim()
  const marca = currentBrandName.value

  if (q) query.q = q
  if (marca) query.marca = marca
  if (filters.value.isPromotion) query.isPromotion = 'true'
  if (filters.value.precoMin !== null && filters.value.precoMin !== '') query.min = String(filters.value.precoMin)
  if (filters.value.precoMax !== null && filters.value.precoMax !== '') query.max = String(filters.value.precoMax)
  if (orderBy.value && orderBy.value !== DEFAULT_ORDER) query.orderBy = orderBy.value

  query.limit = String(PAGE_LIMIT)

  return query
}

async function writeToURL() {
  routeWatchLocked = true

  await router.replace({
    path: route.path || '/catalogo',
    query: getURLQuery()
  })

  await nextTick()
  routeWatchLocked = false
}

function buildSearchParams({ append = false, forcePromotion = null, customLimit = PAGE_LIMIT } = {}) {
  let precoMin = normalizeNumber(filters.value.precoMin)
  let precoMax = normalizeNumber(filters.value.precoMax)

  if (precoMin !== null && precoMax !== null && precoMin > precoMax) {
    const temp = precoMin
    precoMin = precoMax
    precoMax = temp
  }

  const params = {
    limit: Number(customLimit || PAGE_LIMIT),
    offset: append ? Number(offset.value) : 0,
    descricaoProduto: String(filters.value.descricaoProduto || '').trim() || null,
    descricaoMarca: currentBrandName.value || null,
    precoMin,
    precoMax,
    orderBy: normalizeOrderValue(orderBy.value)
  }

  const promotionValue = forcePromotion !== null
    ? Boolean(forcePromotion)
    : Boolean(filters.value.isPromotion)

  if (promotionValue) {
    params.isPromotion = true
  }

  return params
}

async function fetchPromotions() {
  const mySeq = ++promoReqSeq
  loadingPromos.value = true

  try {
    const params = buildSearchParams({
      append: false,
      forcePromotion: true,
      customLimit: PROMO_LIMIT
    })

    params.offset = 0

    const { data } = await api.get('/produtos/', { params })

    if (mySeq !== promoReqSeq) return

    promotionItems.value = normalizeProdutos(data)
  } catch (err) {
    if (mySeq !== promoReqSeq) return

    console.warn('[Catalogo] Não foi possível buscar promoções:', err)
    promotionItems.value = []
  } finally {
    if (mySeq !== promoReqSeq) return
    loadingPromos.value = false
  }
}

async function fetchProducts({ append = false, updateURL = true } = {}) {
  const mySeq = ++reqSeq

  if (append) loadingMore.value = true
  else loading.value = true

  try {
    const params = buildSearchParams({ append })
    const { data } = await api.get('/produtos/', { params })

    if (mySeq !== reqSeq) return

    const newItems = normalizeProdutos(data)

    if (append) {
      const merged = new Map(items.value.map(item => [productKey(item), item]))

      for (const item of newItems) {
        const key = productKey(item)
        if (key) merged.set(key, item)
      }

      items.value = Array.from(merged.values())
    } else {
      items.value = newItems
    }

    const apiTotal = pickTotalFromResponse(data, newItems)

    if (apiTotal !== null) {
      total.value = apiTotal
    } else {
      total.value = items.value.length
    }

    if (typeof data?.is_last_page === 'boolean') {
      apiIsLastPage.value = data.is_last_page
    } else {
      apiIsLastPage.value = newItems.length < Number(limit.value) || (total.value > 0 && items.value.length >= total.value)
    }

    if (!append && updateURL) {
      await writeToURL()
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

    await nextTick()
    updateStickyState()
  }
}

async function searchNow() {
  page.value = 1
  limit.value = PAGE_LIMIT
  items.value = []
  total.value = 0
  apiIsLastPage.value = false

  await Promise.all([
    fetchProducts({ append: false, updateURL: true }),
    fetchPromotions()
  ])

  await nextTick()
  updateStickyState()
  await ensureViewportFilled()
}

async function loadNextPageIfPossible() {
  if (loading.value || loadingMore.value || isLastPage.value) return

  page.value = Number(page.value) + 1

  await fetchProducts({ append: true, updateURL: false })
  await nextTick()
  updateStickyState()
}

async function ensureViewportFilled(maxRounds = 3) {
  for (let i = 0; i < maxRounds; i++) {
    if (loading.value || loadingMore.value || isLastPage.value) break
    if (!isNearBottom(260)) break

    await loadNextPageIfPossible()
  }
}

function openFiltersModal() {
  modalFilters.value = {
    precoMin: filters.value.precoMin,
    precoMax: filters.value.precoMax,
    descricaoMarca: filters.value.descricaoMarca,
    isPromotion: Boolean(filters.value.isPromotion)
  }

  modalOrderBy.value = orderBy.value
  modalSelectedBrand.value = selectedBrand.value ? { ...selectedBrand.value } : null
  modalBrandOptions.value = uniqueBrandOptions([
    ...modalSuggestedBrands.value,
    ...(modalSelectedBrand.value ? [modalSelectedBrand.value] : [])
  ])

  filtersDialog.value = true
}

function onModalBrandChanged(value) {
  if (!value) {
    modalFilters.value.descricaoMarca = null
    return
  }

  modalFilters.value.descricaoMarca = value.marca || value.label || null
}

function clearModalBrand() {
  modalSelectedBrand.value = null
  modalFilters.value.descricaoMarca = null
  modalBrandInput.value = ''
  modalBrandOptions.value = [...modalSuggestedBrands.value]
}

function applySuggestedBrand(brand) {
  modalSelectedBrand.value = { ...brand }
  modalFilters.value.descricaoMarca = brand.marca || brand.label || null
  modalBrandOptions.value = uniqueBrandOptions([brand, ...modalBrandOptions.value])
}

async function onModalBrandFilter(value, update) {
  const term = String(value || '').trim()
  modalBrandInput.value = term

  if (!term) {
    update(() => {
      modalBrandOptions.value = [...modalSuggestedBrands.value]
    })
    return
  }

  const localMatches = modalSuggestedBrands.value.filter(brand =>
    normalizeKey(brand.label).includes(normalizeKey(term))
  )

  if (term.length < 2) {
    update(() => {
      modalBrandOptions.value = localMatches.length ? localMatches : [...modalSuggestedBrands.value]
    })
    return
  }

  const mySeq = ++brandReqSeq
  modalBrandLoading.value = true

  try {
    const { data } = await api.get('/marcas/', {
      params: {
        limit: 10,
        offset: 0,
        descricaoMarca: term
      }
    })

    if (mySeq !== brandReqSeq) return

    const apiOptions = normalizeBrandsResponse(data)

    update(() => {
      modalBrandOptions.value = uniqueBrandOptions([
        ...localMatches,
        ...apiOptions,
        ...modalSuggestedBrands.value
      ])
    })
  } catch (err) {
    if (mySeq !== brandReqSeq) return

    update(() => {
      modalBrandOptions.value = localMatches.length ? localMatches : [...modalSuggestedBrands.value]
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
    descricaoMarca: null,
    isPromotion: false
  }

  modalOrderBy.value = DEFAULT_ORDER
  modalSelectedBrand.value = null
  modalBrandInput.value = ''
  modalBrandOptions.value = [...modalSuggestedBrands.value]
}

async function applyModalFilters() {
  filters.value.precoMin = normalizeNumber(modalFilters.value.precoMin)
  filters.value.precoMax = normalizeNumber(modalFilters.value.precoMax)
  filters.value.isPromotion = Boolean(modalFilters.value.isPromotion)
  orderBy.value = normalizeOrderValue(modalOrderBy.value)

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

async function applyBrandFilter(brand) {
  if (!brand) return

  selectedBrand.value = {
    label: brand.label || brand.marca,
    value: brand.value || normalizeKey(brand.marca || brand.label),
    codMarca: brand.codMarca ?? null,
    marca: brand.marca || brand.label
  }

  filters.value.descricaoMarca = selectedBrand.value.marca

  await searchNow()
  scrollToSection('results')
}

async function togglePromotionQuickFilter() {
  filters.value.isPromotion = !filters.value.isPromotion
  await searchNow()
}

async function clearSearchOnly() {
  filters.value.descricaoProduto = ''
  await searchNow()
}

async function clearBrandAndSearch() {
  selectedBrand.value = null
  filters.value.descricaoMarca = null
  await searchNow()
}

async function removePromotionOnly() {
  filters.value.isPromotion = false
  await searchNow()
}

async function removePrecoMin() {
  filters.value.precoMin = null
  await searchNow()
}

async function removePrecoMax() {
  filters.value.precoMax = null
  await searchNow()
}

async function resetOrderOnly() {
  orderBy.value = DEFAULT_ORDER
  await searchNow()
}

async function resetAllFilters() {
  filters.value = {
    descricaoProduto: '',
    descricaoMarca: null,
    precoMin: null,
    precoMax: null,
    isPromotion: false
  }

  selectedBrand.value = null
  orderBy.value = DEFAULT_ORDER
  page.value = 1

  await searchNow()
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

function isNearBottom(buffer = 850) {
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

function updateActiveSection() {
  const candidates = [
    { key: 'promos', el: promotionsSectionEl.value },
    { key: 'brands', el: brandsSectionEl.value },
    { key: 'results', el: resultsSectionEl.value }
  ].filter(item => item.el)

  if (!candidates.length) {
    activeSection.value = 'results'
    return
  }

  const headerHeight = stickyHeaderEl.value?.offsetHeight || 90
  let current = candidates[0].key

  for (const item of candidates) {
    const rect = item.el.getBoundingClientRect()

    if (rect.top <= headerHeight + 80) {
      current = item.key
    }
  }

  activeSection.value = current
}

function updateStickyState() {
  updateStickySearchVisibility()
  updateActiveSection()
}

function onScroll() {
  if (scrollTicking) return

  scrollTicking = true

  requestAnimationFrame(async () => {
    scrollTicking = false

    updateStickyState()

    if (isNearBottom()) {
      await loadNextPageIfPossible()
    }
  })
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

function scrollToSection(key) {
  const map = {
    promos: promotionsSectionEl.value,
    brands: brandsSectionEl.value,
    results: resultsSectionEl.value
  }

  const el = map[key]
  if (!el) return

  const headerHeight = stickyHeaderEl.value?.offsetHeight || 90
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 18

  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

function confirmAddToCart(product) {
  const name = product?.descricao || 'Produto'

  $q.dialog({
    title: '🛒 Adicionar ao carrinho',
    message: `Adicionar "${name}" ao carrinho?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Adicionar', color: 'green-14' },
    cancel: { label: 'Cancelar', color: 'grey-7' }
  }).onOk(() => {
    cart.addItem(product, 1)

    if (cart.state) {
      cart.state.drawerOpen = true
    }

    $q.notify({
      type: 'positive',
      message: 'Adicionado ao carrinho!'
    })
  })
}

function openDetails(product) {
  sessionStorage.setItem('catalog:lastUrl', `${location.pathname}${location.search}`)

  const slugify = (value = '') =>
    String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

  const id = product.id ?? product.codProduto ?? ''
  const desc = product.descricao || ''
  const brand = product.marca || ''
  const sku = product.codOriginal ?? null

  const prod = {
    id,
    CODPRODUTO: id,
    descricao: desc,
    marca: brand,
    sku,
    codOriginal: sku,
    preco: product.preco,
    precoPromocao: product.precoPromocao,
    precoEfetivo: product.precoEfetivo,
    isPromotion: product.isPromotion,
    ISPROMOTION: product.isPromotion ? 1 : 0,
    imagemUrl: product.imagemUrl || resolveImage(product),
    IMGS_PATH: Array.isArray(product.imgsPath) ? product.imgsPath : [],
    IMGS: Array.isArray(product.imgs) ? product.imgs : null,
    updatedAt: product.dataAtualizacao ?? null,
    raw: product.raw ?? product
  }

  const slug = `${slugify(`${desc} ${brand}`)}-${id}`

  sessionStorage.setItem(`prod:${id}`, JSON.stringify(prod))

  router.push({
    path: `/catalogo/produto/${slug}`,
    state: { product: prod }
  })
}

watch(
  () => route.query,
  async () => {
    if (routeWatchLocked) return

    readFromURL()
    await searchNow()
  },
  { deep: true }
)

onMounted(async () => {
  readFromURL()

  await nextTick()
  bindScrollListener()

  await searchNow()
  await nextTick()
  updateStickyState()
})

onBeforeUnmount(() => {
  unbindScrollListener()
})
</script>

<style scoped>
.catalog-page {
  --en-yellow: #F7D102;
  --en-blue: #021E58;
  --en-blue-dark: #03122E;
  --en-white: #ffffff;
  --en-muted: rgba(255, 255, 255, 0.72);

  min-height: 100vh;
  padding: 0 18px 88px;
  color: var(--en-white);
  background:
    radial-gradient(circle at top left, rgba(247, 209, 2, 0.16), transparent 34%),
    radial-gradient(circle at 80% 18%, rgba(247, 209, 2, 0.09), transparent 24%),
    linear-gradient(135deg, var(--en-blue) 0%, var(--en-blue-dark) 100%);
}

.catalog-shell {
  width: min(100%, 1540px);
  margin: 0 auto;
}

.catalog-sticky-header {
  position: sticky;
  top: 62px;
  z-index: 40;
  width: min(100%, 1540px);
  margin: 0 auto 18px;
  padding: 14px 16px;
  border: 1px solid rgba(247, 209, 2, 0.24);
  border-top: 0;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  background:
    linear-gradient(135deg, rgba(2, 30, 88, 0.94) 0%, rgba(3, 18, 46, 0.98) 100%);
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);
}

.sticky-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sticky-title-wrap {
  min-width: 0;
}

.sticky-breadcrumbs {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.sticky-breadcrumbs :deep(.q-breadcrumbs__el),
.sticky-breadcrumbs :deep(.q-icon) {
  color: rgba(255, 255, 255, 0.72);
}

.sticky-title {
  color: var(--en-yellow);
  font-size: clamp(17px, 2vw, 24px);
  font-weight: 900;
  letter-spacing: -0.03em;
}

.sticky-subtitle {
  color: var(--en-muted);
  font-size: 12px;
}

.sticky-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
}

.sticky-search {
  width: min(720px, 38vw);
}

.sticky-filter-btn {
  color: var(--en-blue-dark);
  background: var(--en-yellow);
  font-weight: 900;
  border-radius: 999px;
  min-height: 40px;
  box-shadow: 0 10px 26px rgba(247, 209, 2, 0.22);
}

.sticky-section-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.section-tab {
  color: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.section-tab--active {
  color: var(--en-blue-dark);
  background: var(--en-yellow);
  border-color: var(--en-yellow);
  font-weight: 900;
}

.catalog-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  gap: 22px;
  align-items: stretch;
  padding: clamp(22px, 4vw, 46px);
  border-radius: 34px;
  border: 1px solid rgba(247, 209, 2, 0.18);
  background:
    linear-gradient(135deg, rgba(247, 209, 2, 0.97) 0%, rgba(247, 209, 2, 0.92) 36%, transparent 36%),
    radial-gradient(circle at top right, rgba(247, 209, 2, 0.22), transparent 34%),
    linear-gradient(135deg, rgba(2, 30, 88, 0.96) 0%, rgba(3, 18, 46, 0.98) 100%);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.hero-copy {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
}

.hero-kicker {
  display: inline-flex;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--en-yellow);
  background: rgba(3, 18, 46, 0.88);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
}

.hero-copy h1 {
  margin: 18px 0 12px;
  max-width: 820px;
  color: var(--en-white);
  font-size: clamp(36px, 5.4vw, 76px);
  line-height: 0.93;
  font-weight: 950;
  letter-spacing: -0.07em;
}

.hero-copy p {
  max-width: 630px;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(15px, 1.6vw, 19px);
  line-height: 1.5;
}

.hero-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.hero-metrics div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  color: var(--en-white);
  background: rgba(3, 18, 46, 0.72);
  border: 1px solid rgba(247, 209, 2, 0.18);
  font-weight: 800;
}

.hero-metrics .q-icon {
  color: var(--en-yellow);
  font-size: 20px;
}

.hero-search-card {
  position: relative;
  z-index: 2;
  display: flex;
  align-self: center;
  flex-direction: column;
  gap: 14px;
  padding: clamp(18px, 2.3vw, 28px);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  color: var(--en-blue-dark);
  box-shadow: 0 22px 58px rgba(0, 0, 0, 0.22);
}

.hero-search-title {
  color: var(--en-blue-dark);
  font-size: 22px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.quick-filter-row,
.active-filters-row,
.modal-brand-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.active-filters-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 18px;
  padding: 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(247, 209, 2, 0.14);
}

.active-filters-title {
  color: var(--en-yellow);
  font-weight: 900;
  white-space: nowrap;
}

.catalog-section {
  margin-top: 30px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
}

.section-kicker {
  color: var(--en-yellow);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-kicker--promo {
  color: #ffdd3b;
}

.section-heading h2 {
  margin: 4px 0 6px;
  color: var(--en-white);
  font-size: clamp(26px, 3vw, 44px);
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.05em;
}

.section-heading p {
  margin: 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.5;
}

.promo-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 285px);
  gap: 14px;
  overflow-x: auto;
  padding: 2px 2px 12px;
  scroll-snap-type: x proximity;
}

.promo-rail .catalog-product-card {
  scroll-snap-align: start;
}

.brand-topics {
  display: grid;
  gap: 18px;
}

.brand-topic-card {
  padding: 16px;
  border-radius: 28px;
  border: 1px solid rgba(247, 209, 2, 0.18);
  background:
    radial-gradient(circle at top right, rgba(247, 209, 2, 0.1), transparent 35%),
    rgba(255, 255, 255, 0.06);
}

.brand-topic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.brand-topic-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-topic-title-wrap h3 {
  margin: 0;
  color: var(--en-white);
  font-size: clamp(19px, 2vw, 26px);
  font-weight: 950;
  letter-spacing: -0.04em;
}

.brand-topic-meta {
  color: rgba(255, 255, 255, 0.66);
  font-size: 13px;
}

.brand-products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(170px, 1fr));
  gap: 14px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(178px, 1fr));
  gap: 15px;
}

.catalog-product-card {
  overflow: hidden;
  border-radius: 22px;
  border-color: rgba(247, 209, 2, 0.22);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.94) 100%);
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.catalog-product-card:hover {
  transform: translateY(-4px);
  border-color: var(--en-yellow);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.22);
}

.catalog-product-card--promo {
  border-color: rgba(255, 70, 70, 0.46);
}

.catalog-product-card--compact .product-img,
.catalog-product-card--compact .product-image-wrap {
  min-height: 168px;
  height: 168px;
}

.product-image-wrap {
  position: relative;
  height: 198px;
  min-height: 198px;
  background:
    radial-gradient(circle at center, rgba(247, 209, 2, 0.08), transparent 52%),
    #ffffff;
}

.product-img {
  height: 198px;
  background: #ffffff;
}

.product-img :deep(img),
.product-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}

.promo-badge {
  position: absolute;
  left: 10px;
  bottom: 44px;
  z-index: 3;
  font-weight: 900;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}

.brand-badge {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 3;
  max-width: calc(100% - 70px);
  color: var(--en-blue-dark);
  background: var(--en-yellow);
  font-weight: 950;
  border-radius: 999px;
}

.price-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  padding: 8px 10px;
  border-radius: 14px;
  color: #ffffff;
  background: rgba(3, 18, 46, 0.94);
  font-size: 13px;
  font-weight: 950;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.16);
}

.price-tag--promo {
  background: rgba(0, 145, 76, 0.96);
}

.old-price {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: line-through;
  font-size: 11px;
  line-height: 1;
}

.promo-price {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.15;
}

.cart-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 4;
}

.product-info {
  min-height: 104px;
  background:
    linear-gradient(135deg, rgba(2, 30, 88, 0.98) 0%, rgba(3, 18, 46, 0.98) 100%);
  color: #ffffff;
}

.product-title {
  min-height: 54px;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 800;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  color: rgba(247, 209, 2, 0.92);
  font-size: 12px;
  font-weight: 800;
}

.card-skeleton {
  min-height: 302px;
  border-radius: 22px;
}

.empty-card {
  padding: 36px 20px;
  border-radius: 28px;
  text-align: center;
  background: rgba(255, 255, 255, 0.96);
  color: var(--en-blue-dark);
}

.pagination-feedback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 86px;
  padding: 24px 0 8px;
}

.last-page-alert {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(247, 209, 2, 0.16);
  font-weight: 800;
}

.filters-modal-card {
  width: min(94vw, 660px);
  border-radius: 24px;
  overflow: hidden;
}

.filters-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--en-blue-dark);
  background: var(--en-yellow);
}

.ellipsis-3-lines {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
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

@media (max-width: 1450px) {
  .catalog-grid {
    grid-template-columns: repeat(4, minmax(178px, 1fr));
  }

  .brand-products-grid {
    grid-template-columns: repeat(4, minmax(155px, 1fr));
  }
}

@media (max-width: 1180px) {
  .catalog-hero {
    grid-template-columns: 1fr;
  }

  .sticky-search {
    width: min(540px, 42vw);
  }

  .catalog-grid {
    grid-template-columns: repeat(3, minmax(170px, 1fr));
  }

  .brand-products-grid {
    grid-template-columns: repeat(3, minmax(155px, 1fr));
  }
}

@media (max-width: 860px) {
  .catalog-page {
    padding: 0 12px 86px;
  }

  .catalog-sticky-header {
    padding: 12px;
  }

  .sticky-main-row {
    align-items: flex-start;
  }

  .sticky-breadcrumbs,
  .sticky-subtitle {
    display: none;
  }

  .sticky-title {
    font-size: 17px;
  }

  .sticky-search {
    width: min(720px, 54vw);
  }

  .catalog-hero {
    padding: 20px;
    border-radius: 26px;
    background:
      radial-gradient(circle at top right, rgba(247, 209, 2, 0.18), transparent 40%),
      linear-gradient(135deg, rgba(2, 30, 88, 0.98) 0%, rgba(3, 18, 46, 0.99) 100%);
  }

  .hero-copy {
    min-height: 0;
  }

  .hero-copy h1 {
    font-size: clamp(34px, 10vw, 56px);
  }

  .active-filters-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand-topic-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .catalog-grid,
  .brand-products-grid {
    grid-template-columns: repeat(2, minmax(145px, 1fr));
    gap: 12px;
  }

  .product-image-wrap,
  .product-img {
    height: 170px;
    min-height: 170px;
  }

  .product-info {
    min-height: 112px;
  }

  .promo-rail {
    grid-auto-columns: minmax(210px, 72vw);
  }
}

@media (max-width: 460px) {
  .sticky-actions {
    gap: 6px;
  }

  .sticky-search {
    width: 100%;
  }

  .section-tab {
    font-size: 12px;
  }

  .hero-actions .q-btn {
    width: 100%;
  }

  .catalog-grid,
  .brand-products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-product-card {
    border-radius: 18px;
  }

  .product-title {
    font-size: 12px;
  }
}
</style>
