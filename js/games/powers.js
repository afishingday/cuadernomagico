/**
 * Juego de Potencias (Matemáticas 5º).
 * Los números se mantienen en rango de 5º: cuadrados hasta 12², cubos y
 * potencias chicas, y las potencias de 10 como patrón visual.
 */
var PowerGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Calcula la Potencia",
      "Recuerda: el número chiquito de arriba (exponente) dice <b>cuántas veces</b> se multiplica el grande (base) por sí mismo.",
      "🚀"
    );
    this.renderRow();
  },

  _rand: function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  generateValues: function (level) {
    var base, exp;
    if (level === "facil") {
      // Cuadrados: la introducción a las potencias (2² a 12²).
      base = this._rand(2, 12);
      exp = 2;
    } else if (level === "medio") {
      if (Math.random() < 0.25) {
        // Potencias de 10: patrón de ceros (100, 1000, 10000).
        base = 10;
        exp = this._rand(2, 4);
      } else {
        // Cuadrados grandes y cubos chicos (máximo 15² = 225 o 6³ = 216).
        exp = Math.random() < 0.5 ? 2 : 3;
        base = exp === 2 ? this._rand(8, 15) : this._rand(2, 6);
      }
    } else if (Math.random() < 0.2) {
      base = 10;
      exp = this._rand(3, 6);
    } else {
      // Exponentes 3 a 5 con bases chicas (máximo 5⁵ = 3125).
      exp = this._rand(3, 5);
      base = exp === 3 ? this._rand(3, 9) : (exp === 4 ? this._rand(2, 6) : this._rand(2, 5));
    }
    this.eq = { base: base, exp: exp, res: Math.pow(base, exp) };
  },

  showExample: function (container) {
    var eq = this.eq || { base: 4, exp: 3, res: 64 };
    var exBase = eq.base, exExp = eq.exp, exRes = eq.res;
    var parts = [];
    for (var i = 0; i < exExp; i++) parts.push(exBase);
    var expanded = parts.join(" × ");
    // Multiplicación paso a paso con los números del ejercicio actual.
    var steps = "";
    var acc = exBase;
    for (var k = 1; k < exExp; k++) {
      var next = acc * exBase;
      steps += "<br>" + acc + " × " + exBase + " = <b>" + next + "</b>";
      acc = next;
    }
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2\">Ejemplo con tu ejercicio: <br><span class=\"text-3xl text-slate-800 math-font ml-4\">" +
      exBase + "<sup class=\"text-xl text-pink-500\">" + exExp + "</sup></span></p>" +
      "<ul class=\"list-decimal pl-6 mt-2 space-y-3\">" +
      "<li><b>La Base:</b> El número grande es el <b>" + exBase + "</b>. Ese es el número que vamos a multiplicar.</li>" +
      "<li><b>El Exponente:</b> El número chiquito arriba es el <b>" + exExp + "</b>. Nos dice que debemos escribir la base esa misma cantidad de veces.</li>" +
      "<li><b>Desglose:</b> Si hacemos caso, escribimos: <br> <span class=\"text-2xl text-pink-600 bg-pink-50 px-2 rounded inline-block mt-1\">" + expanded + "</span></li>" +
      "<li><b>Multiplica de a poquitos:</b> " + steps + "</li>" +
      "<li><b>Resultado:</b> " + exBase + "<sup>" + exExp + "</sup> = <b>" + exRes + "</b>. ¡Ojo! No es " + exBase + " × " + exExp + " = " + (exBase * exExp) + ".</li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var eq = this.eq;

    var row = document.createElement("div");
    row.className = "flex items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-2";
    row.innerHTML =
      "<div class=\"text-5xl md:text-7xl font-bold\">" +
      eq.base +
      "<sup class=\"text-3xl md:text-5xl text-pink-500 ml-1\">" + eq.exp + "</sup></div>" +
      " <div class=\"text-4xl md:text-5xl ml-2\">=</div>";
    container.appendChild(row);

    var expandedRow = document.createElement("div");
    expandedRow.className = "flex justify-center w-full mb-6 animate-fade-in";
    var parts = [];
    for (var i = 0; i < eq.exp; i++) parts.push(eq.base);
    var expandedString = parts.join(" <span class=\"text-pink-400 mx-1\">×</span> ");

    expandedRow.innerHTML =
      "<div class=\"bg-indigo-50/80 border-2 border-indigo-200 text-indigo-700 px-4 py-1 rounded-xl text-2xl md:text-3xl math-font shadow-inner flex items-center justify-center text-center flex-wrap\">" +
      "<span class=\"text-slate-400 text-lg mr-2 font-sans tracking-tight\">es decir: </span> " + expandedString +
      "</div>";
    container.appendChild(expandedRow);

    var self = this;
    // Distractores con sentido: base × exponente (el error clásico), una
    // multiplicación de menos o de más, y base + exponente.
    var preferred = [
      eq.base * eq.exp,
      Math.pow(eq.base, eq.exp - 1),
      Math.pow(eq.base, eq.exp + 1) <= 100000 ? Math.pow(eq.base, eq.exp + 1) : eq.res + 10,
      eq.base + eq.exp
    ];
    generateOptionsUI(
      eq.res,
      function (val, btn) { self.verify(val, btn); },
      "¿Cuál es el resultado?",
      preferred
    );
  },

  verify: function (val, btn) {
    var eq = this.eq;
    if (val === eq.res) {
      handleCorrectOption(btn, function () {
        App.updateTeacher(
          "¡Excelente! 🎉",
          "¡Lo tienes! <b>" + eq.base + "</b> multiplicado por sí mismo <b>" + eq.exp + "</b> veces es igual a <b>" + eq.res + "</b>.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra;
      if (val === eq.base * eq.exp) {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Multiplicaste la base por el exponente (" +
          eq.base + " × " + eq.exp + " = " + val +
          "). ¡Cuidado! Debes multiplicar la base por SÍ MISMA " + eq.exp + " veces.";
      } else if (val === Math.pow(eq.base, eq.exp - 1)) {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Te faltó una multiplicación: la base va <b>" + eq.exp + " veces</b>, no " + (eq.exp - 1) + ".";
      } else if (val === Math.pow(eq.base, eq.exp + 1)) {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Multiplicaste una vez de más: la base va <b>" + eq.exp + " veces</b>, no " + (eq.exp + 1) + ".";
      } else if (val === eq.base + eq.exp) {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Sumaste la base y el exponente. Una potencia es una <b>multiplicación</b> repetida, no una suma.";
      } else {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Escribe la base " + eq.exp + " veces con × en medio y multiplica de a dos en dos. Si te enredas, abre el Paso a Paso.";
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Casi! Recuerda el proceso",
          "Elegiste <b>" + val + "</b>, pero ese no es el resultado. " + errExtra,
          "🤔"
        );
      });
    }
  },

  cleanup: function () {}
};
