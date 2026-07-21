import { db } from "./firebase.js";

import {
doc,
updateDoc,
increment,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let likeInProgress = false;

export async function likeVideo(
videos,
currentIndex
){
const videoId = videos[currentIndex].id;

if (likeInProgress) {
    return;
}

likeInProgress = true;

try {
// ===============================
// Like Permission Check
// ===============================

const settingsSnap = await getDoc(
    doc(db, "settings", "app")
);

if (settingsSnap.exists()) {

    const settings = settingsSnap.data();

    if (settings.likes === false) {

        alert("❤️ Likes are currently disabled by the administrator.");

        return false;

    }

}
const likeKey =
"liked_" + videoId;

const videoRef =
doc(db,"videos",videoId);

if(localStorage.getItem(likeKey)){

await updateDoc(videoRef,{
likes: increment(-1)
});

localStorage.removeItem(likeKey);

videos[currentIndex].likes--;

return false;

}else{

await updateDoc(videoRef,{
likes: increment(1)
});

localStorage.setItem(likeKey,"true");

videos[currentIndex].likes++;

return true;

}

catch(e){

    console.error("Like Error:", e);

    alert("Unable to update like.");

    return false;

}

finally{

    likeInProgress = false;

}

}
export function enableDoubleTap(videoElement, likeCallback){

if(videoElement.doubleTapEnabled){
    return;
}

videoElement.doubleTapEnabled = true;

let lastTap = 0;

videoElement.addEventListener("touchend", async ()=>{

const now = Date.now();

if(now - lastTap < 300){

await likeCallback();

showHeart();

}

lastTap = now;

});

}
export function refreshLikeUI(liked, likes){

document.getElementById("likeBtn").innerHTML =
liked
? `❤️<br><span id="likeCount">${likes}</span>`
: `🤍<br><span id="likeCount">${likes}</span>`;

}