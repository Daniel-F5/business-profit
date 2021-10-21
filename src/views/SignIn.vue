<template>
  <q-page class="full-height full-width row justify-center items-center">
    <div>
      <div class="row">
        <h4 class="col text-center text-secondary q-my-md">Sign In</h4>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-24">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="Email" />
              <q-input square filled clearable v-model="password" autocomplete="on" type="password" label="Password" />
            <div>
            <q-btn glossy rounded class="q-ma-sm full-width" :ripple="{ center: true }" color="primary" size="lg" label="Login" @click="login()"/>
            </div>
            </q-form>
            <q-btn glossy rounded class="fit" bg-color="white" @click="loginWithGoogle()">
              
              <div class="row q-mr-lg">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" class="abcRioButtonSvg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
              </div>
              <div class="col">
              Sign in with Google
              </div>
              </q-btn>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <q-btn rounded flat size="sm" @click="goToRegisterPage()">Not reigistered? Created an Account</q-btn>
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
</style>