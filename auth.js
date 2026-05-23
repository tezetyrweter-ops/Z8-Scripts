let mode = "login";

// عناصر الصفحة
const title = document.getElementById("title");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

function switchMode(){
  mode = mode === "login" ? "register" : "login";

  title.innerText =
    mode === "login" ? "تسجيل الدخول" : "إنشاء حساب";

  email.style.display =
    mode === "register" ? "block" : "none";
}

function mainAction(){
  if(mode === "login"){
    login();
  }else{
    register();
  }
}

//////////////////////////////////////////////////
// ✅ إنشاء حساب
//////////////////////////////////////////////////
function register(){

  if(!username.value || !password.value || !email.value){
    alert("املأ جميع الخانات");
    return;
  }

  const uid = "uid_" + Date.now();

  const userData = {
    username: username.value,
    password: password.value,
    email: email.value,
    balance: 100,
    cardNumber: generateCard(),
    cvv: Math.floor(100 + Math.random()*900),
    pin: "0000",
    gamesOwned: {}
  };

  // إنشاء داخل usersz8
  db.ref("usersz8/" + uid)
    .set(userData)
    .then(()=>{

      console.log("✅ تم إنشاء الحساب");

      localStorage.setItem("uid", uid);

      alert("تم إنشاء الحساب بنجاح");

      window.location.href = "index.html";
    })
    .catch(err=>{
      console.error(err);
      alert("خطأ في إنشاء الحساب");
    });
}

//////////////////////////////////////////////////
// ✅ تسجيل الدخول
//////////////////////////////////////////////////
function login(){

  db.ref("usersz8").once("value")
  .then(snapshot=>{

    let found = false;

    snapshot.forEach(user=>{

      const data = user.val();

      if(
        data.username === username.value &&
        data.password === password.value
      ){
        found = true;

        localStorage.setItem("uid", user.key);

        window.location.href = "index.html";
      }
    });

    if(!found){
      alert("اسم المستخدم أو كلمة السر خطأ");
    }

  });
}

//////////////////////////////////////////////////
// بطاقة عشوائية
//////////////////////////////////////////////////
function generateCard(){
  return "4000-" +
    rand4() + "-" +
    rand4() + "-" +
    rand4();
}

function rand4(){
  return Math.floor(1000 + Math.random()*9000);
}

//////////////////////////////////////////////////
function forgotPassword(){
  alert("الميزة قيد التطوير");
}