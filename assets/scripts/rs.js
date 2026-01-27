const skillNames = ["Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"];

async function fetchJSONData(username) {
    try {
        // Replace with your actual Worker URL from Cloudflare
        const workerUrl = `https://rs-api-proxy.coburnius.net/?user=${username}`;
        
        const response = await fetch(workerUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

async function writeStatsToSite(username) {

    document.getElementById('stats').innerHTML = "<p>Loading player stats, if it takes longer than ten seconds, please reload the page.</p>";

    const data = await fetchJSONData(username);

    if (data && data.skillvalues) {
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
            <strong>${data.name}</strong><br>
            (Combat: ${data.combatlevel}/Total: ${data.totalskill})<br><br>
            <table class='rsTable'>
                ${tableRows}
            </table>
        `;

        document.getElementById('stats').innerHTML = statsToPushToPage;
    }
}