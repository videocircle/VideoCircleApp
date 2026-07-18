import { db } from "./firebase.js";

import {
collection,
query,
where,
orderBy,
getDocs,
updateDoc,
doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const currentUid = localStorage.getItem("uid");

if(!currentUid){

location.href = "index.html";

throw new Error("User not logged in");

}

loadNotifications();

markNotificationsRead();



async function markNotificationsRead(){

const unreadQuery = query(

collection(db,"notifications"),

where("toUid","==",currentUid),

where("read","==",false)

);

const unreadSnap = await getDocs(unreadQuery);

for(const item of unreadSnap.docs){

await updateDoc(

doc(db,"notifications",item.id),

{

read:true

}

);

}

}
/* =========================================
   Load Notifications
========================================= */

async function loadNotifications(){

const list =
document.getElementById("notificationsList");

list.innerHTML = "";

const q = query(

collection(db,"notifications"),

where("toUid","==",currentUid),

orderBy("createdAt","desc")

);

let snap;

try{

snap = await getDocs(q);
console.log("Current UID:", currentUid);

console.log("Documents Found:", snap.size);

snap.forEach(doc=>{
    console.log(doc.id, doc.data());
});
}catch(error){

console.error(error);

alert(error.message);

list.innerHTML = `
<div class="empty">
Failed to load notifications
</div>
`;

return;

}

if(snap.empty){

list.innerHTML = `
<div class="empty">
No Notifications Yet
</div>
`;

return;

}

for(const item of snap.docs){

const data = item.data();

renderNotification(data);

}

}


/* =========================================
   Render Notification
   ${formatTime(data.createdAt)}
========================================= */

function renderNotification(data){

const list =
document.getElementById("notificationsList");

let icon = "🔔";

switch(data.type){

case "follow":
icon = "👤";
break;

case "like":
icon = "❤️";
break;

case "comment":
icon = "💬";
break;

case "reply":
icon = "↩️";
break;

}

list.innerHTML += `

<div class="notification-card">

<div style="font-size:17px">

${icon}
${data.text}

</div>

<div
style="
margin-top:6px;
font-size:12px;
color:gray;
">



</div>

</div>

`;

}
