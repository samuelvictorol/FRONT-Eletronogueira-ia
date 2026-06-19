<template>
  <q-layout view="hHh lpR fFf" class="app-layout bg-primary relative">
    <q-header
      class="site-header text-dark bg-primary animate__animated animate__fadeInDown animate__delay-1s animate__slower">
      <div class="header-shell">
        <q-toolbar class="topbar q-px-md">
          <router-link to="/" class="brand-link">
            <img src="/logo.png" alt="Eletro Nogueira" class="brand-logo" />
          </router-link>

          <q-space class="lt-md" />

          <div class="desktop-nav row no-wrap items-center gt-sm">
            <q-btn flat class="nav-link" to="/" label="Início" />
            <q-btn flat class="nav-link" to="/servicos-manutencao" label="Serviços" />
            <q-btn flat class="nav-link" to="/catalogo?limit=15&page=1&orderBy=updated_desc" label="Catálogo" />
            <q-btn flat class="nav-link" to="/localizacao" label="Localização" />

            <q-btn unelevated color="green-14" class="whatsapp-btn text-bold text-shadow" type="a" target="_blank"
              rel="noopener" icon-right="mdi-whatsapp" label="WhatsApp"
              href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento." />
          </div>

          <q-space class="gt-sm" />

          <q-btn unelevated color="secondary" class="cart-btn" icon="shopping_cart"
            @click="cart.state.drawerOpen = true">
            <q-badge v-if="cart.count.value > 0" color="negative" floating>
              {{ cart.count.value }}
            </q-badge>
          </q-btn>

          <q-btn flat dense round class="lt-md q-ml-sm menu-btn" icon="menu" aria-label="Abrir menu"
            @click="leftDrawerOpen = !leftDrawerOpen" />
        </q-toolbar>

        <div class="category-rail animate__animated animate__fadeInDown animate__delay-2s animate__slower">
          <q-tabs v-model="tab1" dense no-caps outside-arrows mobile-arrows inline-label align="left"
            indicator-color="transparent" active-color="secondary" class="category-tabs">
            <q-route-tab v-for="b in brandsRow1" :key="b.name" :name="b.name.toUpperCase()" :to="brandTo(b.name)"
              class="category-tab">
              <div class="category-pill">
                <span class="category-emoji">{{ b.emoji }}</span>
                <span class="category-label">
                  {{ b.name.includes('BLACK') ? 'black & decker' : b.name }}
                </span>
              </div>
            </q-route-tab>
          </q-tabs>
        </div>
      </div>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay class="bg-white relative" :width="290">
      <div class="drawer-header">
        <img src="/logo.png" alt="Eletro Nogueira" class="drawer-logo" />
      </div>

      <div class="q-pa-md column q-gutter-sm">
        <q-btn flat align="left" class="bg-secondary text-white nav-link" to="/" @click="leftDrawerOpen = false">
          Início
        </q-btn>

        <q-btn flat align="left" class="bg-secondary text-white nav-link" to="/servicos-manutencao"
          @click="leftDrawerOpen = false">
          Serviços e Manutenção
        </q-btn>

        <q-btn flat align="left" class="bg-secondary text-white nav-link"
          to="/catalogo?limit=15&page=1&orderBy=updated_desc" @click="leftDrawerOpen = false">
          Catálogo
        </q-btn>

        <q-btn flat align="left" class="bg-secondary text-white nav-link" to="/localizacao"
          @click="leftDrawerOpen = false">
          Localização
        </q-btn>

        <q-btn unelevated color="dark" class="text-bold" icon="shopping_cart" label="Carrinho"
          @click="cart.state.drawerOpen = true; leftDrawerOpen = false">
          <q-badge v-if="cart.count.value > 0" color="negative" floating>
            {{ cart.count.value }}
          </q-badge>
        </q-btn>

        <q-btn unelevated class="bg-primary text-secondary text-bold rounded-borders drawer-instagram"
          icon="mdi-instagram" type="a" target="_blank" rel="noopener"
          href="https://www.instagram.com/nogueiravalparaiso/" label="@nogueiravalparaiso" />
      </div>
    </q-drawer>

    <q-drawer v-model="cart.state.drawerOpen" side="right" overlay class="bg-grad-secondary text-primary"
      :width="$q.screen.lt.md ? 330 : 420">
      <div class="q-pa-md">
        <div class="row items-center justify-between">
          <div class="text-h6 text-weight-bold">Carrinho</div>
          <q-btn dense flat icon="close" @click="cart.state.drawerOpen = false" />
        </div>

        <div class="text-caption text-grey-4 q-mt-xs">
          {{ cart.count.value }} produto(s)
        </div>

        <q-separator class="q-my-md" />

        <div class="bg-white rounded-borders shadow-1 q-pa-md">
          <div class="row items-center justify-between">
            <div class="text-subtitle2 text-grey-8">Total</div>
            <div class="text-h5 text-weight-bold text-green-14">
              {{ cart.moneyBR(cart.total.value) }}
            </div>
          </div>

          <div class="row no-wrap q-mt-md">
            <q-btn unelevated color="green-14" class="w100 text-bold" icon-right="mdi-whatsapp" label="Finalizar"
              :disable="cart.state.items.length === 0" @click="finishOnWhatsApp" />
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div v-if="cart.state.items.length === 0" class="q-pa-md bg-white rounded-borders shadow-1 text-grey-7">
          Seu carrinho está vazio.
        </div>

        <q-list v-else separator class="bg-white rounded-borders shadow-1">
          <q-item v-for="it in cart.state.items" :key="it.id">
            <q-item-section avatar>
              <q-avatar square size="56px" class="bg-grey-3">
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

              <div class="row items-center q-gutter-xs q-mt-xs">
                <q-btn dense round flat icon="remove" @click="cart.dec(it.id)" />

                <q-input color="secondary" dense outlined style="width: 70px;" input-class="text-center"
                  :model-value="it.qty" @update:model-value="(v) => cart.setQty(it.id, v)" />

                <q-btn dense round flat icon="add" @click="cart.inc(it.id)" />

                <q-space />

                <div class="w100 row no-wrap items-center justify-end q-gutter-sm">
                  <div class="text-weight-bold text-green">
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
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <router-view />
      <q-page-sticky style="z-index: 45;" position="bottom-right" :offset="[18, 18]">
        <q-btn round size="lg" color="primary" text-color="secondary" glossy icon="mdi-robot-excited-outline" class="shadow-8"
          to="/chat">
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const route = useRoute()
const leftDrawerOpen = ref(false)
const tab1 = ref('')
const cart = useCart()

const isMobile = computed(() => $q.screen.lt.md)

const brandsRow1 = [
  { name: 'Cabos', emoji: '🥖', src: '/assets/black-decker-logo.png' },
  { name: 'Elétrica', emoji: '💡', src: '/assets/karcher-logo.png' },
  { name: 'Hidráulica', emoji: '⚙', src: '/assets/marluvas-logo.png' },
  { name: 'Ferramentas', emoji: '🔧', src: '/assets/tigre-logo.png' },
  { name: 'Bomba d\'água', emoji: '💦', src: '/assets/lamesa-logo.webp' },
  { name: 'Luva', emoji: '🧤', src: '/assets/stanley-logo.png' }
]

function brandTo(name) {
  return `/catalogo?q=${encodeURIComponent(String(name).toUpperCase())}&limit=15&page=1&orderBy=updated_desc`
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

watch(() => route.fullPath, () => {
  syncTabWithRoute()

  if ($q.screen.gt.sm) {
    leftDrawerOpen.value = false
  }
}, { immediate: true })

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
}

.header-shell {
  width: 100%;
}

.topbar {
  min-height: 74px;
  gap: 12px;
}

.brand-link {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
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
  flex: 1 1 auto;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.nav-link {
  background-color: var(--navy);
  color: #ffffff;
  font-weight: 800;
  border-radius: 999px;
  min-height: 38px;
  padding: 0 14px;
  white-space: nowrap;
}

.nav-link:hover {
  filter: brightness(1.08);
}

.whatsapp-btn {
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
  min-height: 35px;
  padding: 7px 13px;
  border-radius: 999px;
  background: var(--navy);
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

.drawer-header {
  padding: 16px 16px 4px;
}

.drawer-logo {
  width: 130px;
  max-width: 55%;
  height: auto;
  display: block;
}

.drawer-instagram {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 15px;
}

.q-page-container {
  padding-top: 0 !important;
}

@media (max-width: 1023px) {
  .topbar {
    min-height: 64px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .brand-logo {
    width: 122px;
  }

  .cart-btn {
    min-width: 40px;
    min-height: 40px;
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
}
</style>