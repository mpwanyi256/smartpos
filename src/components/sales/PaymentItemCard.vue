<template>
  <div class="payment">
    <h1>{{ payment.amount_display }}</h1>
    <span>{{ payment.name }}</span>
  </div>
</template>
<script>
export default {
  name: 'PaymentItemCard',
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss">
    .payment {
      display: flex;
      flex-direction: column;
      text-align: center;
      background-color: white;

      h1 {
        font-size: 2rem;
      }
    }
</style>
