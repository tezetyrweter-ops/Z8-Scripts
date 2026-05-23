// =======================
// تحقق من وجود Session
// =======================
const uid = localStorage.getItem("uid");
if(!uid){
  alert("يجب تسجيل الدخول أولاً");
  location="auth.html"; // تحويل لصفحة تسجيل الدخول
}

// =======================
// تعريف عناصر HTML
// =======================
const gid = document.getElementById("gid");
const name = document.getElementById("name");
const price = document.getElementById("price");
const size = document.getElementById("size");
const cover = document.getElementById("cover");
const desc = document.getElementById("desc");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const img3 = document.getElementById("img3");
const download = document.getElementById("download");
const fileName = document.getElementById("fileName");
const gamesList = document.getElementById("gamesList");
const stockQty = document.getElementById("stockQty");
const unlimitedStock = document.getElementById("unlimitedStock");

// =======================
// تبديل حقل الكمية
// =======================
function toggleStock(checkbox){
  stockQty.disabled = checkbox.checked;
  if(checkbox.checked){
    stockQty.value = "";
    stockQty.placeholder = "غير محدودة";
  } else {
    stockQty.placeholder = "الكمية (مثال: 10)";
  }
}

// =======================
// إضافة لعبة جديدة
// =======================
function addGame(){

  const id = gid.value.trim();
  if(!id){
    alert("ضع Game ID");
    return;
  }

  const selectedCategory = category.value; // نجيب الكاتيقوري

  // تحديد الكمية: -1 = غير محدودة، أي رقم آخر = كمية محدودة
  const isUnlimited = unlimitedStock.checked;
  const stock = isUnlimited ? -1 : Number(stockQty.value);

  db.ref("filesz8/"+id).set({
    id: id,
    name: name.value,
    price: Number(price.value),
    size: size.value,
    description: desc.value,
    coverImage: cover.value,

    category: selectedCategory,

    stock: stock, // -1 = غير محدودة

    images: {
      0: img1.value,
      1: img2.value,
      2: img3.value
    },

    downloadUrl: download.value || null,
    fileName: fileName.value || null,
    createdAt: Date.now()
  })
  .then(() => {
    alert("تمت إضافة ملف ✅");
    clearInputs();
    loadGames();
  })
  .catch(err => {
    console.error(err);
    alert("حدث خطأ أثناء إضافة ملف");
  });
}

// =======================
// مسح الحقول بعد الإضافة
// =======================
function clearInputs(){
  gid.value = "";
  name.value = "";
  price.value = "";
  size.value = "";
  cover.value = "";
  desc.value = "";
  img1.value = "";
  img2.value = "";
  img3.value = "";
  download.value = "";
  fileName.value = "";
  stockQty.value = "";
  stockQty.disabled = false;
  unlimitedStock.checked = false;
  stockQty.placeholder = "الكمية (مثال: 10)";
}

// =======================
// عرض كل ملفات
// =======================
function loadGames(){
  gamesList.innerHTML = "";

  db.ref("filesz8").once("value").then(snap => {
    snap.forEach(g => {
      const game = g.val();
      const card = document.createElement("div");
      card.className = "card";

      const stockDisplay = game.stock === -1 ? "غير محدودة ♾️" : (game.stock > 0 ? game.stock + " قطعة" : "<span style='color:#ff4d4d'>نفذت ❌</span>");

      card.innerHTML = `
        <img src="${game.coverImage}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p>السعر: ${game.price}$</p>
        <p>الحجم: ${game.size}</p>
        <p>الكمية: ${stockDisplay}</p>
        <p>ملف ملف: ${game.fileName || "لا يوجد"}</p>
        <button onclick="deleteGame('${g.key}')">🗑 حذف</button>
        <button onclick="editGame('${g.key}')">✏ تعديل</button>
      `;

      gamesList.appendChild(card);
    });
  });
}

// =======================
// حذف لعبة
// =======================
function deleteGame(id){
  if(!confirm("هل تريد حذف ملف؟")) return;

  db.ref("filesz8/"+id).remove()
  .then(() => {
    alert("تم الحذف ✅");
    loadGames();
  })
  .catch(err => {
    console.error(err);
    alert("حدث خطأ أثناء الحذف");
  });
}

// =======================
// تعديل لعبة
// =======================
function editGame(id){
  db.ref("filesz8/"+id).once("value").then(s => {
    const g = s.val();

    gid.value = id;
    name.value = g.name;
    price.value = g.price;
    size.value = g.size;
    desc.value = g.description;
    cover.value = g.coverImage;

    img1.value = g.images?.[0] || "";
    img2.value = g.images?.[1] || "";
    img3.value = g.images?.[2] || "";

    download.value = g.downloadUrl || "";
    fileName.value = g.fileName || "";

    // تحميل الكمية
    if(g.stock === -1 || g.stock === undefined){
      unlimitedStock.checked = true;
      stockQty.disabled = true;
      stockQty.value = "";
      stockQty.placeholder = "غير محدودة";
    } else {
      unlimitedStock.checked = false;
      stockQty.disabled = false;
      stockQty.value = g.stock;
    }
  });
}

// =======================
// تحميل ملفات عند فتح الصفحة
// =======================
window.addEventListener("load", loadGames);