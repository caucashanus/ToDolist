import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 🔧 Firebase konfigurace
const firebaseConfig = {
  apiKey: "AIzaSyBerVfLy960LY0vw0d0HYwVfQKK_gmtyVI",
  authDomain: "nakupni-seznam-e6d66.firebaseapp.com",
  databaseURL: "https://nakupni-seznam-e6d66-default-rtdb.firebaseio.com",
  projectId: "nakupni-seznam-e6d66",
  storageBucket: "nakupni-seznam-e6d66.appspot.com",
  messagingSenderId: "49601954404",
  appId: "1:49601954404:web:1351599fea2f676f921571"
};

// 🚀 Inicializace Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const listRef = ref(db, "nakup");

// 🔘 Elementy DOM
const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");

console.log("✅ app.js spuštěn");

// ➕ Přidávání nové položky
addBtn.onclick = () => {
  const text = itemInput.value.trim();
  if (text) {
    push(listRef, { text, checked: false });
    itemInput.value = "";
  }
};

// 🔁 Načítání seznamu
onValue(listRef, (snapshot) => {
  itemList.innerHTML = "";
  const data = snapshot.val();

  if (!data) {
    itemList.innerHTML = "<li>Žádné položky</li>";
    return;
  }

  Object.entries(data).forEach(([key, item]) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;

    const label = document.createElement("label");
    label.textContent = item.text;
    if (item.checked) label.classList.add("checked");

    checkbox.onchange = () => {
      const updatedItem = {
        text: item.text,
        checked: checkbox.checked,
        imageUrl: item.imageUrl || null,
      };
      if (checkbox.checked) {
        updatedItem.checkedAt = Date.now();
      }
      set(ref(db, "nakup/" + key), updatedItem);
    };

    // 📷 Input pro obrázek
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.marginLeft = "10px";

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const fileRef = storageRef(storage, `images/${key}.jpg`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      set(ref(db, "nakup/" + key), {
        ...item,
        imageUrl: downloadURL
      });
    };

    // 🖼️ Zobrazení obrázku
    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = "Příloha";
      img.style.maxWidth = "100px";
      img.style.maxHeight = "100px";
      img.style.marginTop = "10px";
      img.style.borderRadius = "8px";
      img.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
      li.appendChild(img);
    }

    // ⏳ Odpočet
    if (item.checked && item.checkedAt) {
      const countdown = document.createElement("span");
      countdown.style.marginLeft = "10px";
      countdown.style.fontSize = "0.9em";
      countdown.style.color = "#ccc";

      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = item.checkedAt + 2 * 60 * 60 * 1000 - now;
        if (timeLeft <= 0) {
          set(ref(db, "nakup/" + key), null);
        } else {
          const h = Math.floor(timeLeft / 3600000);
          const m = Math.floor((timeLeft % 3600000) / 60000);
          countdown.textContent = `⏳ ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        }
      };

      updateCountdown();
      setInterval(updateCountdown, 60000);
      label.appendChild(countdown);
    }

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(fileInput);
    itemList.appendChild(li);
  });
});

