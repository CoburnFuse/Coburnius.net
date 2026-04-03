function dateTimeFormat(date, local) {
    const getSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };

    const dayNum = date.getDate();
    const suffix = getSuffix(dayNum);
    const month = date.toLocaleDateString("en-GB", { month: 'long', timeZone: "Europe/Amsterdam" });
    const year = date.toLocaleDateString("en-GB", { year: 'numeric', timeZone: "Europe/Amsterdam" });
    const time = date.toLocaleTimeString("en-GB", { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false,
        ...(local ? {} : { timeZone: "Europe/Amsterdam" })
    });

    return `${dayNum}${suffix} of ${month}, ${year} at ${time}`;
}