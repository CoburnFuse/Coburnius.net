const skillNames = ["Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"];

async function fetchJSONData() {
    try {
        const workerUrl = `https://rs-api-proxy.coburnius.net/?t=${Date.now()}`;
        const response = await fetch(workerUrl);
        const text = await response.text();
        
        console.log("Raw Worker Response:", text);
        
        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error('Frontend Fetch Error:', error);
    }
}

async function writeStatsToSite() {
    document.getElementById('stats').innerHTML = "<p>Loading player stats...</p>";
    
    const envelope = await fetchJSONData();

    if (envelope && envelope.stats && envelope.stats.skillvalues) {
        const data = envelope.stats;
        const lastUpdated = dateTimeFormat(new Date(envelope.lastUpdated));
        
        const statsArray = data.skillvalues.sort((a, b) => a.id - b.id);
        let tableRows = "";

        for (let i = 0; i < statsArray.length; i += 2) {
            const name1 = skillNames[i];
            const level1 = statsArray[i].level;
            
            const hasSecondSkill = (i + 1) < statsArray.length;
            const name2 = hasSecondSkill ? skillNames[i + 1] : ""; 
            const level2 = hasSecondSkill ? statsArray[i + 1].level : "";
            const colon2 = hasSecondSkill ? ":" : "";

            tableRows += `
                <tr>
                    <td>${name1}:</td>
                    <td>${level1}</td>
                    <td style="padding-left: 20px;">${name2}${colon2}</td>
                    <td>${level2}</td>
                </tr>`;
        }

        const statsToPushToPage = `
            <div style="margin-bottom: 10px;">
                <strong>${data.name}</strong><br>
                <span>Combat: ${data.combatlevel} / Total: ${data.totalskill}</span><br>
            </div>
            <table class='rsTable'>
                ${tableRows}
            </table>
            <small>Last updated on the <b>${lastUpdated}</b></small>
        `;

        document.getElementById('stats').innerHTML = statsToPushToPage;
    }
}

writeStatsToSite();