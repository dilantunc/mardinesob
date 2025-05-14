// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIpJxtTxj1KtU4awaAYZ4so3P-lFh_i-g",
  authDomain: "mardinesob-f9126.firebaseapp.com",
  projectId: "mardinesob-f9126",
  storageBucket: "mardinesob-f9126.firebasestorage.app",
  messagingSenderId: "999376861642",
  appId: "1:999376861642:web:47a408105f10d91281b733",
  measurementId: "G-MRYEZYBSWC",
};
// Firebase Client uygulamasını başlatın
const app = initializeApp(firebaseConfig);

// Firestore veritabanı servisine erişin (Client tarafı Firestore)
const db = getFirestore(app); // Firestore instance'ı bu şekilde elde edilir


// db referansını süslü parantez içinde dışa aktarın ki diğer dosyalar alabilsin
export { db };

