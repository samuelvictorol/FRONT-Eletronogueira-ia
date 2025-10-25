<template>
  <q-page class="bg-dark text-white">
    <div class="row full-height">
      <!-- Lista de conversas -->
      <div class="col-12 col-md-4 bg-grey-10 column">
        <div class="q-pa-sm">
          <q-input v-model="q" dense filled dark placeholder="Buscar..." @update:model-value="filterChats" />
        </div>

        <q-scroll-area class="col">
          <q-list bordered separator dark>
            <q-item
              v-for="c in filteredChats"
              :key="c.id"
              clickable
              @click="openChat(c)"
              :active="activeChat?.id === c.id"
              active-class="bg-primary text-white"
            >
              <q-item-section>
                <q-item-label>{{ c.name }}</q-item-label>
                <q-item-label caption class="text-grey-4 ellipsis">
                  {{ c.lastMessage?.body || '—' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-badge v-if="c.unreadCount" color="negative" :label="c.unreadCount" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Histórico -->
      <div class="col-12 col-md-8 column">
        <div class="q-pa-sm text-bold text-h6">
          {{ activeChat?.name || 'Selecione uma conversa' }}
        </div>

        <q-separator />

        <div ref="historyBox" class="col scroll bg-dark q-pa-sm" @scroll.passive="onScrollTop">
          <div class="text-center q-mb-sm">
            <q-btn v-if="canLoadMore" size="sm" outline label="Carregar mais" @click="loadMore" />
          </div>

          <div v-for="m in messages" :key="m.id" class="q-mb-sm">
            <q-chat-message
              :sent="m.isFromMe"
              :stamp="fmtTime(m.timestamp)"
              :name="msgName(m)"
              :text="[m.body || '']"
            />
          </div>
        </div>

        <q-separator />

        <!-- Input de envio -->
        <div class="row q-pa-sm items-center">
          <div class="col">
            <q-input
              v-model="draft"
              type="textarea"
              filled
              dark
              autogrow
              placeholder="Digite uma mensagem..."
              @keyup.enter.exact.prevent="send()"
            />
          </div>
          <div class="q-ml-sm">
            <q-btn color="primary" label="Enviar" @click="send" :disable="!draft || !activeChat" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()

const q = ref('')
const chats = ref([])
const filteredChats = ref([])
const activeChat = ref(null)

const messages = ref([])
const canLoadMore = ref(false)
const nextBeforeId = ref(null)

const draft = ref('')
const historyBox = ref(null)

function filterChats () {
  const s = (q.value || '').toLowerCase()
  filteredChats.value = !s
    ? chats.value
    : chats.value.filter(c => (c.name || '').toLowerCase().includes(s))
}

async function fetchChats () {
  try {
    const { data } = await axios.get('/wpp/chats')
    chats.value = data?.data || []
    filterChats()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Falha ao carregar conversas' })
  }
}

function fmtTime (ts) {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return d.toLocaleString()
}

function msgName (m) {
  if (!activeChat.value?.isGroup) return m.isFromMe ? 'Você' : activeChat.value?.name || 'Contato'
  if (m.isFromMe) return 'Você'
  return m.author || m.from || 'Participante'
}

async function openChat (c) {
  activeChat.value = c
  messages.value = []
  nextBeforeId.value = null
  canLoadMore.value = false
  await loadMore() // carrega primeira página
  await nextTick()
  scrollToBottom()
}

function scrollToBottom () {
  const el = historyBox.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

async function loadMore () {
  if (!activeChat.value) return
  try {
    const params = { limit: 40 }
    if (nextBeforeId.value) params.beforeId = nextBeforeId.value
    const { data } = await axios.get(`/wpp/chats/${encodeURIComponent(activeChat.value.id)}/messages`, { params })

    const page = data?.data || []
    nextBeforeId.value = data?.paging?.nextBeforeId || null
    canLoadMore.value = !!nextBeforeId.value

    // as mensagens vêm do mais antigo pro mais novo — garanta a ordenação crescente por timestamp
    page.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))

    // concatena mantendo ordem
    messages.value = [...page, ...messages.value]

    if (!params.beforeId) {
      // primeira página: desce pro fim
      await nextTick()
      scrollToBottom()
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Falha ao carregar mensagens' })
  }
}

function onScrollTop (ev) {
  const el = ev.target
  if (el.scrollTop <= 0 && canLoadMore.value) {
    loadMore()
  }
}

async function send () {
  if (!draft.value || !activeChat.value) return
  const text = draft.value
  draft.value = ''
  try {
    await axios.post('/wpp/send', { chatId: activeChat.value.id, text })
    // otimista: adiciona na lista local
    messages.value.push({
      id: 'local-' + Date.now(),
      body: text,
      from: 'me',
      to: activeChat.value.id,
      author: null,
      timestamp: Math.floor(Date.now()/1000),
      type: 'chat',
      hasMedia: false,
      isFromMe: true
    })
    await nextTick()
    scrollToBottom()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Falha ao enviar' })
  }
}

onMounted(fetchChats)
</script>

<style scoped>
.full-height { height: calc(100vh - var(--q-header-height, 0px)); }
.scroll { overflow: auto; }
</style>
