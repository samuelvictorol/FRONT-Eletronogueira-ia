<template>
  <q-page class="text-black">
    <div class="bg-secondary">
      <div
        class="open-now text-white text-shadow q-py-sm text-center animate__animated animate__fadeInDown animate__delay-3s animate__slower">
        {{ openNowText }}</div>

    </div>
    <!-- HERO -->
    <section class="hero">
      <img class="hero-bg" :src="heroImg" alt="Fachada Eletro Nogueira" />
      <div class="hero-overlay"></div>

      <div class="hero-content glass q-mx-sm animate__animated animate__fadeInUp animate__delay-4s animate__slower">
        <div class="text-h5 text-secondary text-bold">
          <q-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
            alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
            class="text-negative">ELETRO</strong> NOGUEIRA<br>
        </div>
        <p class="text-bold text-secondary q-mt-sm">Ferramentas & Soluções</p>
        <p class="subtitle">
          Em frente à <strong>BR-040</strong>, na divisa com o DF — <strong>Valparaíso de Goiás</strong>.
          Pronta-entrega e atendimento consultivo.
        </p>
        <div class="hero-badges">
          <div class="badge bg-blue-1 text-dark">Elétrica</div>
          <div class="badge bg-blue-1 text-dark">Hidráulica</div>
          <div class="badge bg-blue-1 text-dark">Automação</div>
          <div class="badge bg-blue-1 text-dark">Agro</div>
          <div class="badge bg-blue-1 text-dark">Industrial</div>
        </div>
        <div class="cta-row">
          <q-btn color="secondary" unelevated class="btn primary text-shadow" @click="scrollTo('#produtos')"
            label="Ver produtos" />
          <q-btn color="negative" unelevated class="btn primary text-shadow" @click="scrollTo('#servicos')"
            label="Serviços e Manutenção" />
          <q-btn flat class="btn ghost text-secondary" color="secondary" icon-right="pin_drop"
            @click="scrollTo('#como-chegar')" label="Como chegar" />
        </div>
      </div>
    </section>

    <!-- SOBRE -->
    <section id="sobre" class="section q-py-md">
      <div class="container grid-2">
        <div class="glass card">
          <h2>Quem somos</h2>
          <p>Somos uma loja física localizada em <strong>Valparaíso de Goiás</strong>, ponto estratégico
            em frente à <strong>BR-040</strong>, próxima à divisa com o DF. Trabalhamos com ampla linha
            de <em>ferramentas elétricas</em>, <em>hidráulica</em>, <em>automação industrial</em>,
            <em>elétrica</em>, <em>agropecuária</em>, <em>bombas d’água</em> e muito mais.
          </p>
          <p>Atendimento rápido, estoque para pronta-entrega e equipe que entende do que faz.</p>
        </div>

        <div class="glass card">
          <h3>Destaques em pronta-entrega</h3>
          <ul class="pill-list">
            <li>Furadeira, Parafusadeira, Martelete</li>
            <li>Martelo, Compressores, Ferramenta pneumática</li>
            <li>Bombas: palito, Anauger, incêndio, poço artesiano</li>
            <li>Elétrica: motores, geradores, inversoras, máquinas de solda</li>
            <li>Agro & Jardim: cortador de grama, desintegrador, forrageira, pulverizador, motosserra</li>
            <li>Medição: paquímetro, alicate amperímetro, multímetro, trena a laser</li>
            <li>Usinagem & corte: fresa, lima rotativa, esquadro, cortador de piso</li>
            <li>Correias, polias, Topfusion, conexões PU</li>
            <li>Lavadoras, Makita e muito mais</li>
          </ul>
        </div>
      </div>
    </section>
    <section id="servicos" class="section q-py-md">
      <div class="container">
        <div class="row q-col-gutter-xl">
          <!-- Coluna: Serviços -->
          <div class="col-12 col-md-6">
            <div class="glass card q-pa-md">
              <h2 class="text-secondary q-mb-xs">Serviços</h2>
              <p class="text-grey-7 q-mb-md">
                Guindaste Munck, torno mecânico, solda TIG/MIG e rebobinagem de motores — equipe técnica para projetos e
                emergências.
              </p>

              <div class="q-gutter-md">
                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://armac.com.br/wordpress/wp-content/uploads/2023/01/armac-guindaste-e-munck-blog.jpg"
                        alt="Munck (Guindaste articulado)">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Munck</q-item-label>
                    <q-item-label caption>Guindaste articulado para içamento e movimentação com segurança e
                      agilidade.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://blog.ferramentaskennedy.com.br/wp-content/uploads/2024/05/o-que-um-torno-mecnico8695f1a75961409e918edbcd14fc128b.jpg"
                        alt="Torno mecânico">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Torno</q-item-label>
                    <q-item-label caption>Usinagem precisa para peças sob medida e recuperação.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img src="https://oximig.com.br/wp-content/uploads/2023/10/Quando-devo-usar-Solda-TIG.jpg"
                        alt="Solda TIG/MIG">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Solda</q-item-label>
                    <q-item-label caption>Processos TIG/MIG para reparos e fabricações com acabamento
                      limpo.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img src="https://www.agbrasil360.com.br/agreletrotecnica/imgs_eventos/53ec6-rebobinamento-6.jpg"
                        alt="Rebobinagem de motores elétricos">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Rebobinagem de Motores</q-item-label>
                    <q-item-label caption>Substituição de enrolamentos com teste e garantia de
                      desempenho.</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mt-md">
                <q-btn class="btn whats q-py-sm shadow-1 text-bold text-shadow w100" color="positive" type="a"
                  target="_blank" rel="noopener" glossy
                  href="https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os.">
                  Pedir orçamento no WhatsApp
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Coluna: Manutenção -->
          <div class="col-12 col-md-6">
            <div class="glass card q-pa-md">
              <h3 class="text-secondary q-mb-xs">Manutenção</h3>
              <p class="text-grey-7 q-mb-md">
                Manutenção preventiva e corretiva com diagnóstico rápido e peças de qualidade.
              </p>

              <!-- Lista “pill” enxuta -->
              <ul class="pill-list q-mb-md">
                <li>Bombas d’água</li>
                <li>Mangueiras & lavadoras</li>
                <li>Compressores</li>
                <li>Automação industrial</li>
              </ul>

              <!-- Itens com avatar padronizado -->
              <div class="q-gutter-md">
                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://blog.meritocomercial.com.br/wp-content/uploads/2023/11/manutencao-preventiva-bomba-de-agua-1024x683.jpg.webp"
                        alt="Manutenção de bombas d'água">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Bombas d’água</q-item-label>
                    <q-item-label caption>Troca de selo e rolamentos, limpeza de rotor e alinhamento.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://s1.kaercher-media.com/media/image/file/9734/d3/assistencia-tecnica-kaercher.webp"
                        alt="Mangueiras hidráulicas e lavadoras">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Mangueiras & Lavadoras</q-item-label>
                    <q-item-label caption>Crimpagem, troca de conexões e testes de pressão.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img
                        src="https://locadoraequiloc.com.br/wp-content/uploads/2022/07/manutencao-de-compressores-servico.jpg"
                        alt="Manutenção de compressores">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Compressores</q-item-label>
                    <q-item-label caption>Troca de óleo/filtros, revisão de válvulas e correias.</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="service-item">
                  <q-item-section avatar>
                    <q-avatar size="80px" rounded class="avatar">
                      <img src="https://blog.safetycontrol.ind.br/wp-content/uploads/2023/05/Manutencao-001.png"
                        alt="Automação industrial">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Automação industrial</q-item-label>
                    <q-item-label caption>Diagnóstico de CLP/inversores, sensores e painéis.</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mt-md">
                <q-btn class="btn whats q-py-sm shadow-1 text-bold text-shadow w100" color="positive" type="a"
                  target="_blank" rel="noopener" glossy
                  href="https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica.">
                  Solicitar assistência técnica
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="produtos">
      <div class=" bg-secondary text-white q-pt-sm">
        <h2 class="center">Produtos e Marcas</h2>
        <q-carousel v-model="slide" v-model:fullscreen="fs" transition-prev="slide-right" transition-next="slide-left"
          animated control-color="secondary" navigation padding arrows swipeable height="400px" infinite
          class="bg-grey-3">
          <template #control>
            <q-btn flat dense color="secondary" round :icon="fs ? 'fullscreen_exit' : 'fullscreen'" @click="fs = !fs"
              class="q-ml-sm q-mt-sm" />
          </template>
          <q-carousel-slide :name="1" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/p/AF1QipNu9WuJF2DhEH0KdB7Qtl9uCiecop1aUaciuSx2=s680-w680-h510-rw" />
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxQ5ryS1tpHhdI2779-8TuNGST8BqID2yx46lRYEOfh35jSIJb9ctsjZe4P80oaPBQWmLVCZra8fwiyJ4d7IY5iZ8uPzjlvLdCV-GJc6gBPxB5o86vMd_PJDri9q3R1FWhTKYP5=s680-w680-h510-rw" />
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="2" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzZBzEFOf3nhbpu82xl4XLquokjRWj6h1OMmp0ZJwKrSVjTQCbD79NB3N5Wqe_dKCb5Cz9YzK1U0czuWSnwInOVR8prGbb-G3blw812pIw5Wyoe2-FQUqB3YhVi-SJSt3TmtGPa_g=s680-w680-h510-rw" />
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyagXSk9RxAoFfbktDFmHkXfBM65tJlcZjN1_R3pjYH3XNAusscYbSw5Nu-1U0tVubxB9psqmRMn7-IcnL-llcs0Q-TnCdj45pQqOUo6PguO6WpaIgV_bTcdXNp8nqBR-mdw-RKsQ=s680-w680-h510-rw" />
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="3" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/p/AF1QipN-mmS6_z1lg5Irtn_XpIHLte5Tt_R2CLqpv2F2=s680-w680-h510-rw" />
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwZkbDh93brg_iTpOSVN73R0WWeZiUyRO_2KHmW9y8Di4_BQQeCRN-T1F2_4vxN5lxhUvs80cnzderCjt_9ERohbzt6TB_yYo-XXxD8M9OCdkJeKupTnvBykHZNARwXrSK9GYrZNA=s680-w680-h510-rw" />
            </div>
          </q-carousel-slide>
          <q-carousel-slide :name="4" class="column no-wrap">
            <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/p/AF1QipPs3aLH9VNuJDuv5xUxOFwIKg_e4AIHKkSvxelo=s680-w680-h510-rw" />
              <q-img class="rounded-borders col-6 full-height"
                src="https://lh3.googleusercontent.com/p/AF1QipPQf6F4n63OrwWlYr5hpOwPuz3ZlahG18SFf46C=s680-w680-h510-rw" />
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </section>
    <!-- PRODUTOS -->
    <section class="section  q-pb-lg">
      <div class="w100 row justify-center no-wrap">
        <q-btn color="secondary" class=" text-white  text-bold q-pa-md "
          to="/catalogo?min=199.9&max=599.9&limit=12&page=1&orderBy=relevance" label="Ver Catálogo Completo"
          icon-right="search" />
      </div>
      <div class="container rounded-borders q-pa-sm">
        <div class="cards">
          <article class="product glass" @click="goTo('/catalogo?q=furadeira&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://www.parafusoscenterfix.com.br/blog/wp-content/uploads/2024/01/distribuidor-de-ferramentas-eletricas-1.jpg"></q-img>
            <h4>Ferramentas Elétricas</h4>
            <p>Furadeira, Parafusadeira, Martelete, Esmerilhadeira.</p>
          </article>
          <article class="product glass" @click="goTo('/catalogo?q=bomba&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://cdn.sindiconet.com.br/Conteudos/9753/bombadagua.jpg"></q-img>
            <h4>Hidráulica & Bombas</h4>
            <p>Bombas palito, Anauger, incêndio, poço artesiano.</p>
          </article>
          <article class="product glass" @click="goTo('/catalogo?q=válvulas&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://www.felapblog.com.br/wp-content/uploads/2019/12/Ferramentas-pneum%C3%A1ticas.jpg"></q-img>
            <h4>Automação & Pneumática</h4>
            <p>Conexões PU, válvulas, mangueiras, ferramentas pneumáticas.</p>
          </article>
          <article class="product glass" @click="goTo('/catalogo?q=motor&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://tokenengenharia.com.br/wp-content/uploads/2024/01/Escolher-Gerador-de-Energia-1024x576.jpg"></q-img>
            <h4>Elétrica Industrial</h4>
            <p>Motores elétricos, inversoras, geradores, quadros.</p>
          </article>
          <article class="product glass" @click="goTo('/catalogo?q=jardim&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://blog.neteletrica.com.br/wp-content/uploads/2019/07/shutterstock_475483222.jpg"></q-img>
            <h4>Agro & Jardim</h4>
            <p>Cortador de grama, pulverizador, motosserra, forrageira.</p>
          </article>
          <article class="product glass" @click="goTo('/catalogo?q=compressor&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://arquivos.sistemaeso.com.br/blog/imagens/seguranca-no-trabalho/o-que-e-um-epi-equipamento-de-protecao-individual.jpg"></q-img>
            <h4>Solda & Oficina</h4>
            <p>Máquinas de solda, EPI, compressores, acessórios.</p>
          </article>
          <article class="product glass"
            @click="goTo('/catalogo?q=trena+multimetro&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://down-br.img.susercontent.com/file/7a39c242d5c572ae4179541e2b71a53d"></q-img>
            <h4>Medição & Precisão</h4>
            <p>Paquímetro, multímetro, trena a laser, esquadro.</p>
          </article>
          <article class="product glass" @click="goTo('/catalogo?q=polia&limit=12&page=1&orderBy=relevance')">
            <q-img width="100%" class="rounded-borders"
              src="https://rexon.com.br/wp-content/uploads/2023/03/Correias-de-borracha-scaled.jpg"></q-img>
            <h4>Acessórios & Transmissão</h4>
            <p>Correias, polias, Topfusion, mangueiras.</p>
          </article>
        </div>

      </div>
    </section>
    <section id="marcas">
      <div class=" text-secondary">
        <div class="" v-if="!isMobile">
          <q-carousel v-model="slide" v-model:fullscreen="fs" transition-prev="slide-right" transition-next="slide-left"
            animated control-color="secondary" navigation padding arrows swipeable height="375px" infinite
            class="bg-grey-3">
            <template #control>
              <q-btn flat dense color="secondary" round :icon="fs ? 'fullscreen_exit' : 'fullscreen'" @click="fs = !fs"
                class="q-ml-sm q-mt-sm" />
            </template>
            <q-carousel-slide :name="1" class="column no-wrap">
              <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                <q-img class="rounded-borders col-6 full-height"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Makita_Logo.svg/1280px-Makita_Logo.svg.png" />
                <q-img class="rounded-borders col-6 full-height"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Black%2BDecker_Logo.svg/1200px-Black%2BDecker_Logo.svg.png " />
              </div>
            </q-carousel-slide>
            <q-carousel-slide :name="2" class="column no-wrap">
              <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                <q-img class="rounded-borders col-6 full-height"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/3M_wordmark.svg/2560px-3M_wordmark.svg.png" />
                <q-img class="rounded-borders col-6 full-height"
                  src="https://logodownload.org/wp-content/uploads/2014/12/bosch-logo-0.png" />
              </div>
            </q-carousel-slide>
            <q-carousel-slide :name="3" class="column no-wrap">
              <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                <q-img class="rounded-borders col-6 full-height"
                  src="https://grandesnomesdapropaganda.com.br/wp-content/uploads/2020/01/Tramontina.jpg" />
                <q-img class="rounded-borders col-6 full-height"
                  src="https://logodownload.org/wp-content/uploads/2021/03/stanley-logo-1.png" />
              </div>
            </q-carousel-slide>
            <q-carousel-slide :name="4" class="column no-wrap">
              <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                <q-img class="rounded-borders col-6 full-height"
                  src="https://media.licdn.com/dms/image/v2/D563DAQFP8xwCqR0SpA/image-scale_191_1128/image-scale_191_1128/0/1721411832041/nova_motores_cover?e=2147483647&v=beta&t=NGpPzhgj6s10Y8SsfDc4CDaGt948DoRUxqqRC0R_QmI" />
                <q-img class="rounded-borders col-6 full-height"
                  src="https://images.seeklogo.com/logo-png/40/1/marluvas-logo-png_seeklogo-404913.png" />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </section>
    <!-- PRODUTOS -->
    <section class="section q-pb-lg">
      <div class="w100 row justify-center no-wrap">
        <q-btn class="text-secondary bg-primary text-bold q-pa-md q-mt-md"
          to="/catalogo?min=799.9&max=999.9&limit=12&page=1&orderBy=relevance" label="Buscar por Marcas"
          icon-right="search" />
      </div>
      <div class="container rounded-borders q-pa-sm">
        <div class="cards text-secondary">
          <article class=" bg-primary product glass"
            @click="goTo('/catalogo?marca=makita&limit=12&page=1&orderBy=relevance')">
            <h4 class="text-bold">Makita</h4>
            <p class="text-secondary">Motossera, broca, disco diamantado, disco de corte etc.</p>
          </article>
          <article class=" bg-primary product glass"
            @click="goTo('/catalogo?marca=black+decker&limit=12&page=1&orderBy=relevance')">
            <h4 class="text-bold">Black & Decker</h4>
            <p class="text-secondary">Parafusadeira, jogo de brocas, esmerilhadeira, soprador térmico etc.</p>
          </article>
          <article class=" bg-primary product glass"
            @click="goTo('/catalogo?marca=Stanley&limit=12&page=1&orderBy=relevance')">
            <h4 class="text-bold">Stanley</h4>
            <p class="text-secondary">Cabo, chave ingles, soquetes, chave de grife, jogo de saca-pino etc.</p>
          </article>
          <article class=" bg-primary product glass"
            @click="goTo('/catalogo?marca=eletro+nogueira&limit=12&page=1&orderBy=relevance')">
            <h4 class="text-bold">E muito mais!</h4>
            <p class="text-secondary">3M, Bosch, Nova Motores, Marluvas, Vonder, Tramontina e várias outras.</p>
          </article>
        </div>
      </div>
      <div class="center mt">
        <q-btn id="horarios" class="btn whats q-py-sm shadow-1 text-bold text-shadow" color="positive" type="a"
          target="_blank" rel="noopener" glossy
          href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira%21%20Gostaria%20de%20realizar%20um%20or%C3%A7amento.">
          Fale Conosco<q-img class="q-ml-sm"
            src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
            alt="EN" style="border-radius:100%; width:30px; height:30px" /></q-btn>
      </div>
    </section>
    <!-- HORÁRIOS / MAPA -->
    <section class="section alt q-py-md">
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

    <!-- FOOTER -->
    <footer class="footer q-pt-md">
      <div class="container footer-grid q-pb-md">
        <div>
          <div class="brand">
            <div class="logo"><q-img style="border-radius: 20%;"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                alt="Eletro Nogueira Logo" /></div>
            <div class="brand-text">
              <strong class="text-secondary">Eletro Nogueira</strong>
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
          <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm" href="tel:+556136290040"
            label="(61) 3629-0040" />
          <q-btn icon-right="phone" color="secondary" class=" btn q-mt-sm" href="tel:+556136296858"
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
const heroImg = '/assets/store2.png' // coloque a imagem em /public/assets
const slide = ref(3)
const fs = ref(false)
const router = useRouter()

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
  if (!range) return '🟡 Fechado hoje • Domingo'
  const [start, end] = range
  return (hhmm >= start && hhmm <= end)
    ? `🟢 Aberto agora • ${start} - ${end}`
    : `🔴 Fechado no momento • ${start} – ${end}`
})

function goTo(path) {
  router.push(path)
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
.section.alt {
  background: linear-gradient(180deg, rgba(30, 74, 168, .06), transparent 70%)
}
</style>
