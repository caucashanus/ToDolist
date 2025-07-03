import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
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
        // 🖼️ Pokud má položka obrázek, zobraz ho
if (item.imageUrl) {
  const img = document.createElement("img");
  img.src = item.imageUrl;
  img.alt = "Příloha";
  img.style.maxWidth = "100px";
  img.style.maxHeight = "100px";
  img.style.borderRadius = "8px";
  img.style.marginTop = "8px";
  img.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
  
  li.appendChild(img);
}
    
    // 📷 Vytvoření inputu pro výběr souboru
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.marginLeft = "10px";

// 📁 Při výběru souboru nahraj do Firebase Storage
fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const storage = getStorage();
  const storagePath = "images/" + key + ".jpg";
  const fileRef = storageRef(storage, storagePath);

  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);

  // 💾 Uložíme URL obrázku do položky v databázi
  set(ref(db, "nakup/" + key), {
    ...item,
    imageUrl: downloadURL
  });

  console.log("✅ Obrázek nahrán:", downloadURL);
};

li.appendChild(fileInput);

    if (item.checked && item.checkedAt) {
  const countdownSpan = document.createElement("span");
  countdownSpan.style.marginLeft = "10px";
  countdownSpan.style.fontSize = "0.9em";
  countdownSpan.style.color = "#ccc";

  const updateCountdown = () => {
    const now = Date.now();
    const timeLeft = item.checkedAt + 7200000 - now; // 2 hodiny odpoctu

    if (timeLeft <= 0) {
      // čas vypršel – smažeme položku
      set(ref(db, "nakup/" + key), null);
    } else {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      countdownSpan.textContent = `⏳ ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
  };

  updateCountdown(); // první výpočet hned
  setInterval(updateCountdown, 60000); // pak každou minutu

  label.appendChild(countdownSpan);
}

    checkbox.onchange = () => {
  const updatedItem = {
    text: item.text,
    checked: checkbox.checked
  };

  if (checkbox.checked) {
    updatedItem.checkedAt = Date.now(); // ⏱️ uložíme čas
  }

  set(ref(db, "nakup/" + key), updatedItem);
};

    li.appendChild(checkbox);
    li.appendChild(label);
    itemList.appendChild(li);
  });
});
