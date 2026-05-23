const uid = localStorage.getItem("uid");
const library = document.getElementById("library");

if(!uid){
  alert("يجب تسجيل الدخول أولاً");
  location="auth.html";
}

db.ref("usersz8/"+uid+"/gamesOwned").once("value")
.then(snapshot => {
  library.innerHTML = "";

  snapshot.forEach(gSnap => {
    const gameId = gSnap.key;
    db.ref("filesz8/"+gameId).once("value").then(s => {
      const game = s.val();
      if(!game) return;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${game.coverImage || game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p>الحجم: ${game.size}</p>
        <p>السعر: ${game.price}$</p>
        <p>تاريخ الشراء: ${new Date(gSnap.val().purchasedAt).toLocaleDateString()}</p>
      `;

      // زر تحميل مباشر من مجلد مشروعك
      const downloadBtn = document.createElement("a");
      downloadBtn.textContent = "تحميل الملف";
      downloadBtn.style.cssText = "margin-top:10px;padding:8px 12px;background:#2e7bff;color:white;border-radius:6px;text-decoration:none;";
      downloadBtn.href = `Games/${game.fileName}`; // <-- هنا اسم الملف في المشروع
      downloadBtn.setAttribute("download", game.fileName);

      card.appendChild(downloadBtn);
      library.appendChild(card);
    });
  });
});