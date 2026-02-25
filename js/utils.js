/**
 * Utilidades globales de UI: opciones múltiples, feedback y confeti.
 */

function generateOptionsUI(correctAnswer, callback) {
  var optionsSet = new Set([correctAnswer]);
  while (optionsSet.size < 5) {
    var offset = Math.floor(Math.random() * 6) + 1;
    var distractor = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    if (distractor >= 0 && distractor !== correctAnswer) optionsSet.add(distractor);
  }
  var options = Array.from(optionsSet).sort(function () { return Math.random() - 0.5; });

  var container = document.createElement("div");
  container.className = "flex flex-wrap justify-center gap-2 md:gap-3 mt-4 animate-fade-in";
  container.id = "options-container";

  options.forEach(function (opt) {
    var btn = document.createElement("button");
    btn.className = "font-sans bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xl md:text-2xl py-2 px-4 md:px-5 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all tracking-wider";
    btn.innerText = opt;
    btn.onclick = function () { callback(opt, btn); };
    container.appendChild(btn);
  });
  document.getElementById("lines-container").appendChild(container);
}

function handleCorrectOption(btn, successCallback) {
  btn.classList.replace("border-indigo-200", "border-green-500");
  btn.classList.replace("text-indigo-700", "text-white");
  btn.classList.add("bg-green-500");
  document.getElementById("options-container").classList.add("pointer-events-none", "opacity-50");
  setTimeout(function () {
    document.getElementById("options-container").remove();
    successCallback();
  }, 500);
}

function handleWrongOption(btn, msgCallback) {
  btn.classList.replace("border-indigo-200", "border-red-400");
  btn.classList.add("bg-red-50", "text-red-600", "animate-shake");
  msgCallback();
  setTimeout(function () {
    btn.classList.remove("bg-red-50", "text-red-600", "animate-shake");
    btn.classList.replace("border-red-400", "border-indigo-200");
  }, 800);
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
