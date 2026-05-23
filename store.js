const gamesDiv = document.getElementById("games");
const uid = localStorage.getItem("uid");

db.ref("filesz8").on("value", snap => {
  gamesDiv.innerHTML = "";

  snap.forEach(g => {
    const game = g.val();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${game.coverImage}" alt="${game.name}">
      <div class="card-body">
        <h3>${game.name}</h3>
        <p>السعر: ${game.price}$</p>
        <p>الحجم: ${game.size}</p>
        <button onclick="openGame('${g.key}')">عرض ملف</button>
      </div>
    `;

    gamesDiv.appendChild(card);
  });
});

function openGame(id){
  if(!uid){
    alert("يجب تسجيل الدخول أولاً");
    location="auth.html";
    return;
  }
  location="game.html?id="+id;
}