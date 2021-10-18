<template>
  <q-page
  class="page"
  >
  <div>
    <add-pkoda :tableName="tableName"></add-pkoda>
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
.page
  background-color:#B8D2F2

</style>