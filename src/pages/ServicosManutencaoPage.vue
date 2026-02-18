<template>
    <q-page class="q-px-md q-mt-xl bg-grey-3" :class="!isMobile ? 'q-pb-xl q-px-xl' : ''">
        <!-- Header -->
        <div class="q-my-md bg-primary q-pa-md header-bar ">
            <q-breadcrumbs class="text-secondary animate__animated animate__fadeInDown animate__delay-3s animate__slower ">
                <q-breadcrumbs-el class="text-secondary" icon="home" label="Início" to="/" />
                <q-breadcrumbs-el class="text-bold" label="Serviços e Manutenção" to="/servicos-manutencao" />
            </q-breadcrumbs>

            <div class="q-mt-sm">
                <div class="text-h4 text-secondary text-bold">Serviços e Manutenção em Valparaíso de Goiás</div>
                <div class="text-dark q-mt-xs">
                    Munck, torno, solda TIG/MIG, rebobinagem de motores, bombas d’água, mangueiras, lavadoras,
                    compressores e automação industrial.
                </div>

                <div class="row q-gutter-sm q-mt-md">
                    <q-btn color="secondary" class="text-bold" icon="place" label="Ver localização e rotas"
                        to="/localizacao" />
                    <q-btn outline color="secondary" icon="inventory_2" label="Ver catálogo de produtos"
                        to="/catalogo?min=299.9&max=8299.9&limit=12&page=1&orderBy=updated_desc" />
                    <q-btn icon="mdi-whatsapp" label="WhatsApp (orçamento)" type="a" target="_blank" class="text-white bg-green-14"
                        rel="noopener" :href="whatsServico" />
                </div>
            </div>
        </div>

        <!-- SEO intro -->
        <div class="q-pa-md bg-white rounded-borders shadow-1 q-mb-md">
            <div class="w100 row justify-center text-center bg-primary">
                <div
                    class="text-h5 text-secondary text-bold animate__animated animate__zoomIn animate__delay-43s animate__slower">
                    <q-img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                        alt="EN" style="border-radius:100%; width:44px; height:44px" /> <strong
                        class="text-negative">Atendimento local </strong>e rápido<br>
                </div>
            </div>
            <div class="text-subtitle1 text-bold text-grey-9"></div>
            <div class="text-grey-8 q-mt-md">
                Procurando manutenção de lavadoras, mangueiras, bombas d’água, compressores ou serviços como solda,
                torno e rebobinagem em Valparaíso de Goiás?
                A Eletro Nogueira atende quem está próximo à BR-040 com suporte técnico especializado e peças de
                qualidade.
                Solicite seu orçamento pelo WhatsApp e receba atendimento rápido.
            </div>

            <q-separator class="q-my-md" />

            <!-- Quick search chips (não precisa buscar nada aqui; é só UX + SEO sem depender de backend) -->
            <div class="text-caption text-grey-7">Buscas comuns:</div>
            <div class="row q-col-gutter-sm q-mt-xs">
                <div class="col-auto" v-for="t in quickTerms" :key="t">
                    <q-chip clickable color="grey-2" text-color="grey-9" @click="openWhatsWithTerm(t)">
                        {{ t }}
                    </q-chip>
                </div>
            </div>
        </div>

        <!-- Services / Maintenance content -->
        <section class="section bg-secondary rounded-borders shadow-1 q-pa-md">
            <div class="container q-py-md">
                <div class="row" :class="!isMobile ? 'q-gutter-x-sm no-wrap' : 'q-gutter-y-sm'">
                    <!-- Services -->
                    <div class="col-12 col-md-6">
                        <div class="card q-pa-md bg-grey-3">
                            <div class="text-h5 text-secondary q-mb-xs text-bold">Serviços</div>
                            <p class="text-black q-mb-md q-pt-sm">
                                Guindaste Munck, torno mecânico, solda TIG/MIG e rebobinagem de motores — equipe técnica
                                para projetos e emergências.
                            </p>

                            <div class="q-gutter-sm">
                                <q-item class="service-item">
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://armac.com.br/wordpress/wp-content/uploads/2023/01/armac-guindaste-e-munck-blog.jpg"
                                                alt="Munck (Guindaste articulado)" />
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Munck</q-item-label>
                                        <q-item-label caption>
                                            Guindaste articulado para içamento e movimentação com segurança e agilidade.
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item class="service-item">
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://blog.ferramentaskennedy.com.br/wp-content/uploads/2024/05/o-que-um-torno-mecnico8695f1a75961409e918edbcd14fc128b.jpg"
                                                alt="Torno mecânico" />
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Torno</q-item-label>
                                        <q-item-label caption>Usinagem precisa para peças sob medida e
                                            recuperação.</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item class="service-item">
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://www.g20brasil.com.br/wp-content/uploads/2016/08/ferro-de-solda-dicas-cuidados.jpg"
                                                alt="Solda TIG/MIG" />
                                        </q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Solda</q-item-label>
                                        <q-item-label caption>Processos TIG/MIG para reparos e fabricações com
                                            acabamento limpo.</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item class="service-item">
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://www.agbrasil360.com.br/agreletrotecnica/imgs_eventos/53ec6-rebobinamento-6.jpg"
                                                alt="Rebobinagem de motores elétricos" />
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
                                <q-btn class="q-py-sm shadow-1 text-bold w100" color="secondary" type="a"
                                    target="_blank" rel="noopener" :href="whatsServico">
                                    Pedir orçamento no WhatsApp
                                </q-btn>
                            </div>
                        </div>
                    </div>

                    <!-- Maintenance -->
                    <div class="col-12 col-md-6">
                        <div class="card q-pa-md bg-grey-3">
                            <div class="text-h5 text-secondary text-right q-mb-xs text-bold">Manutenção</div>
                            <p class="text-black q-pt-sm text-right">
                                Manutenção preventiva e corretiva com diagnóstico rápido e peças de qualidade.
                            </p>

                            <div class="q-gutter-sm">
                                <q-item class="service-item">
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Bombas d’água</q-item-label>
                                        <q-item-label caption>Troca de selo e rolamentos, limpeza de rotor e
                                            alinhamento.</q-item-label>
                                    </q-item-section>
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://blog.meritocomercial.com.br/wp-content/uploads/2023/11/manutencao-preventiva-bomba-de-agua-1024x683.jpg.webp"
                                                alt="Manutenção de bombas d'água" />
                                        </q-avatar>
                                    </q-item-section>
                                </q-item>

                                <q-item class="service-item">
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Mangueiras & Lavadoras</q-item-label>
                                        <q-item-label caption>Crimpagem, troca de conexões e testes de
                                            pressão.</q-item-label>
                                    </q-item-section>
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://s1.kaercher-media.com/media/image/file/9734/d3/assistencia-tecnica-kaercher.webp"
                                                alt="Mangueiras hidráulicas e lavadoras" />
                                        </q-avatar>
                                    </q-item-section>
                                </q-item>

                                <q-item class="service-item">
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Compressores</q-item-label>
                                        <q-item-label caption>Troca de óleo/filtros, revisão de válvulas e
                                            correias.</q-item-label>
                                    </q-item-section>
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://locadoraequiloc.com.br/wp-content/uploads/2022/07/manutencao-de-compressores-servico.jpg"
                                                alt="Manutenção de compressores" />
                                        </q-avatar>
                                    </q-item-section>
                                </q-item>

                                <q-item class="service-item">
                                    <q-item-section>
                                        <q-item-label class="text-weight-medium">Automação industrial</q-item-label>
                                        <q-item-label caption>Diagnóstico de CLP/inversores, sensores e
                                            painéis.</q-item-label>
                                    </q-item-section>
                                    <q-item-section avatar>
                                        <q-avatar size="64px" rounded class="avatar">
                                            <img src="https://blog.safetycontrol.ind.br/wp-content/uploads/2023/05/Manutencao-001.png"
                                                alt="Automação industrial" />
                                        </q-avatar>
                                    </q-item-section>
                                </q-item>
                            </div>

                            <div class="q-mt-md">
                                <q-btn class="q-py-sm shadow-1 text-bold w100" color="secondary" type="a"
                                    target="_blank" rel="noopener" :href="whatsAssistencia">
                                    Solicitar assistência técnica
                                </q-btn>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Local SEO block -->
                <div class="q-mt-lg q-pa-md bg-white rounded-borders shadow-1">
                    <div class="text-subtitle1 text-bold">Atendimento para quem está por perto</div>
                    <div class="text-grey-8 q-mt-xs">
                        Essa página é para facilitar quem procura no Google por serviços e manutenção na região.
                        Se você está em Valparaíso de Goiás, entorno do DF ou próximo à BR-040, fale com a equipe e peça
                        o orçamento.
                    </div>

                    <div class="row q-gutter-sm q-mt-md">
                        <q-btn outline color="secondary" icon="place" label="Localização e horário" to="/localizacao" />
                        <q-btn outline color="secondary" icon="call" label="Ligar (61) 3629-6858" type="a"
                            href="tel:+556136296858" />
                        <q-btn color="positive" icon="whatsapp" label="WhatsApp" type="a" target="_blank" rel="noopener"
                            :href="whatsAssistencia" />
                    </div>
                </div>
            </div>
        </section>

        <div class="w100 q-py-xl"></div>
    </q-page>
    <!-- Footer (mantido) -->
    <footer class="footer q-pt-xl bg-primary">
        <div class="container footer-grid q-pb-md">
            <div>
                <div class="brand">
                    <div class="logo">
                        <q-img style="border-radius: 20%;"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s"
                            alt="Eletro Nogueira Logo" />
                    </div>
                    <div class="brand-text">
                        <strong class="text-secondary">Eletro Nogueira</strong>
                        <small>Em frente à BR-040 • Valparaíso de Goiás</small>
                    </div>
                </div>
                <p class="foot-copy q-pt-sm">
                    Soluções em elétrica, hidráulica, automação e agro.<br />Pronta-entrega e
                    suporte técnico.<br /><br />CNPJ • <strong>26.931.014/0001-12.</strong>
                </p>
            </div>

            <div class="column">
                <q-btn unelevated color="positive" class="text-shadow btn whats q-ml-xs" glossy type="a" target="_blank"
                    rel="noopener"
                    href="https://wa.me/556136290040?text=Ol%C3%A1%20Eletro%20Nogueira!%20Quero%20um%20or%C3%A7amento.">
                    WhatsApp
                    <q-img
                        src="https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
                        alt="EN" style="border-radius:100%; width:30px; height:30px" />
                </q-btn>

                <q-btn outline icon-right="phone" color="secondary" class="btn outline q-mt-sm" href="tel:+556136290040"
                    label="(61) 3629-0040" />
                <q-btn icon-right="phone" color="secondary" class="btn q-mt-sm" href="tel:+556136296858"
                    label="(61) 3629-6858" />
            </div>
        </div>

        <div class="w100 column justify-center items-center text-center">
            Siga-nos no Instagram!!
            <br /><br />
            <q-btn unelevated color="warning" class="text-shadow btn whats q-ml-sm" glossy type="a" target="_blank"
                rel="noopener" href="https://www.instagram.com/nogueiravalparaiso/">
                @nogueiravalparaiso
                <q-img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
                    alt="Logo Instagram" style="border-radius:100%; width:30px; height:30px" />
            </q-btn>
        </div>

        <div class="copy q-mt-md">© Eletro Nogueira — 26.931.014/0001-12.</div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isMobile = computed(() => $q.screen.lt.md)

const quickTerms = [
    'manutenção de lavadoras',
    'mangueiras hidráulicas',
    'crimpagem de mangueiras',
    'manutenção de bombas d’água',
    'manutenção de compressores',
    'automação industrial',
    'solda TIG',
    'solda MIG',
    'rebobinagem de motores',
    'torno mecânico',
    'munck (guindaste articulado)'
]

const whatsServico =
    'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira!%20Gostaria%20de%20um%20or%C3%A7amento%20dos%20servi%C3%A7os.'
const whatsAssistencia =
    'https://wa.me/556136296858?text=Ol%C3%A1%20Eletro%20Nogueira!%20Preciso%20de%20assist%C3%AAncia%20t%C3%A9cnica.'

function openWhatsWithTerm(term) {
    const msg = encodeURIComponent(`Olá Eletro Nogueira! Preciso de orçamento para: ${term}. Estou próximo(a) da loja.`)
    window.open(`https://wa.me/556136296858?text=${msg}`, '_blank', 'noopener')
}
</script>

<style scoped>
.header-bar {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.card {
    border-radius: 14px;
}

.service-item {
    border-radius: 12px;
    background: #ffffff;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
