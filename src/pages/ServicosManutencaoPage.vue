<template>
  <q-page class="svc-page q-mt-xl">
    <div class="w100 q-pt-xl"></div>
    <div class="svc-shell q-py-xl">
      <section class="svc-content-section q-pt-xl">
        <div class="section-heading">
          <div>
            <div class="section-kicker">Soluções técnicas</div>
            <h2>Escolha o atendimento que você precisa</h2>
          </div>

          <q-btn
            flat
            dense
            color="secondary"
            icon-right="mdi-whatsapp"
            label="Falar no WhatsApp"
            type="a"
            target="_blank"
            rel="noopener"
            :href="whatsAssistencia"
          />
        </div>

        <div class="svc-grid">
          <q-card class="svc-category-card">
            <q-card-section class="svc-category-head">
              <div class="svc-category-icon">
                <q-icon name="precision_manufacturing" />
              </div>

              <div>
                <h3>Serviços</h3>
                <p>Equipe técnica para projetos, fabricação, recuperação e demandas industriais.</p>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="svc-list">
              <article
                v-for="item in services"
                :key="item.title"
                class="svc-item"
                @click="openWhatsWithTerm(item.title)"
              >
                <q-img
                  :src="item.img"
                  :alt="item.title"
                  fit="cover"
                  class="svc-item-img"
                  spinner-color="secondary"
                >
                  <template #error>
                    <div class="absolute-full flex flex-center bg-grey-3">
                      <q-icon name="image_not_supported" size="32px" color="grey-6" />
                    </div>
                  </template>
                </q-img>

                <div class="svc-item-body">
                  <div class="svc-item-title">{{ item.title }}</div>
                  <div class="svc-item-desc">{{ item.desc }}</div>
                </div>

                <q-icon name="arrow_forward" class="svc-item-arrow" />
              </article>

              <q-btn
                class="w100 q-mt-sm svc-main-btn"
                unelevated
                color="secondary"
                text-color="white"
                icon="mdi-whatsapp"
                label="Pedir orçamento de serviço"
                type="a"
                target="_blank"
                rel="noopener"
                :href="whatsServico"
              />
            </q-card-section>
          </q-card>

          <q-card class="svc-category-card">
            <q-card-section class="svc-category-head svc-category-head--alt">
              <div class="svc-category-icon">
                <q-icon name="home_repair_service" />
              </div>

              <div>
                <h3>Manutenção</h3>
                <p>Preventiva e corretiva com diagnóstico rápido, peças e suporte especializado.</p>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="svc-list">
              <article
                v-for="item in maintenance"
                :key="item.title"
                class="svc-item"
                @click="openWhatsWithTerm(item.title)"
              >
                <q-img
                  :src="item.img"
                  :alt="item.title"
                  fit="cover"
                  class="svc-item-img"
                  spinner-color="secondary"
                >
                  <template #error>
                    <div class="absolute-full flex flex-center bg-grey-3">
                      <q-icon name="image_not_supported" size="32px" color="grey-6" />
                    </div>
                  </template>
                </q-img>

                <div class="svc-item-body">
                  <div class="svc-item-title">{{ item.title }}</div>
                  <div class="svc-item-desc">{{ item.desc }}</div>
                </div>

                <q-icon name="arrow_forward" class="svc-item-arrow" />
              </article>

              <q-btn
                class="w100 q-mt-sm svc-main-btn"
                unelevated
                color="secondary"
                text-color="white"
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
      </section>

      <q-card class="svc-cta">
        <q-card-section class="svc-cta-content">
          <div class="svc-cta-text">
            <div class="svc-cta-kicker">Atendimento local</div>
            <h2>Está em Valparaíso de Goiás ou entorno do DF?</h2>
            <p>
              Fale com a equipe, envie fotos ou detalhes do equipamento e receba orientação para orçamento,
              manutenção ou assistência técnica.
            </p>
          </div>

          <div class="svc-cta-actions">
            <q-btn
              outline
              color="secondary"
              icon="place"
              label="Localização"
              to="/localizacao"
            />

            <q-btn
              outline
              color="secondary"
              icon="call"
              label="Ligar"
              type="a"
              href="tel:+556136296858"
            />

            <q-btn
              unelevated
              color="green-14"
              text-color="white"
              icon="mdi-whatsapp"
              label="WhatsApp"
              type="a"
              target="_blank"
              rel="noopener"
              :href="whatsAssistencia"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <footer class="footer">
      <div class="footer-copy">
        © Eletro Nogueira — 26.931.014/0001-12.
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

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
  'munck'
]

const services = [
  {
    title: 'Munck',
    desc: 'Guindaste articulado para içamento e movimentação com segurança e agilidade.',
    img: 'https://armac.com.br/wordpress/wp-content/uploads/2023/01/armac-guindaste-e-munck-blog.jpg'
  },
  {
    title: 'Torno',
    desc: 'Usinagem precisa para peças sob medida, ajustes técnicos e recuperação.',
    img: 'https://blog.ferramentaskennedy.com.br/wp-content/uploads/2024/05/o-que-um-torno-mecnico8695f1a75961409e918edbcd14fc128b.jpg'
  },
  {
    title: 'Solda TIG/MIG',
    desc: 'Reparos e fabricações com acabamento limpo e aplicação profissional.',
    img: 'https://www.g20brasil.com.br/wp-content/uploads/2016/08/ferro-de-solda-dicas-cuidados.jpg'
  },
  {
    title: 'Rebobinagem de motores',
    desc: 'Substituição de enrolamentos com teste e garantia de desempenho.',
    img: 'https://www.agbrasil360.com.br/agreletrotecnica/imgs_eventos/53ec6-rebobinamento-6.jpg'
  }
]

const maintenance = [
  {
    title: 'Bombas d’água',
    desc: 'Troca de selo e rolamentos, limpeza de rotor, alinhamento e revisão.',
    img: 'https://blog.meritocomercial.com.br/wp-content/uploads/2023/11/manutencao-preventiva-bomba-de-agua-1024x683.jpg.webp'
  },
  {
    title: 'Mangueiras e lavadoras',
    desc: 'Crimpagem, troca de conexões, manutenção e testes de pressão.',
    img: 'https://s1.kaercher-media.com/media/image/file/9734/d3/assistencia-tecnica-kaercher.webp'
  },
  {
    title: 'Compressores',
    desc: 'Troca de óleo, filtros, revisão de válvulas, correias e funcionamento.',
    img: 'https://locadoraequiloc.com.br/wp-content/uploads/2022/07/manutencao-de-compressores-servico.jpg'
  },
  {
    title: 'Automação industrial',
    desc: 'Diagnóstico de CLP, inversores, sensores, painéis e sistemas elétricos.',
    img: 'https://blog.safetycontrol.ind.br/wp-content/uploads/2023/05/Manutencao-001.png'
  }
]

const whatsServico =
  'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira!%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os.'

const whatsAssistencia =
  'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira!%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica.'

function openWhatsWithTerm(term) {
  const msg = encodeURIComponent(`Olá Eletro Nogueira! Preciso de orçamento para: ${term}. Estou próximo(a) da loja.`)
  window.open(`https://wa.me/556136296858?text=${msg}`, '_blank', 'noopener')
}
</script>

<style scoped>
.svc-page {
  --en-yellow: #ffd200;
  --en-blue: #1e4aa8;
  --en-navy: #012060;
  --en-dark: #03122e;
  --en-green: #22c55e;
  --text: #0d1b2a;
  --muted: #52657d;
  --card: #ffffff;

  /*
    Ajuste fino para o header novo do LandingLayout.
    Como a navbar agora tem topbar + busca inteligente + categorias,
    o sticky precisa parar abaixo dela.
  */
  --svc-navbar-offset: 186px;

  min-height: 100vh;
  padding: 22px 16px 72px;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(255, 210, 0, 0.22), transparent 32%),
    linear-gradient(180deg, #f4f6fb 0%, #eef2f7 100%);
}

.svc-shell {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.svc-top-card {
  position: sticky;
  top: calc(var(--svc-navbar-offset) + env(safe-area-inset-top));
  z-index: 20;
  overflow: hidden;
  border-radius: 28px;
  padding: 18px;
  color: #ffffff;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 210, 0, 0.22), transparent 34%),
    linear-gradient(135deg, var(--en-blue) 0%, var(--en-dark) 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 18px 44px rgba(1, 32, 96, 0.20);
}

.svc-breadcrumb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.svc-breadcrumbs {
  color: #ffffff;
}

.svc-breadcrumbs :deep(.q-breadcrumbs__el),
.svc-breadcrumbs :deep(.q-icon) {
  color: #ffffff;
  font-weight: 800;
}

.svc-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr);
  gap: 18px;
  align-items: stretch;
}

.svc-hero-copy {
  min-width: 0;
}

.svc-kicker {
  font-weight: 900;
}

.svc-hero-copy h1 {
  margin: 12px 0 6px;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.svc-hero-copy p {
  max-width: 780px;
  margin: 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 15px;
  line-height: 1.55;
}

.svc-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.svc-action-btn {
  border-radius: 16px;
  min-height: 44px;
  font-weight: 900;
}

.svc-hero-panel {
  display: grid;
  gap: 10px;
  align-content: center;
  padding: 12px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(10px);
}

.svc-panel-item {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.10);
}

.svc-panel-item .q-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: var(--en-navy);
  background: var(--en-yellow);
  font-size: 24px;
}

.svc-panel-item strong {
  display: block;
  font-size: 13px;
  line-height: 1.15;
}

.svc-panel-item span {
  display: block;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.35;
}

.quick-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.quick-chip {
  border-radius: 999px;
  font-weight: 800;
  box-shadow: 0 6px 16px rgba(1, 32, 96, 0.12);
}

.svc-content-section {
  margin-top: 24px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.section-kicker {
  color: var(--en-blue);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-heading h2 {
  margin: 4px 0 0;
  color: var(--en-dark);
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.08;
  font-weight: 950;
  letter-spacing: -0.03em;
}

.svc-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.svc-category-card {
  overflow: hidden;
  border-radius: 24px;
  background: var(--card);
  border: 1px solid rgba(1, 32, 96, 0.08);
  box-shadow: 0 14px 34px rgba(1, 32, 96, 0.10);
}

.svc-category-head {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 14px;
  align-items: center;
  min-height: 116px;
  padding: 18px;
  background:
    radial-gradient(circle at top left, rgba(255, 210, 0, 0.20), transparent 38%),
    linear-gradient(135deg, rgba(1, 32, 96, 0.05), rgba(255, 255, 255, 1));
}

.svc-category-head--alt {
  background:
    radial-gradient(circle at top right, rgba(30, 74, 168, 0.12), transparent 36%),
    linear-gradient(135deg, rgba(255, 210, 0, 0.12), rgba(255, 255, 255, 1));
}

.svc-category-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: var(--en-yellow);
  background: var(--en-navy);
  box-shadow: 0 10px 22px rgba(1, 32, 96, 0.18);
}

.svc-category-icon .q-icon {
  font-size: 30px;
}

.svc-category-head h3 {
  margin: 0;
  color: var(--en-navy);
  font-size: 23px;
  font-weight: 950;
  letter-spacing: -0.02em;
}

.svc-category-head p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

.svc-list {
  display: grid;
  gap: 10px;
  padding: 14px;
}

.svc-item {
  display: grid;
  grid-template-columns: 86px 1fr 28px;
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  border-radius: 18px;
  cursor: pointer;
  background: #f7f9fc;
  border: 1px solid rgba(1, 32, 96, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.svc-item:hover {
  transform: translateY(-2px);
  background: #ffffff;
  border-color: rgba(1, 32, 96, 0.14);
  box-shadow: 0 12px 24px rgba(1, 32, 96, 0.10);
}

.svc-item-img {
  width: 86px;
  height: 76px;
  border-radius: 15px;
  overflow: hidden;
  background: #e8edf5;
}

.svc-item-body {
  min-width: 0;
}

.svc-item-title {
  color: var(--en-dark);
  font-size: 15px;
  line-height: 1.2;
  font-weight: 950;
}

.svc-item-desc {
  display: -webkit-box;
  margin-top: 5px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.svc-item-arrow {
  color: var(--en-blue);
  font-size: 22px;
  opacity: 0.8;
}

.svc-main-btn {
  min-height: 44px;
  border-radius: 16px;
  font-weight: 950;
}

.svc-cta {
  overflow: hidden;
  margin-top: 22px;
  border-radius: 26px;
  border: 1px solid rgba(1, 32, 96, 0.08);
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 210, 0, 0.28), transparent 32%),
    #ffffff;
  box-shadow: 0 14px 34px rgba(1, 32, 96, 0.10);
}

.svc-cta-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px;
}

.svc-cta-kicker {
  color: var(--en-blue);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.svc-cta h2 {
  margin: 5px 0 6px;
  color: var(--en-dark);
  font-size: clamp(21px, 3vw, 32px);
  line-height: 1.08;
  font-weight: 950;
}

.svc-cta p {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.svc-cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.svc-cta-actions .q-btn {
  border-radius: 14px;
  font-weight: 900;
}

.footer {
  width: min(100%, 1180px);
  margin: 22px auto 0;
  padding: 18px;
  border-radius: 22px;
  text-align: center;
  background: var(--en-navy);
  box-shadow: 0 12px 28px rgba(1, 32, 96, 0.12);
}

.footer-copy {
  color: var(--en-yellow);
  font-weight: 900;
}

@media (max-width: 1023px) {
  .svc-page {
    --svc-navbar-offset: 158px;
    padding: 16px 12px 64px;
  }

  .svc-top-card {
    border-radius: 22px;
    padding: 14px;
  }

  .svc-hero-grid {
    grid-template-columns: 1fr;
  }

  .svc-hero-panel {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .svc-panel-item {
    grid-template-columns: 1fr;
    align-content: start;
  }

  .svc-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }

  .svc-cta-content {
    grid-template-columns: 1fr;
  }

  .svc-cta-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 599px) {
  .svc-page {
    --svc-navbar-offset: 142px;
    padding: 12px 10px 56px;
  }

  .svc-top-card {
    position: relative;
    top: auto;
    border-radius: 20px;
  }

  .svc-breadcrumb-row {
    margin-bottom: 10px;
  }

  .svc-hero-copy h1 {
    font-size: 29px;
  }

  .svc-hero-copy p {
    font-size: 13px;
  }

  .svc-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .svc-action-btn {
    width: 100%;
  }

  .svc-hero-panel {
    grid-template-columns: 1fr;
  }

  .svc-panel-item {
    grid-template-columns: 38px 1fr;
  }

  .quick-wrap {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 6px;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }

  .quick-wrap::-webkit-scrollbar {
    display: none;
  }

  .quick-chip {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .section-heading h2 {
    font-size: 24px;
  }

  .svc-category-head {
    grid-template-columns: 50px 1fr;
    min-height: unset;
    padding: 15px;
  }

  .svc-category-icon {
    width: 50px;
    height: 50px;
    border-radius: 16px;
  }

  .svc-category-head h3 {
    font-size: 20px;
  }

  .svc-item {
    grid-template-columns: 74px 1fr;
    gap: 10px;
  }

  .svc-item-img {
    width: 74px;
    height: 70px;
  }

  .svc-item-arrow {
    display: none;
  }

  .svc-item-title {
    font-size: 14px;
  }

  .svc-item-desc {
    font-size: 11px;
    -webkit-line-clamp: 3;
  }

  .svc-cta-content {
    padding: 18px;
  }

  .svc-cta-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .svc-cta-actions .q-btn {
    width: 100%;
  }

  .footer {
    border-radius: 18px;
    padding: 16px 12px;
  }
}
</style>