/**
 * Juego de Potencias (Matemáticas 5º).
 */
var PowerGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Calcula la Potencia",
      "Recuerda: El número chiquito arriba (exponente) manda a multiplicar al grande por sí mismo.",
      "🚀"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var base, exp;
    if (level === "facil") {
      base = Math.floor(Math.random() * 9) + 2;
      exp = 2;
    } else if (level === "medio") {
      base = Math.floor(Math.random() * 4) + 2;
      exp = Math.floor(Math.random() * 2) + 3;
    } else {
      base = Math.floor(Math.random() * 3) + 2;
      exp = Math.floor(Math.random() * 2) + 5;
    }
    this.eq = { base: base, exp: exp, res: Math.pow(base, exp) };
  },

  showExample: function (container) {
    var exBase = 4, exExp = 3, exRes = 64;
    var expanded = "4 × 4 × 4";
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2\">Ejemplo de guía: <br><span class=\"text-3xl text-slate-800 math-font ml-4\">" +
      exBase + "<sup class=\"text-xl text-pink-500\">" + exExp + "</sup></span></p>" +
      "<ul class=\"list-decimal pl-6 mt-2 space-y-3\">" +
      "<li><b>La Base:</b> El número grande es el <b>" + exBase + "</b>. Ese es el número que vamos a multiplicar.</li>" +
      "<li><b>El Exponente:</b> El número chiquito arriba es el <b>" + exExp + "</b>. Nos dice que debemos escribir la base esa misma cantidad de veces.</li>" +
      "<li><b>Desglose:</b> Si hacemos caso, escribimos: <br> <span class=\"text-2xl text-pink-600 bg-pink-50 px-2 rounded inline-block mt-1\">" + expanded + "</span></li>" +
      "<li><b>Resultado:</b> Si multiplicas todos esos números, paso a paso, el resultado final es <b>" + exRes + "</b>.</li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");

    var row = document.createElement("div");
    row.className = "flex items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-2";
    row.innerHTML =
      "<div class=\"text-5xl md:text-7xl font-bold\">" +
      this.eq.base +
      "<sup class=\"text-3xl md:text-5xl text-pink-500 ml-1\">" + this.eq.exp + "</sup></div>" +
      " <div class=\"text-4xl md:text-5xl ml-2\">=</div>";
    container.appendChild(row);

    var expandedRow = document.createElement("div");
    expandedRow.className = "flex justify-center w-full mb-6 animate-fade-in";
    var parts = [];
    for (var i = 0; i < this.eq.exp; i++) parts.push(this.eq.base);
    var expandedString = parts.join(" <span class=\"text-pink-400 mx-1\">×</span> ");

    expandedRow.innerHTML =
      "<div class=\"bg-indigo-50/80 border-2 border-indigo-200 text-indigo-700 px-4 py-1 rounded-xl text-2xl md:text-3xl math-font shadow-inner flex items-center justify-center text-center flex-wrap\">" +
      "<span class=\"text-slate-400 text-lg mr-2 font-sans tracking-tight\">es decir: </span> " + expandedString +
      "</div>";
    container.appendChild(expandedRow);

    var self = this;
    generateOptionsUI(
      this.eq.res,
      function (val, btn) { self.verify(val, btn); },
      "El resultado es?:"
    );
  },

  verify: function (val, btn) {
    var self = this;
    if (val === this.eq.res) {
      handleCorrectOption(btn, function () {
        App.updateTeacher(
          "¡Excelente! 🎉",
          "¡Lo tienes! <b>" + self.eq.base + "</b> multiplicado por sí mismo <b>" + self.eq.exp + "</b> veces es igual a <b>" + self.eq.res + "</b>.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      if (val === self.eq.base * self.eq.exp) {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Multiplicaste la base por el exponente (" +
          self.eq.base + " x " + self.eq.exp + " = " + val +
          "). ¡Cuidado! Debes multiplicar la base por SÍ MISMA.";
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Ups, revisa tu cálculo!",
          "Elegiste <b>" + val + "</b>, pero no es correcto. " + errExtra,
          "🫣"
        );
      });
    }
  },

  cleanup: function () {}
};

