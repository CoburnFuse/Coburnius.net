//Creates the variables required to run the script
let output = [];
const galleryContainer = document.getElementById("gallery");

async function getData(root) {

    //Reads and encodes the location, and decodes the root part because it is stupid and cant read URLs properly
    const jsonLocation = encodeURI(decodeURI(root) + "files.json");

    //Attempts to fetch the JSON file containing the file names
    try {
        const response = await fetch(jsonLocation);

        //Gives an error if the file fails to load
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        //Turns the JSON file into an array
        output = await response.json();

        //Creates the gallery
        createGallery(output, root);

    } catch (error) {
        galleryContainer.innerHTML = `<p class="error">Unable to load gallery images.</p>`;
        console.log(error.message);
    }
}

function createGallery(images, root){

    //Goes through each file in the array and puts them in the gallery element
    images.forEach(element => {

        //Adds the root to it, otherwise it would be just the file name, and then adds it to the element
        element = root + element;
        galleryContainer.innerHTML += `<a href="${element}"><img src="${element}"></a>`;
    });
}

//Loads the content, depending on the data provided on the page
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("contentHolderMain")?.dataset.galleryroot;

    //EXECUTE
    getData(root);
});