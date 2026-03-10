// src/composables/useCart.js
import { reactive, computed } from 'vue'

const STORAGE_KEY = 'en:cart:v1'

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function pickPrice(p) {
  const promo = Number(p?.precoPromocao ?? 0)
  const efetivo = Number(p?.precoEfetivo ?? p?.preco ?? 0)
  return promo > 0 ? promo : efetivo
}

function normalizeCartProduct(p) {
  if (!p) return null

  const codigo = String(
    p.codProduto ??
    p.CODPRODUTO ??
    p.codigo ??
    p.CODIGO ??
    p.id ??
    p._id ??
    ''
  ).trim()

  if (!codigo) return null

  return {
    id: codigo,
    codigo,
    descricao: String(p.descricao ?? p.DESCRICAO ?? '').trim() || 'Produto',
    marca: String(p.marca ?? p.MARCA ?? '').trim() || '',
    preco: Number(p.preco ?? p.PRECO ?? 0) || 0,
    precoPromocao: Number(p.precoPromocao ?? p.PRECOPROMOCAO ?? 0) || 0,
    precoEfetivo: Number(
      p.precoEfetivo ?? p.PRECO_EFETIVO ?? p.preco ?? p.PRECO ?? 0
    ) || 0,
    imagemUrl:
      p.imagemUrl ||
      p.imgPath ||
      p.IMG_PATH ||
      (p.IMG && (p.IMG.link || p.IMG.url)) ||
      null
  }
}

function moneyBR(n) {
  try {
    return Number(n || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  } catch {
    return `R$ ${String(n || 0)}`
  }
}

const state = reactive({
  drawerOpen: false,
  items: [] // { id, codigo, descricao, marca, precoEfetivo, precoPromocao, imagemUrl, qty }
})

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  } catch {}
}

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = safeParse(raw)
    if (Array.isArray(arr)) state.items = arr
  } catch {}
}

hydrate()

function findIndexById(id) {
  return state.items.findIndex((it) => String(it.id) === String(id))
}

function addItem(product, qty = 1) {
  const p = normalizeCartProduct(product)
  if (!p) return

  const idx = findIndexById(p.id)
  if (idx >= 0) {
    state.items[idx].qty = Math.min(999, Number(state.items[idx].qty || 1) + Number(qty || 1))
  } else {
    state.items.push({ ...p, qty: Math.max(1, Number(qty || 1)) })
  }
  persist()
}

function removeItem(id) {
  const idx = findIndexById(id)
  if (idx >= 0) {
    state.items.splice(idx, 1)
    persist()
  }
}

function setQty(id, qty) {
  const idx = findIndexById(id)
  if (idx < 0) return
  const q = Math.max(1, Math.min(999, Number(qty || 1)))
  state.items[idx].qty = q
  persist()
}

function inc(id) {
  const idx = findIndexById(id)
  if (idx < 0) return
  state.items[idx].qty = Math.min(999, Number(state.items[idx].qty || 1) + 1)
  persist()
}

function dec(id) {
  const idx = findIndexById(id)
  if (idx < 0) return
  state.items[idx].qty = Math.max(1, Number(state.items[idx].qty || 1) - 1)
  persist()
}

function clear() {
  state.items = []
  persist()
}

const count = computed(() => {
  return state.items.reduce((acc, it) => acc + Number(it.qty || 0), 0)
})

const total = computed(() => {
  return state.items.reduce((acc, it) => {
    const price = pickPrice(it)
    return acc + price * Number(it.qty || 0)
  }, 0)
})

function buildWhatsAppText() {
  const lines = []

  lines.push('Olá, estes itens estão disponíveis?')
  lines.push('')

  state.items.forEach((it) => {
    const qty = Number(it.qty || 1)
    const price = pickPrice(it)
    const lineTotal = price * qty
    const codigo = String(it.codigo ?? it.id ?? '').trim()
    const nome = String(it.descricao || '').trim()

    lines.push(`*Cod.${codigo}* - ${qty} uni ${nome} - ${moneyBR(lineTotal)}`)
  })

  lines.push('')
  lines.push(`*TOTAL* = ${moneyBR(total.value)}`)

  return lines.join('\n')
}

function buildWhatsAppUrl(phone = '556136290040') {
  const text = buildWhatsAppText()
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export function useCart() {
  return {
    state,
    count,
    total,
    addItem,
    removeItem,
    setQty,
    inc,
    dec,
    clear,
    buildWhatsAppText,
    buildWhatsAppUrl,
    moneyBR
  }
}