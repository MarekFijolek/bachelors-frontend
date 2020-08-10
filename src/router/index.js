import Vue from 'vue'
import VueRouter from 'vue-router'
import AllTags from '../views/AllTags.vue'
import History from '../views/History.vue'
import Compare from '../views/Compare.vue'
import Search from '../views/Search.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AllTags
  },
  {
    path: '/alltags',
    name: 'AllTags',
    component: AllTags
  },
  {
    path: '/history',
    name: 'History',
    component: History
  },
  {
    path: '/compare',
    name: 'Compare',
    component: Compare
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
