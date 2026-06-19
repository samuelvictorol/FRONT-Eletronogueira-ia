<template>
  <q-layout view="hHh lpR fFf" class="assistant-layout">
    <q-header elevated class="assistant-header">
      <q-toolbar class="assistant-toolbar">
        <q-btn flat dense round icon="arrow_back" class="header-btn" @click="goBack" />

        <q-avatar size="42px" class="assistant-avatar">
          <q-icon name="mdi-robot-excited-outline" size="26px" />
        </q-avatar>

        <div class="header-info">
          <div class="header-title "><strong class="text-red">I.A.</strong> ELETRONOGUEIRA</div>
        </div>

        <q-space />

        <q-btn
          flat
          dense
          round
          icon="qr_code_scanner"
          class="header-btn"
          @click="openBarcodeScanner"
        >
          <q-tooltip>Ler código de barras</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          :round="isMobile"
          :rounded="!isMobile"
          icon="delete_outline"
          :label="isMobile ? '' : 'Limpar'"
          class="header-btn"
          @click="confirmClearChat"
        >
          <q-tooltip>Limpar conversa</q-tooltip>
        </q-btn>
      </q-toolbar>

      <div class="status-row">
        <div class="status-pill">
          <span class="status-dot" />
          <span class="ellipsis">Atendimento virtual online</span>
        </div>

        <q-btn
          dense
          unelevated
          no-caps
          color="green-14"
          text-color="white"
          icon="mdi-whatsapp"
          :label="isMobile ? 'Vendedor' : 'Falar com vendedor'"
          type="a"
          target="_blank"
          rel="noopener"
          :href="defaultWhatsAppUrl"
        />
      </div>
    </q-header>

    <q-page-container class="assistant-page-container">
      <main ref="messagesBoxRef" class="messages-box">
        <div class="messages-inner">
          <div
            v-for="(msg, index) in visibleMessages"
            :key="msg.id || index"
            class="message-row"
            :class="`message-row--${msg.role}`"
          >
            <div class="message-bubble" :class="`message-bubble--${msg.role}`">
              <div v-if="msg.content" class="message-text">
                {{ msg.content }}
              </div>

              <q-card v-if="msg.storeInfo" flat bordered class="store-info-card q-mt-sm">
                <q-card-section class="store-info-head">
                  <div class="text-subtitle1 text-weight-bolder text-secondary">
                    {{ msg.storeInfo.title || 'Eletro Nogueira' }}
                  </div>

                  <div class="text-body2 text-grey-8 q-mt-xs">
                    {{ msg.storeInfo.address }}
                  </div>

                  <div v-if="msg.storeInfo.phone" class="text-caption text-grey-7 q-mt-xs">
                    Telefone/WhatsApp: {{ msg.storeInfo.phone }}
                  </div>
                </q-card-section>

                <div v-if="msg.storeInfo.mapsEmbedUrl" class="store-map-wrap">
                  <iframe
                    title="Mapa Eletro Nogueira"
                    class="store-map-iframe"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    :src="msg.storeInfo.mapsEmbedUrl"
                  />
                </div>

                <q-card-section v-if="msg.storeInfo.hours" class="store-hours">
                  <div v-if="msg.storeInfo.hours.weekdays" class="store-hours-row">
                    <strong>Segunda a sexta</strong>
                    <span>{{ msg.storeInfo.hours.weekdays }}</span>
                  </div>

                  <div v-if="msg.storeInfo.hours.saturday" class="store-hours-row">
                    <strong>Sábado</strong>
                    <span>{{ msg.storeInfo.hours.saturday }}</span>
                  </div>

                  <div v-if="msg.storeInfo.hours.sunday" class="store-hours-row">
                    <strong>Domingo</strong>
                    <span>{{ msg.storeInfo.hours.sunday }}</span>
                  </div>
                </q-card-section>

                <q-card-actions class="store-actions">
                  <q-btn
                    v-if="msg.storeInfo.routeUrl"
                    dense
                    unelevated
                    no-caps
                    color="secondary"
                    text-color="primary"
                    icon="directions"
                    label="Traçar rota"
                    type="a"
                    target="_blank"
                    rel="noopener"
                    :href="msg.storeInfo.routeUrl"
                  />

                  <q-btn
                    v-if="msg.storeInfo.mapsUrl"
                    dense
                    outline
                    no-caps
                    color="secondary"
                    icon="map"
                    label="Abrir Maps"
                    type="a"
                    target="_blank"
                    rel="noopener"
                    :href="msg.storeInfo.mapsUrl"
                  />
                </q-card-actions>
              </q-card>

              <div v-if="msg.items?.length" class="items-grid q-mt-sm">
                <q-card
                  v-for="item in msg.items"
                  :key="item.id || item.codProduto || item.productUrl || item.title"
                  flat
                  bordered
                  class="item-card"
                  @click="openProduct(item)"
                >
                  <div class="item-image-wrap">
                    <q-img
                      :src="resolveItemImage(item)"
                      :alt="item.title || item.descricao || 'Produto'"
                      ratio="1"
                      fit="contain"
                      class="item-img"
                      spinner-color="secondary"
                      @load="scrollToBottom('smooth')"
                    >
                      <template #error>
                        <div class="absolute-full flex flex-center bg-grey-2">
                          <q-icon name="image_not_supported" size="34px" color="grey-6" />
                        </div>
                      </template>

                      <q-badge v-if="item.isPromotion" color="negative" class="promo-badge">
                        Promoção
                      </q-badge>
                    </q-img>
                  </div>

                  <q-card-section class="item-body">
                    <div class="item-title ellipsis-2-lines">
                      {{ item.title || item.descricao || 'Produto Eletro Nogueira' }}
                    </div>

                    <div v-if="item.brand || item.marca" class="item-brand ellipsis">
                      {{ item.brand || item.marca }}
                    </div>

                    <div class="item-footer">
                      <div class="price-wrap">
                        <div v-if="item.oldPriceLabel && item.isPromotion" class="old-price">
                          {{ item.oldPriceLabel }}
                        </div>

                        <div class="item-price">
                          {{ item.priceLabel || money(item.price || item.promoPrice || item.precoPromocao || item.effectivePrice || item.precoEfetivo || item.preco) }}
                        </div>
                      </div>

                      <q-btn
                        dense
                        round
                        unelevated
                        color="secondary"
                        icon="open_in_new"
                        @click.stop="openProduct(item)"
                      >
                        <q-tooltip>Abrir produto</q-tooltip>
                      </q-btn>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <q-card v-if="msg.sellerSummary" flat bordered class="seller-summary-card q-mt-sm">
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bolder text-secondary">
                    Resumo para o vendedor
                  </div>

                  <pre class="seller-summary-text">{{ msg.sellerSummary }}</pre>
                </q-card-section>
              </q-card>

              <div v-if="msg.links?.length" class="message-links q-mt-sm">
                <q-btn
                  v-for="link in msg.links"
                  :key="link.url"
                  dense
                  unelevated
                  no-caps
                  color="secondary"
                  text-color="white"
                  icon="open_in_new"
                  :label="link.label || 'Abrir link'"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="link.url"
                />
              </div>

              <q-btn
                v-if="msg.whatsappUrl"
                class="q-mt-sm"
                dense
                unelevated
                no-caps
                color="green-14"
                icon="mdi-whatsapp"
                :label="msg.sellerSummary ? 'Enviar resumo ao vendedor' : 'Chamar vendedor'"
                type="a"
                target="_blank"
                rel="noopener"
                :href="msg.whatsappUrl"
              />
            </div>
          </div>

          <div v-if="loading" class="message-row message-row--assistant">
            <div class="message-bubble message-bubble--assistant waiting-bubble">
              <q-spinner-dots size="30px" color="secondary" />
              <span>Aguardando resposta...</span>
            </div>
          </div>
        </div>
        <div class="w100 q-py-lg"></div>
      </main>

      <footer class="chat-footer">
        <div class="quick-scroll">
          <q-chip
            v-for="suggestion in suggestions"
            :key="suggestion"
            clickable
            color="white"
            text-color="secondary"
            class="quick-chip"
            @click="sendSuggestion(suggestion)"
          >
            {{ suggestion }}
          </q-chip>
        </div>

        <div class="input-row">
          <q-input
            ref="inputRef"
            v-model="draft"
            outlined
            autogrow
            bg-color="white"
            color="secondary"
            class="chat-input"
            placeholder="Digite sua mensagem aqui..."
            :disable="loading"
            @keyup.enter.exact.prevent="sendMessage()"
          >
            <template #prepend>
              <q-icon name="chat" color="secondary" />
            </template>

            <template #append>
              <q-btn
                flat
                dense
                round
                color="secondary"
                icon="qr_code_scanner"
                :disable="loading"
                @click="openBarcodeScanner"
              >
                <q-tooltip>Ler código de barras</q-tooltip>
              </q-btn>

              <q-btn
                round
                dense
                unelevated
                color="secondary"
                icon="send"
                :disable="loading || !draft.trim()"
                @click="sendMessage()"
              />
            </template>
          </q-input>
        </div>
      </footer>
    </q-page-container>

    <q-dialog v-model="barcodeDialog" persistent :maximized="isMobile" @hide="stopBarcodeScanner">
      <q-card class="barcode-modal-card">
        <q-card-section class="barcode-modal-header">
          <div>
            <div class="text-h6 text-weight-bold">Ler código de barras</div>
            <div class="text-caption">
              Use a câmera ou digite o código manualmente.
            </div>
          </div>

          <q-btn flat round dense icon="close" @click="closeBarcodeScanner" />
        </q-card-section>

        <q-separator />

        <q-card-section class="barcode-modal-body">
          <div class="barcode-action-row">
            <q-btn
              unelevated
              color="secondary"
              text-color="white"
              icon="photo_camera"
              label="Iniciar câmera"
              :loading="barcodeCameraLoading"
              @click="startBarcodeScanner"
            />

            <q-btn
              outline
              color="secondary"
              icon="edit"
              label="Inserir manualmente"
              @click="focusManualBarcodeInput"
            />
          </div>

          <div class="barcode-video-wrap q-mt-md">
            <video ref="barcodeVideoRef" class="barcode-video" autoplay muted playsinline />

            <div class="barcode-frame">
              <div class="barcode-frame-line" />
            </div>

            <div v-if="!barcodeScanning && !barcodeCameraLoading" class="barcode-start-overlay">
              <q-icon name="qr_code_scanner" size="44px" color="primary" />

              <div class="text-weight-bold q-mt-sm">
                Toque em “Iniciar câmera”
              </div>

              <div class="text-caption q-mt-xs">
                Aponte para o código com boa iluminação.
              </div>
            </div>

            <div v-if="barcodeCameraLoading || barcodeScanning" class="barcode-status">
              <q-spinner-dots color="primary" size="28px" />
              {{ barcodeCameraLoading ? 'Abrindo câmera...' : 'Procurando código...' }}
            </div>
          </div>

          <q-banner v-if="barcodeScanError" rounded class="q-mt-md bg-red-1 text-negative">
            <template #avatar>
              <q-icon name="warning" color="negative" />
            </template>

            {{ barcodeScanError }}
          </q-banner>

          <q-input
            ref="manualBarcodeInputRef"
            v-model="manualBarcode"
            class="q-mt-md"
            outlined
            dense
            clearable
            color="secondary"
            label="Inserir código manualmente"
            placeholder="Digite ou cole o código"
            inputmode="numeric"
            @keyup.enter="applyManualBarcode"
          >
            <template #prepend>
              <q-icon name="keyboard" color="secondary" />
            </template>

            <template #append>
              <q-btn flat dense round icon="search" color="secondary" @click="applyManualBarcode" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-actions class="barcode-modal-actions">
          <q-btn flat color="grey-7" label="Cancelar" @click="closeBarcodeScanner" />

          <q-btn
            unelevated
            color="secondary"
            icon="search"
            :label="isMobile ? 'Buscar' : 'Buscar código digitado'"
            @click="applyManualBarcode"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api_ia } from 'boot/axios-ia'
import { BrowserMultiFormatReader } from '@zxing/browser'

const STORAGE_MESSAGES = 'en:assistant:messages'
const STORAGE_FILTERS = 'en:assistant:filters'

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'
const storeUrl = 'https://eletronogueira.com.br'
const phone = '556136290040'

const $q = useQuasar()
const router = useRouter()

const messagesBoxRef = ref(null)
const inputRef = ref(null)
const loading = ref(false)
const draft = ref('')
const messages = ref([])
const filters = ref({})

const barcodeDialog = ref(false)
const barcodeVideoRef = ref(null)
const manualBarcodeInputRef = ref(null)
const barcodeScanning = ref(false)
const barcodeCameraLoading = ref(false)
const barcodeScanError = ref('')
const manualBarcode = ref('')
let barcodeReader = null
let barcodeControls = null
let barcodeApplying = false

const isMobile = computed(() => $q.screen.lt.md)
const visibleMessages = computed(() => messages.value)

const defaultWhatsAppUrl = computed(() => {
  return buildWhatsAppUrl('Olá Eletro Nogueira! Quero falar com um vendedor.')
})

const suggestions = [
  'Queria uma furadeira Makita',
  'Tem bomba d’água?',
  'Produtos em promoção',
  'Buscar por código',
  'Meu nome é...',
  'Qual o endereço?',
  'Quero falar com vendedor'
]

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildWhatsAppUrl(text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

function loadChat() {
  try {
    const savedMessages = JSON.parse(localStorage.getItem(STORAGE_MESSAGES) || '[]')
    const savedFilters = JSON.parse(localStorage.getItem(STORAGE_FILTERS) || '{}')

    messages.value = Array.isArray(savedMessages) && savedMessages.length
      ? savedMessages
      : [
          {
            id: uid(),
            role: 'assistant',
            content: 'Oi! Me diga o que você procura na Eletro Nogueira. Posso buscar por produto, marca, preço, promoção, código de barras ou te passar endereço e WhatsApp. Se quiser, também pode me dizer seu nome para facilitar o atendimento.',
            createdAt: new Date().toISOString()
          }
        ]

    filters.value = savedFilters && typeof savedFilters === 'object' ? savedFilters : {}
  } catch {
    messages.value = [
      {
        id: uid(),
        role: 'assistant',
        content: 'Oi! Me diga o que você procura na Eletro Nogueira.',
        createdAt: new Date().toISOString()
      }
    ]

    filters.value = {}
  }
}

function persistChat() {
  localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages.value.slice(-45)))
  localStorage.setItem(STORAGE_FILTERS, JSON.stringify(filters.value || {}))
}

async function scrollToBottom(behavior = 'auto') {
  await nextTick()

  const el = messagesBoxRef.value
  if (!el) return

  el.scrollTo({
    top: el.scrollHeight,
    behavior
  })
}

function normalizeApiHistory() {
  return messages.value
    .filter(message => ['user', 'assistant'].includes(message.role) && message.content)
    .map(message => ({
      role: message.role,
      content: message.content
    }))
    .slice(-14)
}

function normalizeApiItems(items = []) {
  if (!Array.isArray(items)) return []

  return items.slice(0, 5).map((item) => {
    const productUrl =
      item.productUrl ||
      item.url ||
      item.link ||
      buildCatalogProductUrl(item)

    return {
      ...item,
      productUrl,
      imageUrl: resolveItemImage(item)
    }
  })
}

function normalizeLinks(links = []) {
  if (!Array.isArray(links)) return []

  return links
    .filter(link => link?.url)
    .slice(0, 4)
    .map(link => ({
      label: link.label || 'Abrir link',
      url: link.url
    }))
}

function resolveItemImage(item) {
  if (!item) return fallbackImage

  const image =
    item.imageUrl ||
    item.imagemUrl ||
    item.imgPath ||
    item.IMG_PATH ||
    item.image ||
    item.img ||
    item.thumbnail ||
    item?.imgsPath?.[0] ||
    item?.IMGS_PATH?.[0] ||
    null

  return image ? String(image).replace(/ /g, '%20') : fallbackImage
}

function buildCatalogProductUrl(item) {
  const id = item?.id || item?.codProduto || item?.CODPRODUTO
  const title = item?.title || item?.descricao || 'produto'

  if (!id) {
    return `${storeUrl}/catalogo?limit=15&page=1&orderBy=updated_desc`
  }

  return `${storeUrl}/catalogo/produto/${slugify(`${title}-${id}`)}`
}

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function money(value) {
  if (value === null || value === undefined || value === '') return 'Consultar'

  const n = Number(String(value).replace(',', '.'))

  if (!Number.isFinite(n)) return 'Consultar'

  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

async function sendSuggestion(text) {
  if (loading.value) return

  if (text === 'Buscar por código') {
    openBarcodeScanner()
    return
  }

  draft.value = text
  await sendMessage()
}

async function sendMessage() {
  const text = draft.value.trim()

  if (!text || loading.value) return

  messages.value.push({
    id: uid(),
    role: 'user',
    content: text,
    createdAt: new Date().toISOString()
  })

  draft.value = ''
  loading.value = true

  persistChat()
  await scrollToBottom('smooth')

  try {
    const { data } = await api_ia.post('/assistant/chat', {
      messages: normalizeApiHistory(),
      filters: filters.value
    })

    filters.value = data.filters || filters.value || {}

    const responseMessages = Array.isArray(data.messages) && data.messages.length
      ? data.messages.slice(0, 3)
      : ['Encontrei algumas informações para você.']

    const shouldRenderItems = ['product_search', 'checkout_summary'].includes(data.intent)
    const items = shouldRenderItems ? normalizeApiItems(data.items || []) : []
    const links = normalizeLinks(data.links || [])
    const storeInfo = data.storeInfo || null
    const sellerSummary = data.sellerSummary || ''

    const whatsappUrl =
      data.whatsappUrl ||
      buildWhatsAppUrl(`Olá Eletro Nogueira! Quero ajuda com: ${text}`)

    responseMessages.forEach((content, index) => {
      messages.value.push({
        id: uid(),
        role: 'assistant',
        content,
        items: index === 0 ? items : [],
        storeInfo: index === 0 ? storeInfo : null,
        sellerSummary: index === 0 ? sellerSummary : '',
        links: index === 0 ? links : [],
        whatsappUrl: index === responseMessages.length - 1 ? whatsappUrl : '',
        createdAt: new Date().toISOString()
      })
    })
  } catch (error) {
    const fallbackWhatsApp = buildWhatsAppUrl(`Olá Eletro Nogueira! Quero ajuda com: ${text}`)

    messages.value.push({
      id: uid(),
      role: 'assistant',
      content: 'Não consegui consultar o atendente virtual agora. Você pode chamar o vendedor no WhatsApp com sua solicitação preenchida.',
      whatsappUrl: fallbackWhatsApp,
      createdAt: new Date().toISOString()
    })

    $q.notify({
      type: 'negative',
      message: 'Falha ao consultar o atendente virtual.'
    })
  } finally {
    loading.value = false
    persistChat()
    await scrollToBottom('smooth')
  }
}

function openProduct(item) {
  const url =
    item?.productUrl ||
    item?.url ||
    item?.link ||
    buildCatalogProductUrl(item)

  if (!url) return

  window.open(url, '_blank', 'noopener')
}

function confirmClearChat() {
  $q.dialog({
    title: 'Limpar conversa',
    message: 'Deseja apagar o histórico do atendimento virtual?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Limpar',
      color: 'negative'
    },
    cancel: {
      label: 'Cancelar',
      color: 'grey'
    }
  }).onOk(clearChat)
}

async function clearChat() {
  messages.value = [
    {
      id: uid(),
      role: 'assistant',
      content: 'Conversa limpa. O que você procura hoje?',
      createdAt: new Date().toISOString()
    }
  ]

  filters.value = {}

  localStorage.removeItem(STORAGE_MESSAGES)
  localStorage.removeItem(STORAGE_FILTERS)

  persistChat()
  await scrollToBottom()
}

function normalizeBarcode(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
}

async function openBarcodeScanner() {
  barcodeScanError.value = ''
  manualBarcode.value = ''
  barcodeDialog.value = true

  await nextTick()
}

function focusManualBarcodeInput() {
  manualBarcodeInputRef.value?.focus?.()
}

function getBarcodeCameraErrorMessage(err) {
  const name = String(err?.name || '')

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Permissão da câmera negada. Libere a câmera no navegador ou insira o código manualmente.'
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Nenhuma câmera foi encontrada neste dispositivo. Insira o código manualmente.'
  }

  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'A câmera está em uso por outro aplicativo. Feche outros apps ou insira o código manualmente.'
  }

  if (
    location.protocol !== 'https:' &&
    location.hostname !== 'localhost' &&
    location.hostname !== '127.0.0.1'
  ) {
    return 'A câmera exige HTTPS ou localhost. Acesse por HTTPS ou insira o código manualmente.'
  }

  return 'Não foi possível iniciar a leitura pela câmera. Insira o código manualmente ou tente novamente.'
}

function stopBarcodeScanner() {
  barcodeScanning.value = false
  barcodeCameraLoading.value = false

  try {
    if (barcodeControls) {
      barcodeControls.stop()
      barcodeControls = null
    }
  } catch {}

  try {
    if (barcodeReader?.reset) barcodeReader.reset()
  } catch {}

  if (barcodeVideoRef.value) {
    barcodeVideoRef.value.pause?.()
    barcodeVideoRef.value.srcObject = null
  }

  barcodeReader = null
  barcodeApplying = false
}

function closeBarcodeScanner() {
  stopBarcodeScanner()
  barcodeDialog.value = false
}

async function startBarcodeScanner() {
  stopBarcodeScanner()

  barcodeScanError.value = ''
  barcodeCameraLoading.value = true
  barcodeApplying = false

  try {
    await nextTick()

    if (!barcodeVideoRef.value) {
      throw new Error('VIDEO_ELEMENT_NOT_FOUND')
    }

    barcodeReader = new BrowserMultiFormatReader()

    barcodeControls = await barcodeReader.decodeFromConstraints(
      {
        video: {
          facingMode: {
            ideal: 'environment'
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: false
      },
      barcodeVideoRef.value,
      async (result) => {
        if (!result || barcodeApplying) return

        const rawText =
          result.getText?.() ||
          result.text ||
          result.rawValue ||
          ''

        const code = normalizeBarcode(rawText)

        if (!code) return

        barcodeApplying = true
        stopBarcodeScanner()

        await sendBarcode(code)
        barcodeDialog.value = false
      }
    )

    barcodeScanning.value = true
  } catch (err) {
    barcodeScanError.value = getBarcodeCameraErrorMessage(err)
    barcodeScanning.value = false
  } finally {
    barcodeCameraLoading.value = false
  }
}

async function applyManualBarcode() {
  const code = normalizeBarcode(manualBarcode.value)

  if (!code) {
    $q.notify({
      type: 'warning',
      message: 'Código inválido.'
    })

    return
  }

  await sendBarcode(code)
  closeBarcodeScanner()
}

async function sendBarcode(code) {
  draft.value = `código de barras ${code}`
  filters.value = {
    codBarras: code
  }

  await sendMessage()
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/')
}

watch(
  () => messages.value.length,
  async () => {
    persistChat()
    await scrollToBottom('smooth')
  }
)

watch(filters, persistChat, { deep: true })

onMounted(async () => {
  loadChat()
  await scrollToBottom()
})

onBeforeUnmount(() => {
  stopBarcodeScanner()
})
</script>

<style scoped>
.assistant-layout {
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(247, 209, 2, 0.22), transparent 34%),
    radial-gradient(circle at 80% 12%, rgba(247, 209, 2, 0.12), transparent 24%),
    linear-gradient(135deg, #063186 0%, #03122e 100%);
}

.assistant-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96));
  color: #012060;
  border-bottom: 1px solid rgba(1, 32, 96, 0.08);
}

.assistant-toolbar {
  min-height: 62px;
  padding: 8px 12px;
  gap: 10px;
}

.header-btn {
  color: #012060;
  background: rgba(1, 32, 96, 0.06);
}

.assistant-avatar {
  background: #f7d102;
  color: #012060;
  box-shadow: 0 8px 18px rgba(1, 32, 96, 0.16);
}

.header-info {
  min-width: 0;
  flex: 1;
}

.header-title {
  font-size: 17px;
  line-height: 1.1;
  font-weight: 900;
}

.header-subtitle {
  margin-top: 3px;
  font-size: 12px;
  color: #64748b;
}

.status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px 10px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(1, 32, 96, 0.06);
  color: #012060;
  font-size: 12px;
  font-weight: 800;
}

.status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
}

.assistant-page-container {
  height: 100dvh;
  overflow: hidden;
  padding-bottom: 0 !important;
}

.messages-box {
  height: calc(100dvh - 174px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 14px 14px 10px;
  scroll-behavior: smooth;
}

.messages-inner {
  width: min(100%, 980px);
  margin: 0 auto;
  padding-bottom: 8px;
}

.message-row {
  display: flex;
  margin-bottom: 12px;
}

.message-row--user {
  justify-content: flex-end;
}

.message-row--assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: min(88%, 820px);
  border-radius: 20px;
  padding: 12px 14px;
  box-shadow: 0 10px 26px rgba(2, 30, 88, 0.12);
}

.message-bubble--user {
  color: #ffffff;
  background: #012060;
  border-bottom-right-radius: 6px;
}

.message-bubble--assistant {
  color: #0d1b2a;
  background: #ffffff;
  border-bottom-left-radius: 6px;
}

.message-text {
  white-space: pre-line;
  line-height: 1.46;
  font-size: 14px;
}

.waiting-bubble {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  color: #012060;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(128px, 1fr));
  gap: 10px;
}

.item-card {
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(1, 32, 96, 0.14);
}

.item-image-wrap {
  position: relative;
  background: #ffffff;
}

.item-img {
  background: #ffffff;
}

.promo-badge {
  top: 8px;
  left: 8px;
  font-weight: 800;
}

.item-body {
  padding: 9px;
}

.item-title {
  min-height: 34px;
  color: #0d1b2a;
  font-size: 12px;
  font-weight: 900;
  line-height: 1.25;
}

.item-brand {
  margin-top: 4px;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.item-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.old-price {
  color: #94a3b8;
  font-size: 11px;
  text-decoration: line-through;
}

.item-price {
  color: #16a34a;
  font-size: 13px;
  font-weight: 950;
}

.message-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.store-info-card,
.seller-summary-card {
  width: min(100%, 720px);
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(1, 32, 96, 0.12);
}

.store-info-head {
  padding: 12px 14px;
}

.store-map-wrap {
  width: 100%;
  height: 260px;
  background: #e5e7eb;
}

.store-map-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.store-hours {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  background: #f8fafc;
}

.store-hours-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 8px;
  font-size: 12px;
  color: #334155;
}

.store-hours-row strong {
  color: #012060;
}

.store-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px 12px;
}

.seller-summary-text {
  white-space: pre-wrap;
  margin: 8px 0 0;
  padding: 10px;
  border-radius: 12px;
  background: #f8fafc;
  color: #334155;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.45;
}

.chat-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  padding: 9px 12px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid rgba(1, 32, 96, 0.08);
  backdrop-filter: blur(14px);
  box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.12);
}

.quick-scroll {
  width: min(100%, 980px);
  margin: 0 auto 8px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.quick-scroll::-webkit-scrollbar {
  display: none;
}

.quick-chip {
  flex: 0 0 auto;
  font-weight: 800;
  border: 1px solid rgba(1, 32, 96, 0.08);
}

.input-row {
  width: min(100%, 980px);
  margin: 0 auto;
}

.chat-input :deep(.q-field__control) {
  border-radius: 18px;
  min-height: 48px;
}

.chat-input :deep(textarea) {
  max-height: 110px;
  overflow-y: auto;
}

.barcode-modal-card {
  width: min(100%, 760px);
  border-radius: 22px;
  overflow: hidden;
}

.barcode-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
}

.barcode-modal-body {
  background: #f8fafc;
}

.barcode-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.barcode-video-wrap {
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 18px;
  background: #020617;
}

.barcode-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.barcode-frame {
  position: absolute;
  inset: 14%;
  border: 2px solid rgba(247, 209, 2, 0.95);
  border-radius: 18px;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.36);
  pointer-events: none;
}

.barcode-frame-line {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 50%;
  height: 2px;
  background: #f7d102;
  box-shadow: 0 0 12px rgba(247, 209, 2, 0.9);
}

.barcode-start-overlay,
.barcode-status {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #012060;
  text-align: center;
}

.barcode-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
}

.barcode-modal-actions {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #ffffff;
}

@media (max-width: 900px) {
  .assistant-toolbar {
    min-height: 58px;
    padding: 7px 9px;
    gap: 8px;
  }

  .assistant-avatar {
    width: 38px;
    height: 38px;
  }

  .header-title {
    font-size: 15px;
  }

  .header-subtitle {
    font-size: 11px;
  }

  .status-row {
    padding: 0 9px 8px;
  }

  .status-pill {
    font-size: 11px;
    padding: 6px 9px;
  }

  .messages-box {
    height: calc(100dvh - 170px);
    padding: 10px 9px 8px;
  }

  .message-bubble {
    max-width: 94%;
    border-radius: 18px;
    padding: 11px 12px;
  }

  .message-text {
    font-size: 13.5px;
  }

  .items-grid {
    grid-template-columns: repeat(2, minmax(132px, 1fr));
    gap: 8px;
  }

  .chat-footer {
    padding: 8px 9px calc(9px + env(safe-area-inset-bottom));
  }

  .quick-scroll {
    margin-bottom: 7px;
  }

  .quick-chip {
    font-size: 12px;
  }

  .store-map-wrap {
    height: 230px;
  }

  .store-hours-row {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .barcode-modal-card {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .barcode-video-wrap {
    height: min(52vh, 430px);
  }
}

@media (max-width: 420px) {
  .status-pill {
    max-width: 52vw;
  }

  .messages-box {
    height: calc(100dvh - 164px);
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .item-card {
    display: grid;
    grid-template-columns: 112px 1fr;
  }

  .item-image-wrap {
    min-height: 112px;
  }

  .item-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .item-title {
    min-height: auto;
  }

  .barcode-action-row > .q-btn {
    width: 100%;
  }
}
</style>