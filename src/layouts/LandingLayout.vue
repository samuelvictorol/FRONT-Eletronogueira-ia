<template>
  <q-layout view="hHh lpR fFf" class="bg-primary relative">
    <!-- HEADER -->
    <q-header class="text-dark bg-primary animate__animated animate__fadeInDown animate__delay-1s animate__slower">
      <q-toolbar class="q-py-sm">
        <q-btn flat dense round class="lt-md q-mr-sm" icon="menu" aria-label="Abrir menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />

        <div class="brand">
          <div class="logo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" />
          </div>
          <div class="brand-text animate__animated animate__fadeInLeft animate__delay-3s animate__slower">
            <strong class="text-negative">ELETRO</strong><strong class="text-secondary">NOGUEIRA</strong>
            <small>Valparaíso de Goiás • BR-040</small>
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

        <!-- Botão carrinho (sempre visível) -->
        <q-btn rounded unelevated color="secondary" class="q-ml-sm" icon="shopping_cart"
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

        <!-- abrir carrinho no mobile -->
        <q-btn unelevated color="secondary" class="text-bold" icon="shopping_cart"
          @click="cart.state.drawerOpen = true; leftDrawerOpen = false" label="Carrinho">
          <q-badge v-if="cart.count.value > 0" color="negative" floating>
            {{ cart.count.value }}
          </q-badge>
        </q-btn>

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
            <strong class="text-secondary"><strong
                class="text-negative">ELETRO</strong><strong>NOGUEIRA</strong></strong>
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
                    {{ cart.moneyBR((Number(it.precoPromocao || 0) > 0 ? it.precoPromocao : (it.precoEfetivo ??
                      it.preco))) }}
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const leftDrawerOpen = ref(false)

const cart = useCart()

const schedule = {
  1: ['08:00', '18:00'],
  2: ['08:00', '18:00'],
  3: ['08:00', '18:00'],
  4: ['08:00', '18:00'],
  5: ['08:00', '18:00'],
  6: ['08:00', '12:00'],
  0: null
}

const openNowText = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const pad = n => String(n).padStart(2, '0')
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  const range = schedule[day]
  if (!range) return 'Fechado hoje • Domingo'
  const [start, end] = range
  return (hhmm >= start && hhmm <= end)
    ? `🟢 Aberto agora • ${start}–${end}`
    : `🔴 Fechado no momento • ${start}–${end}`
})

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
  // abre WhatsApp com o texto
  window.open(url, '_blank', 'noopener')

  // opcional: perguntar se quer limpar depois de enviar
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

onMounted(() => {
  $q.screen.gt.md && (leftDrawerOpen.value = false)
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
</style>