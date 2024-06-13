// JavaScript source code
const mapa = document.getElementById("mapa")
const Biniciar = document.getElementById("iniciar")
const Breiniciar = document.getElementById("reiniciar")
const gameOverFX = new Audio('fx/gameOver.mp3')
const comidaFX = new Audio('fx/comida.mp3')
const partidaFX = new Audio('fx/partida.mp3')
const menuFX = new Audio('fx/menu.mp3')
let lienzo = mapa.getContext("2d")
let intervalo
let puntaje = document.getElementById("puntaje")
let perdiste = document.getElementById("lose")
let i = 0 // variable que cuenta los puntos y de ahi sale la logica de las partes de la culebrita
let partes = [0]
let culebra = {
    posX: 200,
    posY: 200,
    alto: 50,
    ancho: 50,
    velocidadX: 0,
    velocidadY:0,
}
let comida = {
    posX: aleatorio(0, 9) * 50,
    posY: aleatorio(0, 9) * 50,
    alto: 50,
    ancho: 50,
}
class parte {
    constructor(posX, posY) {
        this.posX = posX
        this.posY = posY
    }

}

function cambioInicial() {
    let botonIniciar = document.getElementById("botonIniciar")
    let consola = document.getElementById("consola")
    botonIniciar.style.display = "none"
    consola.style.display = "block"
    // Sonido de inicio del juego 
    menuFX.volume = 0.25
    menuFX.loop = true
    menuFX.play()
}
function volumen1(v,c){
    partidaFX.volume = v
    menuFX.volume = v
    // Obtén todos los elementos con la clase ".vol"
    const elementosVol = document.querySelectorAll(".vol");

    // Restablece el color de fondo de todos los elementos
    elementosVol.forEach((elemento) => {
        elemento.style.backgroundColor = "white";
        elemento.style.border = "innerit"
        elemento.style.borderRadius = "5px"
    });
    document.getElementsByClassName("vol")[c].style.backgroundColor = "#e4389dff"
    document.getElementsByClassName("vol")[c].style.border = "none"
    document.getElementsByClassName("vol")[c].style.borderRadius = "5px"
}


function iniciarMapa() {
    mapa.width = 500
    mapa.height = 500
    window.addEventListener("keydown", mover)
    juego()
    partidaFX.loop = true
    partidaFX.currentTime = 0
    partidaFX.play()
    menuFX.pause()
    Biniciar.style.display = "none"
    Breiniciar.style.display = "block"
    document.getElementById("como_jugar").style.display = "none"
    document.getElementById("mapa").style.display = "block"
}

function reiniciarJuego() {
    document.getElementById("como_jugar").style.display = "flex"
    document.getElementById("mapa").style.display = "none"
    Biniciar.style.display = "block"
    Breiniciar.style.display = "none"
    partidaFX.pause()
    menuFX.currentTime = 0
    menuFX.play()
    culebra.posX = 200
    culebra.posY = 200
    culebra.velocidadX = 0
    culebra.velocidadY = 0
    partes = [0]
    comida.posX = aleatorio(0, 9) * 50
    comida.posY = aleatorio(0, 9) * 50
    i = 0
    puntaje.innerHTML = i
}

function juego() {
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    culebra.posX += culebra.velocidadX
    culebra.posY += culebra.velocidadY
    lienzo.fillRect(culebra.posX, culebra.posY, culebra.alto, culebra.ancho)
    lienzo.fillRect(comida.posX, comida.posY, comida.alto, comida.ancho)
    // Dibuja cada parte de la clase parte en el arreglo partes
    partes.forEach((elemento) => {
        lienzo.fillRect(elemento.posX, elemento.posY, 50, 50)
    })
    clearInterval(intervalo)
    intervalo = setInterval(juego, 500 - (i * 10))
    colision()
}

function colision() {
    let colisiones = 0
    // Colision con la comida, crea una comida nueva inmediatamente y la dibuja
    if (culebra.posX == comida.posX && culebra.posY == comida.posY) {
        let parteN = new parte(culebra.posX, culebra.posY)
        partes[i] = parteN
        i += 1
        puntaje.innerHTML = i
        generarComida()
    } else if (culebra.posX < 0 || culebra.posX == mapa.width || culebra.posY < 0 || culebra.posY == mapa.height) {
        clearInterval(intervalo)
        gameOverFX.play()
        partidaFX.pause()
    }
    // Asignacion de cada parte con las coordenadas de la parte superior
    for (let e = partes.length - 1; e >= 0; e--) {
        if (e == 0) {
            partes[e].posX = culebra.posX
            partes[e].posY = culebra.posY
        } else {
            partes[e].posX = partes[e - 1].posX
            partes[e].posY = partes[e - 1].posY
        }
    }
    // Comprobacion de colision consigo mismo, excepto con la primer parte
    for (let e = partes.length - 1; e > 0; e--) {
        if (culebra.posX == partes[e].posX && culebra.posY == partes[e].posY) {
            clearInterval(intervalo)
            gameOverFX.play()
            partidaFX.pause()
        }
    }
}

function generarComida() {
    let coli;
    do {
        comida.posX = aleatorio(0, 9) * 50;
        comida.posY = aleatorio(0, 9) * 50;
        coli = partes.some(elemento => comida.posX == elemento.posX && comida.posY == elemento.posY);
    } while (coli);
    lienzo.fillRect(comida.posX, comida.posY, comida.alto, comida.ancho);
    comidaFX.play()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function moverDerecha() {
    culebra.velocidadX = 50
    culebra.velocidadY = 0
}

function moverIzquierda() {
    culebra.velocidadX = -50
    culebra.velocidadY = 0
}

function moverAbajo() {
    culebra.velocidadX = 0
    culebra.velocidadY = 50
}

function moverArriba() {
    culebra.velocidadX = 0
    culebra.velocidadY = -50
}

function mover(event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
            moverArriba()
            break;
        case "ArrowLeft":
        case "A":
        case "a":
            moverIzquierda()
            break;
        case "ArrowRight":
        case "D":
        case "d":
            moverDerecha()
            break;
        case "ArrowDown":
        case "S":
        case "s":
            moverAbajo()
            break;
        default:
            break;
    }
}

