let bpm = 90;
let loop = null;
let passo = 0;
let ritmoAtual = null;

const contador = document.getElementById("contador");
const ritmoNome = document.getElementById("ritmoNome");
const bpmControl = document.getElementById("bpmControl");
const bpmValor = document.getElementById("bpmValor");
const notasContainer = document.getElementById("notasContainer");

bpmControl.addEventListener("input", () => {
    bpm = parseInt(bpmControl.value);
    bpmValor.textContent = bpm;
    if(loop) reiniciarLoop();
});

const sons = {
    bumbo: new Audio("assets/bumbo.mp3"),
    caixa: new Audio("assets/caixa.mp3"),
    chimbal: new Audio("assets/chimbal.mp3"),
    crash: new Audio("assets/crash.mp3"),
    ride: new Audio("assets/ride.mp3"),
    surdo: new Audio("assets/surdo.mp3"),
    tom1: new Audio("assets/tom1.mp3"),
    tom2: new Audio("assets/tom2.mp3")
};

const ritmos = {

    popRock: [
        [{peca:"chimbal", duracao:8},{peca:"bumbo", duracao:8}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"caixa", duracao:8}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"bumbo", duracao:8}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"caixa", duracao:8}],
        [{peca:"chimbal", duracao:8}]
    ],

    rock: [
        [{peca:"chimbal", duracao:4},{peca:"bumbo", duracao:4}],
        [{peca:"chimbal", duracao:4}],
        [{peca:"chimbal", duracao:4},{peca:"caixa", duracao:4}],
        [{peca:"chimbal", duracao:4}]
    ],

    samba: [
        [{peca:"chimbal", duracao:8},{peca:"surdo", duracao:4}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"caixa", duracao:4}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"surdo", duracao:4}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"caixa", duracao:4}],
        [{peca:"chimbal", duracao:8}]
    ],

    forro: [
        [{peca:"surdo", duracao:4},{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"caixa", duracao:4},{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8}]
    ],

    valsa: [
        [{peca:"bumbo", duracao:4}],
        [{peca:"caixa", duracao:4}],
        [{peca:"caixa", duracao:4}]
    ],

    bolero: [
        [{peca:"bumbo", duracao:4},{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"caixa", duracao:4},{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8}]
    ],

    funk: [
        [{peca:"chimbal", duracao:8},{peca:"bumbo", duracao:4}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"caixa", duracao:4}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"bumbo", duracao:4}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8},{peca:"caixa", duracao:4}],
        [{peca:"chimbal", duracao:8}]
    ],

    sertanejo: [
        [{peca:"bumbo", duracao:4},{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8}],
        [{peca:"caixa", duracao:4},{peca:"chimbal", duracao:8}],
        [{peca:"chimbal", duracao:8}]
    ]

};

function gerarPartitura() {
    notasContainer.innerHTML = "";

    const posicoes = {
        chimbal: 25,
        caixa: 75,
        bumbo: 125,
        tom1: 50,
        tom2: 50,
        crash: 25,
        ride: 25,
        surdo: 100
    };

    let posX = 40;

    ritmoAtual.forEach((passoNotas, index) => {

        passoNotas.forEach(notaObj => {

            const nota = document.createElement("div");
            nota.classList.add("nota");
            nota.dataset.index = index;

            if(notaObj.duracao === 8) nota.classList.add("colcheia");
            if(notaObj.duracao === 4) nota.classList.add("seminima");
            if(notaObj.duracao === 2) nota.classList.add("minima");

            nota.style.top = posicoes[notaObj.peca] + "px";
            nota.style.left = posX + "px";

            notasContainer.appendChild(nota);
        });

        posX += 60;

        if ((index + 1) % 4 === 0) {
            const barra = document.createElement("div");
            barra.classList.add("barraCompasso");
            barra.style.left = posX - 20 + "px";
            notasContainer.appendChild(barra);
        }
    });
}

function selecionarRitmo(nome){
    ritmoAtual = ritmos[nome];
    ritmoNome.textContent = nome.toUpperCase();
    passo = 0;
    gerarPartitura();
    if(loop) reiniciarLoop();
}

function reiniciarLoop(){
    clearInterval(loop);

    const intervalo = (60 / bpm) * 1000;

    loop = setInterval(()=>{
        contador.textContent = passo + 1;

        const passoNotas = ritmoAtual[passo];
        passoNotas.forEach(n => tocarSom(n.peca));

        destacarNota(passo);

        passo++;
        if(passo >= ritmoAtual.length) passo = 0;

    }, intervalo / 2);
}

function destacarNota(indice){
    const notas = document.querySelectorAll(".nota");
    notas.forEach(n => n.classList.remove("ativaNota"));
    notas.forEach(n => {
        if(parseInt(n.dataset.index) === indice){
            n.classList.add("ativaNota");
        }
    });
}

function tocarSom(nome){
    const som = sons[nome];
    if(!som) return;
    som.currentTime = 0;
    som.play();
    brilho(nome);
}

function brilho(nome){
    const el = document.querySelector("." + nome);
    if(!el) return;
    el.classList.add("ativa");
    setTimeout(()=> el.classList.remove("ativa"),120);
}

function iniciar(){
    if(!ritmoAtual) return;
    reiniciarLoop();
}

function parar(){
    clearInterval(loop);
    loop = null;
    passo = 0;
    contador.textContent = "-";
}

function tocarManual(nome){
    tocarSom(nome);
}

function mostrarInfo(){
    const box = document.getElementById("infoRitmo");
    box.style.display = box.style.display === "block" ? "none" : "block";
}