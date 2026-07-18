import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";
// ======================================
// Authentication Module
// ======================================

// signup()
// login()
// logout()
// checkSession()

export function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "index.html";

}
export async function signup() {

  const fullName = document.getElementById("fullname").value;
  const channelName = document.getElementById("channelname").value;

  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  const gender = document.getElementById("gender").value;
  const mobile = document.getElementById("mobile").value;

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
if (mobile.length !== 10) {
  alert("Enter valid 10 digit mobile number");
  return;
}
  if (
  fullName === "" ||
  channelName === "" ||
  day === "" ||
  month === "" ||
  year === "" ||
  gender === "" ||
  mobile === "" ||
  email === "" ||
  password === ""
) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const dob = `${day}/${month}/${year}`;
// ===============================
// Registration Permission Check
// ===============================

const settingsSnap = await getDoc(
    doc(db, "settings", "app")
);

if (settingsSnap.exists()) {

    const settings = settingsSnap.data();

    if (settings.registration === false) {

        alert("🚫 New registrations are currently disabled by the administrator.");

        return;

    }

}
  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      channelName: channelName,
      
      channelNameLower:
channelName.trim().toLowerCase(),
      
      dob: dob,
      gender: gender,
      mobile: mobile,
      email: email,
      createdAt: Date.now(),
      followers: 0,
      following: 0
    });

    alert("Account Created Successfully");

    window.location.href = "index.html";

  } catch (error) {
    alert(error.message);
  }

}
export async function login() {
const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try{

    const userCredential =
    await signInWithEmailAndPassword(auth,email,password);

    const user = userCredential.user;

    const userDoc =
    await getDoc(doc(db,"users",user.uid));

    if(userDoc.exists()){

      const data = userDoc.data();

      localStorage.setItem("loggedIn","true");
  
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("channelName",data.channelName);
      localStorage.setItem("fullName",data.fullName);

    }

    window.location.href="home.html";

  }catch(error){

    alert(error.message);

  }
}