const skillNames = ["Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"];

async function fetchJSONData(username) {
    try {
        const workerUrl = `https://rs-api-proxy.coburnius.net/?user=${encodeURIComponent(username)}`;
        
        const response = await fetch(workerUrl);
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please try again in a few minutes.");
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error);
        document.getElementById('stats').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

async function writeStatsToSite(username) {
    document.getElementById('stats').innerHTML = "<p>Loading player stats...</p>";

    const data = await fetchJSONData(username);

    if (data && data.skillvalues) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
                <span>Combat: ${data.combatlevel} | Total: ${data.totalskill}</span><br>
            </div>
            <table class='rsTable'>
                ${tableRows}
            </table>
        `;

        document.getElementById('stats').innerHTML = statsToPushToPage;
    }
}