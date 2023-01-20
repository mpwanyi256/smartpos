<template>
    <v-menu ref="menu" v-model="menu"
        :close-on-content-click="false" :nudge-right="40" :return-value.sync="time"
        transition="scale-transition"
        prepend-icon="mdi-clock-time-four-outline"
        offset-y max-width="290px" min-width="290px">
        <template v-slot:activator="{ on, attrs }">
        <v-text-field v-model="timeSelected"
          :label="label || 'Time'"
          dense outlined
          readonly v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-time-picker v-if="menu" format="24hr" v-model="timeSelected" full-width
        @click:minute="$refs.menu.save(time)" :min="min">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.menu.save(time)">OK</v-btn>
        </v-time-picker>
    </v-menu>
</template>

<script>
export default {
  name: 'TimePicker',
  props: {
    label: {
      type: String,
      default: () => '',
      required: false,
    },
    min: {
      type: String,
      default: () => '',
      required: false,
    },
  },
  data() {
    return {
      time: null,
      menu: false,
      timeSelected: null,
    };
  },

  watch: {
    timeSelected(newVal) {
      this.saveTime(newVal);
    },
  },

  created() {
    if (this.min.trim()) {
      this.timeSelected = this.min;
    }
  },

  methods: {
    saveTime() {
      this.$emit('time', this.timeSelected);
    },
  },
};
</script>
