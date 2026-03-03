/**
 * Juego de Fracciones (Matemáticas 5º).
 */
var FracGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);

    if (this.eq.d1 !== this.eq.d2) {
      App.updateTeacher(
        "Paso 1: Opera las Fracciones",
        "Los divisores (números de abajo) son diferentes. ¡Tendrás que multiplicar cruzado usando el método de la 'Carita Feliz'!",
        "🍕"
      );
    } else {
      App.updateTeacher(
        "Paso 1: Opera las Fracciones",
        "¡Qué suerte! Los divisores son iguales. Solo debes operar los números de arriba y dejar el de abajo igual.",
        "🍕"
      );
    }

    this.renderRow();
  },

  generateValues: function (level) {
    var n1, d1, n2, d2, op;
    op = Math.random() > 0.5 ? "+" : "-";

    if (level === "facil" || level === "medio") {
      d1 = d2 = Math.floor(Math.random() * 8) + 2;
      n1 = Math.floor(Math.random() * 10) + 5;
      n2 = Math.floor(Math.random() * 4) + 1;
      if (op === "-" && n2 >= n1) {
        var t = n1; n1 = n2 + 1; n2 = t;
      }
      this.eq = {
        n1: n1,
        d1: d1,
        n2: n2,
        d2: d2,
        op: op,
        resN: op === "+" ? n1 + n2 : n1 - n2,
        resD: d1
      };
    } else {
      d1 = Math.floor(Math.random() * 5) + 2;
      d2 = Math.floor(Math.random() * 5) + 2;
      while (d1 === d2) d2 = Math.floor(Math.random() * 5) + 2;
      n1 = Math.floor(Math.random() * 5) + 1;
      n2 = Math.floor(Math.random() * 5) + 1;
      if (op === "-" && (n1 * d2) <= (n2 * d1)) {
        op = "+";
      }
      this.eq = {
        n1: n1,
        d1: d1,
        n2: n2,
        d2: d2,
        op: op,
        resN: op === "+" ? (n1 * d2 + n2 * d1) : (n1 * d2 - n2 * d1),
        resD: d1 * d2
      };
    }
  },

  showExample: function (container) {
    var html = "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">";

    if (this.eq.d1 === this.eq.d2) {
      var opWord = this.eq.op === "+" ? "Suma" : "Resta";
      var opSign = this.eq.op;
      var exRes = opSign === "+" ? 3 : 1;
      html +=
        "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Fracciones Homogéneas</p>" +
        "<p class=\"mb-4 text-2xl math-font bg-white px-4 py-2 inline-block rounded shadow-sm border\">2/5 " + opSign + " 1/5</p>" +
        "<ul class=\"list-decimal pl-6 space-y-3\">" +
        "<li><b>Los denominadores son iguales:</b> Como ambas fracciones tienen un <b>5</b> en la parte de abajo, la fracción resultante también tendrá un <b>5</b> abajo. ¡No lo sumes!</li>" +
        "<li><b>Los numeradores:</b> Simplemente " + opWord.toLowerCase() + " los números de arriba: <b>2 " + opSign + " 1 = " + exRes + "</b>.</li>" +
        "<li><b>Resultado final:</b> Ponemos el " + exRes + " arriba y el 5 abajo. La respuesta es la fracción <b>" + exRes + "/5</b>.</li>" +
        "</ul>";
    } else {
      var opWord2 = this.eq.op === "+" ? "Suma" : "Resta";
      var opSign2 = this.eq.op;
      var cross1 = 3, cross2 = 2, resN = opSign2 === "+" ? 5 : 1, resD = 6;
      html +=
        "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Fracciones Heterogéneas</p>" +
        "<p class=\"mb-4 text-2xl math-font bg-white px-4 py-2 inline-block rounded shadow-sm border\">1/2 " + opSign2 + " 1/3</p>" +
        "<ul class=\"list-decimal pl-6 space-y-3\">" +
        "<li><b>La Sonrisa (Denominador):</b> Multiplica los dos números de abajo entre sí: <span class=\"bg-blue-100 text-blue-700 px-2 rounded\"><b>2 × 3 = " + resD + "</b></span>. Este será tu número de abajo final.</li>" +
        "<li><b>Los Ojos (Cruzado):</b> Multiplica en diagonal (de arriba hacia abajo en forma de X): " +
        "<br>👉 1 × 3 = <b>" + cross1 + "</b>" +
        "<br>👉 1 × 2 = <b>" + cross2 + "</b></li>" +
        "<li><b>El Numerador (Arriba):</b> Ahora " + opWord2.toLowerCase() + " esos dos resultados que acabas de encontrar: <span class=\"bg-red-100 text-red-700 px-2 rounded\"><b>" + cross1 + " " + opSign2 + " " + cross2 + " = " + resN + "</b></span>.</li>" +
        "<li><b>Resultado final:</b> Pon tu resultado final de arriba y de abajo juntos. La fracción es <b>" + resN + "/" + resD + "</b>.</li>" +
        "</ul>";
    }

    html += "</div>";
    container.innerHTML = html;
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-4 text-3xl md:text-5xl";

    var self = this;
    var fracHTML = function (n, d) {
      return "<div class=\"flex flex-col items-center leading-none z-10\">" +
        "<span class=\"border-b-4 border-slate-700 px-2 pb-1 bg-white/80 rounded-t-lg\">" + n + "</span>" +
        "<span class=\"pt-1 bg-white/80 rounded-b-lg px-2\">" + d + "</span>" +
        "</div>";
    };

    row.innerHTML =
      "<div class=\"relative flex items-center justify-center gap-4 px-3 py-2\">" +
      fracHTML(this.eq.n1, this.eq.d1) +
      "<span class=\"font-black text-pink-500 z-10 bg-white/80 rounded-full px-1\">" + this.eq.op + "</span>" +
      fracHTML(this.eq.n2, this.eq.d2) +
      "<svg id=\"frac-hint-svg\" class=\"absolute w-[110%] h-[130%] top-[-15%] left-[-5%] pointer-events-none opacity-0 transition-opacity duration-500 z-0\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"none\">" +
      "<defs>" +
      "<marker id=\"arrow-red\" markerWidth=\"6\" markerHeight=\"4\" refX=\"5\" refY=\"2\" orient=\"auto\">" +
      "<polygon points=\"0 0, 6 2, 0 4\" fill=\"#ef4444\" />" +
      "</marker>" +
      "<marker id=\"arrow-blue\" markerWidth=\"6\" markerHeight=\"4\" refX=\"5\" refY=\"2\" orient=\"auto\">" +
      "<polygon points=\"0 0, 6 2, 0 4\" fill=\"#3b82f6\" />" +
      "</marker>" +
      "</defs>" +
      "<line x1=\"20\" y1=\"25\" x2=\"80\" y2=\"75\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"4\" marker-end=\"url(#arrow-red)\"/>" +
      "<line x1=\"20\" y1=\"75\" x2=\"80\" y2=\"25\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"4\" marker-end=\"url(#arrow-red)\"/>" +
      "<path d=\"M 20 85 Q 50 110 80 85\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"2\" stroke-dasharray=\"4\" marker-end=\"url(#arrow-blue)\"/>" +
      "</svg>" +
      "</div>" +
      "<span>=</span>";

    container.appendChild(row);
    this.generateFracOptions();
  },

  generateFracOptions: function () {
    var correctStr = this.eq.resN + "/" + this.eq.resD;
    var optionsSet = new Set([correctStr]);

    while (optionsSet.size < 4) {
      var errN = this.eq.resN + (Math.floor(Math.random() * 5) - 2);
      if (errN < 1) errN = 1;
      var errD = this.eq.resD;
      if (this.eq.d1 !== this.eq.d2 && Math.random() > 0.5) {
        errD = this.eq.d1 + this.eq.d2;
      }
      optionsSet.add(errN + "/" + errD);
    }

    var options = Array.from(optionsSet).sort(function () { return Math.random() - 0.5; });

    var container = document.createElement("div");
    container.className = "flex flex-col items-center w-full mt-4 animate-fade-in";
    container.id = "options-container";
    container.innerHTML = "<div class=\"text-xl md:text-2xl text-slate-500 mb-3 math-font\">¿Cuál es la fracción resultante?:</div>";

    var btnsDiv = document.createElement("div");
    btnsDiv.className = "flex flex-wrap justify-center gap-3";

    var self = this;
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "font-sans flex flex-col items-center justify-center bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xl md:text-2xl w-16 h-20 md:w-20 md:h-24 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all";
      var parts = opt.split("/");
      btn.innerHTML =
        "<span class=\"border-b-4 border-indigo-300 w-10 md:w-12 text-center leading-none pb-1\">" + parts[0] + "</span>" +
        "<span class=\"leading-none pt-1\">" + parts[1] + "</span>";
      btn.onclick = function () { self.verify(opt, btn); };
      btnsDiv.appendChild(btn);
    });

    container.appendChild(btnsDiv);
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (val, btn) {
    var self = this;
    if (val === (this.eq.resN + "/" + this.eq.resD)) {
      handleCorrectOption(btn, function () {
        App.updateTeacher(
          "¡Fracción Perfecta! 🎉",
          "¡Muy bien! Has operado correctamente la fracción.",
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      if (this.eq.d1 === this.eq.d2) {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Como los denominadores (abajo) son iguales, <b>sólo debes " +
          (this.eq.op === "+" ? "sumar" : "restar") +
          " los de arriba</b> y dejar el mismo número abajo.";
      } else {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Tienen divisores distintos. Sigue las <span class=\"text-red-500 font-bold\">flechas rojas</span> para multiplicar en cruz, y la <span class=\"text-blue-500 font-bold\">sonrisa azul</span> para multiplicar los de abajo.";
        var svgHint = document.getElementById("frac-hint-svg");
        if (svgHint) svgHint.classList.replace("opacity-0", "opacity-100");
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Ups, revisa tu fracción!",
          "No es correcto. " + errExtra,
          "🫣"
        );
      });
    }
  },

  cleanup: function () {}
};

