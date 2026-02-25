/**
 * Juego de Polinomios / Jerarquía de operaciones (5º Grado).
 */
var PolyGame = {
  tokens: [],
  activeOpIndex: -1,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher("Paso 1: ¿Qué se resuelve primero?", "Toca la <b>operación</b> (+, -, ×) que debes resolver primero siguiendo la jerarquía.", "🧐");
    this.renderRow();
  },

  generateValues: function (level) {
    var rand = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
    var a = rand(2, 9), b = rand(2, 9), c = rand(2, 9);
    if (level === "facil") {
      if (a + b <= c) c = a + b - 1;
      this.tokens = [{ t: "n", v: a }, { t: "o", v: "+" }, { t: "n", v: b }, { t: "o", v: "-" }, { t: "n", v: c }];
    } else if (level === "medio") {
      if (Math.random() > 0.5) {
        this.tokens = [{ t: "n", v: a }, { t: "o", v: "+" }, { t: "n", v: b }, { t: "o", v: "×" }, { t: "n", v: c }];
      } else {
        if (a * b <= c) c = a * b - 1;
        this.tokens = [{ t: "n", v: a }, { t: "o", v: "×" }, { t: "n", v: b }, { t: "o", v: "-" }, { t: "n", v: c }];
      }
    } else {
      if (Math.random() > 0.5) {
        this.tokens = [{ t: "p", v: "(" }, { t: "n", v: a }, { t: "o", v: "+" }, { t: "n", v: b }, { t: "p", v: ")" }, { t: "o", v: "×" }, { t: "n", v: c }];
      } else {
        this.tokens = [{ t: "n", v: a }, { t: "o", v: "×" }, { t: "p", v: "(" }, { t: "n", v: b }, { t: "o", v: "+" }, { t: "n", v: c }, { t: "p", v: ")" }];
      }
    }
  },

  getCorrectOpIndex: function () {
    var startP = -1, endP = -1;
    for (var i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].t === "p" && this.tokens[i].v === "(") startP = i;
      if (this.tokens[i].t === "p" && this.tokens[i].v === ")") { endP = i; break; }
    }
    var searchStart = startP > -1 ? startP + 1 : 0;
    var searchEnd = endP > -1 ? endP : this.tokens.length;
    for (var i = searchStart; i < searchEnd; i++) if (this.tokens[i].t === "o" && this.tokens[i].v === "×") return i;
    for (var i = searchStart; i < searchEnd; i++) if (this.tokens[i].t === "o" && (this.tokens[i].v === "+" || this.tokens[i].v === "-")) return i;
    return -1;
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var oldOps = container.querySelectorAll(".poly-op");
    for (var o = 0; o < oldOps.length; o++) {
      oldOps[o].classList.add("pointer-events-none");
      oldOps[o].removeAttribute("onclick");
    }

    var row = document.createElement("div");
    row.className = "flex items-center justify-center gap-1 md:gap-3 math-font text-slate-700 w-full animate-fade-in mb-4 flex-wrap";
    var html = "";
    this.tokens.forEach(function (tk, i) {
      if (tk.t === "n") html += "<span class=\"font-bold\">" + tk.v + "</span>";
      if (tk.t === "p") html += "<span class=\"poly-paren\">" + tk.v + "</span>";
      if (tk.t === "o") html += "<span class=\"poly-op font-black text-blue-500 px-1 md:px-2\" onclick=\"PolyGame.clickOp(" + i + ", this)\">" + tk.v + "</span>";
    });
    row.innerHTML = html;
    container.appendChild(row);

    if (this.tokens.length === 1 && this.tokens[0].t === "n") {
      row.innerHTML = "<span class=\"font-bold text-green-600 border-b-4 border-green-500 px-4\">" + this.tokens[0].v + "</span> <span class=\"text-red-500 text-3xl md:text-4xl rotate-12 font-bold absolute ml-12 md:ml-16 mt-[-10px]\">✓</span>";
      App.updateTeacher("¡Completado! 🎉", "¡Resolviste todo el polinomio en el orden correcto!", "🌟");
      document.getElementById("success-area").classList.remove("hidden-el");
      App.triggerConfetti();
    }
  },

  clickOp: function (idx, element) {
    var oldOpts = document.getElementById("options-container");
    if (oldOpts) oldOpts.remove();
    var correctIdx = this.getCorrectOpIndex();
    if (idx === correctIdx) {
      var left = this.tokens[correctIdx - 1].v, right = this.tokens[correctIdx + 1].v, op = this.tokens[correctIdx].v;
      App.updateTeacher("¡Bien pensado!", "Elegiste resolver <b>" + left + " " + op + " " + right + "</b>. Según la jerarquía, ¡es exactamente lo que va primero! ¿Cuál es su resultado?", "🤓");
      this.activeOpIndex = idx;
      var result = 0;
      if (op === "+") result = left + right;
      if (op === "-") result = left - right;
      if (op === "×") result = left * right;
      var self = this;
      generateOptionsUI(result, function (val, btn) { self.verify(val, btn, result, left, op, right); });
    } else {
      if (element) {
        element.classList.add("animate-shake", "text-red-500");
        setTimeout(function () { element.classList.remove("animate-shake", "text-red-500"); }, 400);
      }
      var clickedOp = this.tokens[idx].v;
      var opName = (clickedOp === "+" || clickedOp === "-") ? "Suma/Resta" : (clickedOp === "×" ? "Multiplicación" : clickedOp);
      App.updateTeacher("¡Cuidado con la jerarquía!", "Tocaste una <b>" + opName + "</b>. Recuerda: Primero los Paréntesis ( ), luego las Multiplicaciones ×, y de último las Sumas + y Restas -.", "⚠️");
    }
  },

  verify: function (selectedVal, btn, correctResult, left, op, right) {
    var self = this;
    if (selectedVal === correctResult) {
      handleCorrectOption(btn, function () {
        var idx = self.activeOpIndex;
        self.tokens.splice(idx - 1, 3, { t: "n", v: correctResult });
        for (var i = 0; i < self.tokens.length - 2; i++) {
          if (self.tokens[i].t === "p" && self.tokens[i].v === "(" && self.tokens[i + 1].t === "n" && self.tokens[i + 2].t === "p" && self.tokens[i + 2].v === ")") {
            self.tokens.splice(i + 2, 1);
            self.tokens.splice(i, 1);
            break;
          }
        }
        if (self.tokens.length > 1) App.updateTeacher("¡Cálculo correcto!", "¡Muy bien! <b>" + left + " " + op + " " + right + " = " + correctResult + "</b>. Sigamos reduciendo el polinomio. ¿Qué operación va ahora?", "🧐");
        self.renderRow();
      });
    } else {
      handleWrongOption(btn, function () {
        App.updateTeacher("¡Fallo de cálculo!", "Elegiste <b>" + selectedVal + "</b>. Elegir la operación estuvo bien, pero la cuenta de <b>" + left + " " + op + " " + right + "</b> no da ese resultado. ¡Intenta de nuevo!", "✍️");
      });
    }
  }
};
