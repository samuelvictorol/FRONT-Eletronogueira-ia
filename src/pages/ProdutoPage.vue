<template>
  <q-page class="q-px-md q-mt-xl q-pt-xs bg-grey-3 animate__animated animate__fadeInLeft animate__slower">
    <div class="q-mb-lg bg-primary animate__animated animate__fadeInDown animate__delay-3s animate__slower"
      style="border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;">
      <q-btn flat color="secondary" icon="arrow_back" @click="goBackToCatalog" label="Voltar" />
    </div>

    <q-card flat bordered
      class="bg-white rounded-borders shadow-1 animate__animated animate__fadeInLeft animate__slower">
      <q-card-section>
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <q-skeleton v-if="loading" type="rect" style="height: 360px; border-radius: 14px" />
            <div class="w100 row justify-center" v-else>
              <q-img :src="productImage" :alt="product?.descricao || 'Imagem do produto'" fit="contain"
                class="product-detail-img" @error="onMainImageError" />
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="row items-center q-col-gutter-sm">
              <q-badge v-if="product?.marca" color="primary" class="text-bold q-pa-sm" text-color="blue-10"
                :label="product.marca" />
              <q-chip v-if="inStock" color="secondary" text-color="white" icon="check_circle">Em estoque</q-chip>
              <q-chip v-else color="grey-6" text-color="white" icon="hourglass_empty">Sob consulta</q-chip>
            </div>

            <div class="text-h5 text-weight-bold q-mt-xs">
              {{ product?.descricao || 'Produto' }}
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Cód.: {{ product?.id || product?.CODPRODUTO || '—' }} • SKU: {{ skuText }}
            </div>

            <div class="q-mt-md">
              <div v-if="product?.precoPromocao && product.precoPromocao > 0" class="column">
                <div class="text-caption text-negative">
                  <s>{{ money(product.precoEfetivo) }}</s>
                </div>
                <div class="text-h5 text-positive">
                  {{ money(product.precoPromocao) }}
                </div>
              </div>
              <div v-else class="text-h5">
                {{ money(product?.precoEfetivo ?? product?.preco) }}
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-body2 text-grey-8">
              <div class="q-mb-xs"><strong>Descrição:</strong></div>
              <div>
                {{ shortDesc }} <br />
                Marca: {{ product?.marca }}
              </div>
            </div>

            <div class="q-mt-lg row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-btn unelevated color="green-14" icon="add_shopping_cart" class="w100 text-bold"
                  label="Adicionar ao carrinho" :disable="!product" @click="confirmAddToCart(product)" />
              </div>

              <!-- <div class="col-12 col-sm-6">
                <q-btn
                  unelevated
                  color="green-14"
                  icon-right="whatsapp"
                  class="w100"
                  :href="product ? whatsLink(product) : '#'"
                  target="_blank"
                  label="Pedir orçamento"
                />
              </div> -->


              <!-- <div class="col-12 col-sm-6">
                <q-btn
                color="secondary"
                icon="shopping_cart"
                class="w100"
                label="Ver carrinho"
                @click="cart.state.drawerOpen = true"
                >
                <q-badge v-if="cart.count.value > 0" color="negative" floating>
                  {{ cart.count.value }}
                </q-badge>
              </q-btn>
            </div> -->
              <div class="col-12 col-sm-6">
                <q-btn outline color="secondary" icon="share" class="w100" @click="shareOrCopy" label="Compartilhar" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="q-mt-lg">
      <q-btn flat color="secondary" icon="arrow_back" @click="goBackToCatalog" label="Voltar" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, useMeta } from 'quasar'
import { api } from 'boot/axios'
import { useCart } from 'src/composables/useCart'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const cart = useCart()

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

const loading = ref(true)
const product = ref(null)

// erro na imagem principal
const mainImageError = ref(false)

// --------- helpers de normalização ---------
function normalizeProduct(p) {
  if (!p) return null
  return {
    id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p.ID,
    CODPRODUTO: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p.ID,
    descricao: p.DESCRICAO ?? p.descricao,
    marca: p.MARCA ?? p.marca,
    preco: p.PRECO ?? p.preco,
    precoPromocao: p.PRECOPROMOCAO ?? p.precoPromocao,
    precoEfetivo: p.PRECO_EFETIVO ?? p.precoEfetivo ?? p.PRECO ?? p.preco,
    CODORIGINAL: p.CODORIGINAL ?? p.codOriginal ?? p.sku,
    INATIVO: p.INATIVO ?? p.inativo,
    IMG: p.IMG ?? p.img ?? null,
    imagemUrl: p.imagemUrl ?? null,
    ...p
  }
}

const stateProduct = (history && history.state && history.state.product) || null

if (stateProduct) {
  product.value = normalizeProduct(stateProduct)
} else {
  const idFromSlug = extractIdFromSlug(route.params.slug)
  if (idFromSlug) {
    try {
      const cached = sessionStorage.getItem(`prod:${idFromSlug}`)
      if (cached) product.value = normalizeProduct(JSON.parse(cached))
    } catch { }
  }
}

// --------- computeds ---------
const inStock = computed(() => {
  const p = product.value
  if (!p) return false
  const flag = p.inativoFlag ?? p.INATIVO
  return typeof flag === 'string' ? flag.toUpperCase() !== 'T' : true
})

const skuText = computed(() => {
  const p = product.value
  if (!p) return '—'
  const sku = p.sku ?? p.CODORIGINAL ?? p.codOriginal ?? p.codoriginal
  return sku ? String(sku) : '—'
})

const shortDesc = computed(() =>
  product.value?.descricao
    ? String(product.value.descricao).slice(0, 180)
    : 'Ferramentas e bombas com pronta-entrega em Valparaíso de Goiás.'
)

const productImage = computed(() => {
  if (mainImageError.value) return fallbackImage
  const p = product.value
  if (!p) return fallbackImage
  if (p.IMG && p.IMG.link) return p.IMG.link
  if (p.imagemUrl) return p.imagemUrl
  return fallbackImage
})

// --------- helpers diversos ---------
function money(n) {
  if (n == null) return '—'
  try {
    return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${String(n)}`
  }
}

function whatsLink(p) {
  const base = 'https://wa.me/556136290040'
  const text = encodeURIComponent(
    `Olá! Pode me enviar o preço e disponibilidade deste item?\n\n${p.descricao} (${p.marca || '—'})\nCód.: ${p.id || '—'}\nLink: ${location.href}`
  )
  return `${base}?text=${text}`
}

function slugify(s = '') {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function extractIdFromSlug(slug) {
  const m = String(slug).match(/-(\d+)$/) || String(slug).match(/-(\w{6,})$/)
  return m ? m[1] : null
}

function buildSlug(p) {
  const desc = (p.DESCRICAO ?? p.descricao) || ''
  const brand = (p.MARCA ?? p.marca) || ''
  const id = p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id ?? ''
  return `${slugify(`${desc} ${brand}`)}-${id}`
}

function goBackToCatalog() {
  const last = sessionStorage.getItem('catalog:lastUrl')
  if (last) return router.push(last)

  if (window.history.length > 1) return router.back()

  return router.push({ path: '/catalogo' })
}

/** carrinho */
function confirmAddToCart(p) {
  const name = p?.descricao || 'Produto'
  $q.dialog({
    title: '🛒 Adicionar ao carrinho',
    message: `Adicionar "${name}" ao carrinho?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Adicionar', color: 'green-14' },
    cancel: { label: 'Cancelar', color: 'grey-6' }
  }).onOk(() => {
    cart.addItem(p, 1)
    cart.state.drawerOpen = true
    $q.notify({ type: 'secondary', message: 'Adicionado ao carrinho!' })
  })
}

// --------- SEO ---------
function updateHead() {
  const p = product.value
  const img = productImage.value

  useMeta(() => {
    const title = p ? `${p.descricao || p.DESCRICAO} | Eletro Nogueira` : 'Produto | Eletro Nogueira'
    const desc = shortDesc.value
    const canonical = `${location.origin}/catalogo/produto/${route.params.slug}`

    return {
      title,
      meta: [
        { name: 'description', content: desc },
        { property: 'og:title', content: title },
        { property: 'og:description', content: desc },
        { property: 'og:type', content: 'product' },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: img }
      ],
      link: [{ rel: 'canonical', href: canonical }],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p?.descricao || p?.DESCRICAO || 'Produto',
            image: [img],
            description: desc,
            sku: p?.sku || p?.CODORIGINAL || String(p?.id || ''),
            brand: p?.marca ? { '@type': 'Brand', name: p.marca } : undefined,
            offers: {
              '@type': 'Offer',
              url: canonical,
              priceCurrency: 'BRL',
              price: Number(p?.precoEfetivo ?? p?.PRECO_EFETIVO ?? p?.preco ?? p?.PRECO ?? 0).toFixed(2),
              availability: inStock.value ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
              itemCondition: 'https://schema.org/NewCondition',
              seller: { '@type': 'Organization', name: 'Eletro Nogueira' }
            }
          })
        }
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  })
}

// --------- carregar do backend ---------
async function load() {
  loading.value = true
  try {
    const slug = route.params.slug
    const idFromSlug = extractIdFromSlug(slug)

    if (idFromSlug) {
      try {
        const { data } = await api.get(`/catalogo/produtos/${idFromSlug}`)
        if (data?.ok && data.data) {
          product.value = normalizeProduct(data.data)
          try {
            sessionStorage.setItem(`prod:${idFromSlug}`, JSON.stringify(product.value))
          } catch { }
        }
      } catch (err) {
        console.error('[ProductPage] erro ao buscar na API:', err)
      }
    }

    if (product.value) {
      const canonicalSlug = buildSlug(product.value)
      if (canonicalSlug && canonicalSlug !== slug) {
        router.replace(`/catalogo/produto/${canonicalSlug}`)
      }
      updateHead()
    } else {
      $q.notify({
        type: 'warning',
        message: 'Produto não encontrado. Abra a partir do catálogo.'
      })
    }
  } catch (err) {
    console.error('[ProductPage] erro:', err)
    $q.notify({ type: 'negative', message: 'Falha ao carregar o produto.' })
  } finally {
    loading.value = false
  }
}

// --------- share ---------
async function shareOrCopy() {
  const url = location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      $q.notify({ type: 'positive', message: 'Link copiado!' })
    }
  } catch { }
}

function onMainImageError() {
  mainImageError.value = true
}

onMounted(load)
</script>

<style scoped>
.product-detail-img {
  max-width: 260px;
  height: 260px;
  border-radius: 14px;
}

/* garante contain + centralizado dentro do q-img */
.product-detail-img :deep(img),
.product-detail-img :deep(.q-img__image) {
  object-fit: contain;
  object-position: center;
}
</style>