<template>
  <v-app>
    <router-view></router-view>
    </v-app>
</template>
<script>

export default {
  name: 'App',
  methods: {
    triggerEmit() {
      this.$eventBus.$emit('started--app', new Date())
    },
    listenToCB(data) {
      console.log('Triggered started app event', data)
    }
  },
  eventBusCallbacks: {
    'started--app': 'listenToCB'
  }
}
</script>
<style>
</style>
