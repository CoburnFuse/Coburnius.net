var fs = require('fs');
var root = __dirname;

//Set folders
var inputFolder = root + "/pages/";
var outputFolder = root + "/dist/";
var componentsFolder = root + "/components/";

function replaceContents() {
    
    //Create components
    var componentNavbar = fs.readFileSync(componentsFolder + "/navbar.html", 'utf-8');
    var componentHeader = fs.readFileSync(componentsFolder + "/header.html", 'utf-8');

    //Copy everything from the pages folder and put it in the dist folder
    fs.cpSync(inputFolder, outputFolder, {recursive:true});

    //Put everything in an array to go through
    var allFilesInFolders = fs.readdirSync(outputFolder, {recursive:true})

    //Go through everything in the dist folder and make changes as needed
    allFilesInFolders.forEach(function (file){

        //Get the first folder (or file) for the navbar
        var currentNav = file.split(/[./\\]/)[0];

        //Skip anything that isnt an html file
        if(file.endsWith('.html')){
            var fileContents = fs.readFileSync(outputFolder + file, 'utf-8');

            //Makes a copy of the navbar so it can be re-used
            var navbarToAdd = componentNavbar;
            navbarToAdd = navbarToAdd.replace(`href='/${currentNav}.html'`, `href='/${currentNav}.html' id="currentPage"`);

            //Add the Queen of Poi to the homepage
            if(currentNav == "index"){
                navbarToAdd = navbarToAdd.replace(`id="currentPage"`, `id="currentPage" onclick="playPoi()"`);
            }

            //Replaces stuff and saves it to the dist folder
            fileContents = fileContents.replace("<!-- NAVBAR_INCLUDE -->", navbarToAdd);
            fileContents = fileContents.replace("<!-- HEADER_INCLUDE -->", componentHeader);
            fs.writeFileSync(outputFolder + file, fileContents);
        }
    });
}

//EXECUTE
replaceContents();