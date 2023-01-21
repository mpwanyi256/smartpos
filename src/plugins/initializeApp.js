import firebase from 'firebase'

// Indexed Database
import idb from '../utilities/idb'
import store from '../store'
import router from '../router'

export default async () => {
    // initialize Indexed Database
    await idb.init().catch((e) => { console.error(e); });

    // Check Auth
    const isOnline = window.navigator.onLine;
    const LoggedInUser = localStorage.getItem('smart_user_id');
    if (LoggedInUser) {
        await store.dispatch('auth/getUserById');

        // Get Licenses
        if (isOnline) {
        const compEmail = localStorage.getItem('smart_company_email');
        await store.dispatch('auth/getFirebaseInfo');
        if (isOnline) {
            firebase
            .firestore()
            .collection('licenses')
            .onSnapshot(async (doc) => {
                const allLicenses = doc;
                if (compEmail) await store.dispatch('auth/getActiveLicense', compEmail);
                if (compEmail === process.env.VUE_APP_ADMIN_EMAIL) { await store.dispatch('manage/fetchClientLicenses', allLicenses); }
            });
        }
        }
    } else {
        const { name } = router.currentRoute;
        // Send user back to login page if not logged in
        if (name !== 'login') router.replace({ name: 'login' });
    }
}
