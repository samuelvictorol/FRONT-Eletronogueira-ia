<template>
  <q-layout view="hHh lpR fFf" class="bg-primary relative">
    <!-- HEADER -->
    <q-header class="text-dark bg-primary animate__animated animate__fadeInDown animate__delay-1s animate__slower">
      <q-toolbar class="header-toolbar q-px-sm q-py-sm">
        <q-btn flat dense round class="lt-md q-mr-sm" icon="menu" aria-label="Abrir menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />

        <div class="brand">
          <div class="logo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" />
          </div>

          <div class="brand-text animate__animated animate__fadeInLeft animate__delay-3s animate__slower"
            v-if="!isMobile">
            <strong class="text-negative">ELETRO</strong><strong class="text-secondary">NOGUEIRA</strong>
            <small>Valparaíso de Goiás • BR-040</small>
          </div>

          <div
            class="brand-text mobile-brand-tabs animate__animated animate__fadeInDown animate__delay-3s animate__slower"
            v-else>
            <q-tabs v-model="tab1" dense no-caps inline-label outside-arrows mobile-arrows align="left"
              indicator-color="transparent" active-color="secondary" class="mobile-tabs">
              <q-route-tab v-for="b in brandsRow1" :key="b.name" :name="b.name.toUpperCase()" :to="brandTo(b.name)"
                exact class="brand-mobile-tab">
                <div class="brand-mobile-tab-inner">
                  <!-- <img :src="b.src" :alt="b.name" class="brand-mobile-logo" /> -->
                  <span class="brand-mobile-label">{{ b.emoji }} {{ b.name.includes('BLACK') ? 'black & decker' : b.name }}</span>
                </div>
              </q-route-tab>
            </q-tabs>
          </div>
        </div>

        <q-space />

        <!-- Ações desktop -->
        <div class="nav-actions gt-sm">
          <q-btn flat class="nav-link" to="/">Início</q-btn>
          <q-btn flat class="nav-link q-ml-xs" to="/servicos-manutencao">Serviços</q-btn>
          <q-btn flat class="nav-link q-ml-xs" to="/catalogo?limit=15&page=1&orderBy=updated_desc">Catálogo</q-btn>
          <q-btn flat class="nav-link q-mx-xs" to="/localizacao">Localização</q-btn>

          <q-btn color="green-14" class="q-ml-xs text-bold text-shadow" type="a" target="_blank" rel="noopener"
            icon-right="mdi-whatsapp" label="WhatsApp"
            href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento." />
        </div>

        <!-- Botão carrinho -->
        <q-btn  color="secondary" class="q-ml-sm" icon="shopping_cart"
          @click="cart.state.drawerOpen = true">
          <q-badge v-if="cart.count.value > 0" color="negative" floating>
            {{ cart.count.value }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- DRAWER MOBILE (LEFT) -->
    <q-drawer v-model="leftDrawerOpen" side="left" overlay class="bg-primary relative" :width="290">
      <div class="q-pa-md column q-gutter-sm">
        <q-btn flat align="left" class="bg-secondary text-white nav-link" to="/">Início</q-btn>
        <q-btn flat align="left" class="bg-secondary text-white nav-link" to="/servicos-manutencao">
          Serviços e Manutenção
        </q-btn>
        <q-btn flat align="left" class="bg-secondary text-white nav-link"
          to="/catalogo?limit=15&page=1&orderBy=updated_desc">
          Catálogo
        </q-btn>
        <q-btn flat align="left" class="bg-secondary text-white nav-link" to="/localizacao">Localização</q-btn>
        <!-- 
        <q-btn
          unelevated
          color="secondary"
          class="text-bold"
          icon="shopping_cart"
          @click="cart.state.drawerOpen = true; leftDrawerOpen = false"
          label="Carrinho"
        >
          <q-badge v-if="cart.count.value > 0" color="negative" floating>
            {{ cart.count.value }}
          </q-badge>
        </q-btn> -->

        <q-btn unelevated class="bg-primary text-secondary rounded-borders" icon="mdi-instagram" type="a"
          target="_blank" style="position:absolute; bottom:85px;" rel="noopener"
          href="https://www.instagram.com/nogueiravalparaiso/" label="@nogueiravalparaiso" />
      </div>

      <div class="absolute-bottom w100 row justify-center q-pb-md">
        <div class="brand">
          <div class="logo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" />
          </div>
          <div class="brand-text">
            <strong class="text-secondary">
              <strong class="text-negative">ELETRO</strong><strong>NOGUEIRA</strong>
            </strong>
            <small>Valparaíso de Goiás • BR-040</small>
            <small class="text-negative text-bold">26.931.014/0001-12</small>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- RIGHT DRAWER (CART) -->
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
            <div class="text-h5 text-weight-bold text-green-14">{{ cart.moneyBR(cart.total.value) }}</div>
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
                <img v-if="it.imagemUrl" :src="it.imagemUrl" style="object-fit:contain;" />
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
                <q-input color="secondary" dense outlined style="width:70px" input-class="text-center"
                  :model-value="it.qty" @update:model-value="(v) => cart.setQty(it.id, v)" />
                <q-btn dense round flat icon="add" @click="cart.inc(it.id)" />

                <q-space />

                <div class="w100 row no-wrap items-center justify-end q-gutter-sm">
                  <div class="text-weight-bold text-green">
                    {{
                      cart.moneyBR(
                        (Number(it.precoPromocao || 0) > 0 ? it.precoPromocao : (it.precoEfetivo ?? it.preco))
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

    <q-page-container style="padding-top: 0px;" class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
  { name: 'Elétrica', emoji: '💡', src: '/assets/karcher-logo.png' },
  { name: 'Hidráulica', emoji: '⚙', src: '/assets/marluvas-logo.png' },
  { name: 'Ferramentas', emoji: '🔧', src: '/assets/tigre-logo.png' },
  { name: 'Bomba d\'água', emoji: '💦', src: '/assets/lamesa-logo.webp' },
]

const schedule = {
  1: ['08:00', '18:00'],
  2: ['08:00', '18:00'],
  3: ['08:00', '18:00'],
  4: ['08:00', '18:00'],
  5: ['08:00', '18:00'],
  6: ['08:00', '12:00'],
  0: null
}

function brandTo(name) {
  return `/catalogo?q=${String(name).toUpperCase()}&limit=15&page=1&orderBy=updated_desc`
}

function syncTabWithRoute() {
  const marca = String(route.query.marca || '').toUpperCase()
  tab1.value = marca || ''
}

function confirmClear() {
  $q.dialog({
    title: 'Limpar carrinho',
    message: 'Tem certeza que deseja remover todos os itens?',
    cancel: true,
    persistent: true
  }).onOk(() => cart.clear())
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

watch(() => route.fullPath, syncTabWithRoute, { immediate: true })

onMounted(() => {
  if ($q.screen.gt.md) leftDrawerOpen.value = false
  syncTabWithRoute()
})
</script>

<style scoped>
.nav-link {
  background-color: #012060;
  color: #fff;
  font-weight: bolder;
  position: relative;
}

:root {
  --white: #ffffff;
  --yellow: #FFD200;
  --blue: #1E4AA8;
  --navy: #0A2A66;
  --green: #22C55E;
  --text: #0d1b2a;
  --muted: #445b78;
  --ink: #f6f8ff;
  --glass-bg: rgba(224, 224, 224, 0.718);
  --glass-brd: rgba(10, 42, 102, 0.14);
  --shadow: 0 10px 30px rgba(10, 42, 102, .12), 0 4px 12px rgba(10, 42, 102, .10);
}

.header-toolbar {
  min-height: 68px;
}

.brand {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.logo {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-text small {
  color: #ffffff;
  line-height: 1.2;
}

.mobile-brand-tabs {
  width: min(62vw, 300px);
  min-width: 0;
}

.mobile-tabs {
  width: 100%;
  min-height: 48px;
  border-radius: 14px;
  padding: 4px;
}

.mobile-tabs :deep(.q-tabs__content) {
  gap: 8px;
}

.mobile-tabs :deep(.q-tab) {
  min-height: 38px;
  padding: 0;
}

.mobile-tabs :deep(.q-tab__content) {
  min-width: unset;
}

.mobile-tabs :deep(.q-tabs__arrow) {
  color: #012060;
}

.brand-mobile-tab {
  border-radius: 999px;
  transition: all 0.22s ease;
}

.brand-mobile-tab-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background-color: #012060;
  border: 1px solid rgba(255, 255, 255, 0.18);
  white-space: nowrap;
}

.mobile-tabs :deep(.q-tab--active .brand-mobile-tab-inner) {
  background: #ffffff;
  border-color: rgba(255, 210, 0, 0.85);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
}

.mobile-tabs :deep(.q-tab--active .brand-mobile-label) {
  color: #012060;
  font-weight: 800;
}

.brand-mobile-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 50%;
  background: #fff;
  flex: 0 0 auto;
}

.brand-mobile-label {
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  color: #fff;
}

@media (max-width: 599px) {
  .header-toolbar {
    min-height: 62px;
    padding-left: 6px;
    padding-right: 6px;
  }

  .logo img {
    width: 40px !important;
    height: 40px !important;
  }

  .mobile-brand-tabs {
    width: min(58vw, 250px);
  }

  .mobile-tabs {
    min-height: 44px;
    padding: 3px;
  }

  .brand-mobile-tab-inner {
    padding: 6px 9px;
    gap: 5px;
  }

  .brand-mobile-logo {
    width: 16px;
    height: 16px;
  }

  .brand-mobile-label {
    font-size: 10px;
  }
}
</style>