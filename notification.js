import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function loadNotificationCount(){

const myUid = localStorage.getItem("uid");

if(!myUid) return;

const q = query(
collection(db,"notifications"),
where("toUid","==",myUid),
where("read","==",false)
);

const snap = await getDocs(q);

document.getElementById("notificationCount").innerText =
snap.size;
}