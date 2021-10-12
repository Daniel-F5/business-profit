<template>
  <q-page class="bg-light-green full-height full-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Business Profit - Sign In</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="Email" />
              <q-input square filled clearable v-model="password" autocomplete="on" type="password" label="Password" />
            </q-form>
            <q-btn class="q-ma-sm full-width" :ripple="{ center: true }" color="light-green-7" size="lg" label="Login" @click="login()"/>
            <q-btn class="full-width" @click="loginWithGoogle()">Sign in with Google</q-btn>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <p class="link" @click="goToRegisterPage()">Not reigistered? Created an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import firebaseInstance from '../middleware/firebase'

export default {
  name: "SignIn",
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login(){
      firebaseInstance.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
            window.user = result.user;
            this.$router.push('/home')
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
          });
    },
    loginWithGoogle() {
      const provider = new firebaseInstance.firebase.auth.GoogleAuthProvider();
      firebaseInstance.firebase.auth()
          .signInWithPopup(provider)
          .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            window.user = result.user;
            this.$router.push('/home')
            // ...
          }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    },
    goToRegisterPage() {
      this.$router.push('/signUp')
    }
  },
  created() {
    if (window.user) {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
  .link:hover {
    color:blue;
  }
  .link {
    color:grey;
  }
</style>