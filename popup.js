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
            func:grabImages
        },
        onResult
    )
}

function grabImages() {
    //pulls a list of all img
    const images = document.querySelectorAll("img");
    //converts the list of images into an array
    //then reuturns the urls (image.src) of the img in the array
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