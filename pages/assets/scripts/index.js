var audioPoi = new Audio('/assets/audio/poi.mp3')

function updateTime() {
    const now = new Date();
    document.querySelector("#time").textContent = dateTimeFormat(now, false);
}

currentPage.addEventListener("click", function (e) {
    e.preventDefault();
    audioPoi.play();
});

updateTime();
setInterval(updateTime, 1000);