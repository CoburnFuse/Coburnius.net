import {dateTimeFormat} from "./library.js";

var audioPoi = new Audio('/assets/audio/poi.mp3')

function updateTime() {
    const now = new Date();
    document.querySelector("#time").innerHTML = `It is currently the <span id="time" style="font-weight: bold">${dateTimeFormat(now, false)}</span> for me.`;
}

currentPage.addEventListener("click", function (e) {
    e.preventDefault();
    audioPoi.play();
});

updateTime();
setInterval(updateTime, 1000);