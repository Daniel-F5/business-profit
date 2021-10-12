<template>
<q-page
class="page">
<div>
    <q-img
    :src='this.userPhoto'
    class="rounded-borders"
    style="height: 40px; max-width: 40px">
    </q-img>
    <p>{{userName}}</p>
</div>
</q-page>

</template>

<script>
export default {
    data() {
        return {
            userPhoto: window.user.photoURL,
            userName: window.user.displayName
        }
    },
}
</script>

<style lang="sass">
.page
  background-color:#B8D2F2

</style>