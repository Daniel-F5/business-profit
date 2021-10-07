<template>
<div>
  My test page
  {{doneTodosCount}}
</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
export default {
  name: "Test",
  computed: {
    doneTodosCount () {
      console.log(this.$store.state)
      const sum =  this.$store.state.pkodot.todos.reduce((pre, currentVal) => pre + currentVal.price, 0);
      console.log(JSON.stringify(sum))
      return sum
    }
  }
}
</script>

<style scoped>

</style>