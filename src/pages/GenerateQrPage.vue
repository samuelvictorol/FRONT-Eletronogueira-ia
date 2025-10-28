<template>
  <q-page class="q-pa-lg flex flex-center">
    <div class="column items-center q-gutter-md" style="max-width: 480px; width: 100%;">
      <div class="text-h4 text-secondary text-center">Gerar QR do WhatsApp</div>

      <q-banner
        v-if="error"
        class="bg-red-2 text-red-10"
        rounded
      >
        {{ error }}
      </q-banner>

      <div class="column items-center q-gutter-sm">
        <q-skeleton v-if="loading" type="rect" style="width:300px; height:300px" />
        <img
          v-else-if="snap?.qrDataURL"
          :src="snap.qrDataURL"
          alt="QR Code WhatsApp"
          style="width: 300px; height: 300px; border: 1px solid var(--q-dark-border,#ddd); border-radius: 8px;"
        />
        <div v-else class="text-grey">
          Nenhum QR disponível.
        </div>

        <div class="text-caption">
          Status: <b>{{ snap?.statusText || '-' }}</b>
        </div>
      </div>

      <div class="row q-gutter-sm justify-center">
        <q-btn
          color="secondary"
          label="Gerar QR Code"
          icon-right="qr_code" glossy
          :loading="loading"
          @click="generate"
        />
        <!-- <q-btn
          v-if="snap?.qr"
          color="secondary"
          flat
          label="Copiar string do QR"
          @click="copyRaw"
        /> -->
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios' // <- seu boot/axios deve exportar "api"

const $q = useQuasar()
const loading = ref(false)
const error = ref('')
const snap = ref(null) // { qr, qrDataURL, status, updatedAt }

async function generate () {
  error.value = ''
  loading.value = true
  try {
    // chama seu endpoint do backend
    const { data } = await api.get('/wpp/generate-qr') // ajuste se necessário
    const ws = data?.data?.whatsapp || data?.whatsapp || null
    snap.value = ws
    if (!ws?.qrDataURL && ws?.status !== 'qr') {
      $q.notify({ type: 'warning', message: 'Sem QR no momento (status: ' + (ws?.status || '-') + ')' })
    }
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || e?.message || 'Erro ao gerar QR'
    $q.notify({ type: 'negative', message: 'Falha ao gerar QR' })
  } finally {
    loading.value = false
  }
}

async function copyRaw () {
  try {
    await navigator.clipboard.writeText(snap.value.qr)
    $q.notify({ type: 'positive', message: 'String do QR copiada!' })
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível copiar.' })
  }
}

</script>
