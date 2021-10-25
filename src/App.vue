<template>
  <q-layout view="lHh Lpr lFf" id="app">
    <q-header elevated class="bg-secondary">
      <q-toolbar>
        <div>
          <q-btn outline class="text-bold" id="loginBtn" v-if="!this.user" to='/' label="התחבר"/>
          <q-btn outline class="text-bold" id="logoutBtn" v-if="this.user" @click="userLogout()" label="התנתק"/>
        </div>
        <q-toolbar-title class="gt-xs row text-center text-bold	text-h5 justify-center">
          <img src="./assets/business-profit-icon.png" width="32" height="32" alt="business-profit-icon">
          Business Profit
        </q-toolbar-title>
        <q-toolbar-title class="lt-sm row justify-center">
          <img src="./assets/business-profit-icon.png" width="32" height="32" alt="business-profit-icon">
        </q-toolbar-title>
        <q-item class="items-center q-px-xs">{{userName}}</q-item>
        <q-img v-if="this.user" :src='this.userPhoto' class="q-px-sm userImg"/>
      </q-toolbar>
    </q-header>

    <q-page-container class="page">
      <router-view></router-view>
    </q-page-container>
    <q-footer elevated class="bg-secondary">
      <q-toolbar class="justify-center">
        <q-btn flat to='/' class="text-bold text-overline self-start">דף הבית</q-btn>
        <q-btn flat to='/about' class="text-bold text-overline self-start">אודות</q-btn>
        <q-btn flat to='/contact' class="text-bold text-overline self-start">צור קשר</q-btn>
      </q-toolbar>
      <q-item-label class="text-center items-center q-mb-sm">©דניאל פרנגיאן 2021</q-item-label>
    </q-footer>
  </q-layout>
</template>

<script>
import Home from './views/Home'
import firebaseInstance from './middleware/firebase'
import {mapActions} from 'vuex'

export default {
  name: 'LayoutDefault',
  methods: {
    ...mapActions('pkodot', ['resetPkodotStore']),
    userLogout() {
      if (this.leftDrawerOpen){
        this.leftDrawerOpen = false;
      }
      firebaseInstance.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.resetPkodotStore();
        this.$router.push('/')
      }).catch((error) => {
        // An error happened.
      });
    },
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
    document.body.style.setProperty('--q-color-secondary', '#435870')
    if (window.user){
      this.user = true;
      this.userPhoto = window.user.photoURL;
      this.userName = window.user.displayName;
      }
     },
}
</script>

<style lang="sass">
.userImg 
  height: 32px;
  max-width: 32px;
  border-radius: 50%
  
#loginBtn, #logoutBtn
  color: #B8D2F2;
  


// 
// color palette
// #344F70
// #B8D2F2
// #6EA9F0
// #435870
// #5785BD
</style>
