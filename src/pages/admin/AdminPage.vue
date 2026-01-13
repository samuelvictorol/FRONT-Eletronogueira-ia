<template>
  <q-page class="q-px-md q-mt-md bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
    <div
      class="animate__animated animate__fadeInDown animate__delay-3s animate__slower q-my-md bg-dark q-pa-md"
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

    <!-- ⚙️ CONTROLES (TOTAL + ORDER + LIMIT) + ✅ BOTÃO ADICIONAR -->
    <div class="row items-center q-mb-sm q-gutter-sm justify-between">
      <div class="text-grey-8">
        <span v-if="!loading">{{ total }} resultado(s)</span>
        <span v-else>Carregando…</span>
      </div>

      <div class="row q-gutter-sm items-center">
        <q-btn
          color="secondary"
          icon="add"
          label="Adicionar"
          :dense="isMobile"
          class="q-mr-xs"
          @click="openAdd"
        />

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
      :grid="isMobile"
      hide-bottom
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
        <q-td :props="props" class="text-right">
          <q-btn
            color="secondary"
            size="sm"
            flat
            icon="edit"
            @click="openEdit(props.row)"
            label="Editar"
          />

          <q-btn
            color="negative"
            size="sm"
            flat
            icon="delete"
            class="q-ml-xs"
            @click="confirmDelete(props.row)"
            label="Remover"
          />
        </q-td>
      </template>

      <!-- modo grid (mobile) -->
      <template #item="props">
        <div class="col-12 q-pa-xs">
          <q-card class="bg-white shadow-1 rounded-borders">
            <q-card-section class="row items-center q-col-gutter-sm">
              <div class="col-auto">
                <q-img
                  :src="resolveImage(props.row)"
                  :alt="props.row.descricao"
                  style="width: 64px; height: 64px; border-radius: 10px;"
                  fit="contain"
                />
              </div>

              <div class="col">
                <div class="text-weight-bold ellipsis-2-lines">
                  {{ props.row.descricao }}
                </div>
                <div class="text-caption text-grey-7">
                  Cód.: {{ props.row.codProduto }} • {{ props.row.marca || '—' }}
                </div>
                <div class="q-mt-xs">
                  <span v-if="props.row.precoPromocao && props.row.precoPromocao > 0">
                    <span class="text-caption text-negative">
                      <s>{{ money(props.row.preco) }}</s>
                    </span>
                    <span class="text-weight-bold text-positive q-ml-sm">
                      {{ money(props.row.precoPromocao) }}
                    </span>
                  </span>
                  <span v-else class="text-weight-medium">
                    {{ money(props.row.precoEfetivo ?? props.row.preco) }}
                  </span>
                </div>
              </div>

              <div class="col-12 row justify-end q-gutter-xs q-pt-sm">
                <q-btn
                  color="secondary"
                  size="sm"
                  flat
                  icon="edit"
                  label="Editar"
                  @click="openEdit(props.row)"
                />
                <q-btn
                  color="negative"
                  size="sm"
                  flat
                  icon="delete"
                  label="Remover"
                  @click="confirmDelete(props.row)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
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

    <!-- ✅ MODAL: ADICIONAR PRODUTO -->
    <q-dialog v-model="addDialog">
      <q-card style="min-width: 360px; max-width: 720px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Adicionar produto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="addForm.descricao"
                label="Descrição *"
                type="textarea"
                autogrow
                dense
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="addForm.codProduto"
                    label="Cód. Produto"
                    dense
                    outlined
                    hint="Opcional (numérico)"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="addForm.codOriginal"
                    label="SKU / Cód. Original"
                    dense
                    outlined
                    hint="Opcional"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="addForm.codMarca"
                    label="Cód. Marca"
                    dense
                    outlined
                    hint="Opcional"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="addPrecoStr"
                    label="Preço"
                    prefix="R$"
                    mask="#######,##"
                    reverse-fill-mask
                    dense
                    outlined
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="addPrecoPromoStr"
                    label="Preço promocional"
                    prefix="R$"
                    mask="#######,##"
                    reverse-fill-mask
                    dense
                    outlined
                    hint="Deixe vazio ou 0 se não tiver"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 q-mb-sm">
            Imagem (opcional)
          </div>

          <q-input
            v-model="addImgLink"
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
              v-model="addImgFile"
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
              v-if="addImgFile"
              flat
              color="negative"
              icon="close"
              label="Limpar arquivo"
              @click="clearAddFile"
            />
          </div>

          <div class="text-caption text-grey-7 q-mt-xs">
            Se enviar arquivo, ele terá prioridade sobre o link.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="secondary"
            label="Cadastrar"
            :loading="adding"
            @click="saveAdd"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ✏️ MODAL DE EDIÇÃO -->
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
const isMobile = computed(() => $q.screen.lt.md).value

/** ---------------- State base ---------------- */
const loading = ref(false)
const rows = ref([])
const total = ref(0)

const page = ref(1)
const limit = ref(12)
const orderBy = ref('updated_desc')

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
async function fetchRows() {
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
        id: p.ID ?? p._id ?? p.CODPRODUTO ?? p.codProduto ?? p.id,
        codProduto: p.CODPRODUTO ?? p.codProduto ?? p.id ?? p._id,
        descricao: p.DESCRICAO ?? p.descricao,
        codOriginal: p.CODORIGINAL ?? p.codOriginal,
        codMarca: p.CODMARCA ?? p.codMarca,
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

/** ---------------- Delete ---------------- */
function confirmDelete(row) {
  $q.dialog({
    title: 'Confirmar remoção',
    message: `Deseja remover o produto:\n\n${row.descricao}\n(Cód.: ${row.codProduto})`,
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    ok: {
      label: 'Remover',
      color: 'negative'
    },
    persistent: true
  }).onOk(() => doDelete(row))
}

async function doDelete(row) {
  try {
    const id = row?.id
    if (!id) {
      $q.notify({ type: 'warning', message: 'Produto inválido para remoção.' })
      return
    }

    await api.delete(`/catalogo/produtos/${id}`)
    $q.notify({ type: 'positive', message: 'Produto removido com sucesso.' })

    // ajusta página se ficou vazia
    if (rows.value.length === 1 && page.value > 1) page.value -= 1
    await fetchRows(false)
  } catch (err) {
    console.error('[CatalogoTabela] erro ao remover:', err)
    $q.notify({ type: 'negative', message: 'Falha ao remover produto.' })
  }
}

/** ---------------- Adicionar (produto + imagem opcional) ---------------- */
const addDialog = ref(false)
const adding = ref(false)

const addForm = ref({
  codProduto: '',
  codOriginal: '',
  codMarca: '',
  descricao: ''
})

const addPrecoStr = ref('')
const addPrecoPromoStr = ref('')

const addImgLink = ref('')
const addImgFile = ref(null)
const addImgFileUrl = ref(null)

function clearAddFile() {
  if (addImgFileUrl.value) URL.revokeObjectURL(addImgFileUrl.value)
  addImgFile.value = null
  addImgFileUrl.value = null
}

function openAdd() {
  addForm.value = { codProduto: '', codOriginal: '', codMarca: '', descricao: '' }
  addPrecoStr.value = ''
  addPrecoPromoStr.value = ''
  addImgLink.value = ''
  clearAddFile()
  addDialog.value = true
}

function onFileRejected() {
  $q.notify({
    type: 'warning',
    message: 'Arquivo inválido. Envie apenas imagens dentro do limite de tamanho.'
  })
}

async function saveAdd() {
  const descricao = String(addForm.value.descricao || '').trim()
  if (!descricao) {
    $q.notify({ type: 'warning', message: 'Informe a descrição do produto.' })
    return
  }

  const preco = brToNumber(addPrecoStr.value)
  const precoPromocao = brToNumber(addPrecoPromoStr.value)

  adding.value = true
  try {
    // 1) cadastra produto
    const body = {
      codproduto: addForm.value.codProduto ? Number.parseInt(addForm.value.codProduto, 10) : undefined,
      codoriginal: addForm.value.codOriginal ? String(addForm.value.codOriginal).trim() : undefined,
      codmarca: addForm.value.codMarca ? String(addForm.value.codMarca).trim() : undefined,
      descricao,
      preco,
      precoPromocao
    }

    const { data } = await api.post('/catalogo/produtos', body)
    const insertedId = data?.insertedId || data?.data?._id || data?.data?.ID || null

    // 2) se tiver imagem, aplica (usa o id retornado)
    if (insertedId && (addImgFile.value || (addImgLink.value && addImgLink.value.trim()))) {
      if (addImgFile.value) {
        const formData = new FormData()
        formData.append('file', addImgFile.value)
        await api.put(`/catalogo/produtos/${insertedId}/imagem`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.put(`/catalogo/produtos/${insertedId}/imagem`, { link: addImgLink.value.trim() })
      }
    }

    $q.notify({ type: 'positive', message: 'Produto cadastrado com sucesso.' })
    addDialog.value = false
    clearAddFile()

    page.value = 1
    await fetchRows(false)
  } catch (err) {
    console.error('[CatalogoTabela] erro ao cadastrar:', err)
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      'Falha ao cadastrar produto.'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    adding.value = false
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

const editImgLink = ref('')
const editImgFile = ref(null)
const editImgFileUrl = ref(null)

const saving = ref(false)

const currentEditImageSrc = computed(() => {
  if (editImgFile.value && editImgFileUrl.value) return editImgFileUrl.value
  return resolveImage(editForm.value)
})

function clearFile() {
  if (editImgFileUrl.value) URL.revokeObjectURL(editImgFileUrl.value)
  editImgFile.value = null
  editImgFileUrl.value = null
}

function openEdit(row) {
  clearFile()
  editImgLink.value = ''

  editForm.value = { ...row }
  editPrecoStr.value = row.preco != null ? numberToBR(row.preco) : ''
  editPrecoPromoStr.value = row.precoPromocao != null ? numberToBR(row.precoPromocao) : ''

  if (row.imagemUrl) editImgLink.value = row.imagemUrl

  editDialog.value = true
}

watch(editImgFile, (file) => {
  if (editImgFileUrl.value) URL.revokeObjectURL(editImgFileUrl.value)
  editImgFileUrl.value = file ? URL.createObjectURL(file) : null
})

watch(addImgFile, (file) => {
  if (addImgFileUrl.value) URL.revokeObjectURL(addImgFileUrl.value)
  addImgFileUrl.value = file ? URL.createObjectURL(file) : null
})

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
    promises.push(
      api.put(`/catalogo/produtos/${editForm.value.id}`, {
        descricao: editForm.value.descricao,
        preco,
        precoPromocao
      })
    )

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

    await Promise.all(promises)

    $q.notify({ type: 'positive', message: 'Produto atualizado com sucesso.' })
    editDialog.value = false
    clearFile()
    await fetchRows(false)
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

watch(addDialog, (v) => {
  if (!v) {
    clearAddFile()
    addImgLink.value = ''
  }
})
</script>

<style scoped>
.w100 { width: 100%; }
.ellipsis-2-lines{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
