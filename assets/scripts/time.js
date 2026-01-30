function updateTime() {
    const now = new Date();

    const getSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };

    const dayNum = now.getDate();
    const suffix = getSuffix(dayNum);
    const month = now.toLocaleDateString("en-GB", { month: 'long', timeZone: "Europe/Amsterdam" });
    const year = now.toLocaleDateString("en-GB", { year: 'numeric', timeZone: "Europe/Amsterdam" });
    const time = now.toLocaleTimeString("en-GB", { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZone: "Europe/Amsterdam" 
    });

    const finalString = `${dayNum}${suffix} of ${month}, ${year} at ${time}`;
    
    document.querySelector("#time").textContent = finalString;
}

updateTime();
setInterval(updateTime, 1000);