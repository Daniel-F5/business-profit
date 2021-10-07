<template>
  <div>
    <add-pkoda :tableName="tableName"></add-pkoda>
  </div>
</template>

<script>
//import localStorageDriver from '../middleware/local-storage';
//import api from '../middleware/api';
//import firebaseDatabase from '../middleware/firebase/database';
import AddPkoda from "@/components/AddPkoda";
import {mapActions, mapState, mapMutations, mapGetters} from "vuex";


export default {
  name: "pkoda",
  computed: {
    ...mapState('pkodot', ['editedPkodaId', 'editedPkoda', 'path']),
  },
  components: {
    AddPkoda
  },
  data() {
    return {
      pkoda: {},
      tableName: 'pkodot'
    }
  },
  //computed: mapState('pkodot', ['pkodot']),
  methods: {
    // ...mapActions('pkodot', ['setEditedPkodaById']),
    // ...mapMutations('pkodot', ['setEditedPkodaId']),
    // async getObject() {
    //   const path = `${this.tableName}/${this.$route.params.year}/${this.$route.params.month}/${this.$route.params.id}`
    //   await this.setEditedPkodaId(this.$route.params.id)
    //   await this.setEditedPkodaById(path)
    //   console.log(this.path)
    //   console.log(this.editedPkoda)
    // }
  },


  created() {
    // this.getObject()
    // const self = this
    // if (this.$route.params.id) {
    //   this.setEditedPkodaId(this.$route.params.id)
    //   await this.setEditedPkodaById({
    //     //todo - try to use the state instead the route
    //     //try 1 = not work in case of refresh page because we don't get the path in the fireBase to set the editedPkoda
    //     id: this.$route.params.id,
    //     year: this.$route.params.year,
    //     month: this.$route.params.month
    //   }).then(()=> {
    //     debugger
    //     self.pkoda = self.editedPkoda
    //   })
    // }
    // this.getObject();
  }
}
</script>

<style scoped>

</style>