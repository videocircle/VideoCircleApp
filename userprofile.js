import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
query,
where,
addDoc,
deleteDoc,
doc,
limit
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

const channel =
localStorage.getItem("viewProfile");
const myChannel =
localStorage.getItem("channelName");
loadProfile();

async function loadProfile(){

const usersSnap =
await getDocs(collection(db,"users"));

usersSnap.forEach((doc)=>{

const data = doc.data();

if(data.channelName === channel){

document.getElementById("channelName").innerText =
data.channelName;

document.getElementById("fullName").innerText =
data.fullName;

if(data.profilePic){

document.getElementById("profilePic").src =
data.profilePic;

}

}

});

const followersQuery =
query(
collection(db,"followers"),
where("following","==",channel)
);

const followersSnap =
await getDocs(followersQuery);

document.getElementById("followersCount").innerText =
followersSnap.size;
const followCheck =
query(
collection(db,"followers"),
where("follower","==",myChannel),
where("following","==",channel)
);

const followSnap =
await getDocs(followCheck);

if(!followSnap.empty){

document.getElementById("followBtn")
.innerText =
"Following";
const followersCount =
document.getElementById("followersCount");

followersCount.innerText =
parseInt(followersCount.innerText) + 1;
}
const followingQuery =
query(
collection(db,"followers"),
where("follower","==",channel)
);

const followingSnap =
await getDocs(followingQuery);

document.getElementById("followingCount").innerText =
followingSnap.size;

const videosSnap =
await getDocs(collection(db,"videos"));

let totalVideos = 0;

const userVideos =
document.getElementById("userVideos");

videosSnap.forEach((videoDoc)=>{

const videoData =
videoDoc.data();

if(videoData.channelName === channel){

    totalVideos++;

    const thumb =
    videoData.thumbnailUrl ||
    `https://res.cloudinary.com/duerkkpjf/video/upload/so_1/${videoData.publicId}.jpg`;

    userVideos.innerHTML += `

    <div class="video-card"
    onclick="window.location.href='watch.html?id=${videoDoc.id}'">

        <div class="video-thumb">

            <img
            src="${thumb}"
            class="video-thumb-img">

            <div class="play-btn">▶</div>

        </div>

    </div>

    `;

}

});

document.getElementById("videoCount").innerText =
totalVideos;

}
window.followUser = async function(){

const myChannel =
localStorage.getItem("channelName");

if(!myChannel){
alert("Login Required");
return;
}

const existingFollow =
query(
collection(db,"followers"),
where("follower","==",myChannel),
where("following","==",channel),
limit(1)
);

const existingSnap =
await getDocs(existingFollow);

if(!existingSnap.empty){

const followDoc =
existingSnap.docs[0];

await deleteDoc(
doc(db,"followers",followDoc.id)
);

document.getElementById("followBtn")
.innerText = "Follow";
const followersCount =
document.getElementById("followersCount");

followersCount.innerText =
parseInt(followersCount.innerText) - 1;
alert("Unfollowed ❌");

return;

}

await addDoc(
collection(db,"followers"),
{
follower: myChannel,
following: channel,
createdAt: Date.now()
}
);
await addDoc(
collection(db,"notifications"),
{
toUser: channel,
fromUser: myChannel,
type: "follow",
text: myChannel + " started following you",
createdAt: Date.now()
}
);

document.getElementById("followBtn")
.innerText = "Following";

alert("Followed Successfully ✅");

}