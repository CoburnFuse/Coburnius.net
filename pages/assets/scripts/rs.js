import {dateTimeFormat} from "./library.js";

//List of skillnames, ordered in the same way the API lists them with numbers
const skillNames = ["Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention", "Archaeology", "Necromancy"];

async function readRSDataFromProxy(username){
    const proxyUrl = `https://rs-api-proxy.coburnius.net/?user=${username}`;
    let infoToShow;

    //Make request to get the JSON data of the character
    try {
        const response = await fetch(proxyUrl);
        const obtainedStats = [];
        let statsToShow = "";

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
                skillLevel: parseInt(characterStats.stats.skillvalues[i].level),
                skillXP:    parseInt(characterStats.stats.skillvalues[i].xp)
            };
    
            obtainedStats.push(statToPush);
        };

        //Sort stats by ID
        obtainedStats.sort((a, b) => a.skillID - b.skillID);

        //Puts stats for elite stats related stuff in arrays
        const inventionUnlockStats = [obtainedStats[12].skillLevel, obtainedStats[13].skillLevel, obtainedStats[25].skillLevel];

        //Add main stats (name, total level, and combat level)
        infoToShow = 
        `Combat: ${combatLevel} / Total: ${totalLevel}<br>`

        //Put everything in a table so it can be shown
        for(let i = 0; i <obtainedStats.length; i += 2){
            let firstCol = `<td>${obtainedStats[i].skillName}: </td>${colorSkillLevel(obtainedStats[i].skillLevel)}</td>`;
            let secondCol = "";

            //Checks if invention is unlocked, if its not, it grays it out
            if(obtainedStats[i].skillName == "Invention" && inventionUnlockStats.some(lv => lv < 80)){
                firstCol = `<td class="locked">${obtainedStats[i].skillName}: </td><td class="locked">${obtainedStats[i].skillLevel}</td>`;
            }

            //If there is an odd column, add it, otherwise skip it
            if(obtainedStats[i + 1]){
                secondCol = `<td>${obtainedStats[i + 1]?.skillName}: </td>${colorSkillLevel(obtainedStats[i + 1]?.skillLevel)}</td>`
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
        document.querySelector("#individualStats").innerHTML = `<table id="rsTable"> ${statsToShow} </table>`;

        //Add last update time to table
        document.querySelector("#updateTime").innerHTML = `<p>Last updated: <b>${lastUpdated}</b></p>`

    //It shouldnt error unless the worker is dead, but a catch is required
    } catch (error) {
        infoToShow = 
        `<span class="error">Unable to load character data... (${error.message})<span><br><br>`;

        document.querySelector("#mainInfo").innerHTML = `${infoToShow}`;
    }
}

//Adds a color to stats having a certain milestone
function colorSkillLevel(level, xp){
    console.log(xp);
    if(xp >= 2000000000){
        //Gives a purple color to stats with max XP (though thats never gonna happen for me :P)
        return `<td class="maxXP"> ${level}`
    }else if(level >= 120){
        //Gives a blue-ish color to stats that reached 120
        return `<td class="TrueMastery"> ${level}`
    }else if(level >= 99){
        //Gives a golden color to stats that reached 99
        return `<td class="mastery"> ${level}`
    }else{
        return `<td>${level}`
    }
}

//Loads the content, depending on the data provided on the page
document.addEventListener("DOMContentLoaded", () => {
    const username = document.getElementById("contentHolderMain")?.dataset.rsname;

    //EXECUTE
    readRSDataFromProxy(username);
});