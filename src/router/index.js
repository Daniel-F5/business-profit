import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import firebaseInstance from '../middleware/firebase'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn,
    meta: {authRequired: false}
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp,
    meta: {authRequired: false}
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {authRequired: true}
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {authRequired: false}
  },
  {
    path: '/contact',
    name: 'Contact',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Contact.vue'),
    meta: {authRequired: false}
  },
  {
    path: '/user',
    name: 'User',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue'),
    meta: {authRequired: true}
  },
  {
    path: '/pkodot/:year/:month/:id',
    name: 'UpdateItem',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/pkoda.vue'),
    meta: {authRequired: true}
  }
]

const router = new VueRouter({
  routes
})

/** 
 * Handle user redirections
*/

router.beforeEach((to, from, next) => {
  let user = firebaseInstance.firebase.auth().currentUser
  if (user === null){
    user = false;
  }
  if (!user && to.meta.authRequired || user && !to.meta.authRequired){
    const path = !user ? '/' : to.fullPath;
    return next(path)
  }
  next()
})

export default router
