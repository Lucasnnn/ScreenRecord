let mediaRecorder;

const recordButton = document.getElementById("recordButton");

let isRecording = false;

recordButton.addEventListener("click", () => {
  isRecording = !isRecording;

  if (isRecording) {
    this.gravar();
    recordButton.textContent = "Parar";
    recordButton.classList.add("recording");
    recordButton.style.animation = "pulse 1s infinite";
  } else {
    this.parar();
    recordButton.textContent = "Gravar";
    recordButton.classList.remove("recording");
    recordButton.style.animation = "none";
  }
});

async function gravar() {
  let stream = await recordScreen();
  let mimeType = "video/webm";
  mediaRecorder = createRecorder(stream, mimeType);
  let node = document.createElement("p");
  node.textContent = "Iniciou";
  document.body.appendChild(node);
}

function parar() {
  mediaRecorder.stop();
  let node = document.createElement("p");
  node.textContent = "Parou";
  document.body.appendChild(node);
}

async function recordScreen() {
  return await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: { mediaSource: "screen" },
  });
}

function createRecorder(stream, mimeType) {
  let recordedChunks = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };
  mediaRecorder.onstop = function () {
    saveFile(recordedChunks);
    recordedChunks = [];
  };
  mediaRecorder.start(200);
  return mediaRecorder;
}

function saveFile(recordedChunks) {
  const blob = new Blob(recordedChunks, {
    type: "video/webm",
  });
  let filename = window.prompt("Nome do arquivo :"),
    downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${filename}.webm`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(blob);
  document.body.removeChild(downloadLink);
}

