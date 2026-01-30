function updateTime() {
    const now = new Date();
    document.querySelector("#time").textContent = dateTimeFormat(now);
}

updateTime();
setInterval(updateTime, 1000);