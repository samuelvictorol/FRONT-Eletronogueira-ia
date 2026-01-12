<template>
  <q-layout view="hHh lpR fFf" class="bg-primary relative q-pt-md">
    <!-- HEADER -->
    <q-header
      class="text-dark glass navbar bg-primary  animate__animated animate__fadeInDown animate__delay-1s animate__slower"
      style="position: sticky; top: 6px; z-index: 999;">
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
          <q-btn flat class="nav-link q-ml-xs"
            to="/catalogo?min=599.9&max=1299.9&limit=12&page=1&orderBy=relevance">Catálogo</q-btn>
          <q-btn flat class="nav-link q-mx-xs" to="/localizacao">Localização</q-btn>
          <q-btn unelevated color="positive" class="btn whats q-ml-xs text-bold text-shadow" glossy type="a"
            target="_blank" rel="noopener"
            href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
            WhatsApp
            <q-img
              src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
              alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER MOBILE -->
    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered class=" relative" :width="290">
      <div class="q-pa-md column q-gutter-sm">
        <q-btn flat align="left" class="nav-link" to="/">Início</q-btn>
        <q-btn flat align="left" class="nav-link"
          to="/catalogo?min=599.9&max=1299.9&limit=12&page=1&orderBy=relevance">Catálogo</q-btn>
        <q-btn flat align="left" class="nav-link" to="/localizacao">Localização</q-btn>
        <q-btn icon-right="phone" color="secondary" class=" btn q-mt-sm" href="tel:+556136296858"
          label="(61) 3629-6858" />
        <q-btn unelevated color="positive" class="text-bold text-shadow btn whats" glossy type="a" target="_blank"
          rel="noopener"
          href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Gostaria%20de%20realizar%20um%20or%C3%A7amento.">
          WhatsApp
          <q-img
            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
            alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
        <q-btn unelevated color="warning" class="text-shadow btn whats q-ml-sm" glossy type="a" target="_blank"
          rel="noopener" href="https://www.instagram.com/nogueiravalparaiso/">
          @nogueiravalparaiso
          <q-img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
            alt="Logo Instagram" style="border-radius:100%; width:30px; height:30px" /></q-btn>
      </div>
      <div class="absolute-bottom w100 row justify-center q-pb-md">
        <div class="brand">
          <div class="logo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" />
          </div>
          <div class="brand-text">
            <strong class="text-secondary">ELETRO NOGUEIRA</strong>
            <small>Valparaíso de Goiás • BR-040</small>
            <small class="text-negative text-bold">26.931.014/0001-12</small>
          </div>
        </div>
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

const $q = useQuasar()
const leftDrawerOpen = ref(false)
const year = new Date().getFullYear()
const heroImg = '/assets/store.webp' // coloque a imagem em /public/assets
const slide = ref(2)
const fs = ref(false)

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

function scrollTo(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function goAndClose(selector) {
  scrollTo(selector)
  leftDrawerOpen.value = false
}

onMounted(() => {
  // fecha drawer ao virar desktop
  $q.screen.gt.md && (leftDrawerOpen.value = false)
})
</script>

<style scoped>
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
