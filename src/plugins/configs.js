import firebase from "firebase";

exports.initializeFireBase =  () => {
    firebase.initializeApp({
        apiKey: process.env.VUE_APP_FB_API_KEY,
        authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
        databaseURL: process.env.VUE_APP_FB_DB_URL,
        projectId: process.env.VUE_APP_FB_PROJECT_ID,
        storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
        messagingSenderId: process.env.VUE_APP_FB_MESSAGESENDER_ID,
        appId: process.env.VUE_APP_FB_APP_ID,
        measurementId: process.env.VUE_APP_FB_MEASUREMENT_ID,
      });
    firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    });
    firebase.analytics();
    firebase.firestore().enablePersistence();
}