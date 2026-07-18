import { db, auth } from "./firebase.js";

import {
doc,
getDoc,
getDocs,
collection,
query,
where,
orderBy,
deleteDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// ======================================
// Profile Module
// ======================================
async function deleteVideoFromFirestore(videoId){

    await deleteDoc(
        doc(db,"videos",videoId)
    );

}
let selectedVideoId = "";
let selectedTitle = "";
let selectedDescription = "";
window.confirmDeleteVideo = async function(){
const btn = document.getElementById("confirmDeleteBtn");

btn.disabled = true;

btn.innerText = "Deleting...";
    await deleteVideoFromFirestore(selectedVideoId);

closeDeleteModal();

closeVideoMenu();

location.reload();

}
window.openEditModal = function(){

    closeVideoMenu();
document.getElementById("editTitle").value =
selectedTitle;

document.getElementById("editDescription").value =
selectedDescription;
    document
        .getElementById("editCaptionModal")
        .classList.add("show");

}

window.closeEditModal = function(){

    document
        .getElementById("editCaptionModal")
        .classList.remove("show");

}
window.openDeleteModal = function(){

    closeVideoMenu();

    document
        .getElementById("deleteModal")
        .classList.add("show");

}

window.closeDeleteModal = function(){

    document
        .getElementById("deleteModal")
        .classList.remove("show");

}
window.saveCaption = async function(){

    const title =
    document.getElementById("editTitle").value.trim();

    const description =
    document.getElementById("editDescription").value.trim();

    await updateDoc(

        doc(db,"videos",selectedVideoId),

        {
            title:title,
            description:description
        }

    );

    closeEditModal();

    alert("Caption Updated");

    location.reload();

}
window.openVideoMenu = function(videoId, title, description){

    selectedVideoId = videoId;

    selectedTitle = title;

    selectedDescription = description;

    document
        .getElementById("videoMenu")
        .classList.add("show");
}

window.closeVideoMenu = function(){

    document
    .getElementById("videoMenu")
    .classList.remove("show");

}
export async function loadProfile() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) return;
      console.log("profile.js loaded");
const docRef = doc(db, "users", user.uid);

const docSnap = await getDoc(docRef);

if (!docSnap.exists()) return;

const data = docSnap.data();

document.getElementById("channelName").innerText =
data.channelName;

document.getElementById("fullName").innerText =
data.fullName;

document.getElementById("email").innerText =
data.email;

document.getElementById("mobile").innerText =
data.mobile;

if (data.profilePic) {
  
    console.log("Profile Photo URL:", data.profilePic);
  
    document.getElementById("profilePic").src =
    data.profilePic + "?t=" + Date.now();

}
      // Followers Count
console.log("Current Channel:", data.channelName);

const followersQuery = query(
    collection(db, "followers"),
    where("following", "==", data.channelName)
);

const followersSnap = await getDocs(followersQuery);
console.log("Followers Found:", followersSnap.size);
document.getElementById("followersCount").innerText =
followersSnap.size;


// Following Count
const followingQuery = query(
    collection(db, "followers"),
    where("follower", "==", data.channelName)
);

const followingSnap = await getDocs(followingQuery);
console.log("Following Found:", followingSnap.size);
document.getElementById("followingCount").innerText =
followingSnap.size;


// Video Count
const videoSnap =
await getDocs(collection(db, "videos"));

let totalLikes = 0;
let totalViews = 0;
let myVideos = 0;

videoSnap.forEach((videoDoc)=>{

    const videoData = videoDoc.data();

    if(
        (videoData.channelName || "").trim().toLowerCase()
        ===
        (data.channelName || "").trim().toLowerCase()
    ){

        myVideos++;

        totalLikes += videoData.likes || 0;
        totalViews += videoData.views || 0;

    }

});

document.getElementById("videoCount").innerText =
myVideos;

document.getElementById("likesCount").innerText =
totalLikes;

document.getElementById("viewsCount").innerText =
totalViews;
      // ==========================
// Load My Videos
// ==========================

const myVideosDiv = document.getElementById("myVideos");

myVideosDiv.innerHTML = "";

videoSnap.forEach((videoDoc) => {

    const video = videoDoc.data();
const thumb =
video.thumbnailUrl ||
`https://res.cloudinary.com/duerkkpjf/video/upload/so_1/${video.publicId}.jpg`;
    if (
        (video.channelName || "").trim().toLowerCase() ===
        (data.channelName || "").trim().toLowerCase()
    ) {

        myVideosDiv.innerHTML += `
            <div class="my-video-card" style="position:relative;">
      <button
class="more-btn"
onclick="openVideoMenu(
'${videoDoc.id}',
'${video.title || ""}',
'${video.description || ""}'
)">

⋮

</button>
                <div class="video-thumb"
     onclick="window.location.href='watch.html?id=${videoDoc.id}'">

    <img
src="${thumb}"
class="video-thumb-img">

<div class="play-btn">▶</div>

</div>

                <h3>${video.title || "Untitled Video"}</h3>

                <p>❤️ ${video.likes || 0} &nbsp;&nbsp; 👁️ ${video.views || 0}</p>
            </div>
        `;
    }

});
    });

}