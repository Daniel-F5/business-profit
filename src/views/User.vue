<template>
<q-page
class="page">
<div>
    <q-img :src='this.userPhoto' class="userImg"/>
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

</style>