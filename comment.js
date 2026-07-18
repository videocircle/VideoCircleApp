/*
=========================================================
VideoCircle
comment.js
Version : 1.0.0
Part : 1/5
=========================================================
*/

import { db } from "./firebase.js";

import {

collection,
addDoc,
getDocs,
query,
where,
orderBy,
doc,
getDoc,
updateDoc,
increment,
deleteDoc,
serverTimestamp,
setDoc

}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentVideoId = "";
let currentReplyCommentId = "";
let expandedReplies = {};
let commentCache = [];
let selectedCommentId = null;
let selectedReplyId = null;
let editingCommentId = null;
let editingReplyId = null;

/* =====================================================
   OPEN COMMENTS
===================================================== */

export async function openComments(videoId){

currentVideoId = videoId;

const settingsSnap = await getDoc(
doc(db,"settings","app")
);

if(settingsSnap.exists()){

const settings=settingsSnap.data();

if(settings.comments===false){

alert("💬 Comments are disabled by administrator.");

return;

}

}

document.getElementById("commentBox").style.display="block";

document.querySelector(".bottom-nav").style.display="none";

await loadComments(videoId);

}



/* =====================================================
   CLOSE COMMENTS
===================================================== */

export function closeComments(){

document.getElementById("commentBox").style.display="none";

document.querySelector(".bottom-nav").style.display="flex";

hideReplyBox();

}



/* =====================================================
   COMMENT STATUS
===================================================== */

export function isCommentBoxOpen(){

return document.getElementById("commentBox").style.display==="block";

}



/* =====================================================
   SHOW REPLY BOX
===================================================== */

function showReplyBox(commentId){

currentReplyCommentId=commentId;

const box=document.getElementById("replyBox");

const input=document.getElementById("replyInput");

box.style.display="block";
  
document.querySelector(".comment-input").style.display="none";
  
input.value="";

input.focus();

}



/* =====================================================
   HIDE REPLY BOX
===================================================== */

function hideReplyBox(){

currentReplyCommentId="";

const box=document.getElementById("replyBox");

const input=document.getElementById("replyInput");

box.style.display="none";

document.querySelector(".comment-input").style.display="flex";
  
input.value="";

}



/* =====================================================
   FORMAT TIME AGO
===================================================== */

function formatTimeAgo(time){

if(!time) return "";

let value=time.seconds
?time.seconds*1000
:time;

const diff=Math.floor((Date.now()-value)/1000);

if(diff<60){

return "Just now";

}

const min=Math.floor(diff/60);

if(min<60){

return min+"m";

}

const hour=Math.floor(min/60);

if(hour<24){

return hour+"h";

}

const day=Math.floor(hour/24);

if(day<7){

return day+"d ago";

}

const week=Math.floor(day/7);

if(week<5){

return week+"w ago";

}

const month=Math.floor(day/30);

if(month<12){

return month+"mo ago";

}

return Math.floor(day/365)+"y ago";

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text){

const div=document.createElement("div");

div.innerText=text;

return div.innerHTML;

}



/* =====================================================
   TOAST
===================================================== */

function showToast(message){

console.log(message);

/*
Version 1.1

Custom Toast UI
*/

}

/* =====================================================
   OWNER CHECK
===================================================== */

function isOwner(userId){

return userId === localStorage.getItem("uid");

}

/* =====================================================
   PART 1 END
===================================================== */
/* =====================================================
   LOAD COMMENTS
===================================================== */

export async function loadComments(videoId){

currentVideoId = videoId;

const commentsList =
document.getElementById("commentsList");

commentsList.innerHTML = "";

commentCache = [];

const q = query(

collection(db,"comments"),

where("videoId","==",videoId)

);

const snap = await getDocs(q);
console.log("Comments Found:", snap.size);

snap.docs.forEach(doc => {
    console.log(doc.id, doc.data());
});
document.getElementById("commentCount").innerText =
snap.size;

for(const commentDoc of snap.docs){

const data = commentDoc.data();

commentCache.push({

id:commentDoc.id,

...data

});

renderComment(commentDoc.id,data);

await loadReplies(commentDoc.id);

}

}



/* =====================================================
   RENDER COMMENT
===================================================== */

function renderComment(commentId,data){

const commentsList =
document.getElementById("commentsList");
const deleteButton = isOwner(data.userId)
? `
<span
class="comment-delete"
onclick="openCommentMenu('${commentId}')">
⋮
</span>
`
: "";
commentsList.innerHTML += `

<div
class="comment"
id="comment-${commentId}">

<div class="comment-user">

<b>

${escapeHTML(

data.channelName ||

"VideoCircle User"

)}

</b>

<span class="comment-time">

${formatTimeAgo(data.createdAt)}

</span>

</div>

<div class="comment-text">

${escapeHTML(data.comment)}

</div>

<div class="comment-actions">

<span
class="comment-like"

onclick="toggleCommentLike(

'${commentId}'

)">

❤️ ${data.likes || 0}

</span>

<span
class="comment-reply"

onclick="replyToComment(

'${commentId}'

)">

💬 Reply

</span>
${deleteButton}
</div>

<div

id="replies-${commentId}"

class="replies-list">

</div>

</div>

`;

}



/* =====================================================
   LOAD REPLIES
===================================================== */

async function loadReplies(commentId){

const box =

document.getElementById(

`replies-${commentId}`

);

if(!box) return;

box.innerHTML = "";

const q = query(

collection(db,"replies"),

where(

"commentId",

"==",

commentId

)

);

const snap = await getDocs(q);

const replies = snap.docs;

if(replies.length===0){

return;

}

const limit =

expandedReplies[commentId]

? replies.length

: Math.min(

2,

replies.length

);

for(

let i=0;

i<limit;

i++

){

renderReply(

replies[i],

box

);

}

if(replies.length>2){

renderReplyToggle(

commentId,

replies.length

);

}

}
/* =====================================================
   RENDER REPLY
===================================================== */

function renderReply(replyDoc, box){

const data = replyDoc.data();
const deleteButton = isOwner(data.userId)
? `
<span
class="reply-delete"
onclick="openCommentMenu('${data.commentId}','${replyDoc.id}')">
⋮
</span>
`
: "";
box.innerHTML += `

<div
class="reply-item"
id="reply-${replyDoc.id}">

<div class="reply-user">

<b>

${escapeHTML(
data.channelName ||
"VideoCircle User"
)}

</b>

<span class="reply-time">

${formatTimeAgo(
data.createdAt
)}

</span>

</div>

<div class="reply-text">

${escapeHTML(
data.text
)}

</div>

<div class="reply-actions">

<span
class="reply-like"
onclick="toggleReplyLike('${replyDoc.id}')">

❤️ ${data.likes || 0}

</span>

${deleteButton}

</div>

</div>

`;

}



/* =====================================================
   RENDER REPLY TOGGLE
===================================================== */

function renderReplyToggle(
commentId,
totalReplies
){

const box =
document.getElementById(
`replies-${commentId}`
);

if(expandedReplies[commentId]){

box.innerHTML += `

<div
class="reply-toggle"
onclick="hideReplies('${commentId}')">

▲ Hide Replies

</div>

`;

}else{

box.innerHTML += `

<div
class="reply-toggle"
onclick="viewReplies('${commentId}')">

▼ View ${totalReplies-2} more replies

</div>

`;

}

}



/* =====================================================
   VIEW REPLIES
===================================================== */

window.viewReplies =
async function(commentId){

expandedReplies[commentId]=true;

await loadReplies(commentId);

};



/* =====================================================
   HIDE REPLIES
===================================================== */

window.hideReplies =
async function(commentId){

expandedReplies[commentId]=false;

await loadReplies(commentId);

};



/* =====================================================
   OPEN REPLY BOX
===================================================== */

window.replyToComment =
function(commentId){

showReplyBox(commentId);

};



/* =====================================================
   CANCEL REPLY
===================================================== */

document
.getElementById("cancelReply")
.onclick=function(){

hideReplyBox();

};



/* =====================================================
   PART 3 END
===================================================== */
/* =====================================================
   ADD COMMENT
===================================================== */

export async function addComment(videoId){

const input =
document.getElementById("commentInput");

const text = input.value.trim();

if(editingCommentId){

    await updateDoc(
        doc(db,"comments",editingCommentId),
        {
            comment: text
        }
    );

    editingCommentId = null;

    input.value = "";

    await loadComments(videoId);

    return;
}
if(!text){

showToast("Write a comment");

return;

}

await addDoc(
collection(db,"comments"),
{
    videoId:videoId,
    comment:text,
    channelName:localStorage.getItem("channelName"),
    userId:localStorage.getItem("uid"),
    likes:0,
    createdAt:serverTimestamp()
}
);

input.value="";

// Server timestamp save होने के लिए थोड़ा इंतज़ार
await new Promise(resolve => setTimeout(resolve, 300));

await loadComments(videoId);
}



/* =====================================================
   SEND REPLY
===================================================== */

document.getElementById("sendReply")
.onclick=async function(){

const input=
document.getElementById("replyInput");

const text=input.value.trim();
if(editingReplyId){

    await updateReply();

    return;

}
if(!text){

showToast("Write a reply");

return;

}

await addDoc(

collection(db,"replies"),

{

commentId:
currentReplyCommentId,

text:text,

channelName:
localStorage.getItem("channelName"),

userId:
localStorage.getItem("uid"),

likes:0,

createdAt:
serverTimestamp()

}

);

hideReplyBox();

await loadReplies(

currentReplyCommentId

);

};

async function updateReply(){

    const input =
    document.getElementById("replyInput");

    const text =
    input.value.trim();

    if(!text){

        showToast("Write a reply");

        return;

    }

    await updateDoc(
        doc(db,"replies",editingReplyId),
        {
            text:text
        }
    );

    editingReplyId = null;

    hideReplyBox();

    await loadComments(currentVideoId);

}

/* =====================================================
   DELETE COMMENT
===================================================== */

window.deleteComment=
async function(commentId){

const ok=
confirm(

"Delete this comment?"

);

if(!ok) return;

await deleteDoc(

doc(

db,

"comments",

commentId

)

);

await loadComments(

currentVideoId

);

};



/* =====================================================
   DELETE REPLY
===================================================== */

window.deleteReply=
async function(

replyId,

commentId

){

const ok=
confirm(

"Delete this reply?"

);

if(!ok) return;

await deleteDoc(

doc(

db,

"replies",

replyId

)

);

await loadReplies(

commentId

);

};



/* =====================================================
   LIVE REFRESH
===================================================== */

async function refreshComments(){

await loadComments(

currentVideoId

);

}

/* =====================================================
   TOGGLE COMMENT LIKE
===================================================== */

window.toggleCommentLike = async function(commentId){

try{

const uid = localStorage.getItem("uid");

if(!uid){

showToast("Login required");

return;

}

const likeRef = doc(
db,
"commentLikes",
commentId + "_" + uid
);

const likeSnap = await getDoc(likeRef);

const commentRef = doc(
db,
"comments",
commentId
);

if(likeSnap.exists()){

await deleteDoc(likeRef);

await updateDoc(commentRef,{
likes:increment(-1)
});

}else{

await setDoc(likeRef,{
commentId,
uid,
createdAt:serverTimestamp()
});

await updateDoc(commentRef,{
likes:increment(1)
});

}

await loadComments(currentVideoId);

}catch(error){

console.error(error);

showToast("Failed to like comment");

}

};
/* =====================================================
   TOGGLE REPLY LIKE
===================================================== */

window.toggleReplyLike = async function(replyId){

try{

const uid = localStorage.getItem("uid");

if(!uid){

showToast("Login required");

return;

}

const likeRef = doc(
db,
"replyLikes",
replyId + "_" + uid
);

const likeSnap = await getDoc(likeRef);

const replyRef = doc(
db,
"replies",
replyId
);

if(likeSnap.exists()){

await deleteDoc(likeRef);

await updateDoc(replyRef,{
likes:increment(-1)
});

}else{

await setDoc(likeRef,{
replyId,
uid,
createdAt:serverTimestamp()
});

await updateDoc(replyRef,{
likes:increment(1)
});

}

await loadReplies(currentReplyCommentId);

}catch(error){

console.error(error);

showToast("Failed to like reply");

}

};
window.openCommentMenu = function(commentId, replyId = null){

    selectedCommentId = commentId;
    selectedReplyId = replyId;

    document.getElementById("commentMenu").style.display = "flex";

}

window.closeCommentMenu = function(){

    document.getElementById("commentMenu").style.display = "none";

}
/* =====================================================
   COMMENT MENU EVENTS
===================================================== */

document.getElementById("cancelCommentMenu").onclick = () => {

    closeCommentMenu();

};

document.getElementById("deleteCommentBtn").onclick = async () => {

    closeCommentMenu();

    if(selectedReplyId){

        await deleteReply(
            selectedReplyId,
            selectedCommentId
        );

    }else{

        await deleteComment(
            selectedCommentId
        );

    }

};
async function startEditReply(replyId){

    const docRef = doc(db,"replies",replyId);

    const snap = await getDoc(docRef);

    if(!snap.exists()) return;

    editingReplyId = replyId;

    showReplyBox(selectedCommentId);

document.getElementById("replyInput").value =
snap.data().text;

document.getElementById("replyInput").focus();

}
document.getElementById("editCommentBtn").onclick = async () => {

    closeCommentMenu();

    if(selectedReplyId){

    await startEditReply(selectedReplyId);

}else{

    await startEditComment(selectedCommentId);

    }

    const input = document.getElementById("commentInput");

    input.focus();

};
document
.getElementById("cancelCommentMenu")
.onclick = function(){

    closeCommentMenu();

};
async function startEditComment(commentId){

    const docRef = doc(db,"comments",commentId);

    const snap = await getDoc(docRef);

    if(!snap.exists()) return;

    editingCommentId = commentId;

    document.getElementById("commentInput").value =
    snap.data().comment;

    document.getElementById("commentInput").focus();

}
/* =====================================================
   PART 4 END
===================================================== */
