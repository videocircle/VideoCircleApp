import { db } from "./firebase.js";

import {
query,
collection,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
startViewTimer,
stopViewTimer
} from "./view.js";

import {
loadComments
} from "./comment.js";
const profileCache = {};
export async function getFollowState(myUid, followingUid){

const followQuery = query(
collection(db,"followers"),
where("followerUid","==",myUid),
where("followingUid","==",followingUid)
);

const followSnap = await getDocs(followQuery);

return !followSnap.empty;

}

export async function loadChannelInfo(channel){
if(profileCache[channel]){
    return profileCache[channel];
}
const userQuery = query(
collection(db,"users"),
where("channelName","==",channel)
);

const userSnap = await getDocs(userQuery);

if(userSnap.empty){
return null;
}

const result = {

    uid: userSnap.docs[0].id,

    data: userSnap.docs[0].data()

};

profileCache[channel] = result;

return result;

}
export function setProfileUI(channelInfo, channel){

if(!channelInfo){
return;
}

window.followingUid =
channelInfo.uid;

if(channelInfo.data.profilePic){

document.getElementById("profileThumb").src =
channelInfo.data.profilePic;

}

document.getElementById("channelName").innerText =
"@" + channel;

}
export async function updateFollowButton(getFollowState){

const myUid =
localStorage.getItem("uid");

const isFollowing =
await getFollowState(
myUid,
window.followingUid
);

document.getElementById("followBtn").innerText =
isFollowing
? "Following"
: "Follow";

}
export function updateLikeButton(videoId, likes){

const liked =
localStorage.getItem(
"liked_" + videoId
);

document.getElementById("likeBtn").innerHTML =
liked
? `❤️<br><span id="likeCount">${likes || 0}</span>`
: `🤍<br><span id="likeCount">${likes || 0}</span>`;

}
export function updateCommentCount(count){

document.getElementById("commentCount").innerText =
count;

}
export function updateViewCount(views){

document.getElementById("viewCount").innerText =
views || 0;

}
export async function setupProfile(videos, index){

    const channel =
    videos[index].channelName || "SAGAR ZONE";
const expectedIndex = index;
    const channelInfo =
    await loadChannelInfo(channel);
if (expectedIndex !== index) {
    return;
}
    setProfileUI(
        channelInfo,
        channel
    );

    await updateFollowButton(
        getFollowState
    );

}
export function refreshViewUI(views){

    document.getElementById("viewCount").innerText = views;

}
export function stopCurrentViewTimer(viewTimer) {

    stopViewTimer(viewTimer);

}
export function startCurrentViewTimer(
    video,
    videoId,
    currentVideoIndex,
    getCurrentIndex,
    videos,
    onViewUpdate
) {

    return startViewTimer(
        video,
        videoId,
        currentVideoIndex,
        getCurrentIndex,
        videos,
        onViewUpdate
    );

}