var tempoRestante = 300;
var pontos = 0;
var intervalo = null;
var pecaSelecionada = null;
var pausado = false;
var jogoAtivo = false;

window.onload = function () {
  iniciarPartida();
};

function iniciarPartida() {
  clearInterval(intervalo);
  tempoRestante = 300;
  pontos = 0;
  pecaSelecionada = null;
  pausado = false;
  jogoAtivo = true;

  document.getElementById("pontos").innerText = pontos;
  document.getElementById("mensagem").innerText = "";
  document.getElementById("btnPausar").innerText = "Pausar";

  atualizarTempo();
  criarPuzzle();

  intervalo = setInterval(function () {
    if (!pausado && jogoAtivo) {
      tempoRestante--;
      atualizarTempo();
      if (tempoRestante <= 0) {
        clearInterval(intervalo);
        jogoAtivo = false;
        bloquearPecas();
        document.getElementById("mensagem").innerText = "Tempo esgotado! Pontos: " + pontos;
      }
    }
  }, 1000);
}

function atualizarTempo() {
  var min = Math.floor(tempoRestante / 60);
  var seg = tempoRestante % 60;
  if (min < 10) min = "0" + min;
  if (seg < 10) seg = "0" + seg;
  document.getElementById("tempo").innerText = min + ":" + seg;
}

function pausar() {
  if (!jogoAtivo) return;
  pausado = !pausado;
  document.getElementById("btnPausar").innerText = pausado ? "Continuar" : "Pausar";
}

function voltarInicio() {
  window.location.href = "inicio.html";
}

function criarPuzzle() {
  var puzzle = document.getElementById("puzzle");
  puzzle.innerHTML = "";

  var ordem = [];
  for (var i = 0; i < 16; i++) {
    ordem.push(i);
  }
  for (var i = ordem.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = ordem[i];
    ordem[i] = ordem[j];
    ordem[j] = tmp;
  }

  for (var k = 0; k < 16; k++) {
    var n = ordem[k];
    var col = n % 4;
    var lin = Math.floor(n / 4);

    var peca = document.createElement("div");
    peca.className = "peca";
    peca.setAttribute("data-correta", n);
    peca.style.backgroundPosition = "-" + (col * 100) + "px -" + (lin * 100) + "px";
    peca.onclick = function () {
      selecionarPeca(this);
    };
    puzzle.appendChild(peca);
  }
}

function selecionarPeca(peca) {
  if (pausado || !jogoAtivo) return;
  if (peca.classList.contains("bloqueada")) return;

  if (pecaSelecionada == null) {
    peca.classList.add("selecionada");
    pecaSelecionada = peca;
  } else if (pecaSelecionada == peca) {
    peca.classList.remove("selecionada");
    pecaSelecionada = null;
  } else {
    trocarPecas(pecaSelecionada, peca);
    pecaSelecionada.classList.remove("selecionada");
    pecaSelecionada = null;
    verificarVitoria();
  }
}

function trocarPecas(a, b) {
  var puzzle = document.getElementById("puzzle");
  var marcador = document.createElement("div");
  puzzle.insertBefore(marcador, a);
  puzzle.insertBefore(a, b);
  puzzle.insertBefore(b, marcador);
  puzzle.removeChild(marcador);
}

function verificarVitoria() {
  var pecas = document.getElementsByClassName("peca");
  for (var i = 0; i < pecas.length; i++) {
    if (parseInt(pecas[i].getAttribute("data-correta")) != i) {
      return;
    }
  }
  jogoAtivo = false;
  clearInterval(intervalo);
  pontos = tempoRestante * 10;
  document.getElementById("pontos").innerText = pontos;
  document.getElementById("mensagem").innerText = "Parabéns! Você venceu! Pontuação: " + pontos;
  bloquearPecas();
}

function bloquearPecas() {
  var pecas = document.getElementsByClassName("peca");
  for (var i = 0; i < pecas.length; i++) {
    pecas[i].classList.add("bloqueada");
    pecas[i].onclick = null;
  }
}
