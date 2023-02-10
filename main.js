let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let textInput = document.getElementById("textInput");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let insertImage = document.getElementById("insertImage");
let spacingButtons = document.querySelectorAll(".spacing")
let formatButtons = document.querySelectorAll(".format")
let scriptButtons = document.querySelectorAll(".script");
let fontList = ["Arial", "Verdana", "Tahoma", "Trebuchet MS", "Times New Roman", "Garamond", "Georgia", "cursive", "Courier New", "Brush Script MT"];
let clickToConvert = document.getElementById("clickToConvert");
const recordBtn = document.querySelector(".record"),
    result = textInput;
inputLanguage = document.querySelector("#language"),
    clearBtn = document.querySelector(".clear");
const initializer = () => {
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);
    fontList.map(value => {
        let option = document.createElement("option");
        option.value = value;
        option.innerHTML = value;
        fontName.appendChild(option);
    });
    for (let i = 1; i <= 7; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = "h" + i;
        fontSizeRef.appendChild(option);
    }
    fontSizeRef.value = 3;
};
const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value);
    textInput.focus();
};
optionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        modifyText(button.id, false, null);
    });
});
const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            if (needsRemoval) {
                let alreadyActive = false;
                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }
                highlighterRemover(className);
                if (!alreadyActive) {
                    button.classList.add("active");
                }
            } else {
                button.classList.toggle("active");
            }
        });
    });
};
insertImage.addEventListener("click", () => {
    let url = prompt('Enter the link here:', 'http://');
    document.execCommand(insertImage.id, false, url);
    textInput.getElementsByTagName('img')[1].parentNode.removeChild(textInput.getElementsByTagName('img')[1]);
    textInput.focus()
})
linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter a URL");
    // if link has http then pass directly else add http
    if (/http/i.test(userLink)) {
        modifyText(linkButton.id, falase, userLink)
    } else {
        userLink = "http://" + userLink;
        modifyText(linkButton.id, false, userLink);
    }
});
const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};
advancedOptionButton.forEach((button) => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, button.value);
    });
});
const fileName = document.getElementById("fileName")

function fileHandle(value) {
    if (value === 'new') {
        textInput.innerHTML = "";
        fileName.value = "untitled";
    } else if (value === "txt") {
        const blob = new Blob([textInput.innerText]);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName.value}.txt`;
        link.click();
    } else if (value === "pdf") {
        var opt = {
            margin: 1,
            filename: fileName.value,
            image: { type: 'pdf', quality: 0.98 }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(textInput).save();

    }
}
/*
speech recognition
*/
let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
    recognition,
    recording = false;

function populateLanguages() {
    languages.forEach((lang) => {
        const option = document.createElement("option");
        option.value = lang.code;
        option.innerHTML = lang.name;
        inputLanguage.appendChild(option);
    });
}

populateLanguages();

function speechToText() {
    try {
        recognition = new SpeechRecognition();
        recognition.lang = inputLanguage.value;
        recognition.interimResults = true;
        recordBtn.classList.add("recording");
        recordBtn.querySelector("p").innerHTML = "Listening...";
        recognition.start();
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            //detect when intrim results
            if (event.results[0].isFinal) {
                result.innerHTML += " " + speechResult;
                result.querySelector("p").remove();
            } else {
                //creative p with class interim if not already there
                if (!document.querySelector(".interim")) {
                    const interim = document.createElement("p");
                    interim.classList.add("interim");
                    result.appendChild(interim);
                }
                //update the interim p with the speech result
                document.querySelector(".interim").innerHTML = " " + speechResult;
            }
        };
        recognition.onspeechend = () => {
            speechToText();
        };
        recognition.onerror = (event) => {
            stopRecording();
            if (event.error === "no-speech") {
                alert("No speech was detected. Stopping...");
            } else if (event.error === "audio-capture") {
                alert(
                    "No microphone was found. Ensure that a microphone is installed."
                );
            } else if (event.error === "not-allowed") {
                alert("Permission to use microphone is blocked.");
            } else if (event.error === "aborted") {
                alert("Listening Stopped.");
            } else {
                alert("Error occurred in recognition: " + event.error);
            }
        };
    } catch (error) {
        recording = false;

        console.log(error);
    }
}

recordBtn.addEventListener("click", () => {
    if (!recording) {
        speechToText();
        recording = true;
    } else {
        stopRecording();
    }
});

function stopRecording() {
    recognition.stop();
    recordBtn.querySelector("p").innerHTML = "Start Listening";
    recordBtn.classList.remove("recording");
    recording = false;
}


clearBtn.addEventListener("click", () => {
    result.innerHTML = "";
});

function removeMark() {
    let paragraph = textInput.innerHTML;
    paragraph = paragraph.replaceAll("<mark>", "");
    paragraph = paragraph.replaceAll("</mark>", "");
    textInput.innerHTML = paragraph;
}
lastSearchedWords = ""

function wordSearch() {
    removeMark();
    let textToSearch = document.getElementById("textToSearch").value;
    let paragraph = textInput.innerHTML
    if (paragraph.search(textToSearch) < 0) {
        let notFound = document.getElementById("notFound");
        notFound.innerText = "not Found";
        removeMark();
    } else {
        paragraph = paragraph.replaceAll(textToSearch, "<mark>" + textToSearch + "</mark>");
        textInput.innerHTML = paragraph;
    }
}
textInput.onfocus = removeMark;

/* trie*/
function makeNode(ch) {
    this.ch = ch;
    this.isTerminal = false;
    this.map = {};
    this.words = [];
}

function add(str, i, root) {
    if (i === str.length) {
        root.isTerminal = true;
        return;
    }
    if (!root.map[str[i]])
        root.map[str[i]] = new makeNode(str[i]);
    root.words.push(str);
    add(str, i + 1, root.map[str[i]]);
}

function search(str, i, root) {
    if (i === str.length)
        return root.words;
    if (!root.map[str[i]])
        return [];
    return search(str, i + 1, root.map[str[i]]);
}
window.onload = initializer();