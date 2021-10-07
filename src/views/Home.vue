<template>
  <q-page
      class="bg-green-3 window-height window-width justify-center items-center"
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
