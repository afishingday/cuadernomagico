/**
 * Juego de Circuitos Digitales / Álgebra de Boole (11º Grado).
 */
var CircuitGame = {
  tokens: [],
  answer: 0,
  currentRuleOp: "",
  _lastKey: null,

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
    var attempts = 0;
    do {
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
      attempts++;
    } while (this.tokens.join(" ") === this._lastKey && attempts < 10); // sin repetir el anterior
    this._lastKey = this.tokens.join(" ");
  },

  // Paso a paso con el circuito ACTUAL: resuelve NO, luego paréntesis, luego el resto.
  showExample: function (container) {
    var tk = this.tokens.slice();
    var steps = [];
    var exprStr = function (arr) { return arr.join(" "); };
    steps.push("<li><b>Tu circuito:</b> <span class=\"math-font text-xl\">" + exprStr(tk) + "</span></li>");

    // 1) NO
    for (var i = 0; i < tk.length; i++) {
      if (tk[i] === "NO") {
        var v = tk[i + 1];
        var inv = v === 1 ? 0 : 1;
        steps.push("<li><b>Compuerta NO:</b> invierte el valor de al lado: NO " + v + " = <b>" + inv + "</b>. Queda: <span class=\"math-font text-xl\">" + exprStr(tk.slice(0, i).concat([inv]).concat(tk.slice(i + 2))) + "</span></li>");
        tk.splice(i, 2, inv);
        i--;
      }
    }
    // 2) Paréntesis
    var open = tk.indexOf("(");
    if (open !== -1) {
      var close = tk.indexOf(")");
      var inner = tk.slice(open + 1, close);
      var innerRes = this.evaluate(inner[0], inner[1], inner[2]);
      steps.push("<li><b>Paréntesis primero:</b> " + inner.join(" ") + " = <b>" + innerRes + "</b>" + this._ruleText(inner[1], inner[0], inner[2]) + ". Queda: <span class=\"math-font text-xl\">" + exprStr(tk.slice(0, open).concat([innerRes]).concat(tk.slice(close + 1))) + "</span></li>");
      tk.splice(open, close - open + 1, innerRes);
    }
    // 3) Operación final
    if (tk.length === 3) {
      var res = this.evaluate(tk[0], tk[1], tk[2]);
      steps.push("<li><b>Operación final:</b> " + tk.join(" ") + " = <b>" + res + "</b>" + this._ruleText(tk[1], tk[0], tk[2]) + ".</li>");
    }

    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Lógica de las Compuertas</p>" +
      "<ul class=\"list-disc pl-6 space-y-2 text-base font-sans mb-4\">" +
      "<li><span class=\"font-bold text-cyan-700 bg-cyan-100 px-2 rounded\">Compuerta Y (AND):</span> Es estricta. Solo da <b>1</b> si <b>AMBAS</b> entradas son 1. Si hay un solo 0, da 0.</li>" +
      "<li><span class=\"font-bold text-cyan-700 bg-cyan-100 px-2 rounded\">Compuerta O (OR):</span> Es amigable. Da <b>1</b> si <b>AL MENOS UNA</b> de las entradas es 1.</li>" +
      "<li><span class=\"font-bold text-cyan-700 bg-cyan-100 px-2 rounded\">Compuerta NO (NOT):</span> Es rebelde. Toma el número que tiene al lado y lo invierte: 1 → 0 y 0 → 1.</li>" +
      "<li><b>Orden:</b> primero NO, luego lo que está entre paréntesis, y al final el resto de izquierda a derecha.</li>" +
      "</ul>" +
      "<p class=\"font-bold text-pink-800 mb-2 border-b-2 border-pink-200 pb-2 text-lg\">👉 Paso a paso con tu circuito</p>" +
      "<ol class=\"list-decimal pl-6 space-y-3 text-base font-sans\">" + steps.join("") + "</ol>" +
      "</div>";
  },

  _ruleText: function (op, l, r) {
    if (op === "Y") return (l === 1 && r === 1) ? " (las dos entradas son 1)" : " (hay al menos un 0, y la Y exige que ambas sean 1)";
    if (op === "O") return (l === 1 || r === 1) ? " (basta con que una sea 1)" : " (las dos son 0, y la O necesita al menos un 1)";
    return "";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-wrap items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-4";
    var html = "";
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
    if (Math.random() < 0.5) options.reverse();
    var self = this;
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-sans bg-white border-4 " + opt.color + " font-bold text-xl md:text-2xl py-3 px-6 rounded-2xl shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none transition-all";
      btn.innerText = opt.label;
      btn.onclick = function () { self.verify(opt.val, btn); };
      container.appendChild(btn);
    });
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (selectedVal, btn) {
    var self = this;
    if (selectedVal === this.answer) {
      btn.classList.add("opacity-50", "pointer-events-none");
      var optsNow = document.getElementById("options-container");
      if (optsNow) optsNow.classList.add("pointer-events-none");
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
        var opts = document.getElementById("options-container");
        if (optsNow && opts !== optsNow) return;
        if (opts) opts.remove();
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
        if (typeof awardExercisePoints === "function") awardExercisePoints();
      }, 500);
    } else {
      btn.classList.add("bg-slate-100", "opacity-60", "animate-shake");
      var tip = "Recuerda: la compuerta <b>Y (AND)</b> solo da 1 si AMBOS son 1. La compuerta <b>O (OR)</b> da 1 si AL MENOS UNO es 1.";
      if (this.currentRuleOp === "NO") tip = "¡Ojo! Tienes una compuerta <b>NO (NOT)</b>, esto significa que antes de operar debes invertir ese valor (un 1 se vuelve 0, y viceversa).";
      if (this.currentRuleOp === "Compuesto") tip = "Resuelve primero lo que está entre <b>paréntesis</b> y luego opera ese resultado con el último valor.";
      App.updateTeacher("¡Cortocircuito lógico!", "Elegiste <b>" + selectedVal + "</b>, pero el circuito no da ese resultado final. " + tip, "⚡");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();
      setTimeout(function () {
        btn.classList.remove("bg-slate-100", "opacity-60", "animate-shake");
      }, 800);
    }
  },

  cleanup: function () {}
};
