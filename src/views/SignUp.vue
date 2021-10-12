<template>
  <q-page
      class="bg-green full-height full-width row justify-center items-center"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Business Profit - Sign Up</h5>
      </div>
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section>
            <q-form class="q-px-sm q-pt-xl q-pb-lg">
              <q-input square clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input 
              square clearable v-model="username" type="username" label="Username"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-input square clearable v-model="password" autocomplete="on" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn @click="register()" unelevated size="lg" color="green-5" class="full-width text-white"
                   label="Get Started" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <p class="link" @click="goToSignInPage()">Return to login</p>
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
  .link:hover {
    color:blue;
  }
  .link {
    color:grey;
  }
</style>