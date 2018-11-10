let socket = io.connect();
let textarea = document.getElementById("textBox");

textarea.value = "";

function sendText() {
    socket.emit('text', {
        text: textarea.value
    });
}

function toTextarea(e) {
    textarea.value = e.innerText;
}

function translateStyle(style) {
    switch (style) {
        case "hudozhiny":
            return "художній";
        case "science":
            return "науковий";
        case "rozmovny":
            return "розмовний";
        case "official_business":
            return "офіційно-діловий";
        case "publicistik":
            return "публіцистичний";
        default:
            break;
    }
}

socket.on("textStyle", function (data) {
    console.log(data.styleText[0][0]);
    let answEl = document.getElementById("answer");
    answEl.innerHTML = "Стиль цього текстку - " + translateStyle(data.styleText[0][0]);
    // answEl.innerHTML = "Стиль цього текстку - " + data.styleText[0][0] + " з ймовірністю " + data.styleText[0][1] + "%";
    answEl.style.visibility = "visible";
})