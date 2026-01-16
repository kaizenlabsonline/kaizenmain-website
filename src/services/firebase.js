import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD2Qk-wxnCVmi3YsJ0XvCJWY-fQSP1nRoA",
    authDomain: "kaizenlabsofficeapps.firebaseapp.com",
    projectId: "kaizenlabsofficeapps",
    storageBucket: "kaizenlabsofficeapps.firebasestorage.app",
    messagingSenderId: "883199764828",
    appId: "1:883199764828:web:3a81209810f0a47840f999",
    measurementId: "G-T3868DR0N0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
