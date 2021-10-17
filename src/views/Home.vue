<template>
  <q-page
  class="page"
  >
  <div class="home">
    <AddPkoda :tableName="'pkodot'"/>
    <TableViewer :tableName="'pkodot'"/>
  </div>
  </q-page>
</template>

<script>
// @ is an alias to /src
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
import TableViewer from '../components/TableViewer';
import AddPkoda from '../components/AddPkoda';

export default {
  name: 'Home',
  components: {
    TableViewer, AddPkoda
  },
  data(){
    return {
      // isReload: false
    }
  },
  methods: {
    ...mapMutations('pkodot', ['resetEditedPkoda', 'resetEditedPkodaId', 'resetPath'])
    // reloadTable(){
    //   this.isReload = !this.isReload;
    // }
  },
  created() {
    this.resetEditedPkoda();
    this.resetEditedPkodaId();
    this.resetPath();
  }
}
</script>
<style lang="sass">

</style>
