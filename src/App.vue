<template>
  <div>
    <v-card
    class="mx-auto"
    width="400"
    prepend-icon="mdi-home"
  >
    <template v-slot:title>
      This is a title
    </template>

    <v-card-text>
      This is content
      <v-btn lg @click="triggerEmit">Trigger Emit</v-btn>
    </v-card-text>
  </v-card>
  </div>
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
