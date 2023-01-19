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
    </v-card-text>
  </v-card>
  </div>
</template>
<script>

export default {
  name: 'App',
  components: {
  }
}
</script>
<style>
</style>
