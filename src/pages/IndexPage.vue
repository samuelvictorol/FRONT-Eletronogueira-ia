<template>
  <q-page class="index-page text-black q-pt-xl">
    <div class="img-parallax bg-primary"></div>

    <!-- HERO / BANNERS -->
    <section
      class="banner-section bg-primary rounded-borders q-mx-sm q-mt-xl q-pt-xl animate__animated animate__fadeInDown animate__delay-2s animate__slower"
    >
      <!-- DESKTOP/TABLET: 2 banners por slide -->
      <q-carousel
        v-if="!isMobile"
        v-model="bannerSlideDesktop"
        class="banner-carousel rounded-borders q-mt-xl q-mb-lg"
        animated
        swipeable
        infinite
        arrows
        navigation
        height="520px"
        :autoplay="bannerAutoplay"
        @mousedown="pauseBannerAutoplay"
        @touchstart="pauseBannerAutoplay"
        @mouseup="resumeBannerAutoplay"
        @touchend="resumeBannerAutoplay"
        @mouseleave="resumeBannerAutoplay"
      >
        <q-carousel-slide
          v-for="(group, groupIndex) in bannerDesktopGroups"
          :key="`desktop-banner-group-${groupIndex}`"
          :name="groupIndex"
          class="q-pa-md"
        >
          <div class="desktop-banner-grid">
            <q-card
              v-for="(banner, bannerIndex) in group"
              :key="`desktop-banner-${groupIndex}-${bannerIndex}`"
              flat
              class="banner-card cursor-pointer"
              @click="onBannerClick(banner)"
            >
              <q-img
                :src="banner.url"
                :alt="banner.alt || `Banner ${bannerIndex + 1}`"
                class="banner-img"
                fit="contain"
                loading="lazy"
              />
            </q-card>
          </div>
        </q-carousel-slide>
      </q-carousel>

      <!-- MOBILE: mantém 1 banner por slide -->
      <q-carousel
        v-else
        v-model="bannerSlideMobile"
        class="banner-carousel rounded-borders q-pt-sm"
        animated
        swipeable
        infinite
        arrows
        navigation
        height="320px"
        :autoplay="bannerAutoplay"
        @mousedown="pauseBannerAutoplay"
        @touchstart="pauseBannerAutoplay"
        @mouseup="resumeBannerAutoplay"
        @touchend="resumeBannerAutoplay"
        @mouseleave="resumeBannerAutoplay"
      >
        <q-carousel-slide
          v-for="(banner, index) in bannersMobile"
          :key="`mobile-banner-${index}`"
          :name="index"
          class="bg-primary q-pa-sm"
        >
          <q-img
            :src="banner.url"
            :alt="banner.alt || `Banner ${index + 1}`"
            class="banner-img cursor-pointer rounded-borders"
            fit="contain"
            loading="lazy"
            @click="onBannerClick(banner)"
          />
        </q-carousel-slide>
      </q-carousel>
    </section>

    <!-- PRODUTOS / MARCAS -->
    <section id="produtos" class="animate__animated animate__fadeInUp animate__slower q-pt-sm"></section>

    <section class="section bg-secondary-grad q-pt-lg animate__animated animate__fadeInUp animate__delay-3s animate__slower">
      <div class="text-secondary">
        <div class="brand-tabs">
          <q-tabs
            v-model="tab1"
            dense
            no-caps
            align="center"
            outside-arrows
            mobile-arrows
            indicator-color="transparent"
            class="rounded-borders q-pa-xs q-pt-lg"
          >
            <q-route-tab
              v-for="brand in brandsRow1"
              :key="brand.name"
              :name="brand.name"
              :icon="`img:${brand.src}`"
              :to="brandCatalogUrl(brand.name)"
              exact
              class="brand-badge"
            />
          </q-tabs>

          <!-- PROMOÇÕES -->
          <q-carousel
            v-if="promoProducts.length"
            v-model="promoSlide"
            swipeable
            animated
            arrows
            navigation
            infinite
            control-color="secondary"
            padding
            height="490px"
            class="rounded-borders bg-transparent q-mt-md"
            :autoplay="promoAutoplay"
            @mousedown="pausePromoAutoplay"
            @touchstart="pausePromoAutoplay"
            @mouseup="resumePromoAutoplay"
            @touchend="resumePromoAutoplay"
            @mouseleave="resumePromoAutoplay"
          >
            <q-carousel-slide
              v-for="(group, index) in promoProductChunks"
              :key="`promo-group-${index}`"
              :name="index"
              class="row justify-center q-gutter-md items-start"
            >
              <q-card
                v-for="product in group"
                :key="product.id"
                class="product-card bg-blur glass cursor-pointer"
                @click="goTo(catalogSearchUrl(product.descricao))"
              >
                <q-img
                  :src="product.imagemPrincipal || fallbackProductImage"
                  :alt="product.descricao"
                  class="product-img bg-white"
                  fit="contain"
                  loading="lazy"
                />

                <q-card-section class="q-pa-sm text-secondary">
                  <q-badge color="negative" text-color="white" class="q-mb-sm">
                    Promoção
                  </q-badge>

                  <q-badge color="primary" text-color="secondary" class="q-mb-sm q-ml-xs">
                    {{ product.marca }}
                  </q-badge>

                  <div class="text-weight-bold text-secondary ellipsis-2">
                    {{ truncate(product.descricao, 50, 37) }}
                  </div>

                  <div class="text-grey-7 text-strike q-mt-sm bg-primary rounded-borders q-px-sm">
                    {{ formatBRL(product.preco) }}
                  </div>

                  <div class="text-weight-bold text-green-14 text-h6 bg-secondary rounded-borders q-px-sm q-mt-xs">
                    {{ formatBRL(product.precoPromocao) }}
                  </div>
                </q-card-section>
              </q-card>
            </q-carousel-slide>
          </q-carousel>

          <div v-else class="text-center text-secondary q-pa-md">
            Nenhum produto em promoção encontrado.
          </div>

          <!-- CATEGORIAS -->
          <div class="container rounded-borders q-pa-sm">
            <div class="cards text-secondary">
              <article
                v-for="category in categoryCards"
                :key="category.title"
                class="bg-primary product glass cursor-pointer"
                @click="goTo(category.to)"
              >
                <h4 class="text-bold text-secondary" >
                  {{ category.title }}
                </h4>
              </article>
            </div>
          </div>

          <div class="w100 row justify-center no-wrap">
            <q-btn
              class="bg-primary text-secondary text-bold q-pa-md q-my-md"
              to="/catalogo?limit=15&page=1&orderBy=updated_desc"
              label="Ver Catálogo Completo"
              icon-right="search"
            />
          </div>

          <!-- DESTAQUES -->
          <div class="q-mt-md">
            <!-- MOBILE: carrossel swipe -->
            <q-carousel
              v-if="isMobile"
              v-model="destaqueSlide"
              swipeable
              animated
              arrows
              control-color="primary"
              padding
              height="100%"
              class="rounded-borders bg-transparent"
              :autoplay="highlightAutoplay"
              infinite
              @mousedown="pauseHighlightAutoplay"
              @touchstart="pauseHighlightAutoplay"
              @mouseup="resumeHighlightAutoplay"
              @touchend="resumeHighlightAutoplay"
              @mouseleave="resumeHighlightAutoplay"
            >
              <q-carousel-slide
                v-for="(group, index) in destaqueChunks"
                :key="`highlight-group-${index}`"
                :name="index"
                class="row justify-center q-gutter-sm items-start"
              >
                <q-card
                  v-for="(product, productIndex) in group"
                  :key="`${product.name}-${productIndex}`"
                  class="product-card bg-blur glass cursor-pointer mobile-highlight-card"
                  @click="goTo(catalogSearchUrl(product.name))"
                >
                  <q-img
                    :src="product.src"
                    :alt="product.name"
                    class="highlight-img"
                    fit="fill"
                    loading="lazy"
                  />

                  <q-card-section class="q-pa-sm text-secondary">
                    <q-badge color="primary" text-color="secondary" class="text-bold q-mb-sm">
                      {{ product.brand }}
                    </q-badge>

                    <div class="text-weight-bold text-primary ellipsis-2 text-caption">
                      {{ product.name }}
                    </div>

                    <div class="text-weight-bold text-green-14 text-subtitle2">
                      {{ formatBRL(product.price) }}
                    </div>
                  </q-card-section>
                </q-card>
              </q-carousel-slide>
            </q-carousel>

            <!-- DESKTOP: grid -->
            <div v-else class="row justify-center q-gutter-sm">
              <q-card
                v-for="(product, index) in destaqueProducts"
                :key="`${product.name}-${index}`"
                class="product-card bg-blur glass q-mb-md cursor-pointer"
                @click="goTo(catalogSearchUrl(product.name))"
              >
                <q-img
                  :src="product.src"
                  :alt="product.name"
                  class="highlight-img"
                  fit="fill"
                  loading="lazy"
                />

                <q-card-section class="q-pa-sm text-secondary">
                  <q-badge color="primary" text-color="secondary" class="text-bold q-mb-sm">
                    {{ product.brand }}
                  </q-badge>

                  <div class="text-weight-bold text-secondary ellipsis-2">
                    {{ product.name }}
                  </div>

                  <div class="text-weight-bold text-primary bg-secondary q-pa-xs rounded-borders">
                    {{ formatBRL(product.price) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-tabs
            v-model="tab2"
            dense
            no-caps
            align="center"
            outside-arrows
            mobile-arrows
            indicator-color="transparent"
            class="rounded-borders q-pa-xs q-mt-sm q-pb-xl"
          >
            <q-route-tab
              v-for="brand in brandsRow2"
              :key="brand.name"
              :name="brand.name"
              :icon="brand.src ? `img:${brand.src}` : 'local_offer'"
              :to="brandCatalogUrl(brand.name)"
              exact
              class="brand-badge"
            />
          </q-tabs>
        </div>
      </div>
    </section>

    <!-- SERVIÇOS -->
    <section id="servicos" class="section bg-grey-4">
      <div class="container q-py-xl q-px-md">
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h4 text-secondary text-weight-bolder">
              Serviços & Manutenção
            </div>
          </div>

          <q-chip outline color="secondary" class="q-mt-sm">
            <q-icon name="verified" class="q-mr-xs" />
            Pronta-entrega + suporte técnico
          </q-chip>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-card class="svc-card glass bg-grey-3">
              <q-card-section class="svc-head">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">
                      Serviços
                    </div>
                    <div class="text-secondary q-mt-xs">
                      Projetos, emergências e soluções sob medida.
                    </div>
                  </div>

                  <q-avatar
                    v-if="!isMobile"
                    rounded
                    size="48px"
                    class="svc-icon bg-secondary text-white"
                  >
                    <q-icon name="handyman" size="24px" />
                  </q-avatar>
                </div>

                <div class="row q-gutter-sm q-mt-md">
                  <q-chip dense color="grey-2" text-color="grey-9" icon="bolt">
                    Industrial
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="precision_manufacturing">
                    Usinagem
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="engineering">
                    Equipe técnica
                  </q-chip>
                </div>
              </q-card-section>

              <q-separator color="rgba(255,255,255,.12)" />

              <q-card-section class="q-pa-md">
                <div class="svc-grid">
                  <div
                    v-for="service in servicesList"
                    :key="service.title"
                    class="svc-item"
                  >
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img :src="service.img" :alt="service.alt" />
                    </q-avatar>

                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">
                        {{ service.title }}
                      </div>
                      <div class="text-grey-8">
                        {{ service.description }}
                      </div>
                    </div>
                  </div>
                </div>

                <q-btn
                  class="q-mt-md w100 svc-cta"
                  unelevated
                  color="secondary"
                  text-color="white"
                  icon="chat"
                  label="Pedir orçamento no WhatsApp"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="whatsappServicesUrl"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card class="svc-card glass bg-grey-3">
              <q-card-section class="svc-head light">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">
                      Manutenção
                    </div>
                    <div class="text-secondary q-mt-xs">
                      Preventiva e corretiva com diagnóstico rápido.
                    </div>
                  </div>

                  <q-avatar
                    v-if="!isMobile"
                    rounded
                    size="48px"
                    class="svc-icon bg-secondary text-white"
                  >
                    <q-icon name="build_circle" size="24px" />
                  </q-avatar>
                </div>

                <div class="row q-gutter-sm q-mt-md">
                  <q-chip dense color="grey-2" text-color="grey-9" icon="water">
                    Hidráulica
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="speed">
                    Pressão
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="settings">
                    Diagnóstico
                  </q-chip>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pa-md">
                <div class="svc-grid">
                  <div
                    v-for="maintenance in maintenanceList"
                    :key="maintenance.title"
                    class="svc-item reverse"
                  >
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">
                        {{ maintenance.title }}
                      </div>
                      <div class="text-grey-8">
                        {{ maintenance.description }}
                      </div>
                    </div>

                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img :src="maintenance.img" :alt="maintenance.alt" />
                    </q-avatar>
                  </div>
                </div>

                <q-btn
                  class="q-mt-md w100 svc-cta"
                  unelevated
                  color="secondary"
                  text-color="white"
                  icon="support_agent"
                  label="Solicitar assistência técnica"
                  type="a"
                  target="_blank"
                  rel="noopener"
                  :href="whatsappMaintenanceUrl"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- SOBRE / COMO CHEGAR -->
    <div id="como-chegar"></div>

    <section class="about-section bg-secondary">
      <div class="container q-py-xl q-px-md">
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h4 text-primary text-weight-bolder">
              Sobre a loja
            </div>
          </div>

          <div class="row q-gutter-sm items-center q-mt-sm">
            <q-chip outline color="secondary" icon="store">
              Loja física
            </q-chip>
            <q-chip outline color="secondary" icon="support_agent">
              Suporte técnico
            </q-chip>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-7">
            <q-card class="about-card glass bg-primary rounded-borders">
              <q-card-section class="about-head">
                <div class="row items-center no-wrap q-gutter-sm">
                  <q-avatar rounded size="46px" class="bg-secondary text-primary">
                    <q-img :src="logoUrl" alt="Eletro Nogueira" />
                  </q-avatar>

                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">
                      <strong class="text-negative">Quem</strong> somos
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-md bg-grey-2 text-grey-2">
                <div class="about-copy text-dark">
                  Somos uma <strong class="text-secondary">loja física em Valparaíso de Goiás</strong>,
                  em frente à <strong class="text-secondary">BR-040</strong>, próximo da divisa com o DF.
                  <br /><br />
                  Aqui você encontra: <strong class="text-secondary">ferramentas elétricas</strong>,
                  <strong class="text-secondary">hidráulica</strong>,
                  <strong class="text-secondary">automação industrial</strong>,
                  <strong class="text-secondary">materiais elétricos</strong>,
                  <strong class="text-secondary">agropecuária</strong>,
                  <strong class="text-secondary">bombas d’água</strong>,
                  <strong class="text-red">manutenção de equipamentos</strong> e
                  <strong class="text-green">serviços especializados</strong>.
                </div>

                <div class="row q-gutter-sm q-mt-md">
                  <q-chip dense color="grey-2" text-color="grey-9" icon="bolt">
                    Elétrica
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="water">
                    Hidráulica
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="precision_manufacturing">
                    Automação
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="agriculture">
                    Agro
                  </q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="inventory_2">
                    Pronta-entrega
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-5">
            <q-card class="about-card glass bg-primary rounded-borders">
              <q-card-section class="about-head light">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">
                      <strong class="text-negative">⏰ Nossos</strong> horários
                    </div>
                    <div class="text-caption text-secondary q-mt-xs">
                      {{ openNowText }}
                    </div>
                  </div>

                  <q-avatar
                    v-if="!isMobile"
                    rounded
                    size="46px"
                    class="bg-primary text-secondary shadow-2"
                  >
                    <q-icon name="schedule" size="24px" />
                  </q-avatar>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-md bg-grey-2 text-secondary">
                <div class="hours">
                  <div
                    v-for="item in openingHours"
                    :key="item.label"
                    class="hours-row"
                  >
                    <q-icon :name="item.icon" class="text-secondary" />

                    <div class="hours-text">
                      <div class="text-weight-bold">
                        {{ item.label }}
                      </div>
                      <div class="text-grey-8">
                        {{ item.time }}
                      </div>
                    </div>

                    <q-badge :color="item.color" outline>
                      {{ item.status }}
                    </q-badge>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card class="map-card bg-primary q-mt-lg">
          <div class="map-wrap">
            <iframe
              title="Mapa"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="map-iframe w100"
              height="250px"
              src="https://www.google.com/maps?q=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s&output=embed"
            />

            <div class="map-overlay row q-py-md w100 justify-center items-center bg-secondary text-primary">
              <div class="row items-center q-gutter-sm">
                <div class="text-white text-center q-px-xs">
                  <q-icon name="pin_drop" class="q-pb-xs text-primary" />
                  Eletro Nogueira — Av. Marginal, QD, Lote 01 • Esplanada I • Valparaíso de Goiás
                </div>
              </div>

              <q-btn
                dense
                unelevated
                color="primary"
                text-color="secondary"
                icon="directions"
                label="Ver no Maps"
                class="q-mt-md text-bold w100 q-mx-lg"
                type="a"
                target="_blank"
                rel="noopener"
                href="https://maps.app.goo.gl/HmBYXDVNAGxB2iiZA"
              />
            </div>
          </div>
        </q-card>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer bg-primary text-secondary q-pt-lg">
      <div class="container footer-grid q-pt-xl q-pb-md">
        <div>
          <div class="brand">
            <div class="logo">
              <q-img
                class="logo-img"
                :src="logoUrl"
                alt="Eletro Nogueira Logo"
              />
            </div>

            <div class="brand-text text-grey">
              <strong class="text-negative">Eletro</strong><strong class="text-secondary">Nogueira</strong><br />
              <small class="text-black">Em frente à BR-040 • Valparaíso de Goiás</small>
            </div>
          </div>

          <p class="foot-copy text-secondary q-pt-sm">
            Soluções em elétrica, hidráulica, automação e agro.<br />
            Pronta-entrega e suporte técnico.<br /><br />
            CNPJ • <strong>26.931.014/0001-12.</strong>
          </p>
        </div>

        <div class="foot-links">
          <a class="cursor-pointer" @click.prevent="scrollTo('#produtos')">Produtos</a>
          <a class="cursor-pointer" @click.prevent="scrollTo('#como-chegar')">Horários</a>
          <a class="cursor-pointer" @click.prevent="scrollTo('#como-chegar')">Como chegar</a>
        </div>

        <div class="column">
          <q-btn
            unelevated
            color="green-14"
            class="text-shadow shadow-1"
            type="a"
            target="_blank"
            rel="noopener"
            :href="whatsappContactUrl"
            label="Fale Conosco"
            icon-right="mdi-whatsapp"
          />

          <q-btn
            icon-right="phone"
            class="bg-secondary text-white rounded-borders q-mt-sm"
            href="tel:+556136296858"
            label="(61) 3629-6858"
          />
        </div>
      </div>

      <div class="w100 column justify-center items-center text-center">
        <q-btn
          color="secondary"
          type="a"
          target="_blank"
          rel="noopener"
          href="https://www.instagram.com/nogueiravalparaiso/"
          label="@nogueiravalparaiso"
          icon-right="mdi-instagram"
        />
      </div>

      <div class="copy q-mt-md">
        © {{ year }} Eletro Nogueira — 26.931.014/0001-12.
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()

const isMobile = computed(() => $q.screen.lt.md)
const year = new Date().getFullYear()

const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s'
const fallbackProductImage = 'https://cdn-icons-png.flaticon.com/512/971/971904.png'

const tab1 = ref('makita')
const tab2 = ref('nova')
const promoProducts = ref([])

const bannerSlideDesktop = ref(0)
const bannerSlideMobile = ref(0)
const bannerAutoplay = ref(4500)

const promoSlide = ref(0)
const promoAutoplay = ref(3500)

const destaqueSlide = ref(0)
const highlightAutoplay = ref(3500)

const whatsappContactUrl = 'https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.'
const whatsappServicesUrl = 'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os.'
const whatsappMaintenanceUrl = 'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica.'

const bannersDesktop = ref([
  {
    url: '/assets/promo5.png',
    alt: 'Automação Industrial',
    action: { type: 'route', to: '/localizacao' }
  },
  {
    url: '/assets/promo1.png',
    alt: 'Ofertas da Semana',
    action: { type: 'scroll', to: '#produtos' }
  },
  {
    url: '/assets/promo3.png',
    alt: 'Serviços e Manutenção',
    action: { type: 'route', to: '/servicos-manutencao' }
  },
  {
    url: '/assets/promo4.png',
    alt: 'Agro e Irrigação',
    action: { type: 'route', to: '/servicos-manutencao' }
  },
  {
    url: '/assets/promo2.png',
    alt: 'Kärcher',
    action: { type: 'route', to: '/catalogo?q=furadeira&limit=15&page=1&orderBy=updated_desc' }
  },
  {
    url: '/assets/promo6.png',
    alt: 'ia + atendimento 24h',
    action: { type: 'route', to: '/chat' }
  }
])

const bannersMobile = ref([
  {
    url: '/assets/promo5.png',
    alt: 'Mobile 5',
    action: { type: 'route', to: '/localizacao' }
  },
  {
    url: '/assets/promo2.png',
    alt: 'Mobile 2',
    action: { type: 'route', to: '/catalogo?q=furadeira&limit=15&page=1&orderBy=updated_desc' }
  },
  {
    url: '/assets/promo3.png',
    alt: 'Mobile 3',
    action: { type: 'route', to: '/servicos-manutencao' }
  },
  {
    url: '/assets/promo4.png',
    alt: 'Mobile 4',
    action: { type: 'route', to: '/servicos-manutencao' }
  },
  {
    url: '/assets/promo1.png',
    alt: 'Mobile 1',
    action: { type: 'route', to: '/catalogo?limit=15&page=1&orderBy=updated_desc' }
  },
  {
    url: '/assets/promo6.png',
    alt: 'Mobile 6',
    action: { type: 'route', to: '/chat' }
  }
  
])

const brandsRow1 = [
  { name: 'makita', src: '/assets/makita-logo.png' },
  { name: 'BLACK+%26+DECKER', src: '/assets/black-decker-logo.png' },
  { name: 'stanley', src: '/assets/stanley-logo.png' },
  { name: '3m', src: '/assets/3m-logo.png' },
  { name: 'tramontina', src: '/assets/tramontina-logo.jpg' },
  { name: 'bosch', src: '/assets/bosch-logo.png' }
]

const brandsRow2 = [
  { name: 'Karcher', src: '/assets/karcher-logo.png' },
  { name: 'marluvas', src: '/assets/marluvas-logo.png' },
  { name: 'Tigre', src: '/assets/tigre-logo.png' },
  { name: 'lamesa', src: '/assets/lamesa-logo.webp' },
  { name: 'matsuyama', src: '/assets/matsuyama-logo.png' },
  { name: 'nova', src: '/assets/nova-logo.jpg' }
]

const categoryCards = [
  {
    title: 'Furadeiras e Periféricos',
    to: '/catalogo?q=furadeira&limit=15&page=1&orderBy=updated_desc'
  },
  {
    title: 'Motores e Bombas',
    to: '/catalogo?q=motor&limit=15&page=1&orderBy=updated_desc'
  },
  {
    title: 'Cabos e Conexões',
    to: '/catalogo?q=cabo&limit=15&page=1&orderBy=updated_desc'
  },
  {
    title: 'E muito mais!',
    to: '/catalogo?limit=15&page=1&orderBy=updated_desc',
    textClass: 'text-secondary'
  }
]

const destaqueProducts = [
  {
    name: 'FURADEIRA MARTELETE SDS PLUS',
    src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2020880%2013743.jpg',
    price: 1240.0,
    brand: 'MAKITA'
  },
  {
    name: 'ASPIRADOR NT 585 15L 1300W',
    src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2016121%208972.jpg',
    price: 549.0,
    brand: 'KARCHER'
  },
  {
    name: 'LAVADORA ALTA PRESSAO K3.30 MOD',
    src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2016233%209096.jpg',
    price: 1450.9,
    brand: 'KARCHER'
  },
  {
    name: 'FITA VEDA ROSCA',
    src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%206761%203873.jpg',
    price: 25.9,
    brand: 'TIGRE'
  },
  {
    name: 'DISCO SERRA 7 1/4"',
    src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2020812%2013678.jpg',
    price: 70.0,
    brand: 'STANLEY'
  },
  {
    name: 'FURADEIRA DE IMPACTO 1/2" 13MM',
    src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2014907%207297.jpg',
    price: 320.0,
    brand: 'WESCO'
  }
]

const servicesList = [
  {
    title: 'Munck',
    description: 'Içamento e movimentação com segurança e agilidade.',
    img: '/assets/munck.webp',
    alt: 'Munck (Guindaste articulado)'
  },
  {
    title: 'Torno',
    description: 'Usinagem precisa para peças sob medida e recuperação.',
    img: '/assets/torno.jpg',
    alt: 'Torno mecânico'
  },
  {
    title: 'Solda',
    description: 'Processos TIG/MIG para reparos e fabricação.',
    img: '/assets/solda.jpg',
    alt: 'Solda TIG/MIG'
  },
  {
    title: 'Rebobinagem',
    description: 'Teste e garantia de desempenho em motores.',
    img: '/assets/rebobinagem.jpg',
    alt: 'Rebobinagem de motores elétricos'
  }
]

const maintenanceList = [
  {
    title: 'Bombas d’água',
    description: 'Selo/rolamentos, limpeza de rotor e alinhamento.',
    img: '/assets/bomba.webp',
    alt: 'Manutenção de bombas d’água'
  },
  {
    title: 'Mangueiras & Lavadoras',
    description: 'Crimpagem, troca de conexões e testes.',
    img: '/assets/mangueira.webp',
    alt: 'Mangueiras hidráulicas e lavadoras'
  },
  {
    title: 'Compressores',
    description: 'Óleo/filtros, revisão de válvulas e correias.',
    img: '/assets/compressor.jpg',
    alt: 'Manutenção de compressores'
  },
  {
    title: 'Automação industrial',
    description: 'CLP/inversores, sensores e painéis.',
    img: '/assets/automacao.png',
    alt: 'Automação industrial'
  }
]

const openingHours = [
  {
    label: 'Segunda a Sexta',
    time: '08:00 às 18:00',
    status: 'Aberto',
    color: 'green-14',
    icon: 'calendar_month'
  },
  {
    label: 'Sábado',
    time: '08:00 às 12:00',
    status: 'Meio período',
    color: 'orange-14',
    icon: 'event'
  },
  {
    label: 'Domingo',
    time: 'Fechado',
    status: 'Fechado',
    color: 'negative',
    icon: 'do_not_disturb'
  }
]

const schedule = {
  0: null,
  1: ['08:00', '18:00'],
  2: ['08:00', '18:00'],
  3: ['08:00', '18:00'],
  4: ['08:00', '18:00'],
  5: ['08:00', '18:00'],
  6: ['08:00', '12:00']
}

const bannerDesktopGroups = computed(() => chunkArray(bannersDesktop.value, 2))
const destaqueChunks = computed(() => chunkArray(destaqueProducts, 2))

const promoProductChunks = computed(() => {
  const chunkSize = isMobile.value ? 1 : 4
  return chunkArray(promoProducts.value, chunkSize)
})

const openNowText = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const range = schedule[day]

  if (!range) return '🔴 Fechado hoje • Domingo'

  const currentTime = `${padTime(now.getHours())}:${padTime(now.getMinutes())}`
  const [start, end] = range

  return currentTime >= start && currentTime <= end
    ? `🟢 Aberto agora • ${start} - ${end}`
    : `🔴 Fechado no momento • ${start} - ${end}`
})

function chunkArray(items, size) {
  const chunks = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function padTime(value) {
  return String(value).padStart(2, '0')
}

function pauseBannerAutoplay() {
  bannerAutoplay.value = false
}

function resumeBannerAutoplay() {
  setTimeout(() => {
    bannerAutoplay.value = 4500
  }, 1200)
}

function pausePromoAutoplay() {
  promoAutoplay.value = false
}

function resumePromoAutoplay() {
  setTimeout(() => {
    promoAutoplay.value = 3500
  }, 1200)
}

function pauseHighlightAutoplay() {
  highlightAutoplay.value = false
}

function resumeHighlightAutoplay() {
  setTimeout(() => {
    highlightAutoplay.value = 3500
  }, 1200)
}

function onBannerClick(banner) {
  const action = banner?.action
  if (!action) return

  if (action.type === 'route' && action.to) {
    goTo(action.to)
    return
  }

  if (action.type === 'scroll' && action.to) {
    scrollTo(action.to)
    return
  }

  if (action.type === 'link' && action.href) {
    window.open(action.href, '_blank', 'noopener,noreferrer')
  }
}

function goTo(path) {
  if (!path) return
  router.push(path)
}

function scrollTo(selector) {
  const element = document.querySelector(selector)
  if (!element) return

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

function brandCatalogUrl(brandName) {
  return `/catalogo?marca=${brandName.toUpperCase()}&limit=15&page=1&orderBy=updated_desc`
}

function catalogSearchUrl(term) {
  return `/catalogo?q=${encodeURIComponent(term)}&limit=15&page=1&orderBy=updated_desc`
}

function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function truncate(text, maxLength = 50, sliceLength = 37) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, sliceLength)}...` : text
}

async function fetchPromoProducts() {
  try {
    const response = await api.get('/produtos/', {
      params: {
        limit: 8,
        offset: 0,
        orderBy: 'updated_desc',
        isPromotion: true
      }
    })

    promoProducts.value = Array.isArray(response.data?.data)
      ? response.data.data.map(normalizePromoProduct)
      : []
  } catch (error) {
    console.error('Erro ao buscar produtos em promoção:', error)
    promoProducts.value = []
  }
}

function normalizePromoProduct(product) {
  return {
    id: product.CODPRODUTO,
    codigo: product.CODPRODUTO,
    descricao: product.DESCRICAO,
    marca: product.MARCA,
    preco: product.PRECO,
    precoPromocao: product.PRECOPROMOCAO,
    isPromotion: product.ISPROMOTION === 1 || product.ISPROMOTION === true,
    hasImage: product.HAS_IMAGE === 1,
    imagens: product.IMGS_PATH || [],
    imagemPrincipal: product.IMGS_PATH?.[0],
    dataAtualizacao: product.DATAATUALIZACAO,
    dataCadastro: product.DATACADASTRO,
    obs: product.OBS
  }
}

onMounted(() => {
  fetchPromoProducts()
})
</script>

<style scoped>
.index-page {
  padding-top: 85px;
  position: relative;
  overflow-x: hidden;
}

.img-parallax {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #f7d102;
}

.section {
  position: relative;
  z-index: 2;
}

.w100 {
  width: 100%;
}

.container {
  width: min(1180px, calc(100% - 24px));
  margin-right: auto;
  margin-left: auto;
}

.bg-grad-secondary {
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.35), transparent 32%),
    linear-gradient(180deg, rgba(247, 209, 2, 0.92), rgba(247, 209, 2, 0.78));
}

.glass {
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.bg-blur {
  background: rgba(255, 255, 255, 0.72);
}

/* BANNERS */
.banner-section {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin-right: auto;
  margin-left: auto;
}

.banner-carousel {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
}

.desktop-banner-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  height: 100%;
}

.banner-card {
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.16);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.banner-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.18);
}

.banner-img {
  width: 100%;
  height: 100%;
}

/* MARCAS */
.brand-tabs {
  position: relative;
  z-index: 2;
}

.brand-badge {
  min-height: 46px;
  padding: 0 10px;
  margin: 4px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}

.brand-tabs :deep(.q-tab__content) {
  padding: 0;
}

.brand-badge :deep(.q-icon) {
  width: 78px;
  height: 28px;
}

.brand-badge :deep(.q-icon img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* CARDS DE CATEGORIA */
.cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.product {
  min-height: 130px;
  padding: 18px;
  border-radius: 18px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.product:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.16);
}

.product h4 {
  margin: 0;
  line-height: 1.15;
}

/* PRODUTOS */
.product-card {
  width: 220px;
  overflow: hidden;
  border-radius: 18px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.14);
}

.product-img {
  height: 250px;
}

.highlight-img {
  height: 220px;
}

.mobile-highlight-card {
  width: 55vw;
}

/* SERVIÇOS */
.svc-card {
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.svc-head {
  padding: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
}

.svc-head.light {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.01));
}

.svc-icon {
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.18);
}

.svc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.svc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 14px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.svc-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.svc-thumb {
  flex: 0 0 auto;
  border: 2px solid rgba(0, 0, 0, 0.06);
}

.svc-text {
  min-width: 0;
  flex: 1;
}

.svc-text > div:last-child {
  font-size: 0.92rem;
  line-height: 1.2rem;
}

.svc-cta {
  border-radius: 14px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

/* SOBRE */
.about-section {
  position: relative;
  z-index: 2;
}

.about-card {
  overflow: hidden;
  border-radius: 18px;
}

.about-head {
  padding: 18px;
}

.about-copy {
  font-size: 1rem;
  line-height: 1.55;
}

.hours {
  display: grid;
  gap: 12px;
}

.hours-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 14px;
}

.hours-text {
  flex: 1;
  min-width: 0;
}

.map-card {
  overflow: hidden;
  border-radius: 18px;
}

.map-wrap {
  position: relative;
  overflow: hidden;
}

.map-iframe {
  display: block;
  border: 0;
}

.map-overlay {
  position: relative;
}

/* FOOTER */
.footer {
  position: relative;
  z-index: 2;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.7fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 58px;
  height: 58px;
  overflow: hidden;
  border-radius: 20%;
}

.logo-img {
  width: 100%;
  height: 100%;
  border-radius: 20%;
}

.foot-copy {
  line-height: 1.5;
}

.foot-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.foot-links a {
  color: inherit;
  text-decoration: none;
  font-weight: 700;
}

.copy {
  padding: 14px;
  text-align: center;
  font-size: 0.88rem;
  opacity: 0.85;
}

/* RESPONSIVO */
@media (max-width: 1023px) {
  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .banner-section {
    max-width: 100%;
  }

  .brand-badge :deep(.q-icon) {
    width: 64px;
    height: 24px;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .product {
    min-height: 104px;
  }

  .product-card {
    width: 220px;
  }

  .hours-row {
    align-items: flex-start;
  }
}
</style>