<template>
  <q-page
  class="page"
  >
  <div class="home">
    <AddPkoda :tableName="'pkodot'" @pkodaAdded="reloadTable"/>
    <TableViewer :tableName="'pkodot'" :isReload="isReload"/>
  </div>
  </q-page>
</template>

<script>
// @ is an alias to /src
import TableViewer from '../components/TableViewer';
import AddPkoda from '../components/AddPkoda';

export default {
  name: 'Home',
  components: {
    TableViewer, AddPkoda
  },
  data(){
    return {
      isReload: false
    }
  },
  methods: {
    reloadTable(){
      this.isReload = !this.isReload;
    }
  }
}
</script>
<style lang="sass">

</style>
