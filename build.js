var fs = require('fs');
var root = __dirname;

//Set folders
var distFolder = root + "/dist/";
var pagesFolder = root + "/pages/";
var componentsFolder = root + "/components/";

function replaceContents() {
    
    //Create components
    var componentNavbar = fs.readFileSync(componentsFolder + "/navbar.html", 'utf-8');
    var componentHeader = fs.readFileSync(componentsFolder + "/header.html", 'utf-8');

    //Create dist folder if it doesnt exist yet
    if (!fs.existsSync(distFolder)) {
        fs.mkdirSync(distFolder);
    }

    //Copy everything from the pages folder and put it in the dist folder
    fs.cpSync(pagesFolder, distFolder, {recursive:true});

    //Put everything in an array to go through
    var allFilesInFolders = fs.readdirSync(distFolder, {recursive:true})

    //Go through everything in the dist folder and make changes as needed
    allFilesInFolders.forEach(function (file){

        //Skip if its a folder, folders (in my case) do not have dots
        if(file.endsWith('.html')){
            var fileContents = fs.readFileSync(distFolder + file, 'utf-8');
            fileContents = fileContents.replace("<!-- NAVBAR_INCLUDE -->", componentNavbar);
            fileContents = fileContents.replace("<!-- HEADER_INCLUDE -->", componentHeader);
            fs.writeFileSync(distFolder + file, fileContents);
        }
    })
}

//EXECUTE
replaceContents();