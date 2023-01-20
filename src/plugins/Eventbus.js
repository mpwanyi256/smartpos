import mitt from 'mitt'

const emitter = mitt()
const { on, emit, off } = emitter;
Object.assign(emitter, { $on: on, $emit: emit, $off: off })

export default (App) => {
  App.config.globalProperties.$eventBus = emitter

  App.mixin({
    created() {
      const callbacks = this.$options.eventBusCallbacks;
      let key;
      for (key in callbacks) {
        emitter.$on(key, this[callbacks[key]]);
      }
    },
    destroyed() {
      const callbacks = this.$options.eventBusCallbacks;
      let key;
      for (key in callbacks) {
        emitter.$off(key, this[callbacks[key]]);
      }
    }
  })
}
