<template>
<q-page class="">
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
</q-page>
</template>