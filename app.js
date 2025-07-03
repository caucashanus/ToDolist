import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBerVfLy960LY0vw0d0HYwVfQKK_gmtyVI",
  authDomain: "nakupni-seznam-e6d66.firebaseapp.com",
  databaseURL: "https://nakupni-seznam-e6d66-default-rtdb.firebaseio.com",
  projectId: "nakupni-seznam-e6d66",
  storageBucket: "nakupni-seznam-e6d66.appspot.com",
  messagingSenderId: "49601954404",
  appId: "1:49601954404:web:1351599fea2f676f921571"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const listRef = ref(db, "nakup");

const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");

console.log("✅ app.js spuštěn");

// Přidávání nové položky
addBtn.onclick = () => {
  console.log("Klik na přidat!");
  const text = itemInput.value.trim();
  if (text) {
    push(listRef, { text: text, checked: false });
    itemInput.value = "";
  }
};

// Posluchač změn v databázi
onValue(listRef, (snapshot) => {
  const data = snapshot.val();
  console.log("📦 Data z Firebase:", data);

  itemList.innerHTML = "";

  if (!data) {
    itemList.innerHTML = "<li>Žádné položky</li>";
    return;
  }

  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    const key = childSnapshot.key;

    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;

    label.className = item.checked ? "checked" : "";
    label.textContent = item.text;

    checkbox.onchange = () => {
      set(ref(db, "nakup/" + key), {
        text: item.text,
        checked: checkbox.checked
      });
    };

    li.appendChild(checkbox);
    li.appendChild(label);
    itemList.appendChild(li);
  });
});
