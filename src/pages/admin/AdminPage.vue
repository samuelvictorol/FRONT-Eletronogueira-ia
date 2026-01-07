<template>
  <q-page class="q-px-md q-mt-md bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <div
      class="animate__animated animate__fadeInDown animate__delay-3s animate__slower q-my-md bg-secondary q-pa-md"
      style="border-bottom-left-radius: 20px;border-bottom-right-radius: 20px;"
    >
      <q-breadcrumbs class="text-grey-3">
        <q-breadcrumbs-el class="text-primary" icon="home" label="Início" to="/" />
        <q-breadcrumbs-el label="Catálogo (Admin / Tabela)" />
      </q-breadcrumbs>
    </div>

    <!-- 🔎 FILTROS -->
    <div class="q-pa-md bg-white rounded-borders q-mb-md shadow-1">
      <div class="row q-col-gutter-md items-end">
        <div class="col-12 col-md-4">
          <q-input
            @keyup.enter="fetchRows(true)"
            color="secondary"
            v-model="filters.descricaoProduto"
            label="Buscar por produto"
            dense
            outlined
            clearable
            hint="Furadeira, Bomba, Martelo"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-input
            @keyup.enter="fetchRows(true)"
            color="secondary"
            v-model="filters.descricaoMarca"
            label="Buscar por marca"
            dense
            outlined
            clearable
            hint="Ex.: makita, bosch, fortlev"
          >
            <template #prepend>
              <q-icon name="sell" />
            </template>
          </q-input>
        </div>

        <div class="col-6 col-md-2">
          <q-input
            @keyup.enter="fetchRows(true)"
            color="secondary"
            maxlength="9"
            prefix="R$"
            mask="####,##"
            reverse-fill-mask
            v-model="priceMinStr"
            label="Preço mín."
            dense
            outlined
            clearable
            hint="Ex.: 199,90"
          >
            <template #prepend>
              <q-icon name="payments" />
            </template>
          </q-input>
        </div>

        <div class="col-6 col-md-2">
          <q-input
            @keyup.enter="fetchRows(true)"
            color="secondary"
            maxlength="9"
            prefix="R$"
            mask="####,##"
            reverse-fill-mask
            v-model="priceMaxStr"
            label="Preço máx."
            dense
            outlined
            clearable
            hint="Ex.: 1299,00"
          >
            <template #prepend>
              <q-icon name="price_check" />
            </template>
          </q-input>
        </div>

        <div class="w100 row justify-center q-gutter-x-md items-center no-wrap">
          <q-btn flat color="secondary" label="Limpar" @click="resetFilters" />
          <q-btn
            color="secondary"
            label="Consultar"
            icon-right="search"
            :loading="loading"
            @click="fetchRows(true)"
          />
        </div>
      </div>
    </div>

    <!-- ⚙️ CONTROLES DE PÁGINA/LIMITE -->
    <div class="row items-center q-mb-sm q-gutter-sm justify-between">
      <div class="text-grey-8">
        <span v-if="!loading">{{ total }} resultado(s)</span>
        <span v-else>Carregando…</span>
      </div>
      <div class="row q-gutter-sm items-center">
        <q-select
          color="secondary"
          v-model="orderBy"
          :options="orderOptions"
          dense
          outlined
          style="min-width: 210px"
          emit-value
          map-options
          @update:model-value="onOrderChange"
        />
        <q-select
          color="secondary"
          v-model="limit"
          :options="[12, 24, 36, 50]"
          dense
          outlined
          style="width: 90px"
          label="Limite"
          @update:model-value="onLimitChange"
        />
      </div>
    </div>

    <!-- 📋 TABELA -->
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      class="bg-white rounded-borders shadow-1"
    >
      <!-- miniatura -->
      <template #body-cell-thumb="props">
        <q-td :props="props">
          <q-img
            :src="resolveImage(props.row)"
            :alt="props.row.descricao"
            style="width: 56px; height: 56px; border-radius: 8px;"
            spinner-color="primary"
            fit="contain"
          />
        </q-td>
      </template>

      <!-- preço -->
      <template #body-cell-preco="props">
        <q-td :props="props">
          <div v-if="props.row.precoPromocao && props.row.precoPromocao > 0">
            <div class="text-caption text-negative">
              <s>{{ money(props.row.preco) }}</s>
            </div>
            <div class="text-weight-bold text-positive">
              {{ money(props.row.precoPromocao) }}
            </div>
          </div>
          <div v-else>
            {{ money(props.row.precoEfetivo ?? props.row.preco) }}
          </div>
        </q-td>
      </template>

      <!-- ações -->
      <template #body-cell-acoes="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            size="sm"
            flat
            icon="edit"
            @click="openEdit(props.row)"
            label="Editar"
          />
        </q-td>
      </template>
    </q-table>

    <div class="w100 row justify-end items-center q-mt-md">
      <q-pagination
        color="secondary"
        v-model="page"
        :max="maxPage"
        :max-pages="6"
        boundary-numbers
        direction-links
        dense
        @update:model-value="onPageChange"
      />
    </div>

    <!-- ✏️ MODAL DE EDIÇÃO (com upload + link de imagem) -->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 360px; max-width: 700px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Editar produto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-img
                :src="currentEditImageSrc"
                :alt="editForm.descricao"
                style="width: 100%; height: 180px; border-radius: 8px;"
                fit="contain"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="editForm.descricao"
                label="Descrição"
                type="textarea"
                autogrow
                dense
                outlined
              />
              <q-input
                class="q-mt-sm"
                v-model="editPrecoStr"
                label="Preço"
                prefix="R$"
                mask="#######,##"
                reverse-fill-mask
                dense
                outlined
              />
              <q-input
                class="q-mt-sm"
                v-model="editPrecoPromoStr"
                label="Preço promocional"
                prefix="R$"
                mask="#######,##"
                reverse-fill-mask
                dense
                outlined
                hint="Deixe vazio ou 0 se não tiver promoção"
              />
              <div class="text-caption text-grey-7 q-mt-sm">
                Cód.: {{ editForm.codProduto }} • Marca: {{ editForm.marca || '—' }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 q-mb-sm">
            Imagem do produto
          </div>

          <q-input
            v-model="editImgLink"
            label="Link da imagem (URL)"
            dense
            outlined
            clearable
            hint="Cole aqui um link de imagem público (https://...)"
          >
            <template #prepend>
              <q-icon name="link" />
            </template>
          </q-input>

          <div class="row items-center q-gutter-sm q-mt-sm">
            <q-file
              v-model="editImgFile"
              label="Upload de imagem"
              dense
              outlined
              use-chips
              accept="image/*"
              @rejected="onFileRejected"
            >
              <template #prepend>
                <q-icon name="upload" />
              </template>
            </q-file>

            <q-btn
              v-if="editImgFile"
              flat
              color="negative"
              icon="close"
              label="Limpar arquivo"
              @click="clearFile"
            />
          </div>

          <div class="text-caption text-grey-7 q-mt-xs">
            Se enviar arquivo, ele terá prioridade sobre o link.
            Se não informar nem link nem arquivo, a imagem atual será mantida.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="secondary"
            label="Salvar"
            :loading="saving"
            @click="saveEdit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="w100 q-py-xl"></div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const isMobile = $q.screen.lt.md

/** ---------------- State base ---------------- */
const loading = ref(false)
const rows = ref([])
const total = ref(0)

const page = ref(1)
const limit = ref(12)
const orderBy = ref('updated_desc') // pra admin faz sentido "Mais recentes"

const filters = ref({
  descricaoProduto: '',
  descricaoMarca: '',
  precoMin: null,
  precoMax: null
})

const priceMinStr = ref('')
const priceMaxStr = ref('')

const orderOptions = [
  { label: 'Mais relevantes', value: 'relevance' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Mais recentes', value: 'updated_desc' }
]

const fallbackImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

function resolveImage(p) {
  if (!p) return fallbackImage
  return p.imagemUrl || p.IMAGEM_URL || p.img_url || fallbackImage
}

const maxPage = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))
const offset = computed(() => (page.value - 1) * limit.value)

const pagination = computed(() => ({
  page: page.value,
  rowsPerPage: limit.value,
  rowsNumber: total.value
}))

/** ---------------- Helpers numéricos ---------------- */
function brToNumber(s) {
  if (!s) return null
  const t = String(s).replace(/\./g, '').replace(',', '.')
  const n = Number.parseFloat(t)
  return Number.isNaN(n) ? null : n
}
function numberToBR(n) {
  if (n == null) return ''
  try {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } catch {
    return String(n)
  }
}
function money(n) {
  if (n == null) return '—'
  try {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${numberToBR(n)}`
  }
}

function normalizePrice(which) {
  if (which === 'min') {
    const n = brToNumber(priceMinStr.value)
    filters.value.precoMin = n
    priceMinStr.value = n != null ? numberToBR(n) : ''
  } else {
    const n = brToNumber(priceMaxStr.value)
    filters.value.precoMax = n
    priceMaxStr.value = n != null ? numberToBR(n) : ''
  }
}

/** ---------------- Tabela: colunas ---------------- */
const columns = [
  { name: 'thumb', label: 'Imagem', align: 'left', field: 'imagemUrl' },
  { name: 'codProduto', label: 'Cód.', align: 'left', field: 'codProduto', sortable: true },
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
  { name: 'marca', label: 'Marca', align: 'left', field: 'marca', sortable: true },
  { name: 'preco', label: 'Preço', align: 'right', field: 'preco', sortable: true },
  { name: 'acoes', label: 'Ações', align: 'right', field: 'acoes' }
]

/** ---------------- Filtros ---------------- */
function resetFilters() {
  filters.value = { descricaoProduto: '', descricaoMarca: '', precoMin: null, precoMax: null }
  priceMinStr.value = ''
  priceMaxStr.value = ''
  page.value = 1
  fetchRows(true)
}

function onOrderChange() {
  page.value = 1
  fetchRows(true)
}
function onLimitChange() {
  page.value = 1
  fetchRows(true)
}
function onPageChange() {
  fetchRows(false)
}

function onRequest(props) {
  const { page: p, rowsPerPage } = props.pagination
  page.value = p
  limit.value = rowsPerPage
  fetchRows(false)
}

/** ---------------- Busca backend ---------------- */
async function fetchRows(updateURL = false) {
  loading.value = true
  try {
    normalizePrice('min')
    normalizePrice('max')

    const L = Number(limit.value) || 12

    const body = {
      descricaoProduto: filters.value.descricaoProduto || null,
      descricaoMarca: filters.value.descricaoMarca || null,
      precoMin: filters.value.precoMin,
      precoMax: filters.value.precoMax,
      limit: L + 1,
      offset: offset.value,
      orderBy: orderBy.value || 'updated_desc'
    }

    // aqui usamos a mesma rota pública /catalogo/produtos/buscar
    const { data } = await api.post('/catalogo/produtos/buscar', body)

    const raw =
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.results) && data.results) ||
      (Array.isArray(data) ? data : [])

    const hasNext = raw.length > L
    const arr = hasNext ? raw.slice(0, L) : raw

    rows.value = arr.map(p => {
      const imagemUrl =
        (p.IMG && (p.IMG.link || p.IMG.url)) ||
        p.IMAGEM_URL ||
        p.imagemUrl ||
        p.img_url ||
        null

      const preco = p.PRECO ?? p.preco
      const precoPromocao = p.PRECOPROMOCAO ?? p.precoPromocao
      const precoEfetivo =
        p.PRECO_EFETIVO ??
        p.precoEfetivo ??
        (precoPromocao > 0 ? precoPromocao : preco)

      return {
        id: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
        codProduto: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
        descricao: p.DESCRICAO ?? p.descricao,
        codOriginal: p.CODORIGINAL ?? p.codOriginal,
        marca: p.MARCA ?? p.marca,
        preco,
        precoPromocao,
        precoEfetivo,
        imagemUrl,
        hasImg: p.HAS_IMG ?? p.hasImg ?? (imagemUrl ? 1 : 0),
        dataAtualizacao: p.DATAATUALIZACAO ?? p.dataAtualizacao ?? null
      }
    })

    const apiTotal = Number(data?.totalCount ?? data?.total ?? data?.count)
    if (Number.isFinite(apiTotal) && apiTotal >= 0) {
      total.value = apiTotal
    } else {
      total.value = hasNext
        ? Number(page.value) * L + 1
        : (Number(page.value) - 1) * L + rows.value.length
    }
  } catch (err) {
    console.error('[CatalogoTabela] erro ao buscar:', err)
    $q.notify({ type: 'negative', message: 'Falha ao buscar produtos.' })
    rows.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** ---------------- Edição (produto + imagem) ---------------- */
const editDialog = ref(false)
const editForm = ref({
  id: null,
  codProduto: null,
  descricao: '',
  marca: '',
  preco: null,
  precoPromocao: null,
  precoEfetivo: null,
  imagemUrl: null
})

const editPrecoStr = ref('')
const editPrecoPromoStr = ref('')

// imagem
const editImgLink = ref('')
const editImgFile = ref(null)
const editImgFileUrl = ref(null)

const saving = ref(false)

const currentEditImageSrc = computed(() => {
  if (editImgFile.value && editImgFileUrl.value) {
    return editImgFileUrl.value
  }
  return resolveImage(editForm.value)
})

function clearFile() {
  if (editImgFileUrl.value) {
    URL.revokeObjectURL(editImgFileUrl.value)
  }
  editImgFile.value = null
  editImgFileUrl.value = null
}

function onFileRejected(rej) {
  console.warn('Arquivo rejeitado:', rej)
  $q.notify({
    type: 'warning',
    message: 'Arquivo inválido. Envie apenas imagens dentro do limite de tamanho.'
  })
}

function openEdit(row) {
  // limpa estados de imagem
  clearFile()
  editImgLink.value = ''

  editForm.value = { ...row }
  editPrecoStr.value = row.preco != null ? numberToBR(row.preco) : ''
  editPrecoPromoStr.value =
    row.precoPromocao != null ? numberToBR(row.precoPromocao) : ''

  // se quiser já preencher o link com a imagem atual:
  if (row.imagemUrl) {
    editImgLink.value = row.imagemUrl
  }

  editDialog.value = true
}

async function saveEdit() {
  if (!editForm.value.id) {
    $q.notify({ type: 'warning', message: 'Produto inválido para edição.' })
    return
  }

  const preco = brToNumber(editPrecoStr.value)
  const precoPromocao = brToNumber(editPrecoPromoStr.value)

  saving.value = true
  try {
    const promises = []

    // 1) Atualiza campos básicos
    const bodyProduto = {
      descricao: editForm.value.descricao,
      preco,
      precoPromocao
    }

    promises.push(api.put(`/catalogo/produtos/${editForm.value.id}`, bodyProduto))

    // 2) Atualiza imagem (se tiver alteração)
    if (editImgFile.value) {
      const formData = new FormData()
      formData.append('file', editImgFile.value)

      promises.push(
        api.put(`/catalogo/produtos/${editForm.value.id}/imagem`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      )
    } else if (editImgLink.value && editImgLink.value.trim().length > 0) {
      promises.push(
        api.put(`/catalogo/produtos/${editForm.value.id}/imagem`, {
          link: editImgLink.value.trim()
        })
      )
    }
    // se não tiver arquivo nem link, não mexe na imagem

    await Promise.all(promises)

    $q.notify({ type: 'positive', message: 'Produto atualizado com sucesso.' })
    editDialog.value = false
    clearFile()
    fetchRows(false)
  } catch (err) {
    console.error('[CatalogoTabela] erro ao salvar:', err)
    $q.notify({ type: 'negative', message: 'Falha ao salvar produto.' })
  } finally {
    saving.value = false
  }
}

/** ---------------- Lifecycle ---------------- */
onMounted(async () => {
  await fetchRows(false)
})

watch(editDialog, (v) => {
  if (!v) {
    clearFile()
    editImgLink.value = ''
  }
})

watch([page, limit], () => {
  // paginação já é tratada pelo @request, então aqui pode ficar vazio
})
</script>

<style scoped>
</style>
