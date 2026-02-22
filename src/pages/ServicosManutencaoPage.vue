<template>
  <q-page class="svc-page bg-grey-3" :class="!isMobile ? 'q-px-xl q-pb-xl' : 'q-px-md q-pb-lg'">
    <!-- HERO / HEADER -->
    <section class="svc-hero bg-primary q-pa-md q-pt-xl q-mt-md">
      <q-breadcrumbs class="text-secondary animate__animated animate__fadeInDown animate__delay-3s animate__slower">
        <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
        <q-breadcrumbs-el class="text-bold" label="Serviços e Manutenção" to="/servicos-manutencao" />
      </q-breadcrumbs>

      <div class="row items-start justify-between q-mt-xs q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="text-h5 text-secondary text-weight-bolder">
            Serviços e Manutenção
          </div>
          <div class="row q-col-gutter-sm q-mt-md">
            <div class="col-12 col-sm-6 col-md-4">
              <q-btn
                unelevated
                color="secondary"
                text-color="primary"
                class="w100 svc-btn"
                icon="mdi-whatsapp"
                label="Pedir orçamento"
                type="a"
                target="_blank"
                rel="noopener"
                :href="whatsServico"
              />
            </div>
            <div class="col-12 col-sm-6 col-md-4">
              <q-btn
                outline
                color="secondary"
                class="w100 svc-btn"
                icon="call"
                label="Ligar agora"
                type="a"
                href="tel:+556136296858"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                outline
                color="secondary"
                class="w100 svc-btn"
                icon="place"
                label="Ver localização"
                to="/localizacao"
              />
            </div>
          </div>
        </div>

      </div>

      <q-separator class="q-my-md" color="grey-7" />

      <!-- QUICK TERMS (chips) -->
      <div class="quick-wrap row justify-center">
        <q-chip
          v-for="t in quickTerms"
          :key="t"
          clickable
          class="quick-chip"
          color="grey-2"
          text-color="grey-9"
          @click="openWhatsWithTerm(t)"
        >
          {{ t }}
        </q-chip>
      </div>
    </section>

    <!-- CONTEÚDO -->
    <section class="q-mt-md">
      <div class="row q-col-gutter-md">
        <!-- SERVIÇOS -->
        <div class="col-12 col-md-6">
          <q-card class="svc-card">
            <q-card-section class="svc-card-head">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h5 text-secondary text-weight-bolder">Serviços</div>
                  <div class="text-grey-8 q-mt-xs">
                    Equipe técnica para projetos e emergências.
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
              <div class="svc-list">
                <ServiceRow
                  title="Munck"
                  desc="Guindaste articulado para içamento e movimentação com segurança e agilidade."
                  img="https://armac.com.br/wordpress/wp-content/uploads/2023/01/armac-guindaste-e-munck-blog.jpg"
                />
                <ServiceRow
                  title="Torno"
                  desc="Usinagem precisa para peças sob medida e recuperação."
                  img="https://blog.ferramentaskennedy.com.br/wp-content/uploads/2024/05/o-que-um-torno-mecnico8695f1a75961409e918edbcd14fc128b.jpg"
                />
                <ServiceRow
                  title="Solda TIG/MIG"
                  desc="Reparos e fabricações com acabamento limpo."
                  img="https://www.g20brasil.com.br/wp-content/uploads/2016/08/ferro-de-solda-dicas-cuidados.jpg"
                />
                <ServiceRow
                  title="Rebobinagem de motores"
                  desc="Substituição de enrolamentos com teste e garantia de desempenho."
                  img="https://www.agbrasil360.com.br/agreletrotecnica/imgs_eventos/53ec6-rebobinamento-6.jpg"
                />
              </div>

              <q-btn
                class="w100 q-mt-md svc-btn"
                unelevated
                color="secondary"
                text-color="primary"
                icon="mdi-whatsapp"
                label="Pedir orçamento no WhatsApp"
                type="a"
                target="_blank"
                rel="noopener"
                :href="whatsServico"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- MANUTENÇÃO -->
        <div class="col-12 col-md-6">
          <q-card class="svc-card">
            <q-card-section class="svc-card-head alt">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h5 text-secondary text-weight-bolder">Manutenção</div>
                  <div class="text-grey-8 q-mt-xs">
                    Preventiva e corretiva com diagnóstico rápido.
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
              <div class="svc-list">
                <ServiceRow
                  reverse
                  title="Bombas d’água"
                  desc="Troca de selo e rolamentos, limpeza de rotor e alinhamento."
                  img="https://blog.meritocomercial.com.br/wp-content/uploads/2023/11/manutencao-preventiva-bomba-de-agua-1024x683.jpg.webp"
                />
                <ServiceRow
                  reverse
                  title="Mangueiras & Lavadoras"
                  desc="Crimpagem, troca de conexões e testes de pressão."
                  img="https://s1.kaercher-media.com/media/image/file/9734/d3/assistencia-tecnica-kaercher.webp"
                />
                <ServiceRow
                  reverse
                  title="Compressores"
                  desc="Troca de óleo/filtros, revisão de válvulas e correias."
                  img="https://locadoraequiloc.com.br/wp-content/uploads/2022/07/manutencao-de-compressores-servico.jpg"
                />
                <ServiceRow
                  reverse
                  title="Automação industrial"
                  desc="Diagnóstico de CLP/inversores, sensores e painéis."
                  img="https://blog.safetycontrol.ind.br/wp-content/uploads/2023/05/Manutencao-001.png"
                />
              </div>

              <q-btn
                class="w100 q-mt-md svc-btn"
                unelevated
                color="secondary"
                text-color="primary"
                icon="mdi-whatsapp"
                label="Solicitar assistência técnica"
                type="a"
                target="_blank"
                rel="noopener"
                :href="whatsAssistencia"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- BLOCO LOCAL SEO / CTA -->
      <q-card class="svc-cta q-mt-md">
        <q-card-section class="q-pa-md">
          <div class="row items-start q-col-gutter-md">
            <div class="col-12 col-md">
              <div class="text-subtitle1 text-weight-bolder text-grey-9">
                Atendimento em Valparaíso de Goiás e entorno do DF
              </div>
              <div class="text-grey-8 q-mt-xs">
                Se você está próximo à BR-040, fale com a equipe e peça orçamento. Atendimento local, rápido e com suporte
                técnico especializado.
              </div>
            </div>

            <div class="col-12 col-md-auto">
              <div class="row q-gutter-sm">
                <q-btn outline color="secondary" icon="place" label="Localização" to="/localizacao" />
                <q-btn outline color="secondary" icon="call" label="Ligar" type="a" href="tel:+556136296858" />
                <q-btn
                  unelevated
                  color="green-14"
                  icon="mdi-whatsapp"
                  label="WhatsApp"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="whatsAssistencia"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </section>

    <div class="w100 q-py-xl"></div>
  </q-page>

  <!-- Footer (mantido) -->
  <footer class="footer q-pt-xl bg-primary">
    <div class="container footer-grid q-pb-md">
      <div>
        <div class="brand">
          <div class="logo">
            <q-img
              style="border-radius: 20%;"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="Eletro Nogueira Logo"
            />
          </div>
          <div class="brand-text">
            <strong class="text-secondary">EletroNogueira</strong>
            <small>Em frente à BR-040 • Valparaíso de Goiás</small>
          </div>
        </div>
        <p class="foot-copy q-pt-sm">
          Soluções em elétrica, hidráulica, automação e agro.<br />Pronta-entrega e
          suporte técnico.<br /><br />CNPJ • <strong>26.931.014/0001-12.</strong>
        </p>
      </div>

      <div class="column">
        <q-btn
          unelevated
          color="positive"
          class="text-shadow btn whats q-ml-xs"
          glossy
          type="a"
          target="_blank"
          rel="noopener"
          href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento."
        >
          WhatsApp
          <q-img
            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
            alt="EN"
            style="border-radius:100%; width:30px; height:30px"
          />
        </q-btn>

        <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm" href="tel:+556136290040"
          label="(61) 3629-0040" />
        <q-btn icon-right="phone" color="secondary" class="btn q-mt-sm" href="tel:+556136296858"
          label="(61) 3629-6858" />
      </div>
    </div>

    <div class="w100 column justify-center items-center text-center">
      Siga-nos no Instagram!!
      <br /><br />
      <q-btn
        unelevated
        color="warning"
        class="text-shadow btn whats q-ml-sm"
        glossy
        type="a"
        target="_blank"
        rel="noopener"
        href="https://www.instagram.com/nogueiravalparaiso/"
      >
        @nogueiravalparaiso
        <q-img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
          alt="Logo Instagram"
          style="border-radius:100%; width:30px; height:30px"
        />
      </q-btn>
    </div>

    <div class="copy q-mt-md">© Eletro Nogueira — 26.931.014/0001-12.</div>
  </footer>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'
import { useQuasar, QItem, QItemSection, QItemLabel, QAvatar } from 'quasar'

const $q = useQuasar()
const isMobile = computed(() => $q.screen.lt.md)

const quickTerms = [
  'manutenção de lavadoras',
  'mangueiras hidráulicas',
  'crimpagem de mangueiras',
  'manutenção de bombas d’água',
  'manutenção de compressores',
  'automação industrial',
  'solda TIG',
  'solda MIG',
  'rebobinagem de motores',
  'torno mecânico',
  'munck (guindaste articulado)'
]

const whatsServico =
  'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira!%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os.'
const whatsAssistencia =
  'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira!%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica.'

function openWhatsWithTerm(term) {
  const msg = encodeURIComponent(`Olá Eletro Nogueira! Preciso de orçamento para: ${term}. Estou próximo(a) da loja.`)
  window.open(`https://wa.me/556136296858?text=${msg}`, '_blank', 'noopener')
}

/**
 * Componente inline só pra evitar repetição e
 * resolver o “espaço aleatório” do avatar/texto.
 */
const ServiceRow = defineComponent({
  name: 'ServiceRow',
  props: {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    reverse: { type: Boolean, default: false }
  },
  setup(props) {
    return () =>
      h(
        QItem,
        { class: ['svc-item', props.reverse ? 'reverse' : ''] },
        () => [
          h(
            QItemSection,
            { avatar: !props.reverse },
            () =>
              !props.reverse
                ? h(
                    QAvatar,
                    { size: '64px', rounded: true, class: 'svc-avatar' },
                    () => h('img', { src: props.img, alt: props.title })
                  )
                : null
          ),
          h(QItemSection, { class: 'svc-text' }, () => [
            h(QItemLabel, { class: 'text-weight-bold text-grey-9' }, () => props.title),
            h(QItemLabel, { caption: true, class: 'text-grey-7' }, () => props.desc)
          ]),
          h(
            QItemSection,
            { avatar: props.reverse },
            () =>
              props.reverse
                ? h(
                    QAvatar,
                    { size: '64px', rounded: true, class: 'svc-avatar' },
                    () => h('img', { src: props.img, alt: props.title })
                  )
                : null
          )
        ]
      )
  }
})
</script>

<style scoped>
.svc-page {
  min-height: 100vh;
}

/* HERO */
.svc-hero {
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .12);
}

.hero-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, .06);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 24px rgba(0,0,0,.10);
}

/* quick chips */
.quick-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .quick-wrap {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 6px;
    -webkit-overflow-scrolling: touch;
  }
  .quick-wrap::-webkit-scrollbar {
    height: 6px;
  }
}

.quick-chip {
  border-radius: 999px;
  font-weight: 700;
}

/* cards */
.svc-card {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .12);
}

.svc-card-head {
  padding: 18px;
  background: linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
}
.svc-card-head.alt {
  background: linear-gradient(135deg, rgba(0,0,0,.03), rgba(0,0,0,.01));
}

.svc-btn {
  border-radius: 14px;
  font-weight: 800;
  letter-spacing: .2px;
}

/* list + rows */
.svc-list {
  display: grid;
  gap: 10px;
}

.svc-item {
  border-radius: 16px;
  background: #fff;
  padding: 10px 10px;
  align-items: center;
}

/* AQUI resolve o “espaço aleatório” */
.svc-item :deep(.q-item__section--avatar) {
  min-width: auto !important;
  padding-right: 10px !important;
}
.svc-item.reverse :deep(.q-item__section--avatar) {
  padding-right: 0 !important;
  padding-left: 10px !important;
}

.svc-avatar {
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(0,0,0,.12);
}
.svc-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* CTA */
.svc-cta {
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .10);
}
</style>