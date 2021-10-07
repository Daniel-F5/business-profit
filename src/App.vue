<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="menu"
        />

        <q-toolbar-title>
          Business Profit
        </q-toolbar-title>

        <div>
          <q-btn v-if="this.user" @click="userLogout()">התנתק</q-btn>
          <q-btn v-if="!this.user" @click="goToLoginPage()">התחבר</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        bordered
        content-class="bg-grey-2"
    >
      <q-list>
        <q-item clickable tag="a" @click="goToLoginPage()">
          <q-item-section avatar>
            <q-icon name="school"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" @click="goToAboutPage()">
          <q-item-section avatar>
            <q-icon name="code"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon name=""/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon name="forum"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="rss_feed"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import Home from './views/Home'
import firebaseInstance from './middleware/firebase'

export default {
  name: 'LayoutDefault',
  methods: {
    userLogout() {
      firebaseInstance.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$router.push('/')
      }).catch((error) => {
        // An error happened.
      });
    },
    goToLoginPage() {
      this.$router.push('/')
    },
    goToAboutPage() {
      this.$router.push('/about')
    },
    reset : () => {
      window.user = null
      this.user = false
    }
  },
  components: {
    Home
  },

  data() {
    return {
      leftDrawerOpen: false,
      user:undefined,
      // logButton: false
    }
  },
  mounted() {
    this.user = window.user;
    if (this.user){
      this.user = true;
    }
     },

  // created() {
  //
  // }
}
</script>

<style>
</style>
