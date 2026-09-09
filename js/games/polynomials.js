/**
 * Juego de Polinomios / Jerarquía de operaciones (5º Grado).
 * Regla que se practica: 1º paréntesis, 2º × y ÷, 3º + y −; y si hay varias
 * del mismo nivel, de izquierda a derecha.
 */
var PolyGame = {
  tokens: [],
  activeOpIndex: -1,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher("Paso 1: ¿Qué se resuelve primero?", "Toca la <b>operación</b> (+, −, ×, ÷) que debes resolver primero siguiendo la jerarquía. Si hay varias del mismo nivel, empieza por la de la <b>izquierda</b>.", "🧐");
    this.renderRow();
  },

  generateValues: function (level) {
    var rand = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
    var a = rand(2, 9), b = rand(2, 9), c = rand(2, 9);
    var n = function (v) { return { t: "n", v: v }; };
    var o = function (v) { return { t: "o", v: v }; };
    var p = function (v) { return { t: "p", v: v }; };
    if (level === "facil") {
      if (a + b <= c) c = a + b - 1;
      this.tokens = [n(a), o("+"), n(b), o("-"), n(c)];
    } else if (level === "medio") {
      var pick = rand(1, 3);
      if (pick === 1) {
        this.tokens = [n(a), o("+"), n(b), o("×"), n(c)];
      } else if (pick === 2) {
        if (a * b <= c) c = a * b - 1;
        this.tokens = [n(a), o("×"), n(b), o("-"), n(c)];
      } else {
        // División exacta: (b × k) ÷ b + c
        var k = rand(2, 9);
        this.tokens = [n(b * k), o("÷"), n(b), o("+"), n(c)];
      }
    } else {
      var pickD = rand(1, 3);
      if (pickD === 1) {
        this.tokens = [p("("), n(a), o("+"), n(b), p(")"), o("×"), n(c)];
      } else if (pickD === 2) {
        this.tokens = [n(a), o("×"), p("("), n(b), o("+"), n(c), p(")")];
      } else {
        if (a <= b) a = b + rand(1, 3);
        this.tokens = [p("("), n(a), o("-"), n(b), p(")"), o("×"), n(c)];
      }
    }
  },

  _exprString: function () {
    return this.tokens.map(function (tk) { return tk.v; }).join(" ");
  },

  showExample: function (container) {
    // Explica con el ejercicio actual: cuál operación va primero y por qué.
    var idx = this.getCorrectOpIndex();
    var expr = this._exprString();
    var reason, firstOp = "";
    if (idx > -1) {
      var left = this.tokens[idx - 1].v, right = this.tokens[idx + 1].v, op = this.tokens[idx].v;
      firstOp = left + " " + op + " " + right;
      var inParen = this._isInsideParens(idx);
      if (inParen) {
        reason = "Hay un <b>paréntesis</b>, y lo de adentro es lo primero de todo.";
      } else if (op === "×" || op === "÷") {
        reason = "Las <b>multiplicaciones y divisiones</b> van antes que las sumas y restas, aunque estén más a la derecha.";
      } else {
        reason = "Solo hay sumas y restas (mismo nivel), así que se resuelve de <b>izquierda a derecha</b>: la primera es la de más a la izquierda.";
      }
    }
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2\">Tu ejercicio:<br><span class=\"text-3xl text-slate-800 math-font ml-4\">" +
      expr + "</span></p>" +
      "<p class=\"font-bold text-indigo-800 mb-2\"><b>Jerarquía Mágica:</b> 1º ( ), 2º × y ÷, 3º + y −. Si hay varias del mismo nivel: de izquierda a derecha.</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li>" + reason + " En este caso la primera es: <span class=\"bg-yellow-200 px-2 rounded\">" + firstOp + "</span>.</li>" +
      "<li>Toca ese operador y el cuaderno te pedirá que calcules ese pedacito.</li>" +
      "<li>Al acertar, el cuaderno reemplaza esa cuenta por su resultado y el polinomio queda más corto. ¡Y repites el proceso hasta que quede un solo número!</li>" +
      "</ul>" +
      "</div>";
  },

  _parenRange: function () {
    var startP = -1, endP = -1;
    for (var i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].t === "p" && this.tokens[i].v === "(") startP = i;
      if (this.tokens[i].t === "p" && this.tokens[i].v === ")") { endP = i; break; }
    }
    return { start: startP, end: endP };
  },

  _isInsideParens: function (idx) {
    var r = this._parenRange();
    return r.start > -1 && r.end > -1 && idx > r.start && idx < r.end;
  },

  _isHigh: function (v) { return v === "×" || v === "÷"; },

  getCorrectOpIndex: function () {
    var r = this._parenRange();
    var searchStart = r.start > -1 ? r.start + 1 : 0;
    var searchEnd = r.end > -1 ? r.end : this.tokens.length;
    for (var i = searchStart; i < searchEnd; i++) if (this.tokens[i].t === "o" && this._isHigh(this.tokens[i].v)) return i;
    for (var j = searchStart; j < searchEnd; j++) if (this.tokens[j].t === "o" && (this.tokens[j].v === "+" || this.tokens[j].v === "-")) return j;
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
      if (tk.t === "o") html += "<button type=\"button\" class=\"poly-op font-black text-blue-500 px-2 md:px-3 py-1 rounded-lg bg-blue-50 border-2 border-dashed border-blue-200\" onclick=\"PolyGame.clickOp(" + i + ", this)\" title=\"Toca para resolver esta operación\">" + tk.v + "</button>";
    });
    row.innerHTML = html;
    container.appendChild(row);

    if (this.tokens.length === 1 && this.tokens[0].t === "n") {
      row.innerHTML = "<span class=\"font-bold text-green-600 border-b-4 border-green-500 px-4\">" + this.tokens[0].v + "</span> <span class=\"text-red-500 text-3xl md:text-4xl rotate-12 font-bold absolute ml-12 md:ml-16 mt-[-10px]\">✓</span>";
      App.updateTeacher("¡Completado! 🎉", "¡Resolviste todo el polinomio en el orden correcto!", "🌟");
      document.getElementById("success-area").classList.remove("hidden-el");
      App.triggerConfetti();
      if (typeof awardExercisePoints === "function") awardExercisePoints();
    }
  },

  clickOp: function (idx, element) {
    var oldOpts = document.getElementById("options-container");
    // Si ya acertó el número y está en la pausa de medio segundo, no se toca nada.
    if (oldOpts && oldOpts.classList.contains("pointer-events-none")) return;
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
      if (op === "÷") result = left / right;
      var self = this;
      generateOptionsUI(result, function (val, btn) { self.verify(val, btn, result, left, op, right); });
    } else {
      if (element) {
        element.classList.add("animate-shake", "text-red-500");
        setTimeout(function () { element.classList.remove("animate-shake", "text-red-500"); }, 400);
      }
      var clickedOp = this.tokens[idx].v;
      var correctOp = correctIdx > -1 ? this.tokens[correctIdx].v : "";
      var clickedHigh = this._isHigh(clickedOp);
      var correctHigh = this._isHigh(correctOp);
      var msg;
      if (correctIdx > -1 && this._isInsideParens(correctIdx) && !this._isInsideParens(idx)) {
        msg = "Hay un <b>paréntesis ( )</b> y lo de adentro se resuelve primero, siempre.";
      } else if (clickedHigh === correctHigh) {
        msg = "Esa operación es del <b>mismo nivel</b> que la correcta, pero cuando hay varias iguales se resuelven de <b>izquierda a derecha</b>. Empieza por la que está más a la izquierda.";
      } else if (!clickedHigh && correctHigh) {
        msg = "Tocaste una <b>suma o resta</b>, pero las <b>multiplicaciones y divisiones</b> son más fuertes y van primero, aunque estén más a la derecha.";
      } else {
        msg = "Recuerda el orden: 1º Paréntesis ( ), 2º Multiplicaciones × y Divisiones ÷, 3º Sumas + y Restas −.";
      }
      App.updateTeacher("¡Ojo con el orden!", msg, "🤔");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();
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
      }, { awardPoints: false });
    } else {
      handleWrongOption(btn, function () {
        App.updateTeacher("¡Casi! Verifica la cuenta", "Elegiste <b>" + selectedVal + "</b>. Elegir la operación estuvo bien, pero la cuenta de <b>" + left + " " + op + " " + right + "</b> da un resultado distinto. ¡Vuelve a intentarlo!", "🤔");
      });
    }
  },

  cleanup: function () {
    this.activeOpIndex = -1;
  }
};
