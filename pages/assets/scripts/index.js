var audioPoi = new Audio('/assets/audio/poi.mp3')

function updateTime() {
    const now = new Date();
    document.querySelector("#time").textContent = dateTimeFormat(now, false);
}

function playPoi(){
    event.preventDefault();
    audioPoi.play();
}

currentPage.addEventListener("click", function (e) {
    e.preventDefault();
    playPoi();
});

updateTime();
setInterval(updateTime, 1000);