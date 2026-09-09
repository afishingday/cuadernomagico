/**
 * Juego de Geometría (Áreas y Perímetros, Matemáticas 5º).
 */
var GeoGame = {
  eq: null,

  LABELS: {
    area: { name: "Área", upper: "ÁREA", unit: "cm²", what: "el relleno interior" },
    perimetro: { name: "Perímetro", upper: "PERÍMETRO", unit: "cm", what: "el borde exterior" }
  },
  TYPE_NAMES: { cuadrado: "cuadrado", rectangulo: "rectángulo" },

  start: function (level) {
    this.generateValues(level);
    var lb = this.LABELS[this.eq.target];
    App.updateTeacher(
      "Paso 1: Calcula el " + lb.name + " (" + (this.eq.target === "area" ? "El Relleno" : "El Borde") + ")",
      "Observa la figura. Te piden el <b>" + lb.upper + "</b>, es decir, " + lb.what + ". La respuesta va en <b>" + lb.unit + "</b>.",
      "📐"
    );
    this.renderRow();
  },

  RANGES: {
    facil: { sq: [2, 12], rw: [3, 12], rh: [2, 6] },
    medio: { sq: [6, 20], rw: [8, 22], rh: [4, 12] },
    dificil: { sq: [12, 35], rw: [15, 40], rh: [6, 20] }
  },

  generateValues: function (level) {
    var types = ["cuadrado", "rectangulo"];
    var targets = ["area", "perimetro"];
    var type = types[Math.floor(Math.random() * types.length)];
    var target = targets[Math.floor(Math.random() * targets.length)];
    var r = this.RANGES[level] || this.RANGES.facil;

    var w, h;
    if (type === "cuadrado") {
      w = h = r.sq[0] + Math.floor(Math.random() * (r.sq[1] - r.sq[0] + 1));
    } else {
      w = r.rw[0] + Math.floor(Math.random() * (r.rw[1] - r.rw[0] + 1));
      h = r.rh[0] + Math.floor(Math.random() * (r.rh[1] - r.rh[0] + 1));
      if (h >= w) { // el dibujo es apaisado: la base siempre es el lado mayor
        var t = w; w = h + 1; h = t;
        if (h >= w) w = h + 2;
      }
    }
    var area = w * h;
    var perimetro = 2 * w + 2 * h;
    var res = target === "area" ? area : perimetro;
    this.eq = { type: type, target: target, w: w, h: h, res: res, area: area, perimetro: perimetro };
  },

  showExample: function (container) {
    var eq = this.eq || { target: "area", type: "rectangulo" };
    var isArea = eq.target === "area";
    var isCuad = eq.type === "cuadrado";
    var lb = this.LABELS[eq.target];

    var exW = 4, exH = isCuad ? 4 : 3;
    var exRes = isArea ? (exW * exH) : (exW * 2 + exH * 2);

    var formulaStr = isArea
      ? (isCuad ? "Lado × Lado" : "Base × Altura")
      : (isCuad ? "Lado + Lado + Lado + Lado (o Lado × 4)" : "Base + Base + Altura + Altura");

    var calcStr = isArea
      ? (exW + " × " + exH + " = <b>" + exRes + " " + lb.unit + "</b>")
      : (exW + " + " + exW + " + " + exH + " + " + exH + " = <b>" + exRes + " " + lb.unit + "</b>");

    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: " + lb.name + " de un " + this.TYPE_NAMES[eq.type] + "</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>¿Qué buscamos?</b> El " + (isArea ? "ÁREA es todo el espacio de relleno interior" : "PERÍMETRO es todo el borde exterior (la cerca)") + " de la figura.</li>" +
      "<li><b>Fórmula:</b> La regla matemática nos dice que hagamos: <span class=\"bg-yellow-100 px-2 rounded\">" + formulaStr + "</span>.</li>" +
      "<li><b>Datos imaginarios:</b> Supongamos que tenemos un " + this.TYPE_NAMES[eq.type] + " de " + exW + " cm" + (!isCuad ? " por " + exH + " cm." : " por lado.") + "</li>" +
      "<li><b>Cálculo:</b> Si reemplazamos en la fórmula: <br> <span class=\"text-xl bg-white px-2 py-1 rounded mt-1 inline-block border border-slate-200\">" + calcStr + "</span></li>" +
      "<li><b>La unidad:</b> el perímetro se mide en <b>cm</b> (es una longitud, como una cuerda alrededor); el área se mide en <b>cm²</b> (centímetros cuadrados, porque cuenta cuadritos de 1 cm × 1 cm que caben adentro).</li>" +
      "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-6 math-font text-slate-700 w-full animate-fade-in mb-4 mt-6";
    var eq = this.eq;
    var lb = this.LABELS[eq.target];

    var wClass = eq.type === "cuadrado" ? "w-32 md:w-40" : "w-44 md:w-60";
    var hClass = eq.type === "cuadrado" ? "h-32 md:h-40" : "h-20 md:h-28";

    var box =
      "<div class=\"relative flex items-center justify-center bg-emerald-100 border-4 border-emerald-500 shadow-md " + wClass + " " + hClass + "\">" +
      "<div class=\"absolute -top-8 text-xl md:text-2xl font-bold text-emerald-700 bg-white/80 px-2 rounded-lg\">" + eq.w + " cm</div>" +
      "<div class=\"absolute -right-14 md:-right-16 text-xl md:text-2xl font-bold text-emerald-700 bg-white/80 px-2 rounded-lg\">" + eq.h + " cm</div>" +
      "<div class=\"text-lg md:text-xl text-emerald-600/60 font-black tracking-widest\">" + lb.upper + " ?</div>" +
      "</div>";

    row.innerHTML = box;
    container.appendChild(row);

    var self = this;
    // Distractores con sentido: la OTRA medida (confundir área con perímetro),
    // sumar solo dos lados, multiplicar por 2 de más, etc.
    var preferred = [
      eq.target === "area" ? eq.perimetro : eq.area,
      eq.w + eq.h,
      eq.target === "area" ? eq.area * 2 : eq.w * 2 + eq.h,
      eq.target === "perimetro" ? eq.w * eq.h * 2 : eq.w * 4
    ];
    generateOptionsUI(
      eq.res,
      function (val, btn) { self.verify(val, btn); },
      "¿Cuánto mide el <b>" + lb.upper + "</b>? (en " + lb.unit + ")",
      preferred
    );
  },

  verify: function (val, btn) {
    var eq = this.eq;
    var lb = this.LABELS[eq.target];
    if (val === eq.res) {
      handleCorrectOption(btn, function () {
        var formula = eq.target === "area"
          ? eq.w + " × " + eq.h
          : eq.w + " + " + eq.w + " + " + eq.h + " + " + eq.h;
        App.updateTeacher(
          "¡Geometría dominada! 🎉",
          "¡Excelente! El " + lb.name.toLowerCase() + " de esta figura es <b>" + formula + " = " + eq.res + " " + lb.unit + "</b>.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      var other = eq.target === "area" ? eq.perimetro : eq.area;
      if (val === other) {
        errExtra = eq.target === "area"
          ? "<br><br>💡 <b>Tip de oro:</b> Ese es el <b>perímetro</b> (el borde). Te pidieron el <b>ÁREA</b> (el relleno): multiplica la Base por la Altura."
          : "<br><br>💡 <b>Tip de oro:</b> Esa es el <b>área</b> (el relleno). Te pidieron el <b>PERÍMETRO</b> (el borde): suma los 4 lados.";
      } else if (val === eq.w + eq.h) {
        errExtra = eq.target === "perimetro"
          ? "<br><br>💡 <b>Tip de oro:</b> Sumaste solo dos lados. El perímetro es TODO el borde: la figura tiene <b>4 lados</b>."
          : "<br><br>💡 <b>Tip de oro:</b> Para el área no se suma, se <b>multiplica</b> la Base por la Altura.";
      } else if (eq.target === "area") {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Te pidieron el ÁREA (el relleno). Para un rectángulo o cuadrado debes <b>multiplicar la Base por la Altura</b>.";
      } else {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Te pidieron el PERÍMETRO (el borde exterior). Esta figura tiene 4 lados en total. Debes <b>sumarlos todos</b>.";
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Casi! Revisa la fórmula",
          "Elegiste <b>" + val + " " + lb.unit + "</b>, pero no es el cálculo correcto. " + errExtra,
          "🫣"
        );
      });
    }
  },

  cleanup: function () {}
};
