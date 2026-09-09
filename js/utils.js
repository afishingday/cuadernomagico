/**
 * Utilidades globales de UI: opciones múltiples, feedback y confeti.
 */

/**
 * Pinta una lista de opciones ya decidida (números o textos). La opción
 * correcta se compara en cada juego (verify), aquí solo se dibujan botones.
 * Sirve para los juegos que necesitan distractores "con sentido" (el error
 * típico que la teoría advierte) en vez de simples vecinos ±1..6.
 */
function renderOptionsUI(options, callback, prefixText) {
  var shuffled = options.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
  }

  var container = document.createElement("div");
  container.className = "flex flex-col items-center w-full mt-4 md:mt-6 animate-fade-in";
  container.id = "options-container";

  if (prefixText) {
    var prefix = document.createElement("div");
    prefix.className = "text-xl md:text-2xl text-slate-500 mb-3 math-font text-center";
    prefix.innerHTML = prefixText;
    container.appendChild(prefix);
  }

  var btnsDiv = document.createElement("div");
  btnsDiv.className = "flex flex-wrap justify-center gap-2 md:gap-3";

  shuffled.forEach(function (opt) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "font-sans bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xl md:text-2xl py-2 px-4 md:px-5 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all tracking-wider";
    btn.innerText = opt;
    btn.onclick = function () { callback(opt, btn); };
    btnsDiv.appendChild(btn);
  });
  container.appendChild(btnsDiv);
  document.getElementById("lines-container").appendChild(container);
}

/**
 * Opciones numéricas: la correcta + distractores.
 * - `preferred` (opcional): lista de distractores "con sentido" que se usan
 *   primero (p. ej. base × exponente en Potencias). Se descartan los que
 *   coincidan con la correcta, sean negativos o no sean enteros.
 * - Luego se completa hasta 5 con vecinos ±1..6 de la correcta.
 */
function generateOptionsUI(correctAnswer, callback, prefixText, preferred) {
  var options = [correctAnswer];
  var seen = {};
  seen[correctAnswer] = true;

  if (Array.isArray(preferred)) {
    preferred.forEach(function (d) {
      if (options.length >= 5) return;
      if (typeof d !== "number" || !isFinite(d) || d !== Math.round(d)) return;
      if (d < 0 || seen[d]) return;
      seen[d] = true;
      options.push(d);
    });
  }

  var guard = 0;
  while (options.length < 5 && guard < 200) {
    guard++;
    var offset = Math.floor(Math.random() * 6) + 1;
    var distractor = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    if (distractor >= 0 && !seen[distractor]) {
      seen[distractor] = true;
      options.push(distractor);
    }
  }
  // Si la correcta es muy pequeña (0, 1, 2) puede faltar espacio por abajo: completa por arriba.
  var up = correctAnswer + 7;
  while (options.length < 5) {
    if (!seen[up]) { seen[up] = true; options.push(up); }
    up++;
  }

  renderOptionsUI(options, callback, prefixText);
}

function awardExercisePoints() {
  if (typeof App !== "undefined" && App.onCorrectAnswer) App.onCorrectAnswer();
}

function handleCorrectOption(btn, successCallback, opts) {
  opts = opts || {};
  btn.classList.replace("border-indigo-200", "border-green-500");
  btn.classList.replace("text-indigo-700", "text-white");
  btn.classList.add("bg-green-500");
  var container = document.getElementById("options-container");
  if (container) container.classList.add("pointer-events-none", "opacity-50");
  // Recordamos QUÉ contenedor era: si en los 500 ms de espera se genera otro
  // ejercicio (cambio de nivel o de tema), no se borran sus opciones nuevas ni
  // se dan puntos por un ejercicio que la niña no resolvió.
  setTimeout(function () {
    var current = document.getElementById("options-container");
    if (container && current !== container) return;
    if (current) current.remove();
    successCallback();
    if (opts.awardPoints !== false) awardExercisePoints();
  }, 500);
}

function handleWrongOption(btn, msgCallback) {
  // Para Sofía: feedback cálido en ámbar en lugar de rojo
  var isSofia = typeof App !== "undefined" && App.user && App.user.id === "zorro";
  var borderErr  = isSofia ? "border-amber-400" : "border-red-400";
  var bgErr      = isSofia ? "bg-amber-50"      : "bg-red-50";
  var textErr    = isSofia ? "text-amber-700"    : "text-red-600";
  btn.classList.replace("border-indigo-200", borderErr);
  btn.classList.add(bgErr, textErr, "animate-shake");
  msgCallback();
  registerWrongAttempt();
  setTimeout(function () {
    btn.classList.remove(bgErr, textErr, "animate-shake");
    btn.classList.replace(borderErr, "border-indigo-200");
  }, 800);
}

/**
 * Cuenta un error para el andamiaje (pista automática al 3.º, sugerencia de
 * nivel al 5.º). Los juegos con su propio estilo de error (Español,
 * Probabilidad, operadores de Polinomios) lo llaman directo.
 */
function registerWrongAttempt() {
  var isSofia = typeof App !== "undefined" && App.user && App.user.id === "zorro";
  if (isSofia && typeof App !== "undefined" && App.Scaffold) App.Scaffold.onWrong();
}

/* Sistema de confeti */
var confettiCanvas = document.getElementById("confetti");
var confettiCtx = confettiCanvas && confettiCanvas.getContext("2d");
if (confettiCanvas && confettiCtx) {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  window.addEventListener("resize", function () {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });
}

var particles = [];
function triggerConfetti() {
  if (!confettiCtx || !confettiCanvas) return;
  particles = [];
  for (var i = 0; i < 100; i++) {
    particles.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 1) * 20 - 5,
      size: Math.random() * 10 + 5,
      color: "hsl(" + Math.random() * 360 + ", 100%, 60%)",
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    });
  }
  requestAnimationFrame(renderConfetti);
}
function renderConfetti() {
  if (!confettiCtx || !confettiCanvas) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  var active = false;
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.vy += 0.5;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotSpeed;
    if (p.y < confettiCanvas.height + 50) active = true;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot * Math.PI / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    confettiCtx.restore();
  }
  if (active) requestAnimationFrame(renderConfetti);
}
