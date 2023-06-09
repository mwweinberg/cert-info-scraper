//from https://dev.to/andreygermanov/create-a-google-chrome-extension-part-1-image-grabber-1foa

const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click",() => {
    //pull the active tabs
    chrome.tabs.query({active: true}, (tabs) => {
        //set tab equal to the first tab in the array
        var tab = tabs[0];
        //if it exists
        if (tab) {
            execScript(tab);
            //this was added to avoid an error - see https://groups.google.com/a/chromium.org/g/chromium-extensions/c/6TtlYbWWN4Q
            chrome.runtime.lastError;
        //if not
        } else {
            alert("There are no active tabs")
        }
    })
})

function execScript(tab) {
    //execute a fnction on a page of the current browser tab and process the result
    chrome.scripting.executeScript(
        {
            target:{tabId: tab.id, allFrames: true},
            func:grabImages,
            func:grabElements,
            //func:grabElementsHelper(oshwaUid)
        },
        onResult
    )
}

// function grabElementsHelper(field) {
//     let targetField = '.entity-editor__field-group[data-field-api-name="' + field + '"]'
//     const element = document.querySelector(targetField);
//     console.log(element);
//     // Check if the element was found
//     if (element) {
//         // Access the input element within the selected div
//         const inputElement = element.querySelector('input[data-test-id="cf-ui-text-input"]');
        
//         // Check if the input element was found
//         if (inputElement) {
//         // Extract the value
//         const value = inputElement.value;
//         console.log(value);
//         } else {
//         console.log("Input element not found.");
//         }
//     } else {
//         console.log("Element not found.");
//     }

// }

function grabElements() {
    const infoHolder = [];
    
    const projectName = document.querySelector('.entity-editor__field-group[data-field-api-name="projectName"]');
    console.log(projectName);
    // Check if the element was found
    if (projectName) {
        // Access the input element within the selected div
        const inputElement = projectName.querySelector('input[data-test-id="cf-ui-text-input"]');
        
        // Check if the input element was found
        if (inputElement) {
        // Extract the value
        const value = inputElement.value;
        console.log(value);
        infoHolder.push(value);
        } else {
        console.log("Input element not found.");
        infoHolder.push(" ");
        }
    } else {
        console.log("Element not found.");
    }
    
    const oshwaUid = document.querySelector('.entity-editor__field-group[data-field-api-name="oshwaUid"]');
    console.log(oshwaUid);
    // Check if the element was found
    if (oshwaUid) {
        // Access the input element within the selected div
        const inputElement = oshwaUid.querySelector('input[data-test-id="cf-ui-text-input"]');
        
        // Check if the input element was found
        if (inputElement) {
        // Extract the value
        const value = inputElement.value;
        console.log(value);
        infoHolder.push(value);
        } else {
        console.log("Input element not found.");
        infoHolder.push(" ");
        }
    } else {
        console.log("Element not found.");
    }

    const privateContact = document.querySelector('.entity-editor__field-group[data-field-api-name="privateContact"]');
    console.log(privateContact);
    // Check if the element was found
    if (privateContact) {
        // Access the input element within the selected div
        const inputElement = privateContact.querySelector('input[data-test-id="cf-ui-text-input"]');
        
        // Check if the input element was found
        if (inputElement) {
        // Extract the value
        const value = inputElement.value;
        console.log(value);
        infoHolder.push(value);
        } else {
        console.log("Input element not found.");
        infoHolder.push(" ");
        }
    } else {
        console.log("Element not found.");
    }

    const projectDescription = document.querySelector('.entity-editor__field-group[data-field-api-name="projectDescription"]');
    console.log(projectDescription);
    // Check if the element was found
    if (projectDescription) {
        // Access the input element within the selected div
        const inputElement = projectDescription.querySelector('input[data-test-id="cf-ui-text-input"]');
        
        // Check if the input element was found
        if (inputElement) {
        // Extract the value
        const value = inputElement.value;
        console.log(value);
        infoHolder.push(value);
        } else {
        console.log("Project Description element not found.");
        infoHolder.push(" ");
        }
    } else {
        console.log("Element not found.");
    }

    const documentationUrl = document.querySelector('.entity-editor__field-group[data-field-api-name="documentationUrl"]');
    console.log(documentationUrl);
    // Check if the element was found
    if (documentationUrl) {
        // Access the input element within the selected div
        const inputElement = documentationUrl.querySelector('input[data-test-id="cf-ui-text-input"]');
        
        // Check if the input element was found
        if (inputElement) {
        // Extract the value
        const value = inputElement.value;
        console.log(value);
        infoHolder.push(value);
        } else {
        console.log("Documentation Url not found.");
        infoHolder.push(" ");
        }
    } else {
        console.log("Element not found.");
    }



    console.log(infoHolder);

}

//todo: create a function "grabelements" by pulling the first part of this out into a new function
// then update teh execScript function to execute it too
function grabImages() {
    
  

    //pulls a list of all img
    const images = document.querySelectorAll("img");
    //converts the list of images into an array
    //then returns the urls (image.src) of the img in the array
    return Array.from(images).map(image=>image.src);
  
  
}

function onResult(frames) {
    //if script fails on the remote end and cannot return results
    if (!frames || !frames.length) {
        alert("Could not retrieve images from specified page");
        return;
    }
    //combine arrays of the image URLs from each frame into a single array
    const imageUrls = frames.map(frame=>frame.result).reduce((r1,r2)=>r1.concat(r2));
    //copy to the clipboard a string of the image URLs, delimited by carriage return
    window.navigator.clipboard.writeText(imageUrls.join("\n")).then(()=>{
        //close the extensoin popup after data is copied to clipboard
        window.close();
    });
}