export function enableSwipe(feed, onNext, onPrev, isCommentOpen){

let startY = 0;
let currentY = 0;
let startTime = 0;
const videoLayer = document.getElementById("videoLayer");
  const currentLayer = document.getElementById("currentLayer");
const nextLayer = document.getElementById("nextLayer");
  const feedVideo = document.getElementById("feedVideo");
const preloadVideo = document.getElementById("preloadVideo");
feed.addEventListener("touchstart",(e)=>{

if(isCommentOpen()) return;

startY = e.touches[0].clientY;
startTime = Date.now();
});
feed.addEventListener("touchmove",(e)=>{

    if(isCommentOpen()) return;

    currentY = e.touches[0].clientY;
const diff = currentY - startY;

const offset = Math.max(
    -window.innerHeight,
    Math.min(window.innerHeight, diff)
);

// Current Video
// TODO: currentLayer will replace videoLayer in V2
videoLayer.style.transform = `translateY(${offset}px)`;
});
feed.addEventListener("touchend",(e)=>{

if(isCommentOpen()) return;
// TODO: Move currentLayer instead of videoLayer
videoLayer.style.transition = "transform 0.22s ease-out";
const endY = e.changedTouches[0].clientY;

const diff = startY - endY;
const swipeTime = Date.now() - startTime;
  let threshold = 60;

if (swipeTime < 180) {
    threshold = 30;
}
if(diff > threshold){

    videoLayer.style.transform = `translateY(-100%)`;

    setTimeout(async ()=>{

        await onNext();

        videoLayer.style.transition = "none";

videoLayer.style.transform = "translateY(0)";

    },220);

}

else if(diff < -threshold){

    videoLayer.style.transform = `translateY(100%)`;

    setTimeout(async ()=>{

        await onPrev();

        videoLayer.style.transition = "none";

videoLayer.style.transform = "translateY(0)";
    },220);

}

else{

    videoLayer.style.transform = "translateY(0)";

    setTimeout(()=>{

        videoLayer.style.transition = "none";

    },220);

}

});

}
export async function goToNextVideo(
    currentIndex,
    videos,
    loadVideo
){

    if(currentIndex >= videos.length - 1){
        return currentIndex;
    }

    currentIndex++;

    await loadVideo(currentIndex);

    return currentIndex;

}
export async function goToPreviousVideo(
    currentIndex,
    loadVideo
){

    if(currentIndex <= 0){
        return currentIndex;
    }

    currentIndex--;

    await loadVideo(currentIndex);

    return currentIndex;

}