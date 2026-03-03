/**
 * Juego de Estadística (Moda y Media, Matemáticas 5º).
 */
var StatGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Calcula la " + this.eq.target.toUpperCase(),
      "Lee atentamente la lista de datos recopilados y encuentra el valor que te piden.",
      "📊"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var targets = ["moda", "media"];
    var target = targets[Math.floor(Math.random() * targets.length)];

    var nums = [];
    var res;

    if (target === "moda") {
      var base = [2, 3, 4, 5, 6, 7];
      var mode = base[Math.floor(Math.random() * base.length)];
      nums = [mode, mode, mode, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1];
      nums.sort(function () { return Math.random() - 0.5; });
      res = mode;
    } else {
      var mean = Math.floor(Math.random() * 6) + 4;
      nums = [mean, mean + 1, mean - 1, mean + 2, mean - 2];
      nums.sort(function () { return Math.random() - 0.5; });
      res = mean;
    }

    this.eq = { target: target, nums: nums, res: res };
  },

  showExample: function (container) {
    var isModa = this.eq.target === "moda";
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl capitalize\">Ejemplo: Encontrar la " + this.eq.target + "</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      (isModa
        ? "<li><b>Datos de ejemplo:</b> Imagina que tenemos: <span class=\"bg-white border px-2 rounded font-bold\">2, 5, 5, 8, 9</span>.</li>" +
          "<li><b>Regla:</b> La Moda es simplemente el número que más se repite (el que está 'de moda' en el grupo).</li>" +
          "<li><b>Observa:</b> Si miramos uno por uno, nos damos cuenta que el número <b>5</b> aparece más veces que los demás. Esa sería la respuesta.</li>"
        : "<li><b>Datos de ejemplo:</b> Imagina que tenemos: <span class=\"bg-white border px-2 rounded font-bold\">4, 6, 8, 10</span>.</li>" +
          "<li><b>Regla:</b> La Media (o Promedio) requiere que sumes todos los números y dividas ese gran total entre la cantidad de números que sumaste.</li>" +
          "<li><b>Suma total:</b> 4 + 6 + 8 + 10 = <b>28</b>.</li>" +
          "<li><b>División:</b> Como sumamos 4 números, dividimos el total entre 4. <br> 28 ÷ 4 = <b>7</b>. El promedio es 7.</li>"
      ) +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-4 math-font text-slate-700 w-full animate-fade-in mb-4";

    var numsHTML = this.eq.nums
      .map(function (n) {
        return "<div class=\"bg-yellow-100 border-4 border-yellow-400 text-yellow-700 px-4 py-2 rounded-2xl text-3xl font-black shadow-sm\">" + n + "</div>";
      })
      .join("");

    row.innerHTML =
      "<p class=\"text-xl md:text-2xl text-slate-500 mb-2\">Datos recopilados:</p>" +
      "<div class=\"flex flex-wrap justify-center gap-3\">" + numsHTML + "</div>";

    container.appendChild(row);

    var self = this;
    generateOptionsUI(
      this.eq.res,
      function (val, btn) { self.verify(val, btn); },
      "Entonces la <b>" + this.eq.target.toUpperCase() + "</b> es?:"
    );
  },

  verify: function (val, btn) {
    var self = this;
    if (val === this.eq.res) {
      handleCorrectOption(btn, function () {
        App.updateTeacher(
          "¡Análisis Perfecto! 🎉",
          "¡Genial! La " + self.eq.target + " de estos datos es exactamente <b>" + self.eq.res + "</b>.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      if (this.eq.target === "moda") {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> La MODA es el número que <b>más se repite</b> en el grupo. Fíjate bien cuál aparece más veces.";
      } else {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> La MEDIA (Promedio) se calcula <b>sumando todos los números</b> y luego dividiendo el resultado entre la cantidad total de números (que son 5).";
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Cuidado con los datos!",
          "Elegiste <b>" + val + "</b>, pero no es correcto. " + errExtra,
          "🫣"
        );
      });
    }
  },

  cleanup: function () {}
};

