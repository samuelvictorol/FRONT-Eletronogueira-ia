const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') },
      { path: 'catalogo', component: () => import('src/pages/CatalogoPage.vue') },
      { path: 'localizacao', component: () => import('src/pages/LocHorarioPage.vue') },

      // Página base
      { path: 'servicos-manutencao', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      // Rotas SEO (todas apontam para a mesma página)
      { path: 'manutencao-lavadoras', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'manutencao-lavadoras-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'manutencao-de-lavadora', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'manutencao-de-lavadora-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'mangueiras-hidraulicas', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'mangueiras-hidraulicas-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'crimpagem-de-mangueiras', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'crimpagem-de-mangueiras-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'manutencao-bombas-dagua', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'manutencao-bombas-dagua-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'conserto-bomba-dagua', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'conserto-bomba-dagua-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'manutencao-compressores', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'manutencao-compressores-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'automacao-industrial', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'automacao-industrial-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'solda-tig', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'solda-mig', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'solda-tig-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'solda-mig-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'torno-mecanico', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'torno-mecanico-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'rebobinagem-de-motores', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'rebobinagem-de-motores-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'caminhao-munck', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'caminhao-munck-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },
      { path: 'munck-valparaiso', component: () => import('src/pages/ServicosManutencaoPage.vue') },

      { path: 'catalogo/produto/:slug', name: 'produto', props: true, component: () => import('src/pages/ProdutoPage.vue') },
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/admin/AdminPage.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
