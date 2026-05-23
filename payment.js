function pay(){

 const uid=localStorage.getItem("uid");
 const gameId=localStorage.getItem("buyGame");

 db.ref("usersz8/"+uid).once("value").then(u=>{

   const user=u.val();

   db.ref("filesz8/"+gameId).once("value").then(g=>{

     const game=g.val();

     if(user.gamesOwned && user.gamesOwned[gameId]){
       alert("تم شراء ملف مسبقا");
       return;
     }

     if(user.balance < game.price){
       alert("رصيد غير كافي");
       return;
     }

     if(pin.value!=user.pin){
       alert("PIN خطأ");
       return;
     }

     db.ref("usersz8/"+uid).update({
       balance:user.balance-game.price
     });

     db.ref("usersz8/"+uid+"/gamesOwned/"+gameId)
     .set(true);

     db.ref("orders").push({
       user:uid,
       game:gameId,
       price:game.price,
       date:Date.now()
     });

     alert("تم الشراء ✅");

     location="library.html";
   });
 });
}