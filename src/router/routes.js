const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/IndexPage.vue') },
      { path: 'catalogo', component: () => import('src/pages/CatalogoPage.vue') },
      { path: 'localizacao', component: () => import('src/pages/LocHorarioPage.vue') },
      { path: 'catalogo/produto/:slug', name: 'produto', props: true, component: () => import('src/pages/ProdutoPage.vue') },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
