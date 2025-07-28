// Listas de 24 íconos únicos para cada tema
const animales = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
  "🐷", "🐸", "🐵", "🙈", "🐔", "🐧", "🐦", "🐤", "🐺", "🐗", "🐴", "🦄",
];
const frutas = [
  "🍎", "🍏", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒",
  "🍑", "🥭", "🍍", "🥝", "🍅", "🥥", "🍆", "🥔", "🌽", "🥒", "🫑", "🥬",
];
const transportes = [
  "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛",
  "🚜", "🛵", "🏍️", "🚲", "🛺", "🚔", "🚍", "🚠", "🚡", "🚢", "🛸", "✈️",
];
const corea = [
  "🇰🇷", "🥢", "🍚", "🍲", "🍜", "🍡", "🥟", "🍗", "🍱", "🎎", "🧧", "🎇",
  "🏯", "🛕", "🫰", "💿", "🎧", "📱", "🎮", "💄", "🎬", "🕺", "👘", "❤️",
];

// Tema adicional de emojis (nuevo array que proporcionaste)
const emojis = [
  '🌞', '🌙', '⭐', '⚡', '🔥', '💧', '🍀', '🌹', '🍎', '🐶', '🐱', '🦊', 
  '🐸', '🐵', '🐘', '🦉', '🐢', '🐝', '🦄', '🧸', '🎩', '👑', '🧪', '🕹️'
];

// Elementos del DOM
const temaSelect = document.getElementById("tema"); // Se obtiene el select del HTML donde el usuario elige el tema
const TABLERO = document.getElementById("tablero"); // El tablero donde se mostrarán las cartas
const TURNO_DISPLAY = document.getElementById("turnoActual"); // Muestra el estado del turno
const JUGADOR_PUNTOS = document.getElementById("jugadorPuntos"); // Muestra los puntos del jugador
const CPU_PUNTOS = document.getElementById("cpuPuntos"); // Muestra los puntos de la CPU

// Variables del juego
let iconosOriginales = []; // Este array almacenará los iconos que se mostrarán en el juego según el tema elegido
let iconosParaJuego = []; // Este array almacenará los iconos duplicados para formar el juego de memoria
let cartasDOM; // Guardará la lista de nodos con las cartas
let cartasSeleccionadas = []; // Cartas actualmente volteadas
let jugadorPuntos = 0; // Puntaje del jugador
let cpuPuntos = 0; // Puntaje de la CPU
let bloqueado = false; // Impide clics mientras se comparan cartas

// Función para mezclar aleatoriamente un array
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Se selecciona un índice aleatorio
    [array[i], array[j]] = [array[j], array[i]]; // Se intercambian los elementos
  }
}

// Función para crear las cartas en el tablero
function crearTablero() {
  mezclar(iconosParaJuego); // Mezcla antes de crear el tablero

  TABLERO.innerHTML = ""; // Limpia el tablero si se reinicia

  // Crear las cartas en el tablero
  for (let i = 0; i < iconosParaJuego.length; i++) {
    const emoji = iconosParaJuego[i]; // Obtiene el emoji de la carta
    const carta = document.createElement("div"); // Crea el elemento de la carta
    carta.className = "carta oculta"; // Clase que hace que la carta esté oculta al principio
    carta.dataset.index = i; // Guardamos el índice de la carta como un atributo de datos
    carta.dataset.emoji = emoji; // Guardamos el emoji de la carta en un atributo de datos
    carta.textContent = ""; // Al principio la carta está vacía (oculta)

    carta.addEventListener("click", () => seleccionarCarta(i)); // Al hacer clic en la carta, se ejecuta la función de selección
    TABLERO.appendChild(carta); // Añade la carta al tablero
  }

  cartasDOM = document.querySelectorAll(".carta"); // Obtiene todos los elementos con la clase 'carta'
}

// Al hacer clic en una carta
function seleccionarCarta(indice) {
  if (bloqueado) return; // Si el juego está bloqueado, no se puede hacer nada

  const carta = cartasDOM[indice]; // Selecciona la carta que fue clickeada
  const emoji = carta.dataset.emoji; // Obtiene el emoji de la carta

  // Si la carta ya está descubierta o ya está seleccionada, no hacer nada
  if (!carta.classList.contains("oculta") || cartasSeleccionadas.some((c) => c.indice === indice)) {
    return;
  }

  carta.classList.remove("oculta"); // Quita la clase de oculta
  carta.textContent = emoji; // Muestra el emoji de la carta

  cartasSeleccionadas.push({ indice, emoji }); // Añade la carta a las seleccionadas

  // Si ya se han seleccionado 2 cartas, se comparan
  if (cartasSeleccionadas.length === 2) {
    bloquearYComparar();
  }
}

// Función para comparar las cartas seleccionadas
function bloquearYComparar() {
  bloqueado = true; // Bloquea el tablero para evitar clics mientras se comparan las cartas

  setTimeout(() => {
    const [c1, c2] = cartasSeleccionadas; // Obtiene las dos cartas seleccionadas

    // Si las cartas coinciden
    if (c1.emoji === c2.emoji) {
      cartaEncontrada(c1, c2); // Si coinciden, las bloqueamos
    } else {
      ocultarCartas(c1, c2); // Si no coinciden, las ocultamos
    }

    cartasSeleccionadas = []; // Reinicia las cartas seleccionadas
    bloqueado = false; // Desbloquea el tablero

    verificarFin(); // Verifica si el juego ha terminado
  }, 1200); // Espera 1.2 segundos para dar tiempo al jugador a ver las cartas
}

// Si hay coincidencia entre dos cartas
function cartaEncontrada(c1, c2) {
  cartasDOM[c1.indice].classList.add("bloqueada"); // Marca las cartas como bloqueadas
  cartasDOM[c2.indice].classList.add("bloqueada");
  jugadorPuntos++; // Suma un punto al jugador
  JUGADOR_PUNTOS.textContent = jugadorPuntos; // Actualiza el puntaje del jugador
}

// Si no hay coincidencia
function ocultarCartas(c1, c2) {
  cartasDOM[c1.indice].classList.add("oculta"); // Vuelve a ocultar las cartas
  cartasDOM[c2.indice].classList.add("oculta");
  cartasDOM[c1.indice].textContent = ""; // Borra el contenido de las cartas
  cartasDOM[c2.indice].textContent = "";
}

// Verificar si el juego ha terminado
function verificarFin() {
  const totalPares = iconosOriginales.length; // Número total de pares en el juego

  // Si el jugador ha encontrado todos los pares
  if (jugadorPuntos >= totalPares) {
    TURNO_DISPLAY.textContent = "🎉 ¡Juego completado!"; // Muestra el mensaje de fin de juego
  }
}

// Manejo de la selección del tema desde el HTML
temaSelect.addEventListener("change", () => {
  const temaElegido = temaSelect.value; // Obtiene el valor del tema seleccionado

  // Asigna el tema correspondiente según la selección
  switch (temaElegido) {
    case "animales":
      iconosOriginales = [...animales];
      break;
    case "frutas":
      iconosOriginales = [...frutas];
      break;
    case "transportes":
      iconosOriginales = [...transportes];
      break;
    case "corea":
      iconosOriginales = [...corea];
      break;
    case "emojis":
      iconosOriginales = [...emojis]; // Añadido el caso de emojis
      break;
  }

  // Duplicar los iconos para el juego y crear el tablero
  iconosParaJuego = [...iconosOriginales, ...iconosOriginales];
  crearTablero();
});

// Inicialización del juego con el primer tema
iconosOriginales = [...animales]; // Tema por defecto
iconosParaJuego = [...iconosOriginales, ...iconosOriginales]; // Duplicamos para formar el juego de memoria
crearTablero();
