<template>
  <q-page class="text-black" style="position: relative;">
    <!-- HERO -->
    <div class="img-parallax"></div>
    <section class="hero">
      <div class="hero-overlay"></div>

      <div
        class="hero-content glass rounded-borders bg-primary q-mx-sm animate__animated animate__zoomIn animate__delay-3s animate__slower q-mb-md q-mt-md">
        <!-- <p class="text-bold text-primary q-mt-sm">Ferramentas & Soluções</p>  -->
        <div v-if="!isMobile" class="w100 row justify-center text-center bg-primary">
          <div class="text-h5 text-secondary text-bold animate__animated animate__zoomIn animate__delay-43s animate__slower">
            <q-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
              class="text-negative">ELETRO</strong>NOGUEIRA<br>
          </div>
        </div>
        <div  class="w100 row justify-center no-wrap items-center text-center bg-primary  animate__animated animate__zoomIn animate__delay-5s animate__slower ">
          <q-input outlined color="secondary" v-model.trim="inputBuscar" class=" w100 rounded-borders bg-grey-2" @keyup.enter="buscarCatalogo()"
            label="O que você precisa?"></q-input>
          <q-btn color="secondary" unelevated class="btn q-ml-sm text-shadow" icon="search" @click="buscarCatalogo()"></q-btn>
        </div>
        <div class="cta-row">
          <q-btn color="secondary" unelevated class="btn  text-shadow" @click="scrollTo('#produtos')"
            label="produtos" />
          <q-btn color="secondary" unelevated class="btn text-shadow" @click="scrollTo('#servicos')"
            label="Serviços e Manutenção" />
          <q-btn class="btn text-shadow" color="secondary" @click="scrollTo('#como-chegar')" label="Como chegar" />
        </div>
        <div class="hero-badges flex flex-center">
          <div class="badge bg-grey-2 text-dark">Elétrica</div>
          <div class="badge bg-grey-2 text-dark">Hidráulica</div>
          <div class="badge bg-grey-2 text-dark">Automação</div>
          <div class="badge bg-grey-2 text-dark">Agro</div>
          <div class="badge bg-grey-2 text-dark">Industrial</div>
          <div class="badge bg-grey-2 text-dark">Manutenção</div>
        </div>
        <div
          class="open-now text-secondary q-pt-md text-center animate__animated animate__fadeInDown animate__delay-3s animate__slower">
          {{ openNowText }}</div>
      </div>
    </section>
    <section id="produtos" class="animate__animated animate__fadeInUp animate__delay-5s animate__slower">
      <!-- <div class="bg-grey-3 text-white q-pt-xl">
        <div class="text-h2 center text-secondary q-py-md">Produtos e Marcas</div>
      </div> -->
    </section>
    <!-- PRODUTOS -->
    <section class="section bg-grey-4 q-pt-lg animate__animated animate__fadeInUp animate__delay-3s animate__slower">
      <div class=" text-secondary">
        <div class="brand-tabs">
          <div class="container rounded-borders q-pa-sm">
            <div class="cards text-secondary">
              <article class=" bg-primary product glass"
                @click="goTo('/catalogo?q=furadeira&limit=12&page=1&orderBy=updated_desc')">
                <h4 class="text-bold">Furadeiras e Periféricos</h4>
              </article>
              <article class=" bg-primary product glass"
                @click="goTo('/catalogo?q=motor&limit=12&page=1&orderBy=updated_desc')">
                <h4 class="text-bold">Motores e Bombas</h4>
              </article>
              <article class=" bg-primary product glass"
                @click="goTo('/catalogo?q=cabo&limit=12&page=1&orderBy=updated_desc')">
                <h4 class="text-bold">Cabos e Conexões</h4>
              </article>
              <article class=" bg-secondary  product glass"
                @click="goTo('/catalogo?min=599.9&max=1299.9&limit=12&page=1&orderBy=updated_desc')">
                <h4 class="text-primary text-bold">E muito mais!</h4>
              </article>
            </div>
          </div>
          <q-tabs v-model="tab1" dense no-caps align="center" outside-arrows mobile-arrows indicator-color="transparent"
            class=" rounded-borders q-pa-xs q-pt-lg">
            <q-tab v-for="b in brandsRow1" :key="b.name" :name="b.name" :icon="`img:${b.src}`" class="brand-badge" />
          </q-tabs>
          <div class="w100 row justify-center no-wrap">
            <q-btn color="secondary" class=" text-white  text-bold q-pa-md q-my-md"
              to="/catalogo?min=199.9&max=599.9&limit=12&page=1&orderBy=updated_desc" label="Ver Catálogo Completo"
              icon-right="search" />
          </div>
          <!-- Linha 2 (6 logos) -->
          <q-tabs v-model="tab2" dense no-caps align="center" outside-arrows mobile-arrows indicator-color="transparent"
            class="rounded-borders q-pa-xs q-mt-sm q-pb-xl">
            <q-tab v-for="b in brandsRow2" :key="b.name" :name="b.name" :icon="b.src ? `img:${b.src}` : 'local_offer'"
              class="brand-badge" />
          </q-tabs>
        </div>
      </div>
    </section>
    <section id="servicos" class="section bg-secondary">
      <div class="container q-py-xl">
        <div class="row " :class="!isMobile ? 'q-gutter-x-sm no-wrap' : 'q-gutter-y-sm'">
          <!-- Coluna: Serviços -->
          <div class="col-12 col-md-6 ">
            <div class=" card q-pa-md bg-grey-3">
              <div class="text-h4 text-secondary q-mb-xs">Serviços</div>
              <p class="text-black q-mb-md q-py-md">
                Guindaste Munck, torno mecânico, solda TIG/MIG e rebobinagem de motores — equipe técnica para projetos e
                emergências.
              </p>

              <div class="q-gutter-md">
                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://armac.com.br/wordpress/wp-content/uploads/2023/01/armac-guindaste-e-munck-blog.jpg"
                        alt="Munck (Guindaste articulado)">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Munck</q-item-label>
                    <q-item-label caption>Guindaste articulado para içamento e movimentação com segurança e
                      agilidade.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://blog.ferramentaskennedy.com.br/wp-content/uploads/2024/05/o-que-um-torno-mecnico8695f1a75961409e918edbcd14fc128b.jpg"
                        alt="Torno mecânico">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Torno</q-item-label>
                    <q-item-label caption>Usinagem precisa para peças sob medida e recuperação.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://www.g20brasil.com.br/wp-content/uploads/2016/08/ferro-de-solda-dicas-cuidados.jpg"
                        alt="Solda TIG/MIG">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Solda</q-item-label>
                    <q-item-label caption>Processos TIG/MIG para reparos e fabricações com acabamento
                      limpo.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img src="https://www.agbrasil360.com.br/agreletrotecnica/imgs_eventos/53ec6-rebobinamento-6.jpg"
                        alt="Rebobinagem de motores elétricos">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Rebobinagem de Motores</q-item-label>
                    <q-item-label caption>Substituição de enrolamentos com teste e garantia de
                      desempenho.</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mt-md">
                <q-btn class="q-py-sm shadow-1 text-bold text-shadow w100" color="secondary" type="a" target="_blank"
                  rel="noopener"
                  href="https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os.">
                  Pedir orçamento no WhatsApp
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Coluna: Manutenção -->
          <div class="col-12 col-md-6">
            <div class=" card q-pa-md bg-grey-3">
              <div class="text-h4 text-secondary text-right q-mb-xs">Manutenção</div>
              <p class="text-black q-py-md text-right">
                Manutenção preventiva e corretiva com diagnóstico rápido e peças de qualidade.
              </p>
              <div class="q-gutter-md">
                <q-item class="service-item">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Bombas d’água</q-item-label>
                    <q-item-label caption>Troca de selo e rolamentos, limpeza de rotor e alinhamento.</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://blog.meritocomercial.com.br/wp-content/uploads/2023/11/manutencao-preventiva-bomba-de-agua-1024x683.jpg.webp"
                        alt="Manutenção de bombas d'água">
                    </q-avatar>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Mangueiras & Lavadoras</q-item-label>
                    <q-item-label caption>Crimpagem, troca de conexões e testes de pressão.</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://s1.kaercher-media.com/media/image/file/9734/d3/assistencia-tecnica-kaercher.webp"
                        alt="Mangueiras hidráulicas e lavadoras">
                    </q-avatar>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Compressores</q-item-label>
                    <q-item-label caption>Troca de óleo/filtros, revisão de válvulas e correias.</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://locadoraequiloc.com.br/wp-content/uploads/2022/07/manutencao-de-compressores-servico.jpg"
                        alt="Manutenção de compressores">
                    </q-avatar>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Automação industrial</q-item-label>
                    <q-item-label caption>Diagnóstico de CLP/inversores, sensores e painéis.</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img src="https://blog.safetycontrol.ind.br/wp-content/uploads/2023/05/Manutencao-001.png"
                        alt="Automação industrial">
                    </q-avatar>
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mt-md">
                <q-btn class="q-py-sm shadow-1 text-bold text-shadow w100" color="secondary" type="a" target="_blank"
                  rel="noopener"
                  href="https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica.">
                  Solicitar assistência técnica
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- SOBRE -->
     <div id="como-chegar"></div>
    <section id="" class=" animate__animated animate__slideInUp animate__delay-2s animate__slower bg-secondary">
      <div class="container grid-2">
        <div>
          <div class=" q-pa-md text-dark bg-primary" style="font-size: 1rem;border-radius: 4px;">
            <div class="w100 row justify-center text-center "
              style="border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;">
              <div class="text-h5 text-secondary text-bold bg-primary rounded-borders q-pa-md">
                <q-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                  alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
                  class="text-negative">Quem</strong>Somos?<br>
              </div>
            </div>
            <div class="q-mb-lg"></div>
            Somos uma <strong class="text-secondary text-bold">loja física em Valparaíso de Goiás</strong>, em frente à
            <strong class="text-secondary">BR-040</strong>, próximo
            da divisa com o DF.<br><br>
            Aqui você encontra uma linha completa de <strong class="text-secondary text-bold">ferramentas
              elétricas</strong>, <strong class="text-secondary text-bold">hidráulica</strong>, <strong
              class="text-secondary text-bold">automação
              industrial</strong>,
            <strong class="text-secondary text-bold">materiais elétricos</strong>, <strong
              class="text-secondary text-bold">agropecuária</strong>, <strong class="text-secondary text-bold">bombas
              d’água</strong>,
            <strong class="text-red text-bold">manutenção de equipamentos</strong> e <strong
              class="text-bold text-green">serviços
              especializados</strong> para seu projeto.<br><br>
          </div>
        </div>
        <div class="bg-primary text-secondary rounded-borders q-pa-md" style="font-size: 0.9rem;">
          <div class="w100 row justify-center text-center q-mb-xl"
            style="border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;">
            <div class="text-h5 text-secondary text-bold bg-primary rounded-borders q-pa-md">
              <q-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
                class="text-negative">Nossos</strong>Horários<br>
            </div>
          </div>
          <div style="font-size: 1.2rem;" class="">
            🟢 Segunda a Sexta: 8h às 18h<br>
            🟢 Sábado: 8h às 12h<br>
            🔴 Domingo: Fechado
          </div>
          <div class="q-pb-md"></div>
        </div>
      </div>
      <div class="w100 bg-primary" :class="isMobile ? '' : ''">
        <iframe title="Mapa" loading="lazy" height="380" class="w100" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s&output=embed"></iframe>
        <div class="bg-primary text-center q-py-md">
          <a href="https://maps.app.goo.gl/HmBYXDVNAGxB2iiZA" target="_blank"
            class="text-secondary text-bold text-center"><q-icon name="pin_drop" size="sm"></q-icon> Eletro Nogueira, Q
            D, LOTE, Av. Marginal, 01 - Esplanada I,
            Valparaíso
            de Goiás - GO, 72878-603</a>
        </div>
      </div>
    </section>
    <footer class="footer bg-secondary text-grey-3">
      <div class="container footer-grid q-pt-xl q-pb-md">
        <div>
          <div class="brand">
            <div class="logo"><q-img style="border-radius: 20%;"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                alt="Eletro Nogueira Logo" /></div>
            <div class="brand-text text-grey">
              <strong class="text-primary">EletroNogueira</strong>
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
          <q-btn unelevated color="positive" class="text-shadow btn whats q-ml-xs shadow-1" glossy type="a"
            target="_blank" rel="noopener"
            href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
            WhatsApp
            <q-img
              src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
              alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
          <q-btn icon-right="phone" color="primary" outline class=" btn q-mt-sm" href="tel:+556136296858"
            label="(61) 3629-6858" />
        </div>
      </div>
      <div class="w100 column justify-center items-center text-center">Siga-nos no Instagram!! <br></br><br><q-btn
          unelevated color="warning" class="text-shadow btn whats q-ml-sm" glossy type="a" target="_blank"
          rel="noopener" href="https://www.instagram.com/nogueiravalparaiso/">
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
import { useRouter } from 'vue-router'
const isMobile = useQuasar().screen.lt.md
const $q = useQuasar()
const leftDrawerOpen = ref(false)
const year = new Date().getFullYear()

const slide = ref(1)
const fs = ref(false)
const router = useRouter()
const inputBuscar = ref('')

const tab1 = ref('makita')
const tab2 = ref('nova_motores')

const brandsRow1 = [
  { name: 'makita', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Makita_Logo.svg/1280px-Makita_Logo.svg.png' },
  { name: 'black_decker', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Black%2BDecker_Logo.svg/1200px-Black%2BDecker_Logo.svg.png' },
  { name: '3m', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/3M_wordmark.svg/2560px-3M_wordmark.svg.png' },
  { name: 'bosch', src: 'https://logodownload.org/wp-content/uploads/2014/12/bosch-logo-0.png' },
  { name: 'tramontina', src: 'https://grandesnomesdapropaganda.com.br/wp-content/uploads/2020/01/Tramontina.jpg' },
  { name: 'stanley', src: 'https://logodownload.org/wp-content/uploads/2021/03/stanley-logo-1.png' }
]

const brandsRow2 = [
  { name: 'Karcher', src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Kaercher_Logo_2015.png' },
  { name: 'marluvas', src: 'https://images.seeklogo.com/logo-png/40/1/marluvas-logo-png_seeklogo-404913.png' },
  { name: 'Tigre', src: 'https://logodownload.org/wp-content/uploads/2016/09/tigre-logo-1-1.png' },
  { name: 'lamesa', src: 'https://http2.mlstatic.com/D_NQ_NP_896259-MLB77676344918_072024-O-cabo-fio-flexivel-cobre-15mm-100m-lamesa-450750v.webp' },
  { name: 'nova_motores', src: 'https://media.licdn.com/dms/image/v2/D563DAQFP8xwCqR0SpA/image-scale_191_1128/image-scale_191_1128/0/1721411832041/nova_motores_cover?e=2147483647&v=beta&t=NGpPzhgj6s10Y8SsfDc4CDaGt948DoRUxqqRC0R_QmI' },
  { name: 'matsuyama', src: 'https://www.matsuyama.ind.br/imagens/logo/logo-matsuyama-top.png' }
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
const openNowText = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const pad = n => String(n).padStart(2, '0')
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  const range = schedule[day]
  if (!range) return '🟡 Fechado hoje • Domingo'
  const [start, end] = range
  return (hhmm >= start && hhmm <= end)
    ? `🟢 Aberto agora • ${start} - ${end}`
    : `🔴 Fechado no momento • ${start} – ${end}`
})

function goTo(path) {
  router.push(path)
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')                     // separa acentos
    .replace(/[\u0300-\u036f]/g, '')      // remove acentos
    .replace(/ç/g, 'c')                   // garante ç -> c
    .trim()
}

function corrigirErrosComuns(text) {
  return text
    .replace(/\bconcerto\b/g, 'conserto')
    .replace(/\bmanutencao\b/g, 'manutencao')
    .replace(/\bassitencia\b/g, 'assistencia')
    .replace(/\btecnica\b/g, 'tecnica')
}

function buscarCatalogo() {
  if (!inputBuscar.value?.trim()) return

  let termoOriginal = inputBuscar.value.trim()
  let termo = normalizeText(termoOriginal)
  termo = corrigirErrosComuns(termo)

  // Palavras relacionadas a serviços/manutenção
  const termosServico = [
    'manutencao',
    'conserto',
    'assistencia',
    'tecnica',
    'lavadora',
    'bomba',
    'compressores',
    'mangueira',
    'crimpagem',
    'munck',
    'torno',
    'solda',
    'rebobinagem',
    'automacao'
  ]

  // Palavras relacionadas a localização
  const termosLocalizacao = [
    'horario',
    'horarios',
    'funcionamento',
    'abertura',
    'localizacao',
    'como chegar',
    'endereco',
    'telefone'
  ]

  // Se encontrar qualquer termo de serviço
  if (termosServico.some(t => termo.includes(t))) {
    router.push('/servicos-manutencao')
    return
  }

  // Se encontrar qualquer termo de localização
  if (termosLocalizacao.some(t => termo.includes(t))) {
    router.push('/localizacao')
    return
  }

  // Caso contrário, vai para catálogo
  router.push(`/catalogo?q=${encodeURIComponent(termoOriginal)}&limit=12&page=1&orderBy=updated_desc`)
}

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
* {
  z-index: 2;
}

.img-parallax {
  position: fixed;
  z-index: -999 !important;
  width: 100%;
  height: 100%;
  top: 0;
  background: #F7D102;
  background-image: url('/assets/loja.webp');
  left: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.brand-badge {
  background: #fff;
  border-radius: 14px;
  margin: 4px;
  min-height: 46px;
  padding: 0 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .08);
}

/* Controla o "tamanho do badge" e da imagem */
.brand-tabs :deep(.q-tab__content) {
  padding: 0;
}

/* QIcon quando usa icon="img:..." */
.brand-badge :deep(.q-icon) {
  width: 78px;
  height: 28px;
}

/* img dentro do q-icon */
.brand-badge :deep(.q-icon img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Responsivo: encolhe no mobile */
@media (max-width: 600px) {
  .brand-badge :deep(.q-icon) {
    width: 64px;
    height: 24px;
  }
}

@media (max-width: 600px) {
  .img-parallax {
    background-size: cover;
  }
}
</style>
