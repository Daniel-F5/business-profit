<template>
  <q-page class="full-height full-width row justify-center items-center">
    <div>
      <div class="row">
        <h4 class="col text-center text-secondary q-my-md">Let's Start!</h4>
      </div>
      <div class="row">
        <q-card square class="shadow-24">
          <q-card-section class="column">
            <q-form class="column q-gutter-sm q-px-lg">
              <q-input class="col full-width" square clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input 
              class="col full-width"
              square clearable v-model="username" type="username" label="Username"
              lazy-rules
              hide-bottom-space
              :rules="[ val => val && val.length > 0 || 'Please type something']">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input class="col full-width" square clearable v-model="password" autocomplete="on" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-section class="text-center q-px-lg q-py-sm">
            <q-btn glossy rounded @click="register()" unelevated size="lg" color="secondary" class="full-width text-white"
                   label="Get Started" />
          </q-card-section>
          <q-card-section class="text-center q-px-lg q-pb-md q-pt-xs">
            <q-btn rounded class="full-width" flat size="md" @click="goToSignInPage()">Return to login</q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import firebaseInstance from '../middleware/firebase'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      username: '',
      password: ''
    }
  },
  methods: {
    register(){
      firebaseInstance.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            // ...
            this.$router.push('/')
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
          });
    },
    goToSignInPage() {
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>