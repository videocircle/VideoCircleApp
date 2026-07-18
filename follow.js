import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { createNotification }
from "./notificationService.js";
export async function updateFollowData(
    myChannel,
    myUid,
    followingChannel,
    followingUid,
    isFollow
){

    const followId =
myChannel + "_" + followingChannel;

if(isFollow){

    await setDoc(
        doc(db,"followers",followId),
        {
            followerUid: myUid,
            followingUid: followingUid,
            follower: myChannel,
            following: followingChannel,
            createdAt: Date.now()
        }
    );
  await createNotification({

fromUid: myUid,

fromUser: myChannel,

toUid: followingUid,

toUser: followingChannel,

type: "follow",

text: myChannel + " started following you"

});

}else{

    await deleteDoc(
        doc(db,"followers",followId)
    );

}

}