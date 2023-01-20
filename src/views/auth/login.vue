 <template>
    <div class="main-login">
      <SmartPos />
        <p class="prodev_info">
          <span>
            <v-avatar size="26">
              <img
                src="@/assets/logo.png"
                alt="prodev"
              >
            </v-avatar>
          </span>
          <a href="http://prodevgroup.22web.org/?i=2" target="__blank">
            Smart POS V-{{posVersion}}
          </a>
          | Copyrite {{ new Date().getFullYear() }}
        </p>
    </div>
</template>
<script>
import SmartPos from '@/views/auth/SmartPos.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'LoginForm',
  components: {
    SmartPos,
  },
  computed: {
    ...mapGetters('auth', ['posVersion']),
  },

};
</script>
<style scoped lang="scss">
@import '../../styles/constants.scss';

.main-login {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .prodev_info {
    text-align: center;
    color: $black;
    font-weight: bold;

    a {
      text-decoration: none;
      color: inherit;
    }
  }
}
</style>
