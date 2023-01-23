<template>
  <Datepicker
    :message="message"
    auto-apply
    format="MM-dd-yyy"
    v-model="date"
  />
</template>
<script>
import moment from 'moment'

export default {
  name: 'DatePickerBeta',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    date: ''
  }),
  watch: {
    date(date) {
      this.$emit('picked', moment(date).format('YY-MM-DD'))
    }
  },
  mounted() {
    // if (this.min) this.date = format(parseISO(new Date(this.min).toISOString()), 'yyyy-MM-dd');
    this.$emit('picked', this.date);
  }
}
</script>
<style scoped>
  .picker_field {
    max-height: 35px !important;
  }
</style>
