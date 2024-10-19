//
//  app.js
//  bar-inventory-app-local
//
//  Created by Patrick Wills on 10/19/24.
//

// IndexedDB setup
let db;
const request = indexedDB.open("BarInventory", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadInventoryItems();
};

request.onerror = (event) => {
  console.error("Database error:", event.target.errorCode);
};

// Add Inventory Item
document.getElementById("addItemForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const type = document.getElementById("type").value;
  const quantity = document.getElementById("quantity").value;

  const transaction = db.transaction(["items"], "readwrite");
  const objectStore = transaction.objectStore("items");

  const newItem = {
    name,
    type,
    quantity: parseInt(quantity),
  };

  const request = objectStore.add(newItem);

  request.onsuccess = () => {
    document.getElementById("addItemForm").reset();
    document.getElementById("addItemModal").style.display = "none";
    loadInventoryItems();
  };
});

// Load inventory items from IndexedDB
function loadInventoryItems() {
  const transaction = db.transaction(["items"], "readonly");
  const objectStore = transaction.objectStore("items");

  const itemsList = document.getElementById("inventory-items");
  itemsList.innerHTML = '';

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${cursor.value.name} (${cursor.value.type}): ${cursor.value.quantity}`;
      itemsList.appendChild(listItem);
      cursor.continue();
    }
  };
}

// Modal Handling
document.getElementById("add-item-btn").addEventListener("click", () => {
  document.getElementById("addItemModal").style.display = "flex";
});

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("addItemModal").style.display = "none";
});
