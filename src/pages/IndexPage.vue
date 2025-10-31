<template>
  <q-page class="text-black">
    <div class="open-now text-white text-shadow q-py-sm bg-secondary text-center">{{ openNowText }}</div>
    <!-- HERO -->
    <section class="hero">
      <img class="hero-bg" :src="heroImg" alt="Fachada Eletro Nogueira" />
      <div class="hero-overlay"></div>

      <div class="hero-content glass q-mx-sm animate__animated animate__fadeInUp animate__delay-3s animate__slower">
        <div class="text-h5 text-secondary text-bold">
          <q-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
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
    <section id="sobre" class="section q-py-md">
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
        <h2 class="center">Catálogo de Produtos</h2>
        <q-carousel v-model="slide" v-model:fullscreen="fs" transition-prev="slide-right" transition-next="slide-left"
          animated control-color="secondary" navigation padding arrows swipeable height="400px"
          class="bg-secondary-grad">
          <template #control>
            <q-btn flat dense color="secondary" round :icon="fs ? 'fullscreen_exit' : 'fullscreen'" @click="fs = !fs"
              class="q-ml-sm q-mt-sm" />
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
    <section class="section  bg-secondary-grad-2 q-pb-lg">
      <div class="w100 row justify-center no-wrap">
        <q-btn color="secondary" class=" text-white  text-bold q-pa-md " to="/catalogo"
          label="Ver Catálogo Completo" icon-right="search" />
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
          <q-btn id="horarios" class="btn whats q-py-sm shadow-1 text-bold text-shadow" color="positive" type="a" target="_blank" rel="noopener" glossy
            href="https://wa.me/556136290040?text=Ol%C3%A1!%20Pode%20me%20enviar%20o%20pre%C3%A7o%20e%20disponibilidade%20deste%20item%3F">Pedir
            orçamento no WhatsApp<q-img class="q-ml-sm"
              src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
              alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
        </div>
      </div>
    </section>

    <!-- HORÁRIOS / MAPA -->
    <section  class="section alt q-py-md">
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
      <footer class="footer q-pt-md">
        <div class="container footer-grid q-pb-md">
          <div>
            <div class="brand">
              <div class="logo"><q-img style="border-radius: 20%;"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                  alt="Eletro Nogueira Logo" /></div>
              <div class="brand-text">
                <strong class="text-secondary">Eletro Nogueira</strong>
                <small>Em frente à BR-040 • Valparaíso de Goiás</small>
              </div>
            </div>
            <p class="foot-copy q-pt-sm">Soluções em elétrica, hidráulica, automação e agro.<br>Pronta-entrega e
              suporte técnico.<br><br>CNPJ • <strong>26.931.014/0001-12.</strong>
            </p>
          </div>
          <div class="foot-links">
            <a class="cursor-pointer" @click.prevent="scrollTo('#sobre')">Sobre</a>
            <a class="cursor-pointer" @click.prevent="scrollTo('#produtos')">Produtos</a>
            <a class="cursor-pointer" @click.prevent="scrollTo('#horarios')">Horários</a>
            <a class="cursor-pointer" @click.prevent="scrollTo('#como-chegar')">Como chegar</a>
          </div>
          <div class="column">
            <q-btn unelevated color="positive" class="text-shadow btn whats q-ml-xs" glossy type="a" target="_blank"
              rel="noopener"
              href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
              WhatsApp
              <q-img
                src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
                alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
            <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm" href="tel:+556136290040"
              label="(61) 3629-0040" />
            <q-btn icon-right="phone" color="secondary" class=" btn q-mt-sm" href="tel:+556136296858"
              label="(61) 3629-6858" />
          </div>
        </div>
        <div class="w100 column justify-center items-center text-center">Siga-nos no Instagram!! <br></br><br><q-btn unelevated color="warning" class="text-shadow btn whats q-ml-sm" glossy type="a" target="_blank"
              rel="noopener"
              href="https://www.instagram.com/nogueiravalparaiso/">
              @nogueiravalparaiso
              <q-img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
                alt="Logo Instagram" style="border-radius:100%; width:30px; height:30px" /></q-btn></div>
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
const heroImg = '/assets/store2.png' // coloque a imagem em /public/assets
const slide = ref(3)
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
    ? `🟢 Aberto agora • ${start} - ${end}`
    : `🔴 Fechado no momento • ${start} – ${end}`
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
.section.alt {
  background: linear-gradient(180deg, rgba(30, 74, 168, .06), transparent 70%)
}
</style>
