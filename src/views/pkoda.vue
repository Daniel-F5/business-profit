<template>
  <q-page>
  <div>
    <add-pkoda :tableName="tableName"></add-pkoda>
  </div>
  <div class="row justify-center q-pt-xl">
  <img class="q-ml-xs" src="../assets/invoice-illustration.jpg" alt="invoice-illustration" width="370" height="370">
  </div>
  </q-page>
</template>

<script>
import AddPkoda from "@/components/AddPkoda";


export default {
  name: "pkoda",
  computed: {
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
  methods: {
  },


  created() {
  }
}
</script>

<style lang="sass">
</style>