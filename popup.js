//from https://dev.to/andreygermanov/create-a-google-chrome-extension-part-1-image-grabber-1foa

let infoHolder = [];
const grabBtn = document.getElementById("grabBtn");

grabBtn.addEventListener("click", () => {
    // Pull the active tabs
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab) {
            execScript(tab);
            // Handle potential runtime errors
            chrome.runtime.lastError;
        } else {
            alert("There are no active tabs.");
        }
    });
});

function execScript(tab) {
    // Execute a function on a page of the current browser tab and process the result
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id, allFrames: true },
            func: grabElements,
        },
        (results) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                processResults(results);
            }
        }
    );
}

function grabElements() {
    const infoHolder = [];

    function extractValue(selector) {
        const fieldGroup = document.querySelector(selector);
        if (fieldGroup) {
            const inputElement = fieldGroup.querySelector('input[data-test-id="cf-ui-text-input"]');
            return inputElement ? inputElement.value : " ";
        }
        return " ";
    }

    function extractCodeMirrorContent(selector) {
        const fieldGroup = document.querySelector(selector);
        if (fieldGroup) {
            const codeMirrorElement = fieldGroup.querySelector('.CodeMirror .CodeMirror-code');
            if (codeMirrorElement) {
                return Array.from(codeMirrorElement.querySelectorAll('.CodeMirror-line'))
                    .map(line => line.textContent)
                    .join('\n'); // Join lines to form full description
            }
        }
        return " ";
    }

    infoHolder.push(extractValue('.entity-editor__field-group[data-field-api-name="projectName"]'));
    infoHolder.push(extractValue('.entity-editor__field-group[data-field-api-name="oshwaUid"]'));
    infoHolder.push(extractValue('.entity-editor__field-group[data-field-api-name="privateContact"]'));
    infoHolder.push(extractCodeMirrorContent('.entity-editor__field-group[data-field-api-name="projectDescription"]'));
    // infoHolder.push(extractValue('.entity-editor__field-group[data-field-api-name="documentationUrl"]'));

    return infoHolder;
}

function processResults(results) {
    if (results && results[0] && results[0].result) {
        const infoHolder = results[0].result;

        // Join array elements with tabs for TSV format
        const tsvData = infoHolder.join("\t");

        // Copy to clipboard
        navigator.clipboard.writeText(tsvData)
            .then(() => {
                // alert("Data copied to clipboard. You can now paste it into a spreadsheet.");
                console.log("Data copied to clipboard. You can now paste it into a spreadsheet.")
                window.close();
            })
            .catch(err => {
                console.error("Error copying to clipboard:", err);
                alert("Failed to copy data to clipboard.");
            });
    } else {
        console.log("No data retrieved from the page.");
    }
}
