// =====================================
// Video Circle Home Controller
// =====================================

import { db } from "./firebase.js";

import {
    loadNotificationCount
} from "./notification.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    serverTimestamp,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export const homeVideos = [];
let lastShuffleTime = 0;
function shuffleVideos(array){
const now = Date.now();

if(now - lastShuffleTime < 5000){

    return array;

}

lastShuffleTime = now;
    for(let i = array.length - 1; i > 0; i--){

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[j]] =
        [array[j], array[i]];

    }

    return array;

}
// ===============================
// Initialize Home
// ===============================
export async function initializeHome(){

    console.log("Home Controller Started");

    loadNotificationCount();

    return {
        videos: homeVideos
    };

}

// ===============================
// Load Feed Data
// ===============================
export async function loadFeedData(){
try {
    const q = query(
    collection(db,"videos"),
    orderBy("createdAt","desc")
);

    const snapshot = await getDocs(q);

    homeVideos.length = 0;

    snapshot.forEach((doc) => {

    const video = {
        id: doc.id,
        ...doc.data()
    };

    // Hidden videos skip
    if (video.isHidden === true) {
        return;
    }

    homeVideos.push(video);

});
shuffleVideos(homeVideos);
    return {
        snapshot,
        videos: homeVideos
    };
    } catch (error) {

    console.error(error);

    console.log("Error Code:", error.code);

    console.log("Error Message:", error.message);

    alert(error.message);

    return {
        snapshot: { docs: [] },
        videos: []
    };

}
}
export function getChannelName(videos, index) {
    return videos[index].channelName || "SAGAR ZONE";
}
export function getVideoUrl(videos, index) {

    const url = videos[index].videoUrl || "";

    return url.replace(
        "/upload/",
        "/upload/f_auto,q_auto:good,vc_auto/"
    );

}
export function getVideoTitle(videos, index) {
    return videos[index].title;
}
export function getVideoViews(videos, index) {
    return videos[index].views || 0;

}
window.openReportDialog = async function(){

    const settingsSnap = await getDoc(
        doc(db,"settings","app")
    );

    if(settingsSnap.exists()){

        const settings = settingsSnap.data();

        if(settings.reports === false){

            alert("🚫 Reports are currently disabled by the administrator.");

            return;

        }

    }

    document
        .getElementById("reportDialog")
        .classList.add("show");

}

window.closeReportDialog = function(){

    document
    .getElementById("reportDialog")
    .classList.remove("show");

}
window.submitReport = async function () {
console.log("submitReport called");
    try {
const settingsSnap = await getDoc(
    doc(db,"settings","app")
);

if(settingsSnap.exists()){

    const settings = settingsSnap.data();

    if(settings.reports === false){

        alert("🚫 Reports are currently disabled by the administrator.");

        return;

    }

}
        const reason =
            document.getElementById("reportReason").value;

        const reporterId =
            localStorage.getItem("uid");

        await addDoc(collection(db, "reports"), {

            videoId: window.currentVideoId,

            ownerId: window.currentOwnerId,

            reporterId: reporterId,

            reason: reason,

            status: "Pending",

            createdAt: serverTimestamp()

        });

        alert("✅ Report Submitted");

        closeReportDialog();

    } catch (e) {

        console.error(e);

        alert("Report Failed");

    }

}