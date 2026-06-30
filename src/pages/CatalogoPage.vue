<template>
  <q-page ref="pageEl" class="catalog-page" :class="{ 'catalog-page--mobile': isMobile }">
    <q-inner-loading :showing="loading && items.length === 0">
      <q-spinner-gears size="42px" color="primary" />
      <div class="q-mt-sm text-white">Carregando...</div>
    </q-inner-loading>

    <div ref="stickyHeaderEl" class="catalog-sticky-header">
      <div v-if="showStickySearch || isMobile" class="sticky-main-row">
        <div class="sticky-actions">
          <transition name="fade-slide">
            <q-input v-model="filters.descricaoProduto" dense outlined clearable bg-color="white" color="secondary"
              placeholder="Buscar produto..." class="sticky-search" @keyup.enter="searchNow" @clear="clearSearchOnly">
              <template #prepend>
                <q-icon name="search" color="secondary" />
              </template>

              <template #append>
                <q-btn flat dense round icon="qr_code_scanner" color="secondary" @click="openBarcodeScanner">
                  <q-tooltip>Ler código de barras</q-tooltip>
                </q-btn>

                <q-btn flat dense round icon="arrow_forward" color="secondary" @click="searchNow" />
              </template>
            </q-input>
          </transition>

          <q-btn unelevated class="sticky-filter-btn text-secondary" icon="tune" :label="isMobile ? '' : 'Filtros'"
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

    <main class="catalog-shell">
      <section ref="mainSearchEl" class="catalog-hero" v-if="!isMobile">
        <div class="hero-copy">
          <h1>Catálogo</h1>
        </div>

        <div class="hero-search-card">
          <q-input v-model="filters.descricaoProduto" outlined clearable bg-color="white" color="secondary"
            placeholder="Buscar produto..." debounce="350" @keyup.enter="searchNow" @clear="clearSearchOnly">
            <template #prepend>
              <q-icon name="search" color="secondary" />
            </template>

            <template #append>
              <q-btn flat round dense color="secondary" icon="qr_code_scanner" @click="openBarcodeScanner">
                <q-tooltip>Ler código de barras</q-tooltip>
              </q-btn>

              <q-btn unelevated color="secondary" text-color="white" icon="search" @click="searchNow" />
            </template>
          </q-input>
          <!-- 
          <div class="quick-filter-row">
            <q-chip
              clickable
              dense
              :color="filters.isPromotion ? 'negative' : 'white'"
              :text-color="filters.isPromotion ? 'white' : 'secondary'"
              icon="local_offer"
              @click="togglePromotionQuickFilter"
            >
              Promoção
            </q-chip>

            <q-chip
              v-for="brand in quickBrandChips"
              :key="brand.value"
              clickable
              dense
              color="white"
              text-color="secondary"
              @click="applyBrandFilter(brand)"
            >
              {{ brand.label }}
            </q-chip>
          </div> -->

          <div class="hero-actions">
            <q-btn unelevated color="secondary" text-color="white" icon="tune" label="Filtros"
              @click="openFiltersModal" />
            <q-btn flat color="secondary" icon="restart_alt" label="Limpar" @click="resetAllFilters" />
          </div>
        </div>
      </section>

      <section v-if="hasAnyFilter" class="active-filters-card">
        <div class="active-filters-row">
          <q-chip v-if="(filters.descricaoProduto || '').trim()" removable color="white" text-color="secondary"
            icon="search" @remove="clearSearchOnly">
            {{ filters.descricaoProduto }}
          </q-chip>

          <q-chip v-if="(filters.codBarras || '').trim()" removable color="white" text-color="secondary"
            icon="qr_code_scanner" @remove="removeCodBarrasOnly">
            Código: {{ filters.codBarras }}
          </q-chip>

          <q-chip v-if="currentBrandName" removable color="white" text-color="secondary" icon="sell"
            @remove="clearBrandAndSearch">
            {{ currentBrandName }}
          </q-chip>

          <q-chip v-if="filters.isPromotion" removable color="negative" text-color="white" icon="local_offer"
            @remove="removePromotionOnly">
            Promoção
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

      <section v-if="brandTopics.length" ref="brandsSectionEl" class="catalog-section">
        <!-- <div class="section-heading">
          <div class="row no-wrap">
            <q-chip dense color="primary" text-color="secondary" icon="sell">
              {{ brandTopics.length }} Marcas
            </q-chip>
          </div>


        </div> -->

        <div class="brand-topics">
          <article v-for="topic in brandTopics" :key="topic.key" class="brand-topic-card">
            <header class="brand-topic-header">
              <div class="brand-topic-title-wrap">
                <q-avatar color="primary" text-color="secondary" size="38px" font-size="18px">
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

              <q-btn flat rounded dense color="primary" icon-right="arrow_forward" label="Ver"
                @click="applyBrandFilter({ label: topic.label, value: topic.key, marca: topic.label })" />
            </header>

            <div class="brand-products-grid">
              <q-card v-for="p in topic.products" :key="`brand-${topic.key}-${productKey(p)}`" flat bordered
                class="catalog-product-card catalog-product-card--compact" @click="openDetails(p)">
                <div class="product-image-wrap" :class="{ 'product-image-wrap--out-stock': isOutOfStock(p) }">
                  <div v-if="isOutOfStock(p)" class="stock-watermark">Sem estoque</div>

                  <q-badge v-if="isOutOfStock(p)" class="stock-badge" color="grey-10" text-color="white" icon="block">
                    Sem estoque
                  </q-badge>

                  <q-img :src="resolveImage(p)" :alt="p.descricao" fit="contain" class="product-img"
                    spinner-color="secondary">
                    <template #error>
                      <div class="absolute-full flex flex-center bg-white">
                        <q-icon name="image_not_supported" size="36px" color="grey-5" />
                      </div>
                    </template>
                  </q-img>

                  <q-badge v-if="hasPromotion(p)" class="promo-badge" color="negative" text-color="white">
                    Oferta
                  </q-badge>

                  <q-btn round dense glossy :color="isOutOfStock(p) ? 'grey-6' : 'green-14'" icon="add_shopping_cart"
                    class="cart-btn" :disable="isOutOfStock(p)" @click.stop="confirmAddToCart(p)">
                    <q-tooltip>{{ isOutOfStock(p) ? 'Produto sem estoque' : 'Adicionar ao carrinho' }}</q-tooltip>
                  </q-btn>
                </div>

                <q-card-section class="product-info">
                  <div class="product-title ellipsis-2-lines">{{ p.descricao }}</div>

                  <div class="product-footer">
                    <q-badge v-if="p.marca" class="product-brand">{{ p.marca }}</q-badge>

                    <div class="product-price" :class="{ 'product-price--promo': hasPromotion(p) }">
                      <template v-if="hasPromotion(p) && p.precoPromocao">
                        <span class="old-price">{{ money(p.preco) }}</span>
                        <strong>{{ money(p.precoPromocao) }}</strong>
                      </template>
                      <template v-else>
                        <strong>{{ money(p.precoEfetivo ?? p.preco) }}</strong>
                      </template>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </article>
        </div>
      </section>

      <section ref="resultsSectionEl" class="catalog-section catalog-results-section">
        <div class="section-heading">
          <div>
            <h2>Produtos</h2>
          </div>

          <q-chip dense color="primary" text-color="secondary" icon="inventory_2">
            {{ resultsCounterLabel }}
          </q-chip>
        </div>

        <div v-if="loading && items.length === 0" class="catalog-grid">
          <q-skeleton v-for="i in PAGE_LIMIT" :key="`sk-${i}`" type="rect" class="card-skeleton" />
        </div>

        <q-card v-else-if="!loading && items.length === 0" flat bordered class="empty-card">
          <q-icon name="inventory_2" size="48px" color="primary" />
          <div class="text-h6 text-weight-bold q-mt-md">Nenhum produto encontrado</div>

          <div class="row justify-center q-gutter-sm q-mt-md">
            <q-btn flat color="secondary" label="Limpar busca" @click="clearSearchOnly" />
            <q-btn unelevated color="secondary" label="Limpar tudo" @click="resetAllFilters" />
          </div>
        </q-card>

        <div v-else class="catalog-grid">
          <q-card v-for="p in items" :key="`result-${productKey(p)}`" flat bordered class="catalog-product-card"
            @click="openDetails(p)">
            <div class="product-image-wrap" :class="{ 'product-image-wrap--out-stock': isOutOfStock(p) }">
              <div v-if="isOutOfStock(p)" class="stock-watermark">Sem estoque</div>

              <q-badge v-if="isOutOfStock(p)" class="stock-badge" color="grey-10" text-color="white" icon="block">
                Sem estoque
              </q-badge>

              <q-img :src="resolveImage(p)" :alt="p.descricao" fit="contain" class="product-img"
                spinner-color="secondary">
                <template #error>
                  <div class="absolute-full flex flex-center bg-white">
                    <q-icon name="image_not_supported" size="38px" color="grey-5" />
                  </div>
                </template>
              </q-img>

              <q-badge v-if="hasPromotion(p)" class="promo-badge" color="negative" text-color="white"
                icon="local_offer">
                Promoção
              </q-badge>

              <q-btn round dense glossy :color="isOutOfStock(p) ? 'grey-6' : 'green-14'" icon="add_shopping_cart"
                class="cart-btn" :disable="isOutOfStock(p)" @click.stop="confirmAddToCart(p)">
                <q-tooltip>{{ isOutOfStock(p) ? 'Produto sem estoque' : 'Adicionar ao carrinho' }}</q-tooltip>
              </q-btn>
            </div>

            <q-card-section class="product-info">
              <div class="product-title ellipsis-2-lines">{{ p.descricao }}</div>

              <div class="product-footer">
                <q-badge v-if="p.marca" class="product-brand">{{ p.marca }}</q-badge>

                <div class="product-price" :class="{ 'product-price--promo': hasPromotion(p) }">
                  <template v-if="hasPromotion(p) && p.precoPromocao">
                    <span class="old-price">{{ money(p.preco) }}</span>
                    <strong>{{ money(p.precoPromocao) }}</strong>
                  </template>
                  <template v-else>
                    <strong>{{ money(p.precoEfetivo ?? p.preco) }}</strong>
                  </template>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="pagination-feedback">
          <q-spinner-dots v-if="loadingMore" size="36px" color="primary" />

          <div v-else-if="!loading && isLastPage && items.length > 0" class="last-page-alert">
            <q-icon name="done_all" size="20px" />
            Fim da lista
          </div>

          <q-btn v-else-if="!loading && !isLastPage && items.length > 0" outline rounded color="primary"
            :loading="loadingMore" icon="expand_more" label="Carregar mais" @click="loadNextPageIfPossible" />
        </div>
      </section>
    </main>

    <transition name="bottom-promo">
      <aside v-if="bottomPromoProducts.length && !barcodeDialog" class="bottom-promo-bar">
        <div class="bottom-promo-shell">
          <div class="bottom-promo-label">
            <q-icon name="local_offer" />
            <span>Promoções</span>
          </div>

          <div class="bottom-promo-list">
            <div v-for="p in bottomPromoProducts" :key="`bottom-promo-${productKey(p)}`" class="bottom-promo-item"
              role="button" tabindex="0" @click="openDetails(p)" @keyup.enter="openDetails(p)">
              <q-img :src="resolveImage(p)" :alt="p.descricao" fit="contain" class="bottom-promo-img" />

              <div class="bottom-promo-info">
                <span>{{ p.descricao }}</span>
                <strong>{{ money(getFinalPrice(p)) }}</strong>
              </div>

              <q-btn flat dense round color="green-14" icon="add_shopping_cart" :disable="isOutOfStock(p)"
                @click.stop="confirmAddToCart(p)" />
            </div>
          </div>
        </div>
      </aside>
    </transition>

    <q-dialog v-model="filtersDialog" :position="isMobile ? 'bottom' : 'standard'">
      <q-card class="filters-modal-card">
        <q-card-section class="filters-modal-header">
          <div class="text-h6 text-weight-bold">Filtros</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-select v-model="modalOrderBy" :options="orderOptions" emit-value map-options outlined dense
            color="secondary" label="Ordenar" >
            <template #prepend>
              <q-icon name="sort" color="secondary" />
            </template>
          </q-select>

          <q-toggle v-model="modalFilters.isPromotion" color="negative" checked-icon="local_offer" unchecked-icon="sell"
            label="Somente promoção" />

          <q-input v-model="modalFilters.codBarras" outlined dense clearable color="secondary" label="Código de barras"
            inputmode="numeric">
            <template #prepend>
              <q-icon name="qr_code_scanner" color="secondary" />
            </template>

            <template #append>
              <q-btn flat dense round icon="photo_camera" color="secondary" @click="openBarcodeScanner">
                <q-tooltip>Ler com a câmera</q-tooltip>
              </q-btn>
            </template>
          </q-input>

          <q-select v-model="modalSelectedBrand" :options="modalBrandOptions" option-label="label" option-value="value"
            use-input fill-input hide-selected input-debounce="350" outlined dense clearable color="secondary"
            label="Marca" :loading="modalBrandLoading" behavior="menu" @filter="onModalBrandFilter"
            @clear="clearModalBrand" @update:model-value="onModalBrandChanged">
            <template #prepend>
              <q-icon name="sell" color="secondary" />
            </template>

            <template #no-option>
              <q-item>
                <q-item-section class="text-grey-7">Digite pelo menos 2 letras.</q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input v-model="modalFilters.precoMin" outlined dense color="secondary" label="Preço mínimo"
                inputmode="decimal">
                <template #prepend>
                  <q-icon name="payments" color="secondary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <q-input v-model="modalFilters.precoMax" outlined dense color="secondary" label="Preço máximo"
                inputmode="decimal">
                <template #prepend>
                  <q-icon name="attach_money" color="secondary" />
                </template>
              </q-input>
            </div>
          </div> -->
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

    <q-dialog v-model="barcodeDialog" persistent :maximized="isMobile" @hide="stopBarcodeScanner">
      <q-card class="barcode-modal-card">
        <q-card-section class="barcode-modal-header">
          <div>
            <div class="text-h6 text-weight-bold">Leitor de código</div>
            <div class="text-caption">Use a câmera ou digite o código.</div>
          </div>

          <q-btn flat round dense icon="close" @click="closeBarcodeScanner" />
        </q-card-section>

        <q-separator />

        <q-card-section class="barcode-modal-body">
          <div class="barcode-action-row">
            <q-btn unelevated color="secondary" text-color="white" icon="photo_camera" label="Iniciar câmera"
              :loading="barcodeCameraLoading" @click="startBarcodeScanner" />
            <q-btn outline color="secondary" icon="edit" label="Digitar" @click="focusManualBarcodeInput" />
          </div>

          <div class="barcode-video-wrap q-mt-md">
            <video ref="barcodeVideoRef" class="barcode-video" autoplay muted playsinline />

            <div class="barcode-frame">
              <div class="barcode-frame-line" />
            </div>

            <div v-if="!barcodeScanning && !barcodeCameraLoading" class="barcode-start-overlay">
              <q-icon name="qr_code_scanner" size="44px" color="primary" />
              <div class="text-weight-bold q-mt-sm">Inicie a câmera</div>
            </div>

            <div v-if="barcodeCameraLoading || barcodeScanning" class="barcode-status">
              <q-spinner-dots color="primary" size="28px" />
              {{ barcodeCameraLoading ? 'Abrindo...' : 'Procurando...' }}
            </div>
          </div>

          <q-banner v-if="barcodeScanError" rounded class="q-mt-md bg-red-1 text-negative">
            <template #avatar>
              <q-icon name="warning" color="negative" />
            </template>

            {{ barcodeScanError }}
          </q-banner>

          <q-input ref="manualBarcodeInputRef" v-model="manualBarcode" class="q-mt-md manual-barcode-input" outlined
            dense clearable color="secondary" label="Código" inputmode="numeric" @keyup.enter="applyManualBarcode">
            <template #prepend>
              <q-icon name="keyboard" color="secondary" />
            </template>

            <template #append>
              <q-btn flat dense round icon="search" color="secondary" @click="applyManualBarcode" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-actions class="barcode-modal-actions">
          <q-btn flat color="grey-7" label="Cancelar" @click="closeBarcodeScanner" />
          <q-btn unelevated color="secondary" icon="search" label="Buscar" @click="applyManualBarcode" />
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
import { BrowserMultiFormatReader } from '@zxing/browser'

const PAGE_LIMIT = 45
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

const barcodeDialog = ref(false)
const barcodeVideoRef = ref(null)
const manualBarcodeInputRef = ref(null)
const barcodeScanning = ref(false)
const barcodeCameraLoading = ref(false)
const barcodeScanError = ref('')
const manualBarcode = ref('')

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
  codBarras: '',
  precoMin: null,
  precoMax: null,
  isPromotion: false,
  estoque: null
})

const selectedBrand = ref(null)
const filtersDialog = ref(false)
const modalFilters = ref({
  precoMin: null,
  precoMax: null,
  descricaoMarca: null,
  codBarras: '',
  isPromotion: false,
  estoque: null
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
    String(filters.value.codBarras || '').trim() ||
    currentBrandName.value ||
    filters.value.isPromotion ||
    filters.value.precoMin !== null ||
    filters.value.precoMax !== null ||
    orderBy.value !== DEFAULT_ORDER
  )
})

const activeExtraFiltersCount = computed(() => {
  let count = 0

  if (String(filters.value.codBarras || '').trim()) count++
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

const bottomPromoProducts = computed(() => {
  return showcaseProducts.value.slice(0, isMobile.value ? 4 : 6)
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

  if (brandTopics.value.length) {
    sections.push({ key: 'brands', label: 'Marcas', icon: 'sell' })
  }

  sections.push({ key: 'results', label: 'Produtos', icon: 'inventory_2' })

  return sections
})

let reqSeq = 0
let promoReqSeq = 0
let brandReqSeq = 0
let scrollTarget = null
let scrollTicking = false
let resizeHandler = null
let routeWatchLocked = false
let barcodeReader = null
let barcodeControls = null
let barcodeApplying = false

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

function normalizeInteger(value) {
  if (value === null || value === undefined || value === '') return null

  const n = Number(String(value).replace(/[^\d-]/g, ''))

  return Number.isFinite(n) ? Math.trunc(n) : null
}

function normalizeBarcode(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
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

function getStockValue(product) {
  return normalizeInteger(
    product?.estoque ??
    product?.ESTOQUE ??
    product?.qtdEstoque ??
    product?.QTDESTOQUE ??
    product?.saldo ??
    product?.SALDO ??
    product?.quantidadeEstoque
  )
}

function hasStockValue(product) {
  return getStockValue(product) !== null
}

function isOutOfStock(product) {
  const stock = getStockValue(product)

  return stock !== null && stock <= 0
}

function getStockLabel(product) {
  const stock = getStockValue(product)

  if (stock === null) return 'Estoque não informado'
  if (stock <= 0) return 'Sem estoque'
  if (stock === 1) return '1 em estoque'

  return `${stock} em estoque`
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
      codBarras: p.CODBARRAS ?? p.codBarras ?? p.COD_BARRAS ?? p.codigoBarras ?? p.BARRAS ?? null,
      marca: p.MARCA ?? p.marca ?? '',
      preco: preco !== null && preco !== undefined ? Number(preco) : null,
      precoPromocao: promo !== null && promo !== undefined ? Number(promo) : null,
      precoEfetivo: efetivo !== null && efetivo !== undefined ? Number(efetivo) : null,
      estoque: normalizeInteger(p.ESTOQUE ?? p.estoque ?? p.QTDESTOQUE ?? p.qtdEstoque ?? p.SALDO ?? p.saldo ?? p.quantidadeEstoque),
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
  const codBarras = normalizeBarcode(q.codBarras || q.cb || '')

  limit.value = PAGE_LIMIT
  page.value = 1

  if (codBarras) {
    clearFiltersForBarcode(codBarras)
    return
  }

  filters.value.descricaoProduto = String(q.q || '')
  filters.value.codBarras = ''
  filters.value.precoMin = normalizeNumber(q.min)
  filters.value.precoMax = normalizeNumber(q.max)
  filters.value.isPromotion = normalizeBoolean(q.isPromotion)
  orderBy.value = normalizeOrderValue(q.orderBy)

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

  const codBarras = normalizeBarcode(filters.value.codBarras || '')

  if (codBarras) {
    return {
      codBarras,
      limit: String(PAGE_LIMIT)
    }
  }

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

function clearFiltersForBarcode(codBarras = '') {
  filters.value = {
    descricaoProduto: '',
    descricaoMarca: null,
    codBarras: normalizeBarcode(codBarras),
    precoMin: null,
    precoMax: null,
    isPromotion: false,
    estoque: null
  }

  selectedBrand.value = null
  orderBy.value = DEFAULT_ORDER
  page.value = 1
  limit.value = PAGE_LIMIT
}

function getBarcodeOnlyParams(codBarras, { append = false, customLimit = PAGE_LIMIT } = {}) {
  return {
    limit: Number(customLimit || PAGE_LIMIT),
    offset: append ? Number(offset.value) : 0,
    codBarras: normalizeBarcode(codBarras)
  }
}

function findBestBarcodeMatch(products = [], codBarras = '') {
  const normalized = normalizeBarcode(codBarras)

  if (!normalized) return products[0] || null

  return products.find(product => normalizeBarcode(product?.codBarras || product?.raw?.CODBARRAS || '') === normalized) ||
    products[0] ||
    null
}

function buildSearchParams({ append = false, forcePromotion = null, customLimit = PAGE_LIMIT } = {}) {
  let precoMin = normalizeNumber(filters.value.precoMin)
  let precoMax = normalizeNumber(filters.value.precoMax)
  const codBarras = normalizeBarcode(filters.value.codBarras || '')

  if (codBarras) {
    return getBarcodeOnlyParams(codBarras, { append, customLimit })
  }

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
    orderBy: normalizeOrderValue(orderBy.value),
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
  if (normalizeBarcode(filters.value.codBarras || '')) {
    promotionItems.value = []
    loadingPromos.value = false
    return
  }

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

    if (mySeq !== reqSeq) return false

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

    return true
  } catch (err) {
    if (mySeq !== reqSeq) return false

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

    return false
  } finally {
    if (mySeq !== reqSeq) return

    loading.value = false
    loadingMore.value = false

    await nextTick()
    updateStickyState()
  }
}

async function searchNow() {
  const codBarras = normalizeBarcode(filters.value.codBarras || '')

  page.value = 1
  limit.value = PAGE_LIMIT
  items.value = []
  total.value = 0
  apiIsLastPage.value = false

  if (codBarras) {
    return searchBarcodeAndOpen(codBarras)
  }

  await Promise.all([
    fetchProducts({ append: false, updateURL: true }),
    fetchPromotions()
  ])

  await nextTick()
  updateStickyState()
  await ensureViewportFilled()

  return true
}

async function searchBarcodeAndOpen(codBarras) {
  const normalized = normalizeBarcode(codBarras)

  if (!normalized) {
    $q.notify({
      type: 'warning',
      message: 'Código inválido.'
    })

    return false
  }

  clearFiltersForBarcode(normalized)
  promotionItems.value = []

  const ok = await fetchProducts({ append: false, updateURL: true })

  if (!ok) return false

  const product = findBestBarcodeMatch(items.value, normalized)

  if (!product) {
    $q.notify({
      type: 'warning',
      message: `Nenhum produto encontrado para o código ${normalized}.`
    })

    await nextTick()
    updateStickyState()

    return false
  }

  $q.notify({
    type: 'positive',
    message: 'Produto encontrado. Abrindo detalhes...'
  })

  await nextTick()
  openDetails(product)

  return true
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
    codBarras: filters.value.codBarras,
    isPromotion: Boolean(filters.value.isPromotion),
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
    codBarras: '',
    isPromotion: false,
    estoque: null
  }

  modalOrderBy.value = DEFAULT_ORDER
  modalSelectedBrand.value = null
  modalBrandInput.value = ''
  modalBrandOptions.value = [...modalSuggestedBrands.value]
}

async function applyModalFilters() {
  const codBarras = normalizeBarcode(modalFilters.value.codBarras || '')

  if (codBarras) {
    filtersDialog.value = false
    await applyBarcodeValue(codBarras)
    return
  }

  filters.value.precoMin = normalizeNumber(modalFilters.value.precoMin)
  filters.value.precoMax = normalizeNumber(modalFilters.value.precoMax)
  filters.value.codBarras = ''
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

async function removeCodBarrasOnly() {
  filters.value.codBarras = ''
  await searchNow()
}

async function removeEstoqueOnly() {
  filters.value.estoque = null
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
    codBarras: '',
    precoMin: null,
    precoMax: null,
    isPromotion: false,
    estoque: null
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

function getStickyTopOffset() {
  const stickyEl = stickyHeaderEl.value

  if (stickyEl) {
    const computedTop = window.getComputedStyle(stickyEl).top
    const parsedTop = Number.parseFloat(computedTop)

    if (Number.isFinite(parsedTop)) return parsedTop
  }

  const pageRoot = pageEl.value?.$el || pageEl.value || document.documentElement
  const raw = window.getComputedStyle(pageRoot).getPropertyValue('--catalog-layout-header-height')
  const parsed = Number.parseFloat(raw)

  return Number.isFinite(parsed) ? parsed : 0
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

  const stickyOffset = getStickyTopOffset()
  const stickyHeight = stickyHeaderEl.value?.offsetHeight || 90
  const activationLine = stickyOffset + stickyHeight + 64
  let current = candidates[0].key

  for (const item of candidates) {
    const rect = item.el.getBoundingClientRect()

    if (rect.top <= activationLine) {
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

  const stickyOffset = getStickyTopOffset()
  const stickyHeight = stickyHeaderEl.value?.offsetHeight || 90
  const safeGap = stickyOffset + stickyHeight + 18

  if (scrollTarget && scrollTarget !== window) {
    const containerRect = scrollTarget.getBoundingClientRect()
    const top = scrollTarget.scrollTop + el.getBoundingClientRect().top - containerRect.top - safeGap

    scrollTarget.scrollTo({
      top,
      behavior: 'smooth'
    })

    return
  }

  const top = el.getBoundingClientRect().top + window.scrollY - safeGap

  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

function getBarcodeCameraErrorMessage(err) {
  const name = String(err?.name || '')

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Permissão da câmera negada. Libere a câmera no navegador ou insira o código manualmente.'
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Nenhuma câmera foi encontrada neste dispositivo. Insira o código manualmente.'
  }

  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'A câmera está em uso por outro aplicativo. Feche outros apps ou insira o código manualmente.'
  }

  if (
    location.protocol !== 'https:' &&
    location.hostname !== 'localhost' &&
    location.hostname !== '127.0.0.1'
  ) {
    return 'A câmera exige HTTPS ou localhost. Acesse por HTTPS ou insira o código manualmente.'
  }

  return 'Não foi possível iniciar a leitura pela câmera. Insira o código manualmente ou tente novamente.'
}

function stopBarcodeScanner() {
  barcodeScanning.value = false
  barcodeCameraLoading.value = false

  try {
    if (barcodeControls) {
      barcodeControls.stop()
      barcodeControls = null
    }
  } catch (err) {
    console.warn('[Catalogo] erro ao parar controles do scanner:', err)
  }

  try {
    if (barcodeReader?.reset) {
      barcodeReader.reset()
    }
  } catch (err) {
    console.warn('[Catalogo] erro ao resetar scanner:', err)
  }

  if (barcodeVideoRef.value) {
    barcodeVideoRef.value.pause?.()
    barcodeVideoRef.value.srcObject = null
  }

  barcodeReader = null
  barcodeApplying = false
}

function closeBarcodeScanner() {
  stopBarcodeScanner()
  barcodeDialog.value = false
}

async function openBarcodeScanner() {
  barcodeScanError.value = ''
  manualBarcode.value = normalizeBarcode(filters.value.codBarras || modalFilters.value.codBarras || '')
  barcodeDialog.value = true

  await nextTick()
}

function focusManualBarcodeInput() {
  manualBarcodeInputRef.value?.focus?.()
}

async function startBarcodeScanner() {
  stopBarcodeScanner()

  barcodeScanError.value = ''
  barcodeCameraLoading.value = true
  barcodeApplying = false

  try {
    await nextTick()

    if (!barcodeVideoRef.value) {
      throw new Error('VIDEO_ELEMENT_NOT_FOUND')
    }

    barcodeReader = new BrowserMultiFormatReader()

    barcodeControls = await barcodeReader.decodeFromConstraints(
      {
        video: {
          facingMode: {
            ideal: 'environment'
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: false
      },
      barcodeVideoRef.value,
      async (result) => {
        if (!result || barcodeApplying) return

        const rawText =
          result.getText?.() ||
          result.text ||
          result.rawValue ||
          ''

        const code = normalizeBarcode(rawText)

        if (!code) return

        barcodeApplying = true

        stopBarcodeScanner()
        const applied = await applyBarcodeValue(code)

        if (applied) {
          barcodeDialog.value = false
        } else {
          barcodeApplying = false
        }
      }
    )

    barcodeScanning.value = true
  } catch (err) {
    console.error('[Catalogo] erro ao iniciar ZXing scanner:', err)

    barcodeScanError.value = getBarcodeCameraErrorMessage(err)
    barcodeScanning.value = false
  } finally {
    barcodeCameraLoading.value = false
  }
}

async function applyBarcodeValue(value) {
  const codBarras = normalizeBarcode(value)

  if (!codBarras) {
    $q.notify({
      type: 'warning',
      message: 'Código inválido.'
    })

    return false
  }

  clearFiltersForBarcode(codBarras)
  modalFilters.value = {
    precoMin: null,
    precoMax: null,
    descricaoMarca: null,
    codBarras,
    isPromotion: false,
    estoque: null
  }
  modalSelectedBrand.value = null
  modalOrderBy.value = DEFAULT_ORDER

  return searchBarcodeAndOpen(codBarras)
}

async function applyManualBarcode() {
  const applied = await applyBarcodeValue(manualBarcode.value)

  if (applied) {
    closeBarcodeScanner()
  }
}

function confirmAddToCart(product) {
  const name = product?.descricao || 'Produto'

  if (isOutOfStock(product)) {
    $q.notify({
      type: 'warning',
      message: 'Produto sem estoque no momento.'
    })

    return
  }

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
    codBarras: product.codBarras ?? product.raw?.CODBARRAS ?? null,
    estoque: getStockValue(product),
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
  stopBarcodeScanner()
  unbindScrollListener()
})
</script>

<style scoped>
.catalog-page {
  --en-yellow: #f7d102;
  --en-blue: #01205f;
  --en-blue-dark: #03122f;
  --en-white: #ffffff;
  --catalog-layout-header-height: 132px;
  --catalog-sticky-top: calc(var(--catalog-layout-header-height) + env(safe-area-inset-top) + 12px);

  min-height: 100vh;
  padding: calc(var(--catalog-layout-header-height) + 14px) 16px calc(116px + env(safe-area-inset-bottom));
  color: var(--en-white);
  background:
    radial-gradient(circle at top right, rgba(0, 22, 95, 0.12), transparent 36%),
    linear-gradient(135deg, var(--en-blue-dark) 0%, var(--en-blue) 100%);
  font-family: Inter, Roboto, Arial, sans-serif;
}

.catalog-shell,
.catalog-sticky-header {
  width: min(100%, 1500px);
  margin-inline: auto;
}

.catalog-sticky-header {
  position: sticky;
  top: var(--catalog-sticky-top);
  z-index: 90;
  margin-bottom: 14px;
  padding: 10px;
  border: 1px solid rgba(247, 209, 2, 0.18);
  border-radius: 18px;
  background: rgba(3, 18, 47, 0.86);
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
}

.sticky-main-row,
.sticky-actions {
  width: 100%;
}

.sticky-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.sticky-search {
  flex: 0 1 640px;
  width: min(640px, 58vw);
  min-width: 280px;
}

.sticky-search :deep(.q-field__control) {
  min-height: 42px;
  border-radius: 14px;
}

.sticky-filter-btn {
  min-height: 42px;
  border-radius: 14px;
  background: var(--en-yellow);
  font-weight: 800;
  box-shadow: none;
}

.sticky-section-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.sticky-section-tabs::-webkit-scrollbar {
  display: none;
}

.section-tab {
  min-width: max-content;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 700;
}

.section-tab--active {
  color: var(--en-blue-dark);
  background: var(--en-yellow);
  border-color: var(--en-yellow);
}

.catalog-hero {
  display: grid;
  grid-template-columns: minmax(220px, 0.45fr) minmax(420px, 0.55fr);
  gap: 18px;
  align-items: center;
  padding: 24px;
  border: 1px solid rgba(247, 209, 2, 0.14);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
}

.hero-copy h1,
.section-heading h2,
.brand-topic-title-wrap h3 {
  margin: 0;
  letter-spacing: -0.045em;
  line-height: 1;
}

.hero-copy h1 {
  color: var(--en-white);
  font-size: clamp(42px, 5vw, 74px);
  font-weight: 950;
}

.hero-search-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 22px;
  color: var(--en-blue-dark);
  background: rgba(255, 255, 255, 0.96);
}

.hero-search-card :deep(.q-field__control) {
  border-radius: 16px;
}

.quick-filter-row,
.active-filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.quick-filter-row {
  max-height: 76px;
  overflow: hidden;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.active-filters-card {
  margin-top: 14px;
  padding: 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(247, 209, 2, 0.12);
}

.catalog-section {
  margin-top: 24px;
  scroll-margin-top: calc(var(--catalog-sticky-top) + 110px);
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-heading h2 {
  color: var(--en-white);
  font-size: clamp(24px, 2.7vw, 38px);
  font-weight: 950;
}

.brand-topics {
  display: grid;
  gap: 16px;
}

.brand-topic-card {
  padding: 14px;
  border-radius: 22px;
  border: 1px solid rgba(247, 209, 2, 0.14);
  background: rgba(255, 255, 255, 0.06);
}

.brand-topic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-topic-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.brand-topic-title-wrap h3 {
  color: var(--en-white);
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 900;
}

.brand-topic-meta {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: 600;
}

.catalog-grid,
.brand-products-grid {
  display: grid;
  gap: 14px;
}

.catalog-grid {
  grid-template-columns: repeat(5, minmax(178px, 1fr));
}

.brand-products-grid {
  grid-template-columns: repeat(4, minmax(160px, 1fr));
}

.catalog-product-card {
  overflow: hidden;
  border-radius: 18px;
  border-color: rgba(255, 255, 255, 0.12);
  background: #ffffff;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.catalog-product-card:hover {
  transform: translateY(-3px);
  border-color: var(--en-yellow);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
}

.product-image-wrap {
  position: relative;
  height: 188px;
  min-height: 188px;
  background: #ffffff;
}

.product-img {
  height: 188px;
  background: #ffffff;
}

.catalog-product-card--compact .product-image-wrap,
.catalog-product-card--compact .product-img {
  height: 158px;
  min-height: 158px;
}

.product-img :deep(img),
.product-img :deep(.q-img__image),
.bottom-promo-img :deep(img),
.bottom-promo-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}

.promo-badge,
.stock-badge {
  position: absolute;
  z-index: 5;
  border-radius: 999px;
  font-weight: 800;
}

.promo-badge {
  top: 9px;
  left: 9px;
}

.stock-badge {
  top: 9px;
  right: 9px;
}

.cart-btn {
  position: absolute;
  right: 9px;
  bottom: 9px;
  z-index: 5;
}

.stock-watermark {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(3, 18, 46, 0.16);
  font-size: clamp(26px, 4vw, 44px);
  font-weight: 950;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  transform: rotate(-18deg);
  pointer-events: none;
}

.product-image-wrap--out-stock .product-img {
  filter: grayscale(100%);
  opacity: 0.46;
}

.product-image-wrap--out-stock::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.34);
  pointer-events: none;
}

.product-info {
  min-height: 104px;
  padding: 12px;
  color: var(--en-blue-dark);
  background: #ffffff;
  border-top: 1px solid #eef1f6;
}

.product-title {
  min-height: 38px;
  color: var(--en-blue-dark);
  font-size: 13px;
  line-height: 1.28;
  font-weight: 800;
}

.product-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}

.product-brand {
  max-width: 50%;
  color: var(--en-blue-dark);
  background: rgb(255, 217, 0);
  font-weight: 850;
}

.product-price {
  margin-left: auto;
  text-align: right;
  color: var(--en-blue-dark);
  white-space: nowrap;
}

.product-price strong {
  display: block;
  font-size: 15px;
  line-height: 1;
  font-weight: 950;
}

.product-price--promo strong {
  color: #09924d;
}

.old-price {
  display: block;
  color: #7b8794;
  text-decoration: line-through;
  font-size: 11px;
  line-height: 1.1;
}

.card-skeleton {
  min-height: 292px;
  border-radius: 18px;
}

.empty-card {
  padding: 34px 18px;
  border-radius: 22px;
  text-align: center;
  color: var(--en-blue-dark);
  background: #ffffff;
}

.pagination-feedback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 78px;
  padding: 22px 0 6px;
}

.last-page-alert {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(247, 209, 2, 0.14);
  font-weight: 700;
}

.bottom-promo-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 120;
  padding: 8px 14px calc(8px + env(safe-area-inset-bottom));
  pointer-events: none;
}

.bottom-promo-shell {
  width: min(100%, 1500px);
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid rgba(247, 209, 2, 0.24);
  border-radius: 20px;
  background: rgba(3, 18, 47, 0.93);
  backdrop-filter: blur(18px);
  box-shadow: 0 -12px 36px rgba(0, 0, 0, 0.24);
  pointer-events: auto;
}

.bottom-promo-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 0 10px;
  color: var(--en-yellow);
  font-weight: 900;
  font-size: 13px;
}

.bottom-promo-list {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 1fr);
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.bottom-promo-list::-webkit-scrollbar {
  display: none;
}

.bottom-promo-item {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 34px;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 64px;
  padding: 6px;
  border-radius: 14px;
  color: var(--en-blue-dark);
  background: #ffffff;
  cursor: pointer;
}

.bottom-promo-img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #ffffff;
}

.bottom-promo-info {
  min-width: 0;
}

.bottom-promo-info span {
  display: block;
  overflow: hidden;
  color: var(--en-blue-dark);
  font-size: 11px;
  line-height: 1.15;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bottom-promo-info strong {
  display: block;
  margin-top: 3px;
  color: #09924d;
  font-size: 13px;
  line-height: 1;
  font-weight: 950;
}

.bottom-promo-enter-active,
.bottom-promo-leave-active,
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease;
}

.bottom-promo-enter-from,
.bottom-promo-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.filters-modal-card,
.barcode-modal-card {
  width: min(94vw, 620px);
  border-radius: 22px;
  overflow: hidden;
}

.filters-modal-header,
.barcode-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: var(--en-blue-dark);
  background: var(--en-yellow);
}

.barcode-modal-card {
  max-height: min(92vh, 760px);
  display: flex;
  flex-direction: column;
}

.barcode-modal-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding-bottom: 18px;
}

.barcode-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.barcode-action-row .q-btn {
  flex: 1 1 180px;
  min-width: 0;
}

.barcode-video-wrap {
  position: relative;
  min-height: 320px;
  overflow: hidden;
  border-radius: 18px;
  background: #03122e;
}

.barcode-video {
  width: 100%;
  height: 320px;
  display: block;
  object-fit: cover;
}

.barcode-frame {
  position: absolute;
  inset: 42px 28px;
  border: 2px solid rgba(247, 209, 2, 0.92);
  border-radius: 18px;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.32), 0 0 26px rgba(247, 209, 2, 0.28);
  pointer-events: none;
}

.barcode-frame-line {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 50%;
  height: 2px;
  background: var(--en-yellow);
  box-shadow: 0 0 14px rgba(247, 209, 2, 0.9);
  animation: barcode-scan-line 1.35s ease-in-out infinite;
}

@keyframes barcode-scan-line {

  0%,
  100% {
    transform: translateY(-105px);
  }

  50% {
    transform: translateY(105px);
  }
}

.barcode-start-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px;
  text-align: center;
  color: #ffffff;
  background: rgba(3, 18, 46, 0.76);
  backdrop-filter: blur(2px);
}

.barcode-status {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(3, 18, 46, 0.78);
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.barcode-modal-actions {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  background: #ffffff;
}

.ellipsis-2-lines {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 1450px) {
  .catalog-grid {
    grid-template-columns: repeat(4, minmax(178px, 1fr));
  }

  .brand-products-grid {
    grid-template-columns: repeat(4, minmax(150px, 1fr));
  }
}

@media (max-width: 1180px) {
  .catalog-page {
    --catalog-layout-header-height: 126px;
  }

  .catalog-hero {
    grid-template-columns: 1fr;
  }

  .catalog-grid {
    grid-template-columns: repeat(3, minmax(170px, 1fr));
  }

  .brand-products-grid {
    grid-template-columns: repeat(3, minmax(150px, 1fr));
  }
}

@media (max-width: 860px) {
  .catalog-page {
    --catalog-layout-header-height: 112px;
    padding: calc(var(--catalog-layout-header-height) + 10px) 10px calc(116px + env(safe-area-inset-bottom));
  }

  .catalog-sticky-header {
    padding: 8px;
    border-radius: 16px;
  }

  .sticky-actions {
    justify-content: stretch;
  }

  .sticky-search {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
  }

  .sticky-filter-btn {
    width: 42px;
    min-width: 42px;
    padding: 0;
  }

  .sticky-section-tabs {
    justify-content: flex-start;
  }

  .section-heading,
  .brand-topic-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .catalog-grid,
  .brand-products-grid {
    grid-template-columns: repeat(2, minmax(145px, 1fr));
    gap: 10px;
  }

  .product-image-wrap,
  .product-img {
    height: 160px;
    min-height: 160px;
  }

  .catalog-product-card--compact .product-image-wrap,
  .catalog-product-card--compact .product-img {
    height: 150px;
    min-height: 150px;
  }

  .bottom-promo-shell {
    align-items: stretch;
    flex-direction: column;
    gap: 6px;
  }

  .bottom-promo-label {
    padding: 0 4px;
  }

  .bottom-promo-list {
    grid-auto-columns: minmax(220px, 78vw);
  }
}

@media (max-width: 460px) {
  .catalog-page {
    --catalog-layout-header-height: 108px;
    padding-inline: 8px;
  }

  .sticky-search :deep(.q-field__control),
  .sticky-search :deep(.q-field__prepend),
  .sticky-search :deep(.q-field__append) {
    min-height: 40px;
    height: 40px;
  }

  .sticky-search :deep(input) {
    font-size: 13px;
  }

  .section-tab {
    font-size: 12px;
  }

  .catalog-grid,
  .brand-products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-product-card {
    border-radius: 16px;
  }

  .product-info {
    min-height: 110px;
    padding: 10px;
  }

  .product-title {
    font-size: 12px;
  }

  .product-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .product-brand {
    max-width: 100%;
  }

  .product-price {
    text-align: left;
  }

  .bottom-promo-bar {
    padding-inline: 8px;
  }

  .bottom-promo-item {
    grid-template-columns: 44px minmax(0, 1fr) 32px;
    height: 60px;
  }

  .bottom-promo-img {
    width: 44px;
    height: 44px;
  }

  .barcode-modal-card {
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
  }

  .barcode-modal-body {
    padding: 14px;
  }

  .barcode-video-wrap {
    min-height: 42dvh;
  }

  .barcode-video {
    height: 42dvh;
  }

  .barcode-frame {
    inset: 56px 22px;
  }

  .barcode-action-row,
  .barcode-modal-actions {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
