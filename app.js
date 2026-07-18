import { logout, signup, login } from "./auth.js";
import { loadProfile } from "./profile.js";
window.logout = logout;
window.signup = signup;
window.login = login;
window.loadProfile = loadProfile;
loadProfile();
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  where
}from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// ======================================
// Firebase Services
// ======================================
import { db, auth } from "./firebase.js";
// ======================================
// App Configuration
// ======================================
import {
  CLOUD_NAME,
  UPLOAD_PRESET
} from "./config.js";

// ======================================
// Posts (Legacy)
// ======================================
window.createPost = function () {
  alert("Video Upload Coming Soon 🚀");
};
window.addPost = async function () {

  const text = document.getElementById("postText").value;

  if (text === "") {
    alert("Write something first");
    return;
  }

  await addDoc(collection(db, "posts"), {
    text: text,
    time: Date.now()
  });

  alert("Post Added");

  document.getElementById("postText").value = "";

  loadPosts();
};
async function loadPosts() {

  const feed = document.getElementById("feed");

  feed.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "posts"));

  querySnapshot.forEach((doc) => {

    feed.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px;">
        ${doc.data().text}
      </div>
    `;

  });
}
window.onload = function () {

  const home = document.getElementById("home");

  if (
    localStorage.getItem("loggedIn") === "true"
    && home
  ) {

    home.style.display = "block";

    loadPosts();

  }

};
// ======================================
// Session
// ======================================

// Day Fill
if(document.getElementById("day")){
  for(let i=1; i<=31; i++){
    document.getElementById("day").innerHTML +=
    `<option value="${i}">${i}</option>`;
  }
}

// Year Fill
if(document.getElementById("year")){

  const currentYear = new Date().getFullYear();

  for(let i=currentYear; i>=1950; i--){

    document.getElementById("year").innerHTML +=
    `<option value="${i}">${i}</option>`;

  }

}
window.checkLogin = function(){
  alert(localStorage.getItem("loggedIn"));
}

// ======================================
// Profile Image
// ======================================
window.uploadProfileImage = async function(){

const file =
document.getElementById("profileImageInput").files[0];

if(!file){
return;
}

const formData = new FormData();

formData.append("file", file);

formData.append(
"upload_preset",
UPLOAD_PRESET
);

const res = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
{
method:"POST",
body:formData
}
);

const data = await res.json();
const user = auth.currentUser;

await updateDoc(
doc(db,"users",user.uid),
{
profilePic:data.secure_url
}
);
alert("Photo Uploaded");

console.log(data.secure_url);

};
// ======================================
// Video Navigation
// ======================================
window.openMyVideo = function(videoUrl, videoId){

localStorage.setItem(
"selectedVideo",
videoUrl
);

localStorage.setItem(
"selectedVideoId",
videoId
);

window.location.href =
"watch.html";

};