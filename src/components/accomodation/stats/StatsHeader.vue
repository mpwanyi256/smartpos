<template>
  <div class="stats_header">
      <StatsCard
        v-for="i in stats"
        :key="`stats-head-${i.value} + ${randomNum()}`"
        :stat="i"
      />
  </div>
</template>
<script>
import StatsCard from '@/components/accomodation/stats/StatsCard.vue';

export default {
  name: 'StatsHeader',
  props: {
    stats: {
      type: Array,
      required: true,
    },
  },
  components: {
    StatsCard,
  },
  methods: {
    randomNum() {
      return Math.random();
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

    .stats_header {
        display: flex;
        // grid-template-columns: 25% 25% 25% 25%;
        gap: 10px;
        width: 100%;
        height: 114px;
        background-color: inherit;

        > div {
          width: 100%;
        }
    }
</style>
