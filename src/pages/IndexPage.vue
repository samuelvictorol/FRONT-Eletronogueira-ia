<template>
  <q-page class="text-black" style="position: relative;">
    <!-- HERO -->
    <div class="img-parallax"></div>
    <section class="hero bg-blur animate__animated animate__fadeIn animate__delay-4s animate__slower ">
      <div class="hero-overlay"></div>

      <div
        class="hero-content glass rounded-borders bg-primary animate__animated animate__zoomIn animate__delay-3s q-mx-sm q-mb-md q-mt-md">
        <!-- <p class="text-bold text-primary q-mt-sm">Ferramentas & Soluções</p>  -->
        <div v-if="!isMobile" class="w100 row justify-center text-center bg-primary">
          <div
            class="text-h5 text-secondary text-bold animate__animated animate__zoomIn animate__delay-43s animate__slower">
            <q-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
              alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
              class="text-negative">ELETRO</strong>NOGUEIRA<br>
          </div>
        </div>
        <div
          class="w100 row justify-center no-wrap items-center text-center bg-primary  animate__animated animate__zoomIn animate__delay-5s animate__slower ">
          <q-input outlined color="secondary" v-model.trim="inputBuscar" class=" w100 rounded-borders bg-grey-2"
            @keyup.enter="buscarCatalogo()" label="O que você precisa?"></q-input>
          <q-btn color="secondary" unelevated class="btn q-ml-sm text-shadow" icon="search"
            @click="buscarCatalogo()"></q-btn>
        </div>
        <div class="cta-row">
          <q-btn color="secondary" unelevated class="btn  text-shadow" @click="scrollTo('#produtos')"
            label="produtos" />
          <q-btn color="secondary" unelevated class="btn text-shadow" @click="scrollTo('#servicos')"
            label="Serviços e Manutenção" />
          <q-btn class="btn text-shadow" color="secondary" @click="scrollTo('#como-chegar')" label="Como chegar" />
        </div>
        <div class="hero-badges flex flex-center">
          <div class="badge bg-grey-2 text-dark">Elétrica</div>
          <div class="badge bg-grey-2 text-dark">Hidráulica</div>
          <div class="badge bg-grey-2 text-dark">Automação</div>
          <div class="badge bg-grey-2 text-dark">Agro</div>
          <div class="badge bg-grey-2 text-dark">Industrial</div>
          <div class="badge bg-grey-2 text-dark">Manutenção</div>
        </div>
        <div
          class="open-now text-secondary q-pt-md text-center animate__animated animate__fadeInDown animate__delay-3s animate__slower">
          {{ openNowText }}</div>
      </div>
    </section>
    <section id="produtos" class="animate__animated animate__fadeInUp animate__delay-5s animate__slower">
      <!-- <div class="bg-grey-3 text-white q-pt-xl">
        <div class="text-h2 center text-secondary q-py-md">Produtos e Marcas</div>
      </div> -->
    </section>
    <!-- PRODUTOS -->
    <section class="section bg-secondary q-pt-lg animate__animated animate__fadeInUp animate__delay-3s animate__slower">
      <div class=" text-secondary">
        <div class="brand-tabs">
          <div class="container rounded-borders q-pa-sm">
            <div class="cards text-secondary">
              <article class=" bg-primary product glass"
                @click="goTo('/catalogo?q=furadeira&limit=15&page=1&orderBy=updated_desc')">
                <h4 class="text-bold">Furadeiras e Periféricos</h4>
              </article>
              <article class=" bg-primary product glass"
                @click="goTo('/catalogo?q=motor&limit=15&page=1&orderBy=updated_desc')">
                <h4 class="text-bold">Motores e Bombas</h4>
              </article>
              <article class=" bg-primary product glass"
                @click="goTo('/catalogo?q=cabo&limit=15&page=1&orderBy=updated_desc')">
                <h4 class="text-bold">Cabos e Conexões</h4>
              </article>
              <article class=" bg-primary  product glass"
                @click="goTo('/catalogo?min=599.9&max=1299.9&limit=15&page=1&orderBy=updated_desc')">
                <h4 class="text-secondary  text-bold">E muito mais!</h4>
              </article>
            </div>
          </div>
          <q-tabs v-model="tab1" dense no-caps align="center" outside-arrows mobile-arrows indicator-color="transparent"
            class=" rounded-borders q-pa-xs q-pt-lg">
            <q-route-tab v-for="b in brandsRow1" :key="b.name" :name="b.name" :icon="`img:${b.src}`" class="brand-badge"
              :to="`/catalogo?marca=${b.name.toUpperCase()}&limit=15&page=1&orderBy=updated_desc`" exact />
          </q-tabs>
          <div class="w100 row justify-center no-wrap">
            <q-btn class="bg-primary text-secondary  text-bold q-pa-md q-my-md"
              to="/catalogo?min=199.9&max=599.9&limit=15&page=1&orderBy=updated_desc" label="Ver Catálogo Completo"
              icon-right="search" />
          </div>
          <!-- DESTAQUES -->
          <div class="q-mt-md">
            <!--  MOBILE: carrossel swipe -->
            <q-carousel v-if="isMobile" v-model="destaqueSlide" swipeable animated arrows control-color="primary"
              padding height="100%" class="rounded-borders bg-transparent" :autoplay="autoPlay" infinite
              @mousedown="autoPlay = false" @touchstart="autoPlay = false" @mouseup="resumeAutoplay"
              @touchend="resumeAutoplay" @mouseleave="resumeAutoplay">
              <q-carousel-slide v-for="(group, index) in destaqueChunks" :key="index" :name="index"
                class="row justify-center q-gutter-sm items-start">
                <q-card v-for="(p, i) in group" :key="p.name + i" class="product-card bg-blur glass cursor-pointer"
                  style="width: 55vw"
                  @click="goTo(`/catalogo?q=${encodeURIComponent(p.name)}&limit=15&page=1&orderBy=updated_desc`)">
                  <q-img :src="p.src" :alt="p.name" style="height: 200px" fit="fill" />
                  <q-card-section class="q-pa-sm text-secondary">
                    <q-badge color="bg-primary text-secondary text-bold" class="q-mb-sm">
                      {{ p.brand }}
                    </q-badge>
                    <div class="text-weight-bold text-primary ellipsis-2 text-caption">
                      {{ p.name }}
                    </div>
                    <div class="text-weight-bold text-green-14 text-subtitle2">
                      R$ {{ Number(p.price).toFixed(2) }}
                    </div>
                  </q-card-section>
                </q-card>
              </q-carousel-slide>
            </q-carousel>

            <!-- DESKTOP: grid normal -->
            <div v-else class="row justify-center q-gutter-sm">
              <q-card v-for="(p, i) in destaqueProducts" :key="p.name + i"
                class="product-card bg-blur glass q-mb-md cursor-pointer" style="width: 220px"
                @click="goTo(`/catalogo?q=${encodeURIComponent(p.name)}&limit=15&page=1&orderBy=updated_desc`)">
                <q-img :src="p.src" :alt="p.name" style="height: 220px" fit="fill" />
                <q-card-section class="q-pa-sm text-secondary">
                  <q-badge color="bg-primary text-secondary text-bold" class="q-mb-sm">
                    {{ p.brand }}
                  </q-badge>
                  <div class="text-weight-bold text-primary ellipsis-2">{{ p.name }}</div>
                  <div class="text-weight-bold text-green">
                    R$ {{ Number(p.price).toFixed(2) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <q-tabs v-model="tab2" dense no-caps align="center" outside-arrows mobile-arrows indicator-color="transparent"
            class="rounded-borders q-pa-xs q-mt-sm q-pb-xl">
            <q-route-tab v-for="b in brandsRow2" :key="b.name" :name="b.name"
              :icon="b.src ? `img:${b.src}` : 'local_offer'"
              :to="`/catalogo?marca=${b.name.toUpperCase()}&limit=15&page=1&orderBy=updated_desc`" exact
              class="brand-badge" />
          </q-tabs>
        </div>
      </div>
    </section>
    <section id="servicos" class="section bg-grey-4">
      <div class="container q-py-xl">
        <!-- Header -->
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h4 text-secondary text-weight-bolder">Serviços & Manutenção</div>
          </div>

          <q-chip outline color="secondary" class="q-mt-sm">
            <q-icon name="verified" class="q-mr-xs" />
            Pronta-entrega + suporte técnico
          </q-chip>
        </div>

        <div class="row q-col-gutter-md">
          <!-- CARD: SERVIÇOS -->
          <div class="col-12 col-md-6">
            <q-card class="svc-card glass bg-grey-3">
              <q-card-section class="svc-head">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">Serviços</div>
                    <div class="text-secondary q-mt-xs">
                      Projetos, emergências e soluções sob medida.
                    </div>
                  </div>

                  <q-avatar v-if="!isMobile" rounded size="48px" class="svc-icon bg-secondary text-white">
                    <q-icon name="handyman" size="24px" />
                  </q-avatar>
                </div>

                <div class="row q-gutter-sm q-mt-md">
                  <q-chip dense color="grey-2" text-color="grey-9" icon="bolt">Industrial</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="precision_manufacturing">Usinagem</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="engineering">Equipe técnica</q-chip>
                </div>
              </q-card-section>

              <q-separator color="rgba(255,255,255,.12)" />

              <q-card-section class="q-pa-md">
                <div class="svc-grid">
                  <!-- Munck -->
                  <div class="svc-item">
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img
                        src="https://armac.com.br/wordpress/wp-content/uploads/2023/01/armac-guindaste-e-munck-blog.jpg"
                        alt="Munck (Guindaste articulado)" />
                    </q-avatar>
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Munck</div>
                      <div class="text-grey-8">Içamento e movimentação com segurança e agilidade.</div>
                    </div>
                  </div>

                  <!-- Torno -->
                  <div class="svc-item">
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img
                        src="https://blog.ferramentaskennedy.com.br/wp-content/uploads/2024/05/o-que-um-torno-mecnico8695f1a75961409e918edbcd14fc128b.jpg"
                        alt="Torno mecânico" />
                    </q-avatar>
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Torno</div>
                      <div class="text-grey-8">Usinagem precisa para peças sob medida e recuperação.</div>
                    </div>
                  </div>

                  <!-- Solda -->
                  <div class="svc-item">
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img
                        src="https://www.g20brasil.com.br/wp-content/uploads/2016/08/ferro-de-solda-dicas-cuidados.jpg"
                        alt="Solda TIG/MIG" />
                    </q-avatar>
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Solda</div>
                      <div class="text-grey-8">Processos TIG/MIG para reparos e fabricação.</div>
                    </div>
                  </div>

                  <!-- Rebobinagem -->
                  <div class="svc-item">
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img src="https://www.agbrasil360.com.br/agreletrotecnica/imgs_eventos/53ec6-rebobinamento-6.jpg"
                        alt="Rebobinagem de motores elétricos" />
                    </q-avatar>
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Rebobinagem</div>
                      <div class="text-grey-8">Teste e garantia de desempenho em motores.</div>
                    </div>
                  </div>
                </div>

                <q-btn class="q-mt-md w100 svc-cta" unelevated color="secondary" text-color="white" icon="chat"
                  label="Pedir orçamento no WhatsApp" type="a" target="_blank" rel="noopener"
                  href="https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os." />
              </q-card-section>
            </q-card>
          </div>

          <!-- CARD: MANUTENÇÃO -->
          <div class="col-12 col-md-6">
            <q-card class="svc-card glass bg-grey-3">
              <q-card-section class="svc-head light">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">Manutenção</div>
                    <div class="text-secondary q-mt-xs">
                      Preventiva e corretiva com diagnóstico rápido.
                    </div>
                  </div>

                  <q-avatar v-if="!isMobile" rounded size="48px" class="svc-icon bg-secondary text-white">
                    <q-icon name="build_circle" size="24px" />
                  </q-avatar>
                </div>

                <div class="row q-gutter-sm q-mt-md">
                  <q-chip dense color="grey-2" text-color="grey-9" icon="water">Hidráulica</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="speed">Pressão</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="settings">Diagnóstico</q-chip>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pa-md">
                <div class="svc-grid">
                  <!-- Bombas -->
                  <div class="svc-item">
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Bombas d’água</div>
                      <div class="text-grey-8">Selo/rolamentos, limpeza de rotor e alinhamento.</div>
                    </div>
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img
                        src="https://blog.meritocomercial.com.br/wp-content/uploads/2023/11/manutencao-preventiva-bomba-de-agua-1024x683.jpg.webp"
                        alt="Manutenção de bombas d'água" />
                    </q-avatar>
                  </div>

                  <!-- Mangueiras -->
                  <div class="svc-item">
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Mangueiras & Lavadoras</div>
                      <div class="text-grey-8">Crimpagem, troca de conexões e testes.</div>
                    </div>
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img
                        src="https://s1.kaercher-media.com/media/image/file/9734/d3/assistencia-tecnica-kaercher.webp"
                        alt="Mangueiras hidráulicas e lavadoras" />
                    </q-avatar>
                  </div>

                  <!-- Compressores -->
                  <div class="svc-item">
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Compressores</div>
                      <div class="text-grey-8">Óleo/filtros, revisão de válvulas e correias.</div>
                    </div>
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img
                        src="https://locadoraequiloc.com.br/wp-content/uploads/2022/07/manutencao-de-compressores-servico.jpg"
                        alt="Manutenção de compressores" />
                    </q-avatar>
                  </div>

                  <!-- Automação -->
                  <div class="svc-item">
                    <div class="svc-text">
                      <div class="text-secondary text-weight-bold">Automação industrial</div>
                      <div class="text-grey-8">CLP/inversores, sensores e painéis.</div>
                    </div>
                    <q-avatar size="58px" rounded class="svc-thumb">
                      <img src="https://blog.safetycontrol.ind.br/wp-content/uploads/2023/05/Manutencao-001.png"
                        alt="Automação industrial" />
                    </q-avatar>
                  </div>
                </div>

                <q-btn class="q-mt-md w100 svc-cta" unelevated color="secondary" text-color="white" icon="support_agent"
                  label="Solicitar assistência técnica" type="a" target="_blank" rel="noopener"
                  href="https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica." />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>
    <!-- SOBRE / COMO CHEGAR -->
    <div id="como-chegar"></div>

    <section class="about-section bg-primary">
      <div class="container q-py-xl q-px-md">
        <!-- Header -->
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h4 text-secondary text-weight-bolder">Sobre a loja</div>
          </div>

          <div class="row q-gutter-sm items-center q-mt-sm">
            <q-chip outline color="secondary" icon="store">Loja física</q-chip>
            <q-chip outline color="secondary" icon="support_agent">Suporte técnico</q-chip>
          </div>
        </div>

        <!-- Cards -->
        <div class="row q-col-gutter-md">
          <!-- Quem somos -->
          <div class="col-12 col-md-7">
            <q-card class="about-card glass bg-primary rounded-borders">
              <q-card-section class="about-head">
                <div class="row items-center no-wrap q-gutter-sm">
                  <q-avatar rounded size="46px" class="bg-secondary text-primary">
                    <q-img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                      alt="Eletro Nogueira" />
                  </q-avatar>

                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">
                      <strong class="text-negative">Quem</strong> somos
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-md bg-grey-2 text-grey-2">
                <div class="about-copy text-dark ">
                  Somos uma <strong class="text-secondary">loja física em Valparaíso de Goiás</strong>, em frente à
                  <strong class="text-secondary">BR-040</strong>, próximo da divisa com o DF.
                  <br /><br />
                  Aqui você encontra: <strong class="text-secondary">ferramentas elétricas</strong>,
                  <strong class="text-secondary">hidráulica</strong>, <strong class="text-secondary">automação
                    industrial</strong>,
                  <strong class="text-secondary">materiais elétricos</strong>, <strong
                    class="text-secondary">agropecuária</strong>,
                  <strong class="text-secondary">bombas d’água</strong>,
                  <strong class="text-red">manutenção de equipamentos</strong> e
                  <strong class="text-green">serviços especializados</strong>.
                </div>

                <div class="row q-gutter-sm q-mt-md">
                  <q-chip dense color="grey-2" text-color="grey-9" icon="bolt">Elétrica</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="water">Hidráulica</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="precision_manufacturing">Automação</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="agriculture">Agro</q-chip>
                  <q-chip dense color="grey-2" text-color="grey-9" icon="inventory_2">Pronta-entrega</q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Horários + CTA -->
          <div class="col-12 col-md-5">
            <q-card class="about-card glass bg-primary rounded-borders">
              <q-card-section class="about-head light">
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-h5 text-secondary text-weight-bolder">
                      <strong class="text-negative">⏰ Nossos</strong> horários
                    </div>
                  </div>

                  <q-avatar v-if="!isMobile" rounded size="46px" class="bg-primary text-secondary shadow-2">
                    <q-icon name="schedule" size="24px" />
                  </q-avatar>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-md bg-grey-2 text-secondary">
                <div class="hours">
                  <div class="hours-row">
                    <q-icon name="calendar_month" class="text-secondary" />
                    <div class="hours-text">
                      <div class="text-weight-bold">Segunda a Sexta</div>
                      <div class="text-grey-8">08:00 às 18:00</div>
                    </div>
                    <q-badge color="green-14" outline>Aberto</q-badge>
                  </div>

                  <div class="hours-row">
                    <q-icon name="event" class="text-secondary" />
                    <div class="hours-text">
                      <div class="text-weight-bold">Sábado</div>
                      <div class="text-grey-8">08:00 às 12:00</div>
                    </div>
                    <q-badge color="orange-14" outline>Meio período</q-badge>
                  </div>

                  <div class="hours-row">
                    <q-icon name="do_not_disturb" class="text-secondary" />
                    <div class="hours-text">
                      <div class="text-weight-bold">Domingo</div>
                      <div class="text-grey-8">Fechado</div>
                    </div>
                    <q-badge color="negative" outline>Fechado</q-badge>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Mapa -->
        <q-card class="map-card bg-primary q-mt-lg">
          <div class="map-wrap">
            <iframe title="Mapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="map-iframe w100"
              height="250px"
              src="https://www.google.com/maps?q=Eletro%20Nogueira%20Valpara%C3%ADso%20de%20Goi%C3%A1s&output=embed" />
            <div class="map-overlay row q-py-md w100 justify-center items-center bg-secondary text-primary">
              <div class="row items-center q-gutter-sm">
                <div class="text-primary text-center q-px-xs">
                  <q-icon name="pin_drop" class="q-pb-xs text-primary" />
                  Eletro Nogueira — Av. Marginal, QD, Lote 01 • Esplanada I • Valparaíso de Goiás
                </div>
              </div>
              <q-btn dense unelevated color="primary" text-color="secondary" icon="directions" label="Ver no Maps"
                class="q-mt-md text-bold w100 q-mx-lg" type="a" target="_blank" rel="noopener"
                href="https://maps.app.goo.gl/HmBYXDVNAGxB2iiZA" />
            </div>
          </div>
        </q-card>
      </div>
    </section>
    <div class="w100" style="height: 90vh;"></div>
    <footer class="footer bg-secondary text-grey-3">
      <div class="container footer-grid q-pt-xl q-pb-md">
        <div>
          <div class="brand">
            <div class="logo"><q-img style="border-radius: 20%;"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                alt="Eletro Nogueira Logo" /></div>
            <div class="brand-text text-grey">
              <strong class="text-primary">EletroNogueira</strong>
              <small>Em frente à BR-040 • Valparaíso de Goiás</small>
            </div>
          </div>
          <p class="foot-copy q-pt-sm">Soluções em elétrica, hidráulica, automação e agro.<br>Pronta-entrega e
            suporte técnico.<br><br>CNPJ • <strong>26.931.014/0001-12.</strong>
          </p>
        </div>
        <div class="foot-links">
          <a class="cursor-pointer" @click.prevent="scrollTo('#sobre')">Sobre</a>
          <a class="cursor-pointer" @click.prevent="scrollTo('#produtos')">Produtos</a>
          <a class="cursor-pointer" @click.prevent="scrollTo('#horarios')">Horários</a>
          <a class="cursor-pointer" @click.prevent="scrollTo('#como-chegar')">Como chegar</a>
        </div>
        <div class="column">
          <q-btn unelevated color="positive" class="text-shadow btn whats q-ml-xs shadow-1" glossy type="a"
            target="_blank" rel="noopener"
            href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
            WhatsApp
            <q-img
              src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
              alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
          <q-btn icon-right="phone" color="primary" outline class=" btn q-mt-sm" href="tel:+556136296858"
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
const isMobile = useQuasar().screen.lt.md
const $q = useQuasar()
const leftDrawerOpen = ref(false)
const year = new Date().getFullYear()
const destaqueSlide = ref(0)
const autoPlay = ref(3500)

function resumeAutoplay () {
  setTimeout(() => (autoPlay.value = 3500), 1200)
}
const destaqueChunks = computed(() => {
  const chunkSize = 2
  const arr = []
  for (let i = 0; i < destaqueProducts.length; i += chunkSize) {
    arr.push(destaqueProducts.slice(i, i + chunkSize))
  }
  return arr
})
const slide = ref(1)
const fs = ref(false)
const router = useRouter()
const inputBuscar = ref('')

const tab1 = ref('makita')
const tab2 = ref('nova_motores')

const brandsRow1 = [
  { name: 'makita', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Makita_Logo.svg/1280px-Makita_Logo.svg.png' },
  { name: 'BLACK+%26+DECKER', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Black%2BDecker_Logo.svg/1200px-Black%2BDecker_Logo.svg.png' },
  { name: '3m', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/3M_wordmark.svg/2560px-3M_wordmark.svg.png' },
  { name: 'bosch', src: 'https://logodownload.org/wp-content/uploads/2014/12/bosch-logo-0.png' },
  { name: 'tramontina', src: 'https://grandesnomesdapropaganda.com.br/wp-content/uploads/2020/01/Tramontina.jpg' },
  { name: 'stanley', src: 'https://logodownload.org/wp-content/uploads/2021/03/stanley-logo-1.png' }
]

const brandsRow2 = [
  { name: 'Karcher', src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Kaercher_Logo_2015.png' },
  { name: 'marluvas', src: 'https://images.seeklogo.com/logo-png/40/1/marluvas-logo-png_seeklogo-404913.png' },
  { name: 'Tigre', src: 'https://logodownload.org/wp-content/uploads/2016/09/tigre-logo-1-1.png' },
  { name: 'lamesa', src: 'https://http2.mlstatic.com/D_NQ_NP_896259-MLB77676344918_072024-O-cabo-fio-flexivel-cobre-15mm-100m-lamesa-450750v.webp' },
  { name: 'nova', src: 'https://media.licdn.com/dms/image/v2/D563DAQFP8xwCqR0SpA/image-scale_191_1128/image-scale_191_1128/0/1721411832041/nova_motores_cover?e=2147483647&v=beta&t=NGpPzhgj6s10Y8SsfDc4CDaGt948DoRUxqqRC0R_QmI' },
  { name: 'matsuyama', src: 'https://www.matsuyama.ind.br/imagens/logo/logo-matsuyama-top.png' }
]

const destaqueProducts = [
  { name: 'FURADEIRA MARTELETE SDS PLUS', src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2020880%2013743.jpg', price: 1240.00, brand: 'MAKITA' },
  { name: 'ASPIRADOR NT 585 15L 1300W', src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2016121%208972.jpg', price: 549.00, brand: 'KARCHER' },
  { name: 'LAVADORA ALTA PRESSAO K3.30 MOD', src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2016233%209096.jpg', price: 1450.9, brand: 'KARCHER' },
  { name: 'FITA VEDA ROSCA', src: '	https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%206761%203873.jpg', price: 25.9, brand: 'TIGRE' },
  { name: 'DISCO SERRA 7 1/4"', src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2020812%2013678.jpg', price: 70.00, brand: 'STANLEY' },
  { name: 'FURADEIRA DE IMPACTO 1/2" 13MM', src: 'https://eletronogueira-produtos.s3.us-east-2.amazonaws.com/Produto%2014907%207297.jpg', price: 320.00, brand: 'WESCO' },
]

const schedule = {
  1: ['08:00', '18:00'],
  2: ['08:00', '18:00'],
  3: ['08:00', '18:00'],
  4: ['08:00', '18:00'],
  5: ['08:00', '18:00'],
  6: ['08:00', '12:00'],
  0: null
}
const openNowText = computed(() => {
  const now = new Date()
  const day = now.getDay()
  const pad = n => String(n).padStart(2, '0')
  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  const range = schedule[day]
  if (!range) return '🔴 Fechado hoje • Domingo'
  const [start, end] = range
  return (hhmm >= start && hhmm <= end)
    ? `🟢 Aberto agora • ${start} - ${end}`
    : `🔴 Fechado no momento • ${start} – ${end}`
})

function goTo(path) {
  router.push(path)
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')                     // separa acentos
    .replace(/[\u0300-\u036f]/g, '')      // remove acentos
    .replace(/ç/g, 'c')                   // garante ç -> c
    .trim()
}

function corrigirErrosComuns(text) {
  return text
    .replace(/\bconcerto\b/g, 'conserto')
    .replace(/\bmanutencao\b/g, 'manutencao')
    .replace(/\bassitencia\b/g, 'assistencia')
    .replace(/\btecnica\b/g, 'tecnica')
}

function buscarCatalogo() {
  if (!inputBuscar.value?.trim()) return

  let termoOriginal = inputBuscar.value.trim()
  let termo = normalizeText(termoOriginal)
  termo = corrigirErrosComuns(termo)

  // Palavras relacionadas a serviços/manutenção
  const termosServico = [
    'manutencao',
    'conserto',
    'assistencia',
    'tecnica',
    'lavadora',
    'bomba',
    'compressores',
    'mangueira',
    'crimpagem',
    'munck',
    'torno',
    'solda',
    'rebobinagem',
    'automacao'
  ]

  // Palavras relacionadas a localização
  const termosLocalizacao = [
    'horario',
    'horarios',
    'funcionamento',
    'abertura',
    'localizacao',
    'como chegar',
    'endereco',
    'telefone'
  ]

  // Se encontrar qualquer termo de serviço
  if (termosServico.some(t => termo.includes(t))) {
    router.push('/servicos-manutencao')
    return
  }

  // Se encontrar qualquer termo de localização
  if (termosLocalizacao.some(t => termo.includes(t))) {
    router.push('/localizacao')
    return
  }

  // Caso contrário, vai para catálogo
  router.push(`/catalogo?q=${encodeURIComponent(termoOriginal)}&limit=15&page=1&orderBy=updated_desc`)
}

function scrollTo(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function goAndClose(selector) {
  scrollTo(selector)
  leftDrawerOpen.value = false
}

onMounted(() => {
  // fecha drawer ao virar desktop
  $q.screen.gt.md && (leftDrawerOpen.value = false)
})
</script>


<style scoped>
* {
  z-index: 2;
}

.img-parallax {
  position: fixed;
  z-index: -999 !important;
  width: 100%;
  height: 100%;
  top: 0;
  background: #F7D102;
  background-image: url('/assets/loja.webp');
  left: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.brand-badge {
  background: #fff;
  border-radius: 14px;
  margin: 4px;
  min-height: 46px;
  padding: 0 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .08);
}

/* Controla o "tamanho do badge" e da imagem */
.brand-tabs :deep(.q-tab__content) {
  padding: 0;
}

/* QIcon quando usa icon="img:..." */
.brand-badge :deep(.q-icon) {
  width: 78px;
  height: 28px;
}

/* img dentro do q-icon */
.brand-badge :deep(.q-icon img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.svc-card {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, .12);
}

.svc-head {
  padding: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, .06), rgba(255, 255, 255, .02));
}

.svc-head.light {
  background: linear-gradient(135deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .01));
}

.svc-icon {
  box-shadow: 0 10px 18px rgba(0, 0, 0, .18);
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
  border-radius: 14px;
  background: rgba(255, 255, 255, .06);
  transition: transform .15s ease, box-shadow .15s ease;
}

.svc-card.bg-grey-3 .svc-item {
  background: rgba(0, 0, 0, .03);
}

.svc-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, .10);
}

.svc-thumb {
  flex: 0 0 auto;
  border: 2px solid rgba(255, 255, 255, .15);
}

.svc-card.bg-grey-3 .svc-thumb {
  border: 2px solid rgba(0, 0, 0, .06);
}

.svc-text {
  min-width: 0;
  flex: 1;
}

.svc-text>div:last-child {
  font-size: .92rem;
  line-height: 1.2rem;
}

.svc-cta {
  border-radius: 14px;
  font-weight: 800;
  letter-spacing: .2px;
}

/* Responsivo: encolhe no mobile */
@media (max-width: 600px) {
  .brand-badge :deep(.q-icon) {
    width: 64px;
    height: 24px;
  }
}

@media (max-width: 600px) {
  .img-parallax {
    background-size: cover;
  }
}
</style>
