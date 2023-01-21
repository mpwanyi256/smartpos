import mitt from 'mitt'
import { mapGetters } from 'vuex'

const emitter = mitt()
const { on, emit, off } = emitter;
Object.assign(emitter, { $on: on, $emit: emit, $off: off })

export default (App) => {
  App.config.globalProperties.$eventBus = emitter

  App.mixin({
    computed: {
      ...mapGetters('auth', ['user'])
    },
    watch: {
      user: {
        handler(loggedInUser) {
          const currentRoute = this.$route.name
          if (loggedInUser && loggedInUser.company_id) {
            const DAYS_LEFT = loggedInUser.company_info?.days_left;
            // Check route
            if (currentRoute === 'login' && DAYS_LEFT >= 1) {
              this.$router.replace({ name: 'pos' });
            } else if (currentRoute !== 'login' && DAYS_LEFT < 1) {
              this.$router.replace({ name: 'login' });
            }
          } else if (!loggedInUser && !['setup', 'login'].includes(currentRoute)) {
            this.$router.replace({ name: 'login' });
          }
        },
        immediate: true
      }
    },
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
