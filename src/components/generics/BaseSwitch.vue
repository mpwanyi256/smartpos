<template>
    <v-switch
      @input="toggle"
      :value="data"
      :color="status ? color ? color : 'green' : 'primary'"
      :disabled="disabled"
      :label="label"
      hide-details
      inset
    />
</template>
<script>
export default {
  name: 'BaseSwitch',
  props: {
    status: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    color: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
      default: () => '',
    },
  },
  data() {
    return {
      data: false,
    };
  },
  methods: {
    toggle(val) {
      // const updatedVal = val.target._value
      // this.data = !this.data
      // console.log('data', this.data)
      this.$emit('toggle', !this.data);
    }
  },
  mounted() {
    this.data = this.status;
  },
};
</script>
