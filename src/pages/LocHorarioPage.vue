<template>
  <q-page class="q-pa-md bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <div class="q-mb-md">
      <q-breadcrumbs class="text-grey-7">
        <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
        <q-breadcrumbs-el label="Localização" to="/catalogo" />
      </q-breadcrumbs>
    </div>
    <section class="section alt q-py-md">
      <div class="container grid-2">
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

      </div>
    </section>
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
import { useQuasar } from 'quasar';

const year = new Date().getFullYear()
const isMobile = useQuasar().screen.lt.md

</script>