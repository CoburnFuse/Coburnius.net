//List of skillnames, ordered in the same way the API lists them with numbers
const skillNames = ["Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"];

async function readRSDataFromProxy(username){
    const proxyUrl = `https://rs-api-proxy.coburnius.net/?user=${username}`;

    //Make request to get the JSON data of the character
    try {
        const response = await fetch(proxyUrl);
        const obtainedStats = [];
        let statsToShow = "";
        let infoToShow;

        //Give an error response if fails to find the page
        if(!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }

        //Turn response into a properly readable JSON
        const characterStats = await response.json();

        //Get all other data needed
        const combatLevel = characterStats.stats.combatlevel;
        const totalLevel = characterStats.stats.totalskill;
        const totalXP = characterStats.stats.totalxp;
        const lastUpdated = dateTimeFormat(new Date(characterStats.lastUpdated), true);

        //Go through all stats available and get all neccessary data
        for(let i = 0; i < characterStats.stats.skillvalues.length; i++){

            //Get stats to push and push them
            let statToPush = {
                skillID:    characterStats.stats.skillvalues[i].id,
                skillName:  skillNames[characterStats.stats.skillvalues[i].id],
                skillLevel: characterStats.stats.skillvalues[i].level,
                skillXP:    characterStats.stats.skillvalues[i].xp
            };
    
            obtainedStats.push(statToPush);
        };

        //Sort stats by ID
        obtainedStats.sort((a, b) => a.skillID - b.skillID);

        //Add main stats (name, total level, and combat level)
        infoToShow = 
        `<b>${username}</b><br>
        Combat: ${combatLevel} / Total: ${totalLevel}<br>`

        //Put everything in a table so it can be shown
        for(let i = 0; i <obtainedStats.length; i += 2){
            let firstCol = `<td>${obtainedStats[i].skillName}: </td>${colorSkillLevel(obtainedStats[i].skillLevel)}</td>`
            let secondCol = "";

            //If there is an odd column, add it, otherwise skip it
            if(obtainedStats[i + 1]){
                secondCol = `<td>${obtainedStats[i + 1]?.skillName}: </td><td>${colorSkillLevel(obtainedStats[i + 1]?.skillLevel)}</td>`
            }

            //Push the current row to the table
            statsToShow += 
            `<tr>
                ${firstCol}${secondCol}
            </tr>`
        }
        
        //Update basic info
        document.querySelector("#mainInfo").innerHTML = `${infoToShow}`;

        //Update the table
        document.querySelector("#individualStats").innerHTML = `<table class="rsTable"> ${statsToShow} </table>`;

        //Add last update time to table
        document.querySelector("#updateTime").innerHTML = `<p><small>Last updated: <b>${lastUpdated}</b></small></p>`

    //It shouldnt error unless the worker is dead, but a catch is required
    } catch (error) {
        console.log(error.message);
    }
}

//Adds a blue-silverish or golden color to stats having a certain milestone
function colorSkillLevel(level){
    if(level >= 120){
        //Gives a blue-silverish color to stats that reached 120
        return `<td style="color:#00ffff;"> ${level}`
    }else if(level >= 99){
        //Gives a golden color to stats that reached 99
        return `<td style="color:#ffd700;"> ${level}`
    }else{
        return `<td>${level}`
    }
}
