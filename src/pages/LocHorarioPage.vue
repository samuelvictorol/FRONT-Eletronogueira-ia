<template>
  <q-page class="loc-page bg-grey-3 relative" :class="!isMobile ? 'q-pb-xl q-px-xl' : 'q-pb-lg q-px-md'">
    <!-- HERO -->
    <div class="w100 bg-primary q-pa-md animate__animated animate__fadeInDown animate__delay-3s animate__slower" style="position: sticky;top:60px;z-index: 9;border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;">
      <q-breadcrumbs class="text-secondary " >
        <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
        <q-breadcrumbs-el class="text-bold" label="Localização" to="/localizacao" />
      </q-breadcrumbs>
      <div>
        <div class="text-h5 text-secondary text-weight-bolder q-mt-sm">Como chegar na loja</div>
      </div>
    </div>
    <section class="loc-hero bg-primary rounded-borders q-pa-md q-pt-xl animate__animated animate__fadeInUp animate__delay-3s animate__slower">
    <div class="row items-center justify-between">
      
        <div class="row q-gutter-sm q-mt-sm">
          <q-chip outline color="secondary" icon="pin_drop">Valparaíso - GO</q-chip>
          <q-chip outline color="secondary" icon="support_agent">Suporte técnico</q-chip>
        </div>
      </div>
    </section>
    <!-- CONTEÚDO: ENDEREÇO + HORÁRIOS -->
    <section class="q-mt-lg">
      <div class="row q-col-gutter-md">
        <!-- Endereço / Mapa -->
        <div class="col-12 col-md-7">
          <q-card class="loc-card">
            <q-card-section class="loc-head">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h5 text-secondary text-weight-bolder">Endereço</div>
                  <div class="text-grey-8 q-mt-xs">
                    QD, Lote 01 — Av. Marginal • Esplanada I • Valparaíso de Goiás - GO
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-sm q-mt-md">
                <div class="col-12 col-sm-7">
                  <q-btn unelevated color="secondary" text-color="primary" class="w100 loc-btn" type="a" target="_blank"
                    rel="noopener"
                    href="https://www.google.com/maps/dir/?api=1&destination=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s"
                    icon="directions" label="Traçar rota no Google Maps" />
                </div>
                <div class="col-12 col-sm-5">
                  <q-btn outline color="secondary" class="w100 loc-btn" href="tel:+556136290040" icon="phone"
                    label="Ligar agora" />
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <div class="map-wrap b">
              <iframe title="Mapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="map-iframe"
                src="https://www.google.com/maps?q=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s&output=embed"></iframe>

              <div class="map-overlay bg-primary">
                <div class="row items-center q-gutter-sm">
                  <div class="text-secondary text-weight-bold">
                    📍 Av. Marginal, 72878-603 - Esplanada I
                  </div>
                </div>

                <q-btn dense unelevated color="secondary" text-color="primary" icon="map" label="Abrir no Maps" type="a"
                  target="_blank" rel="noopener" href="https://maps.app.goo.gl/HmBYXDVNAGxB2iiZA" />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Horários -->
        <div class="col-12 col-md-5">
          <q-card class="loc-card">
            <q-card-section class="loc-head ">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h5 text-secondary text-weight-bolder">Horários</div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
              <div class="hours-grid">
                <div class="hours-row">
                  <div class="text-weight-bold">Segunda a Sexta</div>
                  <div class="text-grey-8">08:00 – 18:00</div>
                  <q-badge outline color="green-14">Aberto</q-badge>
                </div>

                <div class="hours-row">
                  <div class="text-weight-bold">Sábado</div>
                  <div class="text-grey-8">08:00 – 12:00</div>
                  <q-badge outline color="orange-14">Meio período</q-badge>
                </div>

                <div class="hours-row">
                  <div class="text-weight-bold">Domingo</div>
                  <div class="text-grey-8">Fechado</div>
                  <q-badge outline color="negative">Fechado</q-badge>
                </div>
              </div>

              <q-banner class="q-mt-md bg-grey-2 text-grey-9 rounded-borders">
                <template #avatar>
                  <q-icon name="info" />
                </template>
                Quer separar seu produto antes de ir? Chama no WhatsApp.
              </q-banner>

              <q-btn class="w100 q-mt-md loc-btn" unelevated color="green-14" text-color="white" icon="mdi-whatsapp"
                label="Falar no WhatsApp" type="a" target="_blank" rel="noopener"
                href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento." />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>
    <section class="q-mt-md">
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle1 text-grey-9 text-weight-bold">Fotos da loja</div>
      </div>

      <div class="gallery-grid">
        <!-- imagem grande -->
        <q-img class="gallery-item big"
          src="https://lh3.googleusercontent.com/p/AF1QipPr30aIimlcjBUSfG_krYbJBoEQGhd3DY8bum1P=s1360-w1360-h1020-rw"
          alt="Foto da loja 1" ratio="16/9" fit="cover">
        </q-img>

        <q-img class="gallery-item"
          src="https://lh3.googleusercontent.com/p/AF1QipMWqsee_NTf1r8YRRqPE4b3Xvkn2LnmybAFDrcw=s1360-w1360-h1020-rw"
          alt="Foto da loja 2" ratio="1" fit="cover" />

        <q-img class="gallery-item"
          src="https://lh3.googleusercontent.com/p/AF1QipNu9WuJF2DhEH0KdB7Qtl9uCiecop1aUaciuSx2=s1360-w1360-h1020-rw"
          alt="Foto da loja 3" ratio="1" fit="cover" />

        <q-img class="gallery-item"
          src="https://lh3.googleusercontent.com/p/AF1QipObwtZ4-Y6X80g7lIrp12W554NdsRhVU16Nn4-T=s1360-w1360-h1020-rw"
          alt="Foto da loja 4" ratio="1" fit="cover" />

        <q-img class="gallery-item"
          src="https://lh3.googleusercontent.com/p/AF1QipNzBolmkMWUxxWTtU2Um6Zf10wADfGgw-bQ7sWk=s1360-w1360-h1020-rw"
          alt="Foto da loja 4" ratio="1" fit="cover" />
      </div>
    </section>

  </q-page>

  <footer class="footer bg-primary">
    <div class="copy q-mt-md text-secondary text-bold">© Eletro Nogueira — 26.931.014/0001-12.</div>
  </footer>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isMobile = $q.screen.lt.md
const year = new Date().getFullYear()
</script>

<style scoped>
.loc-page {
  min-height: 100vh;
}

.loc-hero {
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .12);
}

.loc-card {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .12);
}

.loc-head {
  padding: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, .06), rgba(255, 255, 255, .02));
}

.loc-head.light {
  background: linear-gradient(135deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .01));
}

.loc-btn {
  border-radius: 14px;
  font-weight: 800;
  letter-spacing: .2px;
}

/* GALERIA */
.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
}

.gallery-item {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(0, 0, 0, .10);
  cursor: pointer;
}

.gallery-item.big {
  grid-row: 1 / span 2;
}

.gallery-overlay {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, .35);
  backdrop-filter: blur(10px);
}

@media (max-width: 900px) {
  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .gallery-item.big {
    grid-column: 1 / span 2;
    grid-row: auto;
  }
}

/* MAPA */
.map-wrap {
  position: relative;
  width: 100%;
  height: 380px;
}

.map-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.map-overlay {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  padding: 12px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, .35);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 600px) {
  .map-wrap {
    height: 340px;
  }

  .map-overlay {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* HORÁRIOS */
.hours-grid {
  display: grid;
  gap: 12px;
}

.hours-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 12px;
  padding: 12px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, .03);
}

.hours-row .q-badge {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  justify-self: end;
}
</style>