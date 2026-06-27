let output = [];
const galleryContainer = document.getElementById("gallery");

async function getData(root) {

    //Reads and encodes the location, and decodes the root part because it is stupid and cant read URLs properly
    const jsonLocation = encodeURI(decodeURI(root) + "files.json");

    try {
        const response = await fetch(jsonLocation);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        output = await response.json();

        createGallery(output, root);

    } catch (error) {
        console.error(error.message);
    }
}

function createGallery(images, root){
    images.forEach(element => {
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