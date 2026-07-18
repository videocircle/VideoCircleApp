import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
query,
where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmsMiA6z6noYBkVCRxcXqH1s5atnfXEVQ",
  authDomain: "video-circle-52af7.firebaseapp.com",
  projectId: "video-circle-52af7",
  storageBucket: "video-circle-52af7.firebasestorage.app",
  messagingSenderId: "433167331683",
  appId: "1:433167331683:web:342dff0c3bf1de8a606356"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let searchRequestId = 0;
window.searchUsers = async function(){
const currentRequest = ++searchRequestId;
const searchText =
document.getElementById("searchInput")
.value
.toLowerCase();

const results =
document.getElementById("results");

results.innerHTML = "";

if(searchText === "") return;

const usersSnap =
await getDocs(collection(db,"users"));
if(currentRequest !== searchRequestId){
   return;
}
const renderedUsers = {};
for (const userDoc of usersSnap.docs) {

const data = userDoc.data();

if(
(data.channelName || "")
.toLowerCase()
.includes(searchText)
){
if(renderedUsers[data.channelName]){
   continue;
}

renderedUsers[data.channelName] = true;

const followersQuery =
query(
collection(db,"followers"),
where("following","==",data.channelName)
);

const followersSnap =
await getDocs(followersQuery);

let videoCount = 0;

const videosSnap =
await getDocs(collection(db,"videos"));

videosSnap.forEach((videoDoc)=>{

const videoData =
videoDoc.data();

if(
videoData.channelName ===
data.channelName
){
videoCount++;
}

});
results.innerHTML += `
<div class="user-card"
onclick="openProfile('${data.channelName}')">

<img src="${
data.profilePic ||
'https://via.placeholder.com/100'
}">

<div>

<b>${data.channelName}</b>

<br>

${data.fullName || ""}

<br>

${followersSnap.size} Followers •
${videoCount} Videos

</div>

</div>
`;

}

}

}

window.openProfile = function(channel){

localStorage.setItem(
"viewProfile",
channel
);

window.location.href =
"userprofile.html";

}