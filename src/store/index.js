import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import sales from './sales';
import accounts from './accounts';
import menu from './menu';
import inventory from './inventory';
import pos from './pos';
import reports from './reports';
import settings from './settings';
import accomodation from './accomodation';
import mail from './email';
import print from './print';
import manage from './manage';
import kds from './kds';
import estates from './estates';
import backups from './backups';
import pdf from './pdf';
import network from './network';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    sales,
    accounts,
    menu,
    inventory,
    pos,
    reports,
    settings,
    accomodation,
    mail,
    print,
    manage,
    kds,
    estates,
    backups,
    pdf,
    network,
  },
});
