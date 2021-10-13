<template>
  <q-layout view="lHh Lpr lFf" id="app">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="menu"
            v-show="this.user"
        />

        <q-toolbar-title class="text-center text-bold	text-h5">
          Business Profit
        </q-toolbar-title>

        <q-item>{{userName}}</q-item>
        <q-img v-if="this.user" :src='this.userPhoto' class="userImg"/>
        <div>
          <q-btn id="loginBtn" v-if="!this.user" @click="goToLoginPage()">התחבר</q-btn>

          <q-btn id="logoutBtn" v-if="this.user" @click="userLogout()">התנתק</q-btn>
        </div>
        
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        bordered
        content-class="bg-grey-2"
    >
      <q-list>
        <q-item clickable @click="goToPage('user')">
          <q-item-section avatar>
            <q-icon name="school"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>הגדרות משתמש</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="code"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>דוחות</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <q-item clickable tag="a">
          <q-item-section avatar>
            <q-icon name=""/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a">
          <q-item-section avatar>
            <q-icon name="forum"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a">
          <q-item-section avatar>
            <q-icon name="rss_feed"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <q-page-container >
      <router-view></router-view>
    </q-page-container>
    <q-footer elevated class="glossy">
      <q-toolbar class="justify-center">
        <q-btn flat to='/' class="text-bold text-overline">home</q-btn>
        <q-btn flat to='/about' class="text-bold text-overline">about</q-btn>
        <q-btn flat to='/contact' class="text-bold text-overline">contact as</q-btn>
      </q-toolbar>
      <p class="text-center justify-center">Daniel Farangian 2021©</p>
    </q-footer>
  </q-layout>
</template>

<script>
import Home from './views/Home'
import firebaseInstance from './middleware/firebase'

export default {
  name: 'LayoutDefault',
  methods: {
    userLogout() {
      if (this.leftDrawerOpen){
        this.leftDrawerOpen = false;
      }
      firebaseInstance.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$router.push('/')
      }).catch((error) => {
        // An error happened.
      });
    },
    goToPage(path) {
      if (this.$route.path === `/${path}`){
        return;
      } else {
        this.$router.push(`/${path}`)
      }
    },
    goToLoginPage(){
      if (this.$route.path === `/`){
        return;
      } else {
        this.$router.push(`/`)
      }
    }
  },
  components: {
    Home
  },

  data() {
    return {
      leftDrawerOpen: false,
      user:undefined,
      userPhoto: null,
      userName: null,
    }
  },
  mounted() {
    document.body.style.setProperty('--q-color-primary', '#5785BD')
    if (window.user){
      this.user = true;
      this.userPhoto = window.user.photoURL;
      this.userName = window.user.displayName;
      }
     },
}
</script>

<style lang="sass" >
.userImg 
  height: 32px;
  max-width: 32px;
  border-radius: 50%
  
.page
    background-color:#B8D2F2

// 
// color palette
// #344F70
// #B8D2F2
// #6EA9F0
// #435870
// #5785BD
</style>
