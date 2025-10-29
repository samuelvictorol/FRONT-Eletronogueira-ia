<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-3">
    <!-- HEADER -->
    <q-header class="text-dark glass navbar">
      <q-toolbar class="q-py-sm">
        <q-btn flat dense round class="lt-md q-mr-sm" icon="menu" aria-label="Abrir menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />
        <div class="brand">
          <div class="logo">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" />
          </div>
          <div class="brand-text animate__animated animate__fadeInLeft animate__delay-2s animate__slower">
            <strong class="text-secondary">ELETRO NOGUEIRA</strong>
            <small>Valparaíso de Goiás • BR-040</small>
            <small class="text-negative text-bold">26.931.014/0001-12</small>
          </div>
        </div>
        <q-space />
        <!-- Ações desktop -->
        <div class="nav-actions gt-sm">
          <q-btn flat class="nav-link" to="/">Início</q-btn>
          <q-btn flat class="nav-link" @click="scrollTo('#produtos')">Catálogo</q-btn>
          <q-btn flat class="nav-link q-mx-xs" @click="scrollTo('#horarios')">Horários</q-btn>
          <q-btn color="secondary" unelevated class="btn primary text-bold text-shadow" href="tel:+556136290040">
            (61) 3629-0040
          </q-btn>
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
    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered class="glass relative" :width="290">
      <div class="q-pa-md column q-gutter-sm">
        <q-btn flat align="left" class="nav-link" @click="goAndClose('#produtos')">Catálogo</q-btn>
        <q-btn flat align="left" class="nav-link" @click="goAndClose('#horarios')">Horários</q-btn>
        <q-btn color="secondary" unelevated class="btn primary text-bold text-shadow" href="tel:+556136290040">
          (61) 3629-0040
        </q-btn>
        <q-btn unelevated color="positive" class="text-bold text-shadow btn whats q-ml-xs" glossy type="a"
          target="_blank" rel="noopener"
          href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
          WhatsApp
          <q-img
            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
            alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
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

    <q-page-container>
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
/* ===== Paleta clara + Glass ===== */
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

body {
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 10% 0%, rgba(255, 210, 0, .20), transparent 60%),
    radial-gradient(900px 500px at 100% 0%, rgba(30, 74, 168, .12), transparent 60%),
    linear-gradient(180deg, var(--ink) 0%, #eef3ff 50%, #f7f9ff 100%);
}

a {
  text-decoration: none;
  color: inherit
}

.container {
  width: min(1120px, 92vw);
  margin: 0 auto
}

.section {}

.section.alt {
  background: linear-gradient(180deg, rgba(30, 74, 168, .06), transparent 70%)
}

.section.light {
  background: linear-gradient(180deg, rgba(255, 255, 255, .7), rgba(255, 255, 255, .4))
}

.center {
  text-align: center
}

.mt {
  margin-top: 24px
}

.glass {
  background: var(--glass-bg);
  background-color: var(--glass-bg);
  backdrop-filter: saturate(150%) blur(12px);
  -webkit-backdrop-filter: saturate(150%) blur(12px);
  border: 1px solid var(--glass-brd);
  border-radius: 18px;
  box-shadow: var(--shadow);
  transition: background 0.3s ease;
  cursor: pointer;
}

.glass:hover {
  background: whitesmoke;
}

.card {
  padding: 28px
}

/* Navbar */
.navbar {}

.brand {
  display: flex;
  gap: 12px;
  align-items: center
}

.logo {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px
}

.brand-text small {
  display: block;
  color: var(--muted);
  font-size: 12px;
  margin-top: -4px
}

.nav-actions .nav-link {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid transparent
}

.nav-actions .nav-link:hover {
  border-color: rgba(10, 42, 102, .2);
  background: #fff
}

.btn {
  border-radius: 12px
}

.btn.primary {
  background: linear-gradient(135deg, var(--blue), #4f7be0);
  color: #fff
}

.btn.whats {
  background: linear-gradient(135deg, var(--green), #59da86);
  color: #06250f
}

.btn.ghost {
  background: #fff;
  border: 1px solid rgba(10, 42, 102, .18);
  color: var(--blue)
}

.btn.outline {
  border: 1px solid rgba(10, 42, 102, .25);
  color: var(--blue)
}

/* Hero */
.hero {
  position: relative;
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: 60px 0
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  filter: saturate(105%) contrast(105%) brightness(.92)
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .6), rgba(255, 255, 255, .3) 30%, rgba(255, 255, 255, .1) 100%),
    radial-gradient(1000px 500px at 30% 30%, rgba(255, 210, 0, .25), transparent 70%);
  mix-blend: lighten
}

.hero-content {
  position: relative;
  padding: 28px;
  max-width: 860px;
  background: rgba(255, 255, 255, .6)
}

.hero h1 {
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.1;
  margin: 4px 0 12px;
  color: var(--blue)
}

.hero h1 span {
  color: var(--yellow)
}

.subtitle {
  color: #1b2c52;
  margin: 0 0 14px
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 10px
}

.badge {
  border: 1px dashed rgba(10, 42, 102, .25);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--navy);
  background: #fff
}

.cta-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0 6px
}

.open-now {
  font-weight: 600;
  margin-top: 6px;
  color: var(--navy)
}

/* Grid */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px
}

@media (max-width:900px) {
  .grid-2 {
    grid-template-columns: 1fr
  }
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 18px
}

.product {
  padding: 20px;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 255, 255, .7)
}

.product h4 {
  margin: 0 0 6px;
  color: var(--blue)
}

@media (max-width:1100px) {
  .cards {
    grid-template-columns: repeat(3, 1fr)
  }
}

@media (max-width:800px) {
  .cards {
    grid-template-columns: repeat(2, 1fr)
  }
}

@media (max-width:520px) {
  .cards {
    grid-template-columns: 1fr
  }
}

/* Horários + mapa */
.hours {
  width: 100%;
  border-collapse: collapse
}

.hours td {
  padding: 8px 6px;
  border-bottom: 1px dashed rgba(10, 42, 102, .15)
}

.note {
  color: var(--muted);
  font-size: 12px;
  margin-top: 10px
}

.mini-map {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow)
}

.mini-map iframe {
  width: 100%;
  height: 260px;
  border: 0
}

/* Footer */
.footer {
  padding: 28px 0;
  border-top: 1px solid rgba(10, 42, 102, .08);
  background: linear-gradient(180deg, rgba(255, 210, 0, .15), transparent)
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  align-items: center
}

.foot-copy {
  color: var(--muted)
}

.foot-links {
  display: grid;
  gap: 6px
}

.copy {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  padding: 10px 0;
  border-top: 1px solid rgba(10, 42, 102, .06)
}

.q-header {
  width: min(1120px, 92vw) !important;
  margin: 0 auto;
}


@media (max-width:820px) {
  .q-header {
    width: 100% !important;
  }

  .footer-grid {
    grid-template-columns: 1fr
  }
}
</style>
