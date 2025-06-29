let gamepad_index = 0n;
let gamepad_connected = false;
let podeMudarDirecao = true;

function gamepad_mapear() {
  const gamepad = navigator.getGamepads()[gamepad_index]
  console.log('gamepad_mapear', gamepad.axi)
  if (gamepad) {
    if (gamepad.buttons[12].pressed && direcao.y !== 1) {
      // cima
      direcao = { x: 0, y: -1 }
    }
    if (gamepad.buttons[13].pressed && direcao.y !== -1) {
      // baixo
      direcao = { x: 0, y: 1 }
    }
    if (gamepad.buttons[14].pressed && direcao.x !== 1) {
      // esquerda
      direcao = { x: -1, y: 0 }
    }
    if (gamepad.buttons[15].pressed && direcao.x !== -1) {
      // direita
      direcao = { x: 1, y: 0 }
    }
    requestAnimationFrame(gamepad_mapear)
  } else {
    gamepad_connected = false
  }
}

window.addEventListener('gamepadconnected', (event) => {
  gamepad_index = event.gamepad.index
  if (gamepad_connected === false) {
    gamepad_connected = true
    gamepad_mapear()
  }
})

const table = document.getElementById("grade");
const table_size = 17; //pra aumentar o tamanho é só mexer aqui


// cria a grade
for (let y = 0; y < table_size; y++) {
  const linha = document.createElement("tr");
  for (let x = 0; x < table_size; x++) {
    const coluna = document.createElement("td");
    coluna.setAttribute("data-x", x);
    coluna.setAttribute("data-y", y);
    linha.appendChild(coluna);
  }
  table.appendChild(linha);//declaro
}

// ------------CRIAÇÃO DA COBRA
let cobra = [{ x: 5, y: 5 }]; // a cobra começa no meio
let direcao = { x: 0, y: 1 }; // começa indo pra para baixo

function desenharCobra() {
  document.querySelectorAll("td").forEach(td => {
    td.removeAttribute("data-snake");
  });

  cobra.forEach(parte => {
    const celula = document.querySelector(`td[data-x="${parte.x}"][data-y="${parte.y}"]`);
    if (celula) {
      celula.setAttribute("data-snake", "true");
    }
  });
}

// ------------MECÂNICA DA COMIDA
function gerarComida() {
  const celulas = document.querySelectorAll("td"); //pega todas as celulas da grade
  const livres = Array.from(celulas).filter(td =>
    //Array.from(celulas) vai transformar a lista em um array normal...
    !td.hasAttribute("data-snake") && !td.hasAttribute("data-food")
  );  /*.filter(...) vai remover as células que já têm a cobrinha (data-snake) ou já têm comida (data-food), agr só tem as livres */
  if (livres.length === 0) return; //"se não houver nenhuma célula livre, return"
  const aleatoria = livres[Math.floor(Math.random() * livres.length)];
  aleatoria.setAttribute("data-food", "true");// ta marcando essa celula criada pelo const aleatoria como sendo comida :)
}

function moverCobra() {

  const cabeca = cobra[cobra.length - 1];
  //pega a última posição do array cobra, que representa a cabeça atual (laeli).
  //"a propriedade length tem como de retornar a quantidade de caracteres de uma string ou o tamanho de um array."
  const novaCabeca = { x: cabeca.x + direcao.x, y: cabeca.y + direcao.y };
  //calcula onde será a nova cabeça, somando a direção (direcao.x e direcao.y) à posição atual. Isso move a cobrinha para a frente.
  // agora vai verificar a colisão com bordas ou com o próprio corpo hehe
  if (
    novaCabeca.x < 0 || novaCabeca.x >= table_size ||
    //verifica se a cabeça foi para fora da esquerda (x < 0) ou saiu pela direita (x >= table_size
    novaCabeca.y < 0 || novaCabeca.y >= table_size ||
    ////verifica se a cabeça foi para fora por cima (x < 0) ou por baixo (x >= table_size
    cobra.some(parte => parte.x === novaCabeca.x && parte.y === novaCabeca.y)
    //se a novaCabeca estiver no mesmo quadrado de alguma parte.x e parte.y ao mesmo temp, ela "bate" nela mesma
  ) {
    // alert("Perdeu, otário!!");
    clearInterval(loop); //tenho que chamar o clearInterval porque usei o setInterval pra criar o loop da cobre
    podeMudarDirecao = true;
    return;
  }

  //verificando se a cobra comeu a comida ao se mover para uma nova célula
  const celulaNova = document.querySelector(`td[data-x="${novaCabeca.x}"][data-y="${novaCabeca.y}"]`);
  //td[data-x="5"][data-y="7"] "Quero pegar o <td> que tem data-x="5" e data-y="7"".
  // // document.querySelector(...) Procura no HTML a primeira célula <td> que tem essas coordenadas específicas. E retorna essa célula em formato d objeto js
  const comeu = celulaNova?.hasAttribute("data-food");//se a célula tiver data-food então é true
  //"O operador ?. é chamado optional chaining e evita erros caso celulaNova seja null (ou seja, caso a célula não exista)."

  cobra.push(novaCabeca); // adiciona nova cabeça (LAELI)

  if (comeu) {
    celulaNova.removeAttribute("data-food");
    gerarComida(); // nova comida
  } else {
    cobra.shift(); // remove cauda se não comeu
  }

  desenharCobra();
  podeMudarDirecao = true; //pode trocar a direção agora
}

//--------lógica para setas do teclado
document.addEventListener("keydown", (e) => {
  if (!podeMudarDirecao) return;
  // if podeMudarDirecao for false, return (pare aqui)
  if (e.key === "ArrowUp" && direcao.y !== 1) {direcao = { x: 0, y: -1 }
podeMudarDirecao= false;}
  
  else if (e.key === "ArrowDown" && direcao.y !== -1) {direcao = { x: 0, y: 1 };
podeMudarDirecao= false;}
  else if (e.key === "ArrowLeft" && direcao.x !== 1) {direcao = { x: -1, y: 0 }
podeMudarDirecao= false;}
  else if (e.key === "ArrowRight" && direcao.x !== -1) {direcao = { x: 1, y: 0 }
podeMudarDirecao= false;}
});

document.addEventListener("keydown", (e) => {
    if (!podeMudarDirecao) return;
  if (e.key === "w" && direcao.y !== 1) {direcao = { x: 0, y: -1 };
podeMudarDirecao= false;}
  else if (e.key === "s" && direcao.y !== -1) {direcao = { x: 0, y: 1 };
podeMudarDirecao= false;}
  else if (e.key === "a" && direcao.x !== 1) {direcao = { x: -1, y: 0 };
podeMudarDirecao= false;}
  else if (e.key === "d" && direcao.x !== -1) {direcao = { x: 1, y: 0 };
podeMudarDirecao= false;}
});

let loop;

function Start () {
  desenharCobra();
  gerarComida();
  loop = setInterval(moverCobra, 140);
}
//velocidade, quanto menor, mais rápido / setInterval é comando padrão para loop


document.getElementById("start-button").addEventListener("click", function() {
  Start();
  this.disabled = true;
});


document.getElementById("reset-button").addEventListener("click", function () {
  location.reload();
});
//o botão de reset