const skillNames = ["Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"];

async function fetchJSONData(username) {
    try {
        const workerUrl = `https://rs-api-proxy.coburnius.net/?user=${username}&t=${Date.now()}`;
        const response = await fetch(workerUrl);
        
        if (!response.ok) throw new Error("User not found or worker error");
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Frontend Fetch Error:', error);
        return null;
    }
}

async function writeStatsToSite(username) {
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = `<p>Loading stats for ${username}...</p>`;
    
    const envelope = await fetchJSONData(username);

    if (envelope && envelope.stats && envelope.stats.skillvalues) {
        const data = envelope.stats;
        const lastUpdated = dateTimeFormat(new Date(envelope.lastUpdated), true);
        
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
            <p><small>Last updated: <b>${lastUpdated}</b></small></p>
        `;

        statsContainer.innerHTML = statsToPushToPage;
    } else {
        statsContainer.innerHTML = `<p style="color:red;">Could not load stats for ${username}.</p>`;
    }
}