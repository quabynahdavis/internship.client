import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('./views/HomeView.vue'), meta: { title: 'Home' } },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('./views/DiscoverView.vue'),
      meta: { title: 'Discover internships' },
    },
    {
      path: '/applications',
      name: 'applications',
      component: () => import('./views/ApplicationsView.vue'),
      meta: { title: 'My applications' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/ProfileView.vue'),
      meta: { title: 'Profile & matching' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

router.afterEach((to, from) => {
  document.title = `${to.meta.title} · InternHub`
  if (from.matched.length && to.path !== from.path) {
    requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
  }
})
