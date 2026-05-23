function createSession(uid){

 const sid="sess_"+Date.now();

 db.ref("sessions/"+sid).set({
   uid:uid,
   expire:Date.now()+86400000
 });

 localStorage.setItem("session",sid);
}

function checkSession(){

 const sid=localStorage.getItem("session");
 if(!sid) location="auth.html";

 db.ref("sessions/"+sid).once("value").then(s=>{

   if(!s.exists() || Date.now()>s.val().expire){
      localStorage.clear();
      location="auth.html";
   }

   localStorage.setItem("uid",s.val().uid);
 });
}