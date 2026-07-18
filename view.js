import { db } from "./firebase.js";

import {
doc,
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
export function startViewTimer(
video,
videoId,
currentVideoIndex,
getCurrentIndex,
videos,
updateViewUI
){

const viewedKey =
"viewed_" + videoId;

const timer = setTimeout(async ()=>{

if(
getCurrentIndex() === currentVideoIndex &&
video.currentTime >= 5 &&
!sessionStorage.getItem(viewedKey)
){

await updateDoc(
doc(db,"videos",videoId),
{
views: increment(1)
}
);

sessionStorage.setItem(
viewedKey,
"true"
);

videos[currentVideoIndex].views =
(videos[currentVideoIndex].views || 0)+1;

updateViewUI(
videos[currentVideoIndex].views
);

}

},6000);

return timer;

}
export function stopViewTimer(timer){

clearTimeout(timer);

}