/**
 * Juego de Geometría (Áreas y Perímetros, Matemáticas 5º).
 */
var GeoGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);
    var title = this.eq.target === "area" ? "Área (El Relleno)" : "Perímetro (El Borde)";
    App.updateTeacher(
      "Paso 1: Calcula el " + title,
      "Observa la figura. Te piden el <b>" + this.eq.target.toUpperCase() + "</b>. Recuerda la fórmula matemática correcta.",
      "📐"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var types = ["cuadrado", "rectangulo"];
    var targets = ["area", "perimetro"];
    var type = types[Math.floor(Math.random() * types.length)];
    var target = targets[Math.floor(Math.random() * targets.length)];

    var w, h;
    if (type === "cuadrado") {
      w = h = Math.floor(Math.random() * 8) + 3;
    } else {
      w = Math.floor(Math.random() * 8) + 5;
      h = Math.floor(Math.random() * 4) + 2;
    }
    var res = target === "area" ? (w * h) : (2 * w + 2 * h);
    this.eq = { type: type, target: target, w: w, h: h, res: res };
  },

  showExample: function (container) {
    var isArea = this.eq.target === "area";
    var isCuad = this.eq.type === "cuadrado";

    var exW = 4, exH = isCuad ? 4 : 3;
    var exRes = isArea ? (exW * exH) : (exW * 2 + exH * 2);

    var formulaStr = isArea
      ? (isCuad ? "Lado × Lado" : "Base × Altura")
      : (isCuad ? "Lado + Lado + Lado + Lado (o Lado × 4)" : "Base + Base + Altura + Altura");

    var calcStr = isArea
      ? (exW + " × " + exH + " = <b>" + exRes + "</b>")
      : (exW + " + " + exW + " + " + exH + " + " + exH + " = <b>" + exRes + "</b>");

    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl capitalize\">Ejemplo: " + this.eq.target + " de un " + this.eq.type + "</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>¿Qué buscamos?:</b> El " + (isArea ? "ÁREA es todo el espacio de relleno interior" : "PERÍMETRO es todo el borde exterior (la cerca)") + " de la figura.</li>" +
      "<li><b>Fórmula:</b> La regla matemática nos dice que hagamos: <span class=\"bg-yellow-100 px-2 rounded\">" + formulaStr + "</span>.</li>" +
      "<li><b>Datos imaginarios:</b> Supongamos que tenemos un " + this.eq.type + " de " + exW + " cm" + (!isCuad ? " por " + exH + " cm." : " por lado.") + "</li>" +
      "<li><b>Cálculo:</b> Si reemplazamos en la fórmula: <br> <span class=\"text-xl bg-white px-2 py-1 rounded mt-1 inline-block border border-slate-200\">" + calcStr + "</span></li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-6 math-font text-slate-700 w-full animate-fade-in mb-4 mt-6";

    var wClass = this.eq.type === "cuadrado" ? "w-32 md:w-40" : "w-48 md:w-60";
    var hClass = this.eq.type === "cuadrado" ? "h-32 md:h-40" : "h-20 md:h-28";

    var box =
      "<div class=\"relative flex items-center justify-center bg-emerald-100 border-4 border-emerald-500 shadow-md " + wClass + " " + hClass + "\">" +
      "<div class=\"absolute -top-8 text-xl md:text-2xl font-bold text-emerald-700 bg-white/80 px-2 rounded-lg\">" + this.eq.w + " cm</div>" +
      "<div class=\"absolute -left-16 text-xl md:text-2xl font-bold text-emerald-700 bg-white/80 px-2 rounded-lg\">" + this.eq.h + " cm</div>" +
      "<div class=\"text-lg md:text-xl text-emerald-600/60 uppercase font-black tracking-widest\">" + this.eq.target + " ?</div>" +
      "</div>";

    row.innerHTML = box;
    container.appendChild(row);

    var self = this;
    generateOptionsUI(
      this.eq.res,
      function (val, btn) { self.verify(val, btn); },
      "El resultado en <b>cm</b> es?:"
    );
  },

  verify: function (val, btn) {
    var self = this;
    if (val === this.eq.res) {
      handleCorrectOption(btn, function () {
        App.updateTeacher(
          "¡Geometría Dominada! 🎉",
          "¡Excelente! El " + self.eq.target + " de esta figura es exactamente <b>" + self.eq.res + "</b>.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      if (this.eq.target === "area") {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Te pidieron el ÁREA (el relleno). Para un rectángulo/cuadrado debes <b>multiplicar la Base por la Altura</b>.";
      } else {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Te pidieron el PERÍMETRO (el borde exterior). Esta figura tiene 4 lados en total. Debes <b>sumarlos todos</b>.";
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Ups, revisa tu fórmula!",
          "Elegiste <b>" + val + "</b>, pero no es el cálculo correcto. " + errExtra,
          "🫣"
        );
      });
    }
  },

  cleanup: function () {}
};

