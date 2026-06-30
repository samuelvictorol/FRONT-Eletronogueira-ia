<template>
  <q-layout view="hHh lpR fFf" class="app-layout bg-primary relative">
    <q-header class="site-header text-dark bg-primary">
      <div class="header-shell">
        <q-toolbar class="topbar">
          <router-link to="/" class="brand-link">
            <img src="/logo.png" alt="Eletro Nogueira" class="brand-logo" />
          </router-link>

          <nav class="desktop-nav gt-sm" aria-label="Menu principal">
            <q-btn flat class="nav-link" to="/" label="Início" exact />
            <q-btn flat class="nav-link" to="/servicos-manutencao" label="Serviços" />
            <q-btn flat class="nav-link" to="/catalogo?limit=15&page=1&orderBy=updated_desc" label="Catálogo" />
            <q-btn flat class="nav-link" to="/localizacao" label="Localização" />
          </nav>

          <div class="topbar-actions">
            <q-btn unelevated color="green-14" class="topbar-whatsapp-btn gt-sm text-bold text-shadow" type="a"
              target="_blank" rel="noopener" icon-right="mdi-whatsapp" label="WhatsApp"
              href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento." />

            <q-btn unelevated color="secondary" class="cart-btn" icon="shopping_cart" aria-label="Abrir carrinho"
              @click="cart.state.drawerOpen = true">
              <q-badge v-if="cart.count.value > 0" color="negative" floating>
                {{ cart.count.value }}
              </q-badge>
            </q-btn>

            <q-btn flat dense round class="lt-md menu-btn" icon="menu" aria-label="Abrir menu"
              @click="leftDrawerOpen = true" />
          </div>
        </q-toolbar>

        <transition name="smart-search-slide">
          <div v-if="showSmartSearch" class="smart-search-rail">
            <q-form class="smart-search-card" @submit.prevent="submitSmartCatalogSearch">
              <div class="smart-search-copy gt-xs">
                <div class="">✨ Buscar no Catálogo</div>
              </div>

              <q-input v-model="smartSearchText" dense outlined clearable bg-color="white" color="secondary"
                class="smart-search-input" placeholder="O que você precisa?" :disable="smartSearchLoading"
                @keyup.enter.stop.prevent="submitSmartCatalogSearch">
                <template #prepend>
                  <q-icon name="auto_awesome" color="secondary" />
                </template>

                <template #append>
                  <q-btn flat dense round color="secondary" icon="search" :loading="smartSearchLoading"
                    @click="submitSmartCatalogSearch">
                    <q-tooltip>Buscar no catálogo</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </q-form>
          </div>
        </transition>

        <div class="category-rail">
          <q-tabs v-model="tab1" dense no-caps outside-arrows mobile-arrows inline-label align="left"
            indicator-color="transparent" active-color="secondary" class="category-tabs">
            <q-route-tab v-for="b in categoriesRow" :key="b.name" :name="b.name.toUpperCase()" :to="categoryTo(b.name)"
              class="category-tab">
              <div class="category-pill">
                <q-icon v-if="b.emoji.startsWith('mdi-')" :name="b.emoji" size="16px" />
                <span class="category-label">
                  {{ b.name.includes('BLACK') ? 'black & decker' : b.name }}
                </span>
              </div>
            </q-route-tab>
          </q-tabs>
        </div>
      </div>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered class="mobile-drawer"
      :width="$q.screen.lt.sm ? 312 : 340">
      <div class="drawer-shell">
        <div class="drawer-hero bg-primary ">
          <div class="drawer-hero-top">
            <img src="/logo.png" alt="Eletro Nogueira" class="drawer-logo q-pb-sm" />

            <q-btn flat round dense color="secondary" icon="close" aria-label="Fechar menu"
              @click="leftDrawerOpen = false" />
          </div>
        </div>

        <div class="drawer-content">
          <q-list class="drawer-list">
            <q-item v-for="item in drawerNavItems" :key="item.label" clickable v-ripple :to="item.to"
              class="drawer-link" :active-class="'drawer-link--active'" @click="leftDrawerOpen = false">
              <q-item-section avatar>
                <q-avatar class="drawer-link-icon" size="38px">
                  <q-icon :name="item.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="drawer-link-label">
                  {{ item.label }}
                </q-item-label>
                <!-- <q-item-label caption class="drawer-link-caption">
                  {{ item.caption }}
                </q-item-label> -->
              </q-item-section>

              <q-item-section side>
                <q-icon name="chevron_right" color="secondary" />
              </q-item-section>
            </q-item>
          </q-list>

          <q-card flat class="drawer-cart-card">
            <q-card-section class="drawer-cart-head">
              <div>
                <div class="drawer-card-title text-secondary">Carrinho</div>
                <div class="drawer-card-subtitle text-grey">
                  {{ cart.count.value }} produto(s) selecionado(s)
                </div>
              </div>

              <q-btn round unelevated color="primary" text-color="secondary" icon="shopping_cart"
                @click="openCartFromDrawer">
                <q-badge v-if="cart.count.value > 0" color="negative" floating>
                  {{ cart.count.value }}
                </q-badge>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>

        <div class="drawer-footer">
          <q-btn unelevated class="bg-secondary text-white rounded-borders w100" icon-right="mdi-instagram" type="a"
            target="_blank" rel="noopener" href="https://www.instagram.com/nogueiravalparaiso/"
            label="@nogueiravalparaiso" />
          <q-btn unelevated color="green-14" text-color="white" class="w100 text-bold q-mt-md checkout-btn"
            label="WhatsApp" type="a" target="_blank" rel="noopener"
            href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento."
            icon-right="mdi-whatsapp" />
        </div>
      </div>
    </q-drawer>

    <q-drawer v-model="cart.state.drawerOpen" side="right" overlay bordered class="cart-drawer"
      :width="$q.screen.lt.md ? 330 : 420">
      <div class="cart-drawer-shell">
        <div class="cart-drawer-header">
          <div>
            <div class="cart-drawer-title text-secondary">Carrinho</div>
            <div class="cart-drawer-subtitle text-grey">
              {{ cart.count.value }} produto(s)
            </div>
          </div>

          <q-btn dense flat round icon="close" color="secondary" @click="cart.state.drawerOpen = false" />
        </div>

        <q-card flat class="cart-total-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <q-icon name="shopping_cart" size="34px" color="secondary" />
              <div>
                <div class="text-caption text-grey-7">Total:</div>
                <div class="text-h5 text-weight-bold text-secondary">
                  {{ cart.moneyBR(cart.total.value) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div v-if="cart.state.items.length === 0" class="empty-cart-card">
          <q-icon name="shopping_cart" size="42px" color="grey-5" />
          <div class="text-weight-bold text-grey-8 q-mt-sm">Seu carrinho está vazio.</div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Adicione produtos do catálogo para montar seu orçamento.
          </div>
        </div>

        <q-list v-else separator class="cart-items-list">
          <q-item v-for="it in cart.state.items" :key="it.id" class="cart-item">
            <q-item-section avatar>
              <q-avatar square size="58px" class="cart-item-img">
                <img v-if="it.imagemUrl" :src="it.imagemUrl" style="object-fit: contain;" />
                <q-icon v-else name="image" color="grey-6" />
              </q-avatar>
            </q-item-section>

            <q-item-section class="text-secondary">
              <q-item-label class="text-weight-bold" lines="2">
                {{ it.descricao }}
              </q-item-label>

              <q-item-label caption>
                {{ it.marca || '—' }}
              </q-item-label>

              <div class="cart-item-controls">
                <q-btn dense round flat icon="remove" @click="cart.dec(it.id)" />

                <q-input color="secondary" dense outlined class="cart-qty-input" input-class="text-center"
                  :model-value="it.qty" @update:model-value="(v) => cart.setQty(it.id, v)" />

                <q-btn dense round flat icon="add" @click="cart.inc(it.id)" />

                <q-space />

                <div class="w100 row no-wrap">
                  <div class="cart-item-price">
                    {{
                      cart.moneyBR(
                        Number(it.precoPromocao || 0) > 0
                          ? it.precoPromocao
                          : (it.precoEfetivo ?? it.preco)
                      )
                    }}
                  </div>

                  <q-btn dense round flat color="grey" icon="delete" @click="cart.removeItem(it.id)" />
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="cart.state.items.length > 0" class="cart-drawer-footer q-mt-md">
          <q-btn unelevated color="green-14" text-color="white" class="w100 text-bold checkout-btn"
            label="Finalizar pedido" @click="finishOnWhatsApp" icon-right="mdi-whatsapp" />
        </div>
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <router-view />

      <q-page-sticky style="z-index: 45;" position="bottom-right" :offset="[18, 18]">
        <q-btn round size="xl" color="primary" text-color="secondary" icon="mdi-face-agent" class="shadow-8"
          to="/chat" />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api_ia } from 'boot/axios-ia'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const leftDrawerOpen = ref(false)
const tab1 = ref('')
const smartSearchText = ref('')
const smartSearchLoading = ref(false)

const cart = useCart()

const isCatalogRoute = computed(() => {
  return String(route.path || '').startsWith('/catalogo')
})

const showSmartSearch = computed(() => {
  return !isCatalogRoute.value
})

const drawerNavItems = [
  {
    label: 'Início',
    caption: 'Página principal',
    icon: 'home',
    to: '/'
  },
  {
    label: 'Serviços e Manutenção',
    caption: 'Assistência técnica e orçamento',
    icon: 'home_repair_service',
    to: '/servicos-manutencao'
  },
  {
    label: 'Catálogo',
    caption: 'Produtos, marcas e promoções',
    icon: 'inventory_2',
    to: '/catalogo?limit=15&page=1&orderBy=updated_desc'
  },
  {
    label: 'Localização',
    caption: 'Endereço, mapa e horários',
    icon: 'place',
    to: '/localizacao'
  }
]

const categoriesRow = [
  { name: 'Cabos', emoji: 'mdi-vector-line', },
  { name: 'Elétrica', emoji: 'mdi-lightning-bolt', },
  { name: 'Hidráulica', emoji: 'mdi-cog', },
  { name: 'Ferramentas', emoji: 'mdi-wrench', },
  { name: 'Motor', emoji: 'mdi-engine', },
  { name: 'Bomba d\'água', emoji: 'mdi-water-pump', },
  { name: 'Luva', emoji: 'mdi-hand', },
  { name: 'Cola', emoji: 'mdi-bottle-wine', },
  { name: 'Alicate', emoji: 'mdi-pipe-wrench', },
  { name: 'Conexão', emoji: 'mdi-connection', },
  { name: 'Fita', emoji: 'mdi-car-windshield-outline', },
  { name: 'Parafusadeira', emoji: 'mdi-pistol', },
  { name: 'Bateria', emoji: 'mdi-battery-charging', },
  { name: 'Óleo', emoji: 'mdi-oil', },
  { name: 'Parafuso', emoji: 'mdi-screwdriver', },
  { name: 'Porca', emoji: 'mdi-nut', },
  { name: 'Arruela', emoji: 'mdi-circle-outline', },
  { name: 'Chave', emoji: 'mdi-key', },
  { name: 'Martelo', emoji: 'mdi-hammer', },
  { name: 'Serra', emoji: 'mdi-saw-blade', },
  { name: 'Placa', emoji: 'mdi-alert', },
  { name: 'Filtro', emoji: 'mdi-filter', },
  { name: 'Válvula', emoji: 'mdi-valve', },
  { name: 'Mangueira', emoji: 'mdi-water-pump', },
  { name: 'Esmerilhadeira', emoji: 'mdi-tools', },
  { name: 'Interruptor', emoji: 'mdi-toggle-switch', },
  { name: 'Tomada', emoji: 'mdi-power-socket-eu', },
  { name: 'Lâmpada', emoji: 'mdi-lightbulb-on-outline', },
  { name: 'Lavadora', emoji: 'mdi-washing-machine', },
  { name: 'Transformador', emoji: 'mdi-lightbulb-multiple-outline ', },
  { name: 'Resistência ', emoji: 'mdi-resistor', },
  { name: 'Chuveiro', emoji: 'mdi-shower', },
]

function categoryTo(name) {
  return `/catalogo?q=${encodeURIComponent(String(name).toUpperCase())}&limit=15&page=1&orderBy=updated_desc`
}

function normalizeSmartText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickSmartPayload(data = {}, originalText = '') {
  const optimized = data.optimizedParams || data.params || data.query || {}

  const descricaoProduto = normalizeSmartText(
    optimized.descricaoProduto || optimized.q || data.descricaoProduto || originalText
  )

  const descricaoMarca = normalizeSmartText(
    optimized.descricaoMarca || optimized.marca || data.descricaoMarca || ''
  )

  const orderBy = String(optimized.orderBy || data.orderBy || 'updated_desc')
  const limit = Number(optimized.limit || data.limit || 15)

  return {
    descricaoProduto,
    descricaoMarca,
    orderBy,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 15
  }
}

function buildCatalogQueryFromSmart(params) {
  const query = {
    limit: String(params.limit || 15),
    page: '1',
    orderBy: params.orderBy || 'updated_desc'
  }

  if (params.descricaoProduto) query.q = params.descricaoProduto
  if (params.descricaoMarca) query.marca = params.descricaoMarca

  return query
}

async function submitSmartCatalogSearch() {
  const text = normalizeSmartText(smartSearchText.value)

  if (!text) {
    $q.notify({
      type: 'warning',
      message: 'Digite o produto ou a marca para buscar.'
    })

    return
  }

  smartSearchLoading.value = true

  try {
    const { data } = await api_ia.post('/catalog/filtro-inteligente', {
      texto: text,
      limit: 15,
      orderBy: 'updated_desc'
    })

    const params = pickSmartPayload(data, text)

    await router.push({
      path: '/catalogo',
      query: buildCatalogQueryFromSmart(params)
    })

    leftDrawerOpen.value = false

    if (data?.matchedBrand || params.descricaoMarca) {
      $q.notify({
        type: 'positive',
        message: `Busca ajustada: ${params.descricaoProduto || 'produto'}${params.descricaoMarca ? ` · ${params.descricaoMarca}` : ''}`
      })
    }
  } catch (err) {
    console.error('[LandingLayout] erro na busca inteligente:', err)

    await router.push({
      path: '/catalogo',
      query: {
        q: text,
        limit: '15',
        page: '1',
        orderBy: 'updated_desc'
      }
    })

    $q.notify({
      type: 'warning',
      message: 'Não consegui otimizar a busca agora. Busquei pelo texto digitado.'
    })
  } finally {
    smartSearchLoading.value = false
  }
}

function openCartFromDrawer() {
  leftDrawerOpen.value = false
  cart.state.drawerOpen = true
}

function syncTabWithRoute() {
  const q = String(route.query.q || '').toUpperCase()
  tab1.value = q || ''
}

function finishOnWhatsApp() {
  const url = cart.buildWhatsAppUrl('556136290040')
  window.open(url, '_blank', 'noopener')

  $q.dialog({
    color: 'secondary',
    title: '✅ Pedido iniciado',
    message: 'Seu pedido foi enviado para o WhatsApp. Deseja limpar o carrinho agora?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    cart.clear()
    cart.state.drawerOpen = false
  })
}

watch(
  () => route.fullPath,
  () => {
    syncTabWithRoute()

    if ($q.screen.gt.sm) {
      leftDrawerOpen.value = false
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await nextTick()

  enableDragScroll('.category-tabs .q-tabs__content')
})

function enableDragScroll(selector) {
  const elements = document.querySelectorAll(selector)

  elements.forEach((el) => {
    let isDown = false
    let startX = 0
    let scrollLeft = 0

    el.addEventListener('mousedown', (e) => {
      isDown = true
      el.classList.add('is-dragging')
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    })

    el.addEventListener('mouseleave', () => {
      isDown = false
      el.classList.remove('is-dragging')
    })

    el.addEventListener('mouseup', () => {
      isDown = false
      el.classList.remove('is-dragging')
    })

    el.addEventListener('mousemove', (e) => {
      if (!isDown) return

      e.preventDefault()

      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.4

      el.scrollLeft = scrollLeft - walk
    })
  })
}
</script>

<style scoped>
.app-layout {
  --white: #ffffff;
  --yellow: #ffd200;
  --blue: #1e4aa8;
  --navy: #012060;
  --green: #22c55e;
  --text: #0d1b2a;
  --muted: #445b78;
  --shadow: 0 10px 30px rgba(10, 42, 102, 0.12), 0 4px 12px rgba(10, 42, 102, 0.1);
}

.site-header {
  border-bottom: 1px solid rgba(1, 32, 96, 0.08);
  box-shadow: 0 8px 24px rgba(1, 32, 96, 0.08);
  animation: headerIn 0.34s ease both;
}

@keyframes headerIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-shell {
  width: 100%;
}

.topbar {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) auto minmax(150px, 1fr);
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 74px;
  padding: 0 16px;
}

.brand-link {
  display: flex;
  align-items: center;
  justify-self: start;
  text-decoration: none;
  min-width: 0;
}

.brand-logo {
  width: clamp(92px, 13vw, 155px);
  height: auto;
  display: block;
  object-fit: contain;
}

.desktop-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  gap: 8px;
  min-width: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  justify-self: end;
  gap: 10px;
  min-width: 0;
}

.nav-link {
  background-color: var(--navy);
  color: #ffffff;
  font-weight: 850;
  border-radius: 999px;
  min-height: 38px;
  padding: 0 15px;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.nav-link:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.topbar-whatsapp-btn {
  border-radius: 999px;
  min-height: 38px;
  padding: 0 16px;
  white-space: nowrap;
}

.cart-btn {
  border-radius: 14px;
  min-width: 42px;
  min-height: 42px;
  flex: 0 0 auto;
}

.menu-btn {
  color: var(--navy);
  background: rgba(1, 32, 96, 0.06);
}

.smart-search-slide-enter-active {
  overflow: hidden;
  transition:
    opacity 0.14s ease,
    transform 0.14s ease,
    max-height 0.14s ease,
    padding-top 0.14s ease,
    padding-bottom 0.14s ease,
    margin-bottom 0.14s ease;
}

.smart-search-slide-leave-active {
  overflow: hidden;
  pointer-events: none;
  transition:
    opacity 0.08s ease,
    transform 0.08s ease,
    max-height 0.08s ease,
    padding-top 0.08s ease,
    padding-bottom 0.08s ease,
    margin-bottom 0.08s ease;
}

.smart-search-slide-enter-from,
.smart-search-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

.smart-search-slide-enter-to,
.smart-search-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 72px;
}

.smart-search-rail {
  width: 100%;
  padding: 0 12px 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.smart-search-card {
  width: min(620px, calc(100% - 24px));
  max-width: 620px;
  min-height: 50px;
  display: grid;
  grid-template-columns: minmax(130px, 175px) minmax(260px, 1fr);
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgb(1, 33, 96), rgba(1, 32, 96, 0.72));
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 8px 20px rgba(1, 32, 96, 0.14);
}

.smart-search-copy {
  color: #ffffff;
  min-width: 0;
}

.smart-search-title {
  font-size: 13px;
  font-weight: 900;
  line-height: 1.1;
  white-space: nowrap;
}

.smart-search-input {
  min-width: 0;
}

.smart-search-input :deep(.q-field__control) {
  border-radius: 15px;
  min-height: 38px;
}

.category-rail {
  width: 100%;
  padding: 0 12px 10px;
  overflow: hidden;
}

.category-tabs {
  width: 100%;
  min-height: 46px;
  border-radius: 18px;
  padding: 5px;
  background: linear-gradient(90deg, rgba(1, 32, 96, 0.06), rgba(255, 210, 0, 0.22));
  border: 1px solid rgba(1, 32, 96, 0.08);
}

.category-tabs :deep(.q-tabs__content) {
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  cursor: grab;
  scroll-behavior: smooth;
  padding-bottom: 1px;
}

.category-tabs :deep(.q-tabs__content::-webkit-scrollbar) {
  display: none;
}

.category-tabs :deep(.q-tabs__content.is-dragging) {
  cursor: grabbing;
  user-select: none;
}

.category-tabs :deep(.q-tab) {
  min-height: 36px;
  padding: 0;
  flex: 0 0 auto;
}

.category-tabs :deep(.q-tab__content) {
  min-width: unset;
}

.category-tabs :deep(.q-tabs__arrow) {
  color: var(--navy);
}

.category-tab {
  border-radius: 999px;
  transition: all 0.22s ease;
}

.category-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  min-height: 35px;
  padding: 7px 13px;
  border-radius: 999px;
  background: #e00905;
  background:
    radial-gradient(circle at top left, rgba(0, 10, 156, 0.22), transparent 38%),
    linear-gradient(180deg, #eb0c08 0%, #bd0b08 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(96, 90, 1, 0.12);
}

.category-emoji {
  font-size: 14px;
  line-height: 1;
}

.category-label {
  font-size: 12px;
  line-height: 1;
}

.category-tabs :deep(.q-tab--active .category-pill) {
  background: #ffffff;
  color: var(--navy);
  border-color: rgba(255, 210, 0, 0.95);
  box-shadow: 0 4px 14px rgba(1, 32, 96, 0.16);
}

.mobile-drawer {
  background:
    radial-gradient(circle at top left, rgba(255, 210, 0, 0.22), transparent 38%),
    linear-gradient(180deg, #ffffff 0%, #f3f6fb 100%);
}

.drawer-shell {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-hero {
  padding: 18px 16px 16px;
  color: #ffffff;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 12px 28px rgba(1, 32, 96, 0.16);
}

.drawer-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.drawer-logo {
  width: 132px;
  max-width: 62%;
  height: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.14));
}

.drawer-title {
  margin-top: 16px;
  font-size: 20px;
  line-height: 1.1;
  font-weight: 950;
}

.drawer-subtitle {
  margin-top: 5px;
  max-width: 260px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.35;
}

.drawer-content {
  flex: 1;
  padding: 14px;
}

.drawer-list {
  display: grid;
  gap: 8px;
}

.drawer-link {
  min-height: 64px;
  border-radius: 18px;
  color: var(--navy);
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(1, 32, 96, 0.07);
  box-shadow: 0 8px 18px rgba(1, 32, 96, 0.06);
}

.drawer-link--active {
  background: rgba(255, 210, 0, 0.24);
  border-color: rgba(255, 210, 0, 0.82);
}

.drawer-link-icon {
  color: var(--navy);
  background: var(--yellow);
}

.drawer-link-label {
  font-weight: 950;
  line-height: 1.15;
}

.drawer-link-caption {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.25;
}

.drawer-cart-card {
  margin-top: 14px;
  overflow: hidden;
  border-radius: 20px;
  color: var(--navy);
  background: #ffffff;
  border: 1px solid rgba(1, 32, 96, 0.08);
  box-shadow: 0 10px 24px rgba(1, 32, 96, 0.08);
}

.drawer-cart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
}

.drawer-card-title {
  font-size: 15px;
  font-weight: 950;
}

.drawer-card-subtitle {
  margin-top: 2px;
  color: var(--muted);
  font-size: 12px;
}

.drawer-card-actions {
  padding: 12px 14px 14px;
}

.drawer-whatsapp-btn {
  min-height: 42px;
  border-radius: 15px;
  font-weight: 900;
}

.drawer-footer {
  padding: 0 14px 16px;
}

.drawer-instagram {
  width: 100%;
  min-height: 42px;
  border-radius: 15px;
  color: var(--navy);
  background: var(--yellow);
  font-weight: 950;
}

.cart-drawer {
  background:
    radial-gradient(circle at top right, rgba(255, 210, 0, 0.22), transparent 38%),
    linear-gradient(180deg, #012060 0%, #03122e 100%);
}

.cart-drawer-shell {
  min-height: 100%;
  padding: 16px;
}

.cart-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #ffffff;
}

.cart-drawer-title {
  font-size: 22px;
  font-weight: 950;
  line-height: 1.1;
}

.cart-drawer-subtitle {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.cart-total-card {
  margin-top: 16px;
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
}

.checkout-btn {
  min-height: 44px;
  border-radius: 15px;
}

.empty-cart-card {
  margin-top: 16px;
  padding: 22px 16px;
  border-radius: 20px;
  text-align: center;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
}

.cart-items-list {
  margin-top: 16px;
  overflow: hidden;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.10);
}

.cart-item {
  padding: 12px;
}

.cart-item-img {
  background: #f1f4f8;
  border-radius: 14px;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.cart-qty-input {
  width: 68px;
}

.cart-item-price {
  color: var(--green);
  font-weight: 950;
  white-space: nowrap;
}

.q-page-container {
  padding-top: 0 !important;
}

@media (max-width: 1150px) {
  .topbar {
    grid-template-columns: minmax(120px, 0.75fr) auto minmax(120px, 0.75fr);
    gap: 10px;
  }

  .nav-link {
    padding: 0 12px;
  }

  .topbar-whatsapp-btn {
    padding: 0 12px;
  }
}

@media (max-width: 1023px) {
  .topbar {
    display: grid;
    grid-template-columns: 1fr auto;
    min-height: 64px;
    padding: 0 10px;
  }

  .brand-logo {
    width: 122px;
  }

  .topbar-actions {
    gap: 8px;
  }

  .cart-btn {
    min-width: 40px;
    min-height: 40px;
  }

  .smart-search-rail {
    padding: 0 8px 7px;
    justify-content: stretch;
  }

  .smart-search-card {
    width: 100%;
    max-width: none;
    grid-template-columns: 1fr;
    min-height: unset;
    padding: 7px;
    border-radius: 15px;
  }

  .category-rail {
    padding: 0 8px 9px;
  }

  .category-tabs {
    min-height: 43px;
    border-radius: 15px;
    padding: 4px;
  }

  .category-pill {
    min-height: 33px;
    padding: 7px 11px;
  }

  .category-label {
    font-size: 11px;
  }
}

@media (max-width: 599px) {
  .topbar {
    min-height: 58px;
    gap: 8px;
  }

  .brand-logo {
    width: 108px;
  }

  .smart-search-rail {
    padding: 0 6px 6px;
  }

  .smart-search-card {
    padding: 7px;
    border-radius: 14px;
  }

  .smart-search-input :deep(.q-field__control) {
    min-height: 38px;
  }

  .category-rail {
    padding: 0 6px 8px;
  }

  .category-tabs {
    border-radius: 14px;
  }

  .category-tabs :deep(.q-tabs__content) {
    gap: 6px;
  }

  .category-pill {
    min-height: 32px;
    padding: 6px 10px;
    gap: 5px;
  }

  .category-emoji {
    font-size: 13px;
  }

  .category-label {
    font-size: 10px;
  }

  .cart-drawer-shell {
    padding: 12px;
  }

  .cart-item-controls {
    flex-wrap: wrap;
  }

  .cart-item-price {
    width: 100%;
    margin-top: 4px;
  }
}
</style>