
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider , signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvkb7dD5N16d493xN6dS5Jp_oWxTNYuts",
    authDomain: "aninight-oauth.firebaseapp.com",
    projectId: "aninight-oauth",
    storageBucket: "aninight-oauth.appspot.com",
    messagingSenderId: "853895524014",
    appId: "1:853895524014:web:33dccc134f916075e2473f",
    measurementId: "G-4453RRS5ZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const Googlelogin_btn = document.getElementById("googlelogin_btn");
Googlelogin_btn.addEventListener('click', ()=> {
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
     
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };

      const usersesstion = req.session.userlogin; // อ่านค่า session ไว้ก่อนที่จะทำการส่งข้อมูลผู้ใช้

      // ส่งข้อมูลผู้ใช้ไปยังเซิร์ฟเวอร์
      fetch('/api/googlelogin/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save user');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        window.location.href = `/${usersesstion.url}?tokenlogin=${usersesstion.accessToken}&alertMessage=เข้าสู่ระบบสำเร็จ`
      })
      .catch(error => {
        console.error('Error:', error);
        // ทำตามที่ต้องการเมื่อเกิดข้อผิดพลาด
      });
      console.log(userData)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
})