// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAnalytics
} from "firebase/analytics";
import {
    getStorage
} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCggW1LXCyomX3L9kvB0zdVPaENxn3LjeQ",
    authDomain: "save-sign-docs.firebaseapp.com",
    projectId: "save-sign-docs",
    storageBucket: "save-sign-docs.appspot.com",
    messagingSenderId: "834142425819",
    appId: "1:834142425819:web:a6570d84b615da657df2fe",
    measurementId: "G-SGV5JGH69W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)


module.exports.storage = storage