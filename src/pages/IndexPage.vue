<template>
    <q-page class="text-black">
        <div class="open-now text-white text-shadow q-py-sm bg-secondary text-center">{{ openNowText }}</div>
        <!-- HERO -->
        <section class="hero">
            <img class="hero-bg" :src="heroImg" alt="Fachada Eletro Nogueira" />
            <div class="hero-overlay"></div>

            <div class="hero-content glass q-mx-sm animate__animated animate__fadeInUp animate__delay-3s animate__slower">
                <div class="text-h5 text-secondary text-bold">
                    <q-img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                        alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
                        class="text-negative">ELETRO</strong> NOGUEIRA<br>
                </div>
                <p class="text-bold text-secondary q-mt-sm">Ferramentas & Soluções</p>
                <p class="subtitle">
                    Em frente à <strong>BR-040</strong>, na divisa com o DF — <strong>Valparaíso de Goiás</strong>.
                    Pronta-entrega e atendimento consultivo.
                </p>
                <div class="hero-badges">
                    <div class="badge bg-blue-1 text-dark">Elétrica</div>
                    <div class="badge bg-blue-1 text-dark">Hidráulica</div>
                    <div class="badge bg-blue-1 text-dark">Automação</div>
                    <div class="badge bg-blue-1 text-dark">Agro</div>
                    <div class="badge bg-blue-1 text-dark">Industrial</div>
                </div>
                <div class="cta-row">
                    <q-btn color="secondary" unelevated class="btn primary text-shadow" @click="scrollTo('#produtos')"
                        label="Ver produtos" />
                    <q-btn flat class="btn ghost text-secondary" color="secondary" icon-right="pin_drop"
                        @click="scrollTo('#como-chegar')" label="Como chegar (17 min)" />
                </div>
            </div>
        </section>

        <!-- SOBRE -->
        <section id="sobre" class="section">
            <div class="container grid-2">
                <div class="glass card">
                    <h2>Quem somos</h2>
                    <p>Somos uma loja física localizada em <strong>Valparaíso de Goiás</strong>, ponto estratégico
                        em frente à <strong>BR-040</strong>, próxima à divisa com o DF. Trabalhamos com ampla linha
                        de <em>ferramentas elétricas</em>, <em>hidráulica</em>, <em>automação industrial</em>,
                        <em>elétrica</em>, <em>agropecuária</em>, <em>bombas d’água</em> e muito mais.
                    </p>
                    <p>Atendimento rápido, estoque para pronta-entrega e equipe que entende do que faz.</p>
                </div>

                <div class="glass card">
                    <h3>Destaques em pronta-entrega</h3>
                    <ul class="pill-list">
                        <li>Furadeira, Parafusadeira, Martelete</li>
                        <li>Martelo, Compressores, Ferramenta pneumática</li>
                        <li>Bombas: palito, Anauger, incêndio, poço artesiano</li>
                        <li>Elétrica: motores, geradores, inversoras, máquinas de solda</li>
                        <li>Agro & Jardim: cortador de grama, desintegrador, forrageira, pulverizador, motosserra</li>
                        <li>Medição: paquímetro, alicate amperímetro, multímetro, trena a laser</li>
                        <li>Usinagem & corte: fresa, lima rotativa, esquadro, cortador de piso</li>
                        <li>Correias, polias, Topfusion, conexões PU</li>
                        <li>Lavadoras, Makita e muito mais</li>
                    </ul>
                </div>
            </div>
        </section>
        <section id="produtos">
            <div class=" bg-secondary text-white q-pt-sm">
                <h2 class="center">Catálogo de produtos</h2>
                <q-carousel v-model="slide" v-model:fullscreen="fs" transition-prev="slide-right"
                    transition-next="slide-left" animated control-color="blue" navigation padding arrows swipeable
                    height="400px" class="bg-secondary rounded-borders">
                    <template #control>
                        <q-btn flat dense color="primary" round :icon="fs ? 'fullscreen_exit' : 'fullscreen'"
                            @click="fs = !fs" class="q-ml-sm q-mt-sm" />
                    </template>
                    <q-carousel-slide :name="1" class="column no-wrap">
                        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/p/AF1QipNu9WuJF2DhEH0KdB7Qtl9uCiecop1aUaciuSx2=s680-w680-h510-rw" />
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxQ5ryS1tpHhdI2779-8TuNGST8BqID2yx46lRYEOfh35jSIJb9ctsjZe4P80oaPBQWmLVCZra8fwiyJ4d7IY5iZ8uPzjlvLdCV-GJc6gBPxB5o86vMd_PJDri9q3R1FWhTKYP5=s680-w680-h510-rw" />
                        </div>
                    </q-carousel-slide>
                    <q-carousel-slide :name="2" class="column no-wrap">
                        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzZBzEFOf3nhbpu82xl4XLquokjRWj6h1OMmp0ZJwKrSVjTQCbD79NB3N5Wqe_dKCb5Cz9YzK1U0czuWSnwInOVR8prGbb-G3blw812pIw5Wyoe2-FQUqB3YhVi-SJSt3TmtGPa_g=s680-w680-h510-rw" />
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyagXSk9RxAoFfbktDFmHkXfBM65tJlcZjN1_R3pjYH3XNAusscYbSw5Nu-1U0tVubxB9psqmRMn7-IcnL-llcs0Q-TnCdj45pQqOUo6PguO6WpaIgV_bTcdXNp8nqBR-mdw-RKsQ=s680-w680-h510-rw" />
                        </div>
                    </q-carousel-slide>
                    <q-carousel-slide :name="3" class="column no-wrap">
                        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/p/AF1QipN-mmS6_z1lg5Irtn_XpIHLte5Tt_R2CLqpv2F2=s680-w680-h510-rw" />
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwZkbDh93brg_iTpOSVN73R0WWeZiUyRO_2KHmW9y8Di4_BQQeCRN-T1F2_4vxN5lxhUvs80cnzderCjt_9ERohbzt6TB_yYo-XXxD8M9OCdkJeKupTnvBykHZNARwXrSK9GYrZNA=s680-w680-h510-rw" />
                        </div>
                    </q-carousel-slide>
                    <q-carousel-slide :name="4" class="column no-wrap">
                        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/p/AF1QipPs3aLH9VNuJDuv5xUxOFwIKg_e4AIHKkSvxelo=s680-w680-h510-rw" />
                            <q-img class="rounded-borders col-6 full-height"
                                src="https://lh3.googleusercontent.com/p/AF1QipPQf6F4n63OrwWlYr5hpOwPuz3ZlahG18SFf46C=s680-w680-h510-rw" />
                        </div>
                    </q-carousel-slide>
                </q-carousel>
            </div>
        </section>
        <!-- PRODUTOS -->
        <section class="section light bg-secondary q-pb-lg">
            <div class="w100 row justify-center no-wrap">
                <q-btn color="green-14" class=" text-white  text-bold q-pa-md q-mt-lg" to="/catalogo" label="Ver Catálogo Completo"
                    icon-right="search" />
            </div>
            <div class="container rounded-borders q-pa-sm">
                <div class="cards">
                    <article class="product glass">
                        <h4>Ferramentas Elétricas</h4>
                        <p>Furadeira, Parafusadeira, Martelete, Esmerilhadeira.</p>
                    </article>
                    <article class="product glass">
                        <h4>Hidráulica & Bombas</h4>
                        <p>Bombas palito, Anauger, incêndio, poço artesiano.</p>
                    </article>
                    <article class="product glass">
                        <h4>Automação & Pneumática</h4>
                        <p>Conexões PU, válvulas, mangueiras, ferramentas pneumáticas.</p>
                    </article>
                    <article class="product glass">
                        <h4>Elétrica Industrial</h4>
                        <p>Motores elétricos, inversoras, geradores, quadros.</p>
                    </article>
                    <article class="product glass">
                        <h4>Agro & Jardim</h4>
                        <p>Cortador de grama, pulverizador, motosserra, forrageira.</p>
                    </article>
                    <article class="product glass">
                        <h4>Solda & Oficina</h4>
                        <p>Máquinas de solda, EPI, compressores, acessórios.</p>
                    </article>
                    <article class="product glass">
                        <h4>Medição & Precisão</h4>
                        <p>Paquímetro, multímetro, trena a laser, esquadro.</p>
                    </article>
                    <article class="product glass">
                        <h4>Acessórios & Transmissão</h4>
                        <p>Correias, polias, Topfusion, mangueiras.</p>
                    </article>
                </div>
                <div class="center mt">
                    <q-btn flat class="btn whats text-white" type="a" target="_blank" rel="noopener"
                        href="https://wa.me/556136290040?text=Ol%C3%A1!%20Pode%20me%20enviar%20o%20pre%C3%A7o%20e%20disponibilidade%20deste%20item%3F"
                        >Pedir orçamento no WhatsApp</q-btn>
                </div>
            </div>
        </section>

        <!-- HORÁRIOS / MAPA -->
        <section id="horarios" class="section alt q-py-md">
            <div class="container grid-2">
                <div class="glass card">
                    <div class="text-h2 q-pt-xs q-mb-md">Horários</div>
                    <table class="hours">
                        <tbody>
                            <tr>
                                <td>Segunda-feira</td>
                                <td>08:00 – 18:00</td>
                            </tr>
                            <tr>
                                <td>Terça-feira</td>
                                <td>08:00 – 18:00</td>
                            </tr>
                            <tr>
                                <td>Quarta-feira</td>
                                <td>08:00 – 18:00</td>
                            </tr>
                            <tr>
                                <td>Quinta-feira</td>
                                <td>08:00 – 18:00</td>
                            </tr>
                            <tr>
                                <td>Sexta-feira</td>
                                <td>08:00 – 18:00</td>
                            </tr>
                            <tr>
                                <td>Sábado</td>
                                <td>08:00 – 12:00</td>
                            </tr>
                            <tr>
                                <td>Domingo</td>
                                <td>Fechado</td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="note">* Atendimento presencial e consultivo. Fale conosco pelo WhatsApp para separar seu
                        produto.</p>
                </div>
                <div id="como-chegar" class="glass card">
                    <div class="text-h2">Endereço</div>
                    <p class="text-secondary q-pt-sm"><strong>Q D, LOTE, Av. Marginal, 01 - Esplanada I, Valparaíso de
                            Goiás -
                            GO, 72878-603</strong></p>
                    <div class="cta-row">
                        <q-btn color="secondary" unelevated class="btn primary" type="a" target="_blank" rel="noopener"
                            href="https://www.google.com/maps/dir/?api=1&destination=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s"
                            label="Navegar no Google Maps" icon-right="pin_drop" />
                        <q-btn flat class="btn ghost" href="tel:+556136290040" label="Ligar agora" icon-right="phone" />
                    </div>
                    <div class="mini-map">
                        <iframe title="Mapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps?q=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s&output=embed"></iframe>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer">
            <div class="container footer-grid q-pb-md">
                <div>
                    <div class="brand">
                        <div class="logo"><q-img style="border-radius: 20%;"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                                alt="Eletro Nogueira Logo" /></div>
                        <div class="brand-text">
                            <strong>Eletro Nogueira</strong>
                            <small>Em frente à BR-040 • Valparaíso de Goiás</small>
                        </div>
                    </div>
                    <p class="foot-copy q-pt-sm">Soluções em elétrica, hidráulica, automação e agro. Pronta-entrega e
                        suporte
                        técnico.
                    </p>
                </div>
                <div class="foot-links">
                    <a @click.prevent="scrollTo('#sobre')">Sobre</a>
                    <a @click.prevent="scrollTo('#produtos')">Produtos</a>
                    <a @click.prevent="scrollTo('#horarios')">Horários</a>
                    <a @click.prevent="scrollTo('#como-chegar')">Como chegar</a>
                </div>
                <div class="column">
                    <q-btn unelevated color="positive" class="text-shadow btn whats q-ml-xs" glossy type="a"
                        target="_blank" rel="noopener"
                        href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
                        WhatsApp
                        <q-img
                            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
                            alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
                    <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm"
                        href="tel:+556136290040" label="(61) 3629-0040" />
                </div>
            </div>
            <div class="copy q-mt-md">© {{ year }} Eletro Nogueira — 26.931.014/0001-12.</div>
        </footer>

    </q-page>
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

