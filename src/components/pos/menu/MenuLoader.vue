<template>
    <div class="skeleton-loader">
        <BaseLoading
          v-for="i in count"
          :key="i"
          class="loading-item"
        />
    </div>
</template>
<script>
import BaseLoading from '@/components/generics/BaseLoading.vue';

export default {
  name: 'MenuLoader',
  props: {
    count: {
      type: Number,
      required: false,
      default: () => 6,
    },
  },
  components: {
    BaseLoading,
  },
};
</script>
<style scoped lang="scss">
    .skeleton-loader {
      padding: 8px;
      width: 100%;
      grid-template-rows: repeat(6, 108px);
      display: grid;
      row-gap: 8px;
    }
</style>
