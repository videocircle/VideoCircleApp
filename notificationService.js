import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*
=====================================
Notification Service
Version 1.0
=====================================
*/

export async function createNotification({

fromUid,
fromUser,

toUid,
toUser,

type,
text,

videoId = "",
commentId = "",
replyId = ""

}){

try{

// Don't notify yourself
if(fromUid === toUid){
return;
}

await addDoc(
collection(db,"notifications"),
{

fromUid,
fromUser,

toUid,
toUser,

type,
text,

videoId,
commentId,
replyId,

read:false,

createdAt:serverTimestamp()

}
);

}catch(error){

console.error(
"Notification Error:",
error
);

}

}