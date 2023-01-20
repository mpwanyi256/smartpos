<template>
    <div class="accomodation">
        <NavBar />
        <div class="accomodation_area">
            <div class="routes_area">
              <SalesNavBar
                  :title="selectedProperty? selectedProperty.name : 'Accomodation Quick Links'"
                  :links="links"
                />
                <router-view
                  v-if="properties.length"
                  :property="selectedProperty"
                />
            </div>
            <PropertiesList
              :properties="properties"
              @add="addProperty = true"
              @select="selectedProperty = $event"
              :selectedProperty="selectedProperty"
            />
        </div>
        <CreateProperty
          v-if="addProperty"
          @close="addProperty = false"
          @reload="fetchProperties"
        />
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import NavBar from '@/components/nav/Navbar.vue';
import PropertiesList from '@/components/accomodation/properties/PropertiesList.vue';
import CreateProperty from '@/components/accomodation/manage/CreateProperty.vue';
import SalesNavBar from '@/components/nav/SalesNavBar.vue';

export default {
  name: 'Accomodation',
  components: {
    NavBar,
    PropertiesList,
    CreateProperty,
    SalesNavBar,
  },
  data() {
    return {
      addProperty: false,
      links: [
        { name: 'Dashboard', icon: 'mdi-graph', path: 'accomodation_statistics' },
        { name: 'Calendar', icon: 'mdi-calendar', path: 'accomodation_dashboard' },
        { name: 'Properties', icon: 'mdi-home', path: 'accomodation_properties' },
      ],
    };
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('accomodation', ['properties', 'selectedProperty'])
  },
  created() {
    this.fetchProperties();
  },
  methods: {
    ...mapActions('accomodation', ['post', 'getProperties']),

    async fetchProperties() {
      if (!this.user) return;
      await this.getProperties();
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../styles/constants.scss';

.accomodation {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: $bg_color;
  font-size: 14px;
  font-family: $font-style !important;

  ::-webkit-scrollbar{
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: $scrollbar-color;
    border-radius: 1ex;
    -webkit-border-radius: 1ex;
  }

  ::-webkit-scrollbar-corner {
    background: #000;
  }

    .accomodation_area {
        width: 100vw;
        height: calc(100vh - 52px);
        margin: 0;
        background-color: $body-bg;
        display: flex;
        flex-direction: column;
        font-family: $font-style !important;
        overflow: hidden;

        .routes_area {
            display: flex;
            height: calc(100vh - 104px);
            display: grid;
            grid-template-columns: 25% 75%;
        }
    }
}

</style>
