import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBerVfLy960LY0vw0d0HYwVfQKK_gmtyVI",
  authDomain: "nakupni-seznam-e6d66.firebaseapp.com",
  databaseURL: "https://nakupni-seznam-e6d66-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nakupni-seznam-e6d66",
  storageBucket: "nakupni-seznam-e6d66.appspot.com",
  messagingSenderId: "49601954404",
  appId: "1:49601954404:web:1351599fea2f676f921571"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const listRef = ref(db, "nakup");



