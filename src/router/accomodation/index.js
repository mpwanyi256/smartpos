export default {
  path: '/Accomodation',
  name: 'accomodation',
  meta: {
    authrequired: false,
    title: 'SmartPOS :: Dashboard',
  },
  component: () => import('@/views/Accomodation/Home.vue'),
  children: [
    {
      name: 'accomodation_dashboard',
      path: 'accomodation_dashboard',
      meta: {
        authrequired: false,
        title: 'SmartPOS | Bookings',
      },
      component: () => import('@/views/Accomodation/Dashboard.vue'),
    },
    {
      name: 'accomodation_statistics',
      path: 'accomodation_statistics',
      meta: {
        authrequired: false,
        title: 'SmartPOS | Statistics',
      },
      component: () => import('@/views/Accomodation/Stats.vue'),
    },
    {
      name: 'accomodation_properties',
      path: 'accomodation_properties',
      meta: {
        authrequired: false,
        title: 'SmartPOS | Properties',
      },
      component: () => import('@/views/Accomodation/Properties.vue'),
    },
  ],
};
