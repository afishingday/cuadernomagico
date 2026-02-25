/**
 * Juego de Circuitos Digitales / Álgebra de Boole (11º Grado).
 */
var CircuitGame = {
  tokens: [],
  answer: 0,
  currentRuleOp: "",

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher("Paso 1: Expresión Booleana", "Aplica las reglas del Álgebra de Boole (AND, OR, NOT) para determinar el estado lógico final del circuito.", "⚡");
    this.renderRow();
  },

  evaluate: function (left, op, right) {
    if (op === "Y") return (left === 1 && right === 1) ? 1 : 0;
    if (op === "O") return (left === 1 || right === 1) ? 1 : 0;
    return 0;
  },

  generateValues: function (level) {
    var randBit = function () { return Math.random() > 0.5 ? 1 : 0; };
    var randOp = function () { return Math.random() > 0.5 ? "Y" : "O"; };
    var a = randBit(), b = randBit(), c = randBit();
    var op1 = randOp(), op2 = randOp();
    if (level === "facil") {
      this.tokens = [a, op1, b];
      this.answer = this.evaluate(a, op1, b);
      this.currentRuleOp = op1;
    } else if (level === "medio") {
      if (Math.random() > 0.5) {
        this.tokens = ["NO", a, op1, b];
        this.answer = this.evaluate(a === 1 ? 0 : 1, op1, b);
      } else {
        this.tokens = [a, op1, "NO", b];
        this.answer = this.evaluate(a, op1, b === 1 ? 0 : 1);
      }
      this.currentRuleOp = "NO";
    } else {
      this.tokens = ["(", a, op1, b, ")", op2, c];
      var temp = this.evaluate(a, op1, b);
      this.answer = this.evaluate(temp, op2, c);
      this.currentRuleOp = "Compuesto";
    }
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-wrap items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-4";
    var html = "";
    var self = this;
    this.tokens.forEach(function (tk) {
      if (tk === 1) {
        html += "<span class=\"flex items-center gap-1 bg-green-100 text-green-700 border-2 border-green-400 px-3 md:px-4 py-1 rounded-xl font-black text-2xl md:text-4xl shadow-sm\"><span class=\"text-lg md:text-2xl\">💡</span> 1</span>";
      } else if (tk === 0) {
        html += "<span class=\"flex items-center gap-1 bg-red-100 text-red-700 border-2 border-red-400 px-3 md:px-4 py-1 rounded-xl font-black text-2xl md:text-4xl shadow-sm\"><span class=\"text-lg md:text-2xl opacity-50\">🌑</span> 0</span>";
      } else if (tk === "Y" || tk === "O" || tk === "NO") {
        html += "<span class=\"font-black text-cyan-600 px-1 md:px-2 text-3xl md:text-5xl uppercase\">" + tk + "</span>";
      } else {
        html += "<span class=\"font-bold text-slate-400 px-1 text-3xl md:text-5xl\">" + tk + "</span>";
      }
    });
    html += "<div class=\"text-4xl md:text-5xl font-bold text-slate-400 mx-2\">=</div>";
    html += "<div id=\"circuit-answer-slot\" class=\"flex items-center justify-center min-w-[80px] h-[60px] border-4 border-dashed border-slate-300 rounded-2xl text-slate-400 text-3xl bg-white/50 shadow-inner\">?</div>";
    row.innerHTML = html;
    container.appendChild(row);
    this.generateOptions();
  },

  generateOptions: function () {
    var container = document.createElement("div");
    container.className = "flex flex-wrap justify-center gap-4 mt-6 md:mt-10 animate-fade-in";
    container.id = "options-container";
    var options = [
      { val: 1, label: "💡 Es 1 (Verdadero)", color: "border-green-400 text-green-700 hover:bg-green-50" },
      { val: 0, label: "🌑 Es 0 (Falso)", color: "border-red-400 text-red-700 hover:bg-red-50" }
    ];
    options.sort(function () { return Math.random() - 0.5; });
    var self = this;
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "font-sans bg-white border-4 " + opt.color + " font-bold text-xl md:text-2xl py-3 px-6 rounded-2xl shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none transition-all";
      btn.innerText = opt.label;
      btn.onclick = function () { self.verify(opt.val, btn); };
      container.appendChild(btn);
    });
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (selectedVal, btn) {
    if (selectedVal === this.answer) {
      btn.classList.add("opacity-50", "pointer-events-none");
      document.getElementById("options-container").classList.add("pointer-events-none");
      var slot = document.getElementById("circuit-answer-slot");
      if (this.answer === 1) {
        slot.className = "flex items-center justify-center gap-1 bg-green-100 border-4 border-green-500 px-4 py-1 rounded-2xl shadow-sm relative";
        slot.innerHTML = "<span class=\"text-2xl\">💡</span><span class=\"font-black text-4xl text-green-700\">1</span><span class=\"text-red-500 text-3xl md:text-4xl rotate-12 font-bold absolute -right-6 -top-4\">✓</span>";
      } else {
        slot.className = "flex items-center justify-center gap-1 bg-red-100 border-4 border-red-500 px-4 py-1 rounded-2xl shadow-sm relative";
        slot.innerHTML = "<span class=\"text-2xl opacity-50\">🌑</span><span class=\"font-black text-4xl text-red-700\">0</span><span class=\"text-red-500 text-3xl md:text-4xl rotate-12 font-bold absolute -right-6 -top-4\">✓</span>";
      }
      App.updateTeacher("¡Excelente! 🎉", "¡Correcto! Evaluaste bien las compuertas lógicas y el resultado del circuito es efectivamente <b>" + this.answer + "</b>.", "🤖");
      setTimeout(function () {
        document.getElementById("options-container").remove();
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      }, 500);
    } else {
      btn.classList.add("bg-slate-100", "text-slate-400", "border-slate-300", "animate-shake");
      var tip = "Recuerda: la compuerta <b>Y (AND)</b> solo da 1 si AMBOS son 1. La compuerta <b>O (OR)</b> da 1 si AL MENOS UNO es 1.";
      if (this.currentRuleOp === "NO") tip = "¡Ojo! Tienes una compuerta <b>NO (NOT)</b>, esto significa que antes de operar debes invertir ese valor (un 1 se vuelve 0, y viceversa).";
      App.updateTeacher("¡Cortocircuito lógico!", "Elegiste <b>" + selectedVal + "</b>, pero el circuito no da ese resultado final. " + tip, "⚡");
      setTimeout(function () {
        btn.classList.remove("bg-slate-100", "text-slate-400", "border-slate-300", "animate-shake");
      }, 800);
    }
  }
};
