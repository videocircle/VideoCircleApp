export async function shareVideo(videos, currentIndex){

const url =
videos[currentIndex].videoUrl;

const title =
videos[currentIndex].title || "Watch this video";

try{

if(navigator.share){

await navigator.share({
title:title,
text:"Watch this video on Video Circle",
url:url
});

}else{

await navigator.clipboard.writeText(url);

alert("Video link copied");

}

}catch(err){

console.log(err);

}

}