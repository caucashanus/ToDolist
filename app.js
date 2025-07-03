
// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Tvoje Firebase config (zatím dummy - nahradíme vlastním)
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const listRef = ref(db, "nakup");

// UI
const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");

// Přidání nové položky
addBtn.onclick = () => {
  const text = itemInput.value.trim();
  if (text) {
    push(listRef, { text: text, checked: false });
    itemInput.value = "";
  }
};

// Aktualizace seznamu v reálném čase
onValue(listRef, (snapshot) => {
  itemList.innerHTML = "";
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
