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

socket.on("textStyle", function (data) {
    console.log(data.styleText[0][0]);
    let answEl = document.getElementById("answer");
    answEl.innerHTML = "Стиль цього текстку - " + data.styleText[0][0] + " з ймовірністю " + data.styleText[0][1] + "%";
    answEl.style.visibility = "visible";
})