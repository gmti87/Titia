// ===================================== // ELEMENTOS HTML // =====================================

const chuva = document.getElementById("chuva");
const relampago = document.getElementById("relampago");

// ===================================== // SISTEMA DE CHUVA // =====================================

function criarGota() {

    const gota = document.createElement("div");

    gota.classList.add("gota");

    gota.style.left = Math.random() * 100 + "vw";

    gota.style.animationDuration =
        (Math.random() * 0.7 + 0.3) + "s";

    gota.style.height =
        (Math.random() * 20 + 10) + "px";

    chuva.appendChild(gota);

    setTimeout(() => {
        gota.remove();
    }, 1200);

}

// Intensidade da chuva

setInterval(criarGota, 15);

// ===================================== // SISTEMA DE ÁUDIO // =====================================

let audioContext = null;

let somAtivo = false;

// Liberar áudio na primeira interação // do visitante com a página

async function iniciarAudio() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    }

    if (audioContext.state === "suspended") {

        await audioContext.resume();

    }

    somAtivo = true;

}

// Primeira interação libera o áudio

document.addEventListener("click", iniciarAudio, { once: true });

document.addEventListener("touchstart", iniciarAudio, { once: true });

// ===================================== // GERAR SOM DO TROVÃO // =====================================

function tocarTrovao() {

    if (!somAtivo || !audioContext) return;

    if (audioContext.state !== "running") return;

    const duracao = 3;

    const tamanho =
        audioContext.sampleRate * duracao;

    const buffer = audioContext.createBuffer(
        1,
        tamanho,
        audioContext.sampleRate
    );

    const dados = buffer.getChannelData(0);


    // Criar ruído do trovão

    for (let i = 0; i < tamanho; i++) {

        const envelope =
            Math.pow(1 - i / tamanho, 2);

        dados[i] =
            (Math.random() * 2 - 1) * envelope;

    }


    // Criar elementos de áudio

    const fonte = audioContext.createBufferSource();

    const volume = audioContext.createGain();

    const filtro = audioContext.createBiquadFilter();


    // Configurar som

    filtro.type = "lowpass";

    filtro.frequency.value = 180;

    fonte.buffer = buffer;

    volume.gain.setValueAtTime(
        0.8,
        audioContext.currentTime
    );


    // Conectar áudio

    fonte.connect(filtro);

    filtro.connect(volume);

    volume.connect(audioContext.destination);


    // Reproduzir trovão

    fonte.start();

}

// ===================================== // SISTEMA DE RELÂMPAGOS // =====================================

function criarRelampago() {

    // Remover efeito anterior

    relampago.classList.remove("ativo");

    void relampago.offsetWidth;


    // Criar novo relâmpago

    relampago.classList.add("ativo");


    // Trovão após o relâmpago

    if (somAtivo) {

        setTimeout(() => {

            tocarTrovao();

        }, Math.random() * 1200 + 300);

    }


    // Próximo relâmpago aleatório

    setTimeout(
        criarRelampago,
        Math.random() * 5000 + 2000
    );

}

// Iniciar tempestade

criarRelampago();