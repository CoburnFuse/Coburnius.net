const fs = require('fs');
const root = __dirname;

//Set folders
const inputFolder = root + "/pages/";
const outputFolder = root + "/dist/";
const componentsFolder = root + "/components/";

function replaceContents() {
    
    //Create components
    const componentNavbar = fs.readFileSync(componentsFolder + "/navbar.html", 'utf-8');
    const componentHeader = fs.readFileSync(componentsFolder + "/header.html", 'utf-8');

    //Copy everything from the pages folder and put it in the dist folder
    fs.cpSync(inputFolder, outputFolder, {recursive:true});

    //Put everything in an array to go through
    const allFilesInFolders = fs.readdirSync(outputFolder, {recursive:true})

    //Go through everything in the dist folder and make changes as needed
    allFilesInFolders.forEach(function (file){

        //Get the first folder (or file) for the navbar
        let currentNav = file.split(/[./\\]/)[0];

        //Skip anything that isnt an html file
        if(file.endsWith('.html')){
            let fileContents = fs.readFileSync(outputFolder + file, 'utf-8');

            //Makes a copy of the navbar so it can be re-used
            let navbarToAdd = componentNavbar;
            navbarToAdd = navbarToAdd.replace(`href='/${currentNav}.html'`, `href='/${currentNav}.html' id="currentPage"`);

            //Replaces stuff and saves it to the dist folder
            fileContents = fileContents.replace("<!-- NAVBAR_INCLUDE -->", navbarToAdd);
            fileContents = fileContents.replace("<!-- HEADER_INCLUDE -->", componentHeader);

            //Adds scripts that are required for the page
            fileContents = addRelevantScriptsToPage(file, fileContents);

            fs.writeFileSync(outputFolder + file, fileContents);
        }
    });
}

//For now a hacky way to add the modules to the relevant pages
function addRelevantScriptsToPage(file, fileContents){
    if(file == "index.html"){
        return fileContents = fileContents.replace("<!-- SCRIPT_INCLUDE -->", `<script type="module" src="/assets/scripts/index.js"></script>`);
    }else if(/gamesiplay[\/\\]runescape[\/\\][^\/\\]+\.html/.test(file)){

        //Adds to any runescape user page
        return fileContents = fileContents.replace("<!-- SCRIPT_INCLUDE -->",`<script type="module" src="/assets/scripts/rs.js"></script>`);
    }else{
        return fileContents = fileContents.replace("<!-- SCRIPT_INCLUDE -->", "");
    }
}

//EXECUTE
replaceContents();