<template>
  <q-page class="loc-page q-mt-xl">
    <div class="w100 q-py-xl"></div>

    <div class="loc-shell q-py-xl">
      <section class="loc-hero bg-secondary">
        <div class="loc-hero-copy">
          <div class="section-kicker">Localização e horários</div>

          <h1>Como chegar</h1>

          <p>
            Estamos em Valparaíso de Goiás, com atendimento para compra de produtos,
            retirada na loja, suporte técnico e orçamento pelo WhatsApp.
          </p>
        </div>

        <div class="loc-hero-actions">
          <q-btn
            outline
            color="secondary"
            text-color="primary"
            icon="directions"
            label="Traçar rota"
            class="loc-action-btn"
            type="a"
            target="_blank"
            rel="noopener"
            :href="googleDirectionsUrl"
          />

          <q-btn
            outline
            color="grey-2"
            icon="phone"
            label="Ligar agora"
            class="loc-action-btn"
            type="a"
            href="tel:+556136290040"
          />

          <q-btn
            unelevated
            color="green-14"
            text-color="white"
            icon="mdi-whatsapp"
            label="WhatsApp"
            class="loc-action-btn"
            type="a"
            target="_blank"
            rel="noopener"
            :href="whatsUrl"
          />
        </div>
      </section>

      <section class="loc-content-section">
        <div class="loc-grid">
          <q-card class="loc-card loc-map-card">
            <q-card-section class="loc-card-head">
              <div class="loc-card-title-row">
                <div class="loc-card-icon">
                  <q-icon name="place" />
                </div>

                <div>
                  <h2>Endereço</h2>
                  <p>{{ address }}</p>
                </div>
              </div>

              <div class="loc-card-actions">
                <q-btn
                  dense
                  flat
                  color="secondary"
                  icon="content_copy"
                  label="Copiar endereço"
                  @click="copyAddress"
                />

                <q-btn
                  dense
                  unelevated
                  color="secondary"
                  text-color="primary"
                  icon="map"
                  label="Abrir no Maps"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="googleMapsUrl"
                />
              </div>
            </q-card-section>

            <q-separator />

            <div class="map-wrap">
              <iframe
                title="Mapa da Eletro Nogueira"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="map-iframe"
                :src="mapEmbedUrl"
              ></iframe>

              <div class="map-overlay">
                <div>
                  <div class="map-overlay-title">📍 Eletro Nogueira</div>
                  <div class="map-overlay-text">Av. Marginal, Esplanada I</div>
                </div>

                <q-btn
                  dense
                  unelevated
                  color="secondary"
                  text-color="primary"
                  icon="directions"
                  label="Rota"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="googleDirectionsUrl"
                />
              </div>
            </div>
          </q-card>

          <q-card class="loc-card loc-hours-card">
            <q-card-section class="loc-card-head">
              <div class="loc-card-title-row">
                <div class="loc-card-icon">
                  <q-icon name="schedule" />
                </div>

                <div>
                  <h2>Horários</h2>
                  <p>Confira antes de sair de casa.</p>
                </div>
              </div>

              <q-badge
                :color="openStatus.open ? 'green-14' : 'negative'"
                text-color="white"
                class="status-badge"
              >
                {{ openStatus.label }}
              </q-badge>
            </q-card-section>

            <q-separator />

            <q-card-section class="hours-section">
              <div class="hours-grid">
                <div
                  v-for="item in hours"
                  :key="item.day"
                  class="hours-row"
                  :class="{ 'hours-row--today': item.isToday }"
                >
                  <div class="hours-left">
                    <div class="hours-day">{{ item.day }}</div>
                    <div class="hours-time">{{ item.time }}</div>
                  </div>

                  <q-badge
                    outline
                    :color="item.color"
                    class="hours-badge"
                  >
                    {{ item.badge }}
                  </q-badge>
                </div>
              </div>

              <q-banner class="hours-banner">
                <template #avatar>
                  <q-icon name="info" color="secondary" />
                </template>

                Quer separar seu produto antes de ir? Chame no WhatsApp e confirme disponibilidade.
              </q-banner>

              <div class="hours-actions">
                <q-btn
                  unelevated
                  color="green-14"
                  text-color="white"
                  icon="mdi-whatsapp"
                  label="Separar produto pelo WhatsApp"
                  class="w100 loc-main-btn"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="whatsUrl"
                />

                <q-btn
                  outline
                  color="secondary"
                  icon="call"
                  label="Ligar para a loja"
                  class="w100 loc-main-btn"
                  type="a"
                  href="tel:+556136290040"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </section>

      <section class="gallery-section">
        <div class="section-heading">
          <div>
            <div class="section-kicker">Nossa loja</div>
          </div>

          <q-btn
            flat
            dense
            color="secondary"
            icon-right="open_in_new"
            label="Ver no Google"
            type="a"
            target="_blank"
            rel="noopener"
            :href="googleMapsUrl"
          />
        </div>

        <div class="gallery-grid">
          <q-img
            v-for="(photo, index) in galleryPhotos"
            :key="photo.src"
            :src="photo.src"
            :alt="photo.alt"
            fit="cover"
            class="gallery-item"
            :class="{ 'gallery-item--big': index === 0 }"
            spinner-color="secondary"
            @click="openPhoto(photo)"
          >
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="image_not_supported" size="34px" color="grey-6" />
              </div>
            </template>

            <div class="gallery-hover">
              <q-icon name="zoom_in" />
              <span>Ampliar</span>
            </div>
          </q-img>
        </div>
      </section>

      <q-card class="loc-cta">
        <q-card-section class="loc-cta-content">
          <div>
            <div class="loc-cta-kicker">Atendimento local</div>
            <h2>Vai passar na loja?</h2>
            <p>
              Envie uma mensagem antes para consultar produto, orçamento, manutenção ou separar um item para retirada.
            </p>
          </div>

          <div class="loc-cta-actions">
            <q-btn
              outline
              color="secondary"
              icon="directions"
              label="Traçar rota"
              type="a"
              target="_blank"
              rel="noopener"
              :href="googleDirectionsUrl"
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
              :href="whatsUrl"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <footer class="footer">
      <div class="footer-copy">
        © {{ year }} Eletro Nogueira — 26.931.014/0001-12.
      </div>
    </footer>

    <q-dialog v-model="photoDialog">
      <q-card class="photo-dialog-card">
        <q-card-section class="photo-dialog-head">
          <div class="text-weight-bold text-secondary">
            {{ selectedPhoto?.alt || 'Foto da loja' }}
          </div>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-img
          v-if="selectedPhoto"
          :src="selectedPhoto.src"
          :alt="selectedPhoto.alt"
          fit="contain"
          class="photo-dialog-img"
          spinner-color="secondary"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const year = new Date().getFullYear()

const address = 'QD, Lote 01 — Av. Marginal, Esplanada I, Valparaíso de Goiás - GO, 72878-603'

const googleMapsUrl = 'https://maps.app.goo.gl/HmBYXDVNAGxB2iiZA'

const googleDirectionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s'

const mapEmbedUrl =
  'https://www.google.com/maps?q=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s&output=embed'

const whatsUrl =
  'https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.'

const selectedPhoto = ref(null)
const photoDialog = ref(false)

const today = new Date().getDay()

const hours = computed(() => [
  {
    day: 'Segunda a Sexta',
    time: '08:00 – 18:00',
    badge: 'Aberto',
    color: 'green-14',
    isToday: today >= 1 && today <= 5
  },
  {
    day: 'Sábado',
    time: '08:00 – 12:00',
    badge: 'Meio período',
    color: 'orange-14',
    isToday: today === 6
  },
  {
    day: 'Domingo',
    time: 'Fechado',
    badge: 'Fechado',
    color: 'negative',
    isToday: today === 0
  }
])

const openStatus = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()

  const weekOpen = 8 * 60
  const weekClose = 18 * 60
  const saturdayClose = 12 * 60

  if (day >= 1 && day <= 5 && minutes >= weekOpen && minutes < weekClose) {
    return {
      open: true,
      label: 'Aberto agora'
    }
  }

  if (day === 6 && minutes >= weekOpen && minutes < saturdayClose) {
    return {
      open: true,
      label: 'Aberto agora'
    }
  }

  return {
    open: false,
    label: 'Fechado agora'
  }
})

const galleryPhotos = [
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipPr30aIimlcjBUSfG_krYbJBoEQGhd3DY8bum1P=s1360-w1360-h1020-rw',
    alt: 'Foto da fachada da loja'
  },
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipMWqsee_NTf1r8YRRqPE4b3Xvkn2LnmybAFDrcw=s1360-w1360-h1020-rw',
    alt: 'Foto interna da loja'
  },
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipNu9WuJF2DhEH0KdB7Qtl9uCiecop1aUaciuSx2=s1360-w1360-h1020-rw',
    alt: 'Foto de produtos da loja'
  },
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipObwtZ4-Y6X80g7lIrp12W554NdsRhVU16Nn4-T=s1360-w1360-h1020-rw',
    alt: 'Foto da área de atendimento'
  },
  {
    src: 'https://lh3.googleusercontent.com/p/AF1QipNzBolmkMWUxxWTtU2Um6Zf10wADfGgw-bQ7sWk=s1360-w1360-h1020-rw',
    alt: 'Foto da Eletro Nogueira'
  }
]

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(address)

    $q.notify({
      type: 'positive',
      message: 'Endereço copiado.'
    })
  } catch {
    $q.notify({
      type: 'warning',
      message: 'Não foi possível copiar o endereço.'
    })
  }
}

function openPhoto(photo) {
  selectedPhoto.value = photo
  photoDialog.value = true
}
</script>

<style scoped>
.loc-page {
  --en-yellow: #ffd200;
  --en-blue: #1e4aa8;
  --en-navy: #012060;
  --en-dark: #03122e;
  --en-green: #22c55e;
  --text: #0d1b2a;
  --muted: #52657d;
  --card: #ffffff;

  min-height: 100vh;
  padding: 22px 16px 72px;
}

.loc-shell {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.loc-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 24px;
  border-radius: 28px;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 18px 44px rgba(1, 32, 96, 0.18);
}

.loc-hero-copy {
  min-width: 0;
}

.section-kicker {
  color: var(--en-blue);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.loc-hero .section-kicker {
  color: var(--en-yellow);
}

.loc-hero h1 {
  margin: 6px 0 8px;
  font-size: clamp(28px, 4vw, 46px);
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.loc-hero p {
  max-width: 740px;
  margin: 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 15px;
  line-height: 1.55;
}

.loc-hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.loc-action-btn {
  min-height: 44px;
  border-radius: 16px;
  font-weight: 900;
}

.loc-content-section {
  margin-top: 22px;
}

.loc-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(330px, 0.65fr);
  gap: 18px;
  align-items: stretch;
}

.loc-card {
  overflow: hidden;
  border-radius: 24px;
  background: var(--card);
  border: 1px solid rgba(1, 32, 96, 0.08);
  box-shadow: 0 14px 34px rgba(1, 32, 96, 0.10);
}

.loc-card-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 18px;
  background:
    radial-gradient(circle at top left, rgba(255, 210, 0, 0.20), transparent 38%),
    linear-gradient(135deg, rgba(1, 32, 96, 0.05), rgba(255, 255, 255, 1));
}

.loc-card-title-row {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 14px;
  align-items: center;
  min-width: 0;
}

.loc-card-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: var(--en-yellow);
  background: var(--en-navy);
  box-shadow: 0 10px 22px rgba(1, 32, 96, 0.18);
}

.loc-card-icon .q-icon {
  font-size: 30px;
}

.loc-card-head h2 {
  margin: 0;
  color: var(--en-navy);
  font-size: 23px;
  font-weight: 950;
  letter-spacing: -0.02em;
}

.loc-card-head p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

.loc-card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.loc-card-actions .q-btn {
  border-radius: 13px;
  font-weight: 900;
}

.status-badge {
  justify-self: end;
  padding: 7px 10px;
  border-radius: 999px;
  font-weight: 900;
}

.map-wrap {
  position: relative;
  width: 100%;
  height: 430px;
  background: #dce4ef;
}

.map-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.map-overlay {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  border-radius: 18px;
  color: #ffffff;
  background: rgba(1, 32, 96, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 26px rgba(1, 32, 96, 0.18);
}

.map-overlay-title {
  font-weight: 950;
  line-height: 1.2;
}

.map-overlay-text {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.hours-section {
  display: grid;
  gap: 14px;
  padding: 14px;
}

.hours-grid {
  display: grid;
  gap: 10px;
}

.hours-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  background: #f7f9fc;
  border: 1px solid rgba(1, 32, 96, 0.06);
}

.hours-row--today {
  background:
    radial-gradient(circle at right, rgba(255, 210, 0, 0.20), transparent 42%),
    #ffffff;
  border-color: rgba(255, 210, 0, 0.9);
  box-shadow: 0 10px 22px rgba(1, 32, 96, 0.08);
}

.hours-left {
  min-width: 0;
}

.hours-day {
  color: var(--en-dark);
  font-size: 15px;
  font-weight: 950;
  line-height: 1.2;
}

.hours-time {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.hours-badge {
  border-radius: 999px;
  font-weight: 900;
}

.hours-banner {
  border-radius: 18px;
  color: var(--text);
  background: #f7f9fc;
  border: 1px solid rgba(1, 32, 96, 0.06);
}

.hours-actions {
  display: grid;
  gap: 8px;
}

.loc-main-btn {
  min-height: 44px;
  border-radius: 16px;
  font-weight: 950;
}

.gallery-section {
  margin-top: 24px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.section-heading h2 {
  margin: 4px 0 0;
  color: var(--en-dark);
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.08;
  font-weight: 950;
  letter-spacing: -0.03em;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 210px 210px;
  gap: 12px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  cursor: pointer;
  background: #dce4ef;
  box-shadow: 0 14px 28px rgba(1, 32, 96, 0.10);
}

.gallery-item--big {
  grid-row: 1 / span 2;
}

.gallery-hover {
  position: absolute;
  inset: auto 12px 12px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 8px 10px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
  background: rgba(1, 32, 96, 0.78);
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.gallery-item:hover .gallery-hover {
  opacity: 1;
  transform: translateY(0);
}

.loc-cta {
  overflow: hidden;
  margin-top: 22px;
  border-radius: 26px;
  border: 1px solid rgba(1, 32, 96, 0.08);
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 210, 0, 0.28), transparent 32%),
    #ffffff;
  box-shadow: 0 14px 34px rgba(1, 32, 96, 0.10);
}

.loc-cta-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px;
}

.loc-cta-kicker {
  color: var(--en-blue);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.loc-cta h2 {
  margin: 5px 0 6px;
  color: var(--en-dark);
  font-size: clamp(21px, 3vw, 32px);
  line-height: 1.08;
  font-weight: 950;
}

.loc-cta p {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.loc-cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.loc-cta-actions .q-btn {
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

.photo-dialog-card {
  width: min(96vw, 980px);
  max-width: 980px;
  border-radius: 22px;
  overflow: hidden;
}

.photo-dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: #ffffff;
}

.photo-dialog-img {
  max-height: 76vh;
  background: #0b1020;
}

@media (max-width: 1023px) {
  .loc-page {
    padding: 16px 12px 64px;
  }

  .loc-hero {
    grid-template-columns: 1fr;
    border-radius: 24px;
    padding: 20px;
  }

  .loc-hero-actions {
    justify-content: flex-start;
  }

  .loc-grid {
    grid-template-columns: 1fr;
  }

  .loc-card-head {
    grid-template-columns: 1fr;
  }

  .loc-card-actions {
    justify-content: flex-start;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }

  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 250px 190px 190px;
  }

  .gallery-item--big {
    grid-column: 1 / span 2;
    grid-row: auto;
  }

  .loc-cta-content {
    grid-template-columns: 1fr;
  }

  .loc-cta-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 599px) {
  .loc-page {
    padding: 12px 10px 56px;
  }

  .loc-hero {
    border-radius: 20px;
    padding: 18px;
  }

  .loc-hero h1 {
    font-size: 29px;
  }

  .loc-hero p {
    font-size: 13px;
  }

  .loc-hero-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .loc-action-btn {
    width: 100%;
  }

  .loc-card {
    border-radius: 20px;
  }

  .loc-card-title-row {
    grid-template-columns: 50px 1fr;
  }

  .loc-card-icon {
    width: 50px;
    height: 50px;
    border-radius: 16px;
  }

  .loc-card-head h2 {
    font-size: 20px;
  }

  .loc-card-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .loc-card-actions .q-btn {
    width: 100%;
  }

  .map-wrap {
    height: 360px;
  }

  .map-overlay {
    left: 10px;
    right: 10px;
    bottom: 10px;
    flex-direction: column;
    align-items: flex-start;
  }

  .map-overlay .q-btn {
    width: 100%;
  }

  .hours-row {
    grid-template-columns: 1fr;
  }

  .hours-badge {
    width: fit-content;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .gallery-item,
  .gallery-item--big {
    grid-column: auto;
    grid-row: auto;
    height: 230px;
  }

  .gallery-hover {
    opacity: 1;
    transform: translateY(0);
  }

  .loc-cta-content {
    padding: 18px;
  }

  .loc-cta-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .loc-cta-actions .q-btn {
    width: 100%;
  }

  .footer {
    border-radius: 18px;
    padding: 16px 12px;
  }
}
</style>