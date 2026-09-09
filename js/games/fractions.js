/**
 * Juego de Fracciones (Matemáticas 5º).
 * Niveles: fácil = mismo denominador (homogéneas, fracciones propias);
 * medio = distinto denominador con números chicos; difícil = distinto denominador
 * con números más grandes. Se acepta cualquier fracción equivalente a la
 * respuesta (p. ej. 4/3 por 8/6) y se muestra la simplificada al acertar.
 */
var FracGame = {
  eq: null,

  start: function (level) {
    this.generateValues(level);

    if (this.eq.d1 !== this.eq.d2) {
      App.updateTeacher(
        "Paso 1: Opera las Fracciones",
        "Los denominadores (números de abajo) son diferentes. ¡Tendrás que multiplicar cruzado usando el método de la 'Carita Feliz'!",
        "🍕"
      );
    } else {
      App.updateTeacher(
        "Paso 1: Opera las Fracciones",
        "¡Qué suerte! Los denominadores son iguales. Solo debes operar los números de arriba y dejar el de abajo igual.",
        "🍕"
      );
    }

    this.renderRow();
  },

  _rand: function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  _gcd: function (a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  },

  generateValues: function (level) {
    var n1, d1, n2, d2, op;
    op = Math.random() > 0.5 ? "+" : "-";

    if (level === "facil") {
      // Homogéneas con fracciones propias: nada de 14/2.
      d1 = d2 = this._rand(3, 9);
      n1 = this._rand(1, d1 - 1);
      n2 = this._rand(1, d1 - 1);
      if (op === "+" && n1 + n2 > d1) {
        // Que la suma no pase de 1 entero (máximo d/d).
        n2 = this._rand(1, Math.max(1, d1 - n1));
      }
      if (op === "-") {
        if (n1 === n2) n1 = Math.min(d1 - 1, n1 + 1);
        if (n1 < n2) { var t = n1; n1 = n2; n2 = t; }
        if (n1 === n2) { op = "+"; n2 = this._rand(1, Math.max(1, d1 - n1)); }
      }
      this.eq = {
        n1: n1, d1: d1, n2: n2, d2: d2, op: op,
        resN: op === "+" ? n1 + n2 : n1 - n2,
        resD: d1
      };
      return;
    }

    // Heterogéneas: medio con números chicos, difícil con más grandes.
    var dMax = level === "medio" ? 5 : 9;
    var nMax = level === "medio" ? 3 : 6;
    d1 = this._rand(2, dMax);
    d2 = this._rand(2, dMax);
    while (d1 === d2) d2 = this._rand(2, dMax);
    n1 = this._rand(1, Math.min(nMax, d1 - 1 > 0 ? d1 - 1 : 1));
    n2 = this._rand(1, Math.min(nMax, d2 - 1 > 0 ? d2 - 1 : 1));
    if (op === "-" && (n1 * d2) <= (n2 * d1)) {
      // Que la resta nunca dé cero ni negativo: intercambia las fracciones.
      var tn = n1, td = d1; n1 = n2; d1 = d2; n2 = tn; d2 = td;
      if ((n1 * d2) <= (n2 * d1)) op = "+";
    }
    this.eq = {
      n1: n1, d1: d1, n2: n2, d2: d2, op: op,
      resN: op === "+" ? (n1 * d2 + n2 * d1) : (n1 * d2 - n2 * d1),
      resD: d1 * d2
    };
  },

  _isEquivalent: function (n, d, N, D) {
    return d > 0 && D > 0 && n * D === N * d;
  },

  _simplified: function (n, d) {
    var g = this._gcd(n, d);
    return { n: n / g, d: d / g };
  },

  showExample: function (container) {
    var eq = this.eq || { d1: 5, d2: 5, op: "+" };
    var html = "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">";

    if (eq.d1 === eq.d2) {
      var opWord = eq.op === "+" ? "Suma" : "Resta";
      var opSign = eq.op;
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
      var opWord2 = eq.op === "+" ? "Suma" : "Resta";
      var opSign2 = eq.op;
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
        "<li><b>Simplificar (opcional):</b> Si arriba y abajo se pueden dividir entre el mismo número, la fracción se puede escribir más chiquita: 2/6 = 1/3. En este cuaderno las dos formas cuentan como correctas.</li>" +
        "</ul>";
    }

    html += "</div>";
    container.innerHTML = html;
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex items-center justify-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in mb-4 text-3xl md:text-5xl";

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

  // Distractores con sentido: los errores típicos (sumar también los de abajo,
  // usar la operación contraria, multiplicar los de arriba) y luego vecinos.
  _distractorCandidates: function () {
    var eq = this.eq;
    var list = [];
    var homog = eq.d1 === eq.d2;
    if (homog) {
      list.push({ n: eq.op === "+" ? eq.n1 + eq.n2 : eq.n1 - eq.n2, d: eq.d1 + eq.d2, tag: "sumo_denominadores" });
      list.push({ n: eq.op === "+" ? eq.n1 - eq.n2 : eq.n1 + eq.n2, d: eq.d1, tag: "op_contraria" });
      list.push({ n: eq.n1 * eq.n2, d: eq.d1, tag: "multiplico" });
    } else {
      list.push({ n: eq.n1 + eq.n2, d: eq.d1 + eq.d2, tag: "sumo_directo" });
      list.push({ n: eq.op === "+" ? eq.n1 * eq.d2 - eq.n2 * eq.d1 : eq.n1 * eq.d2 + eq.n2 * eq.d1, d: eq.d1 * eq.d2, tag: "op_contraria" });
      list.push({ n: eq.n1 * eq.n2, d: eq.d1 * eq.d2, tag: "multiplico" });
      list.push({ n: eq.op === "+" ? eq.n1 + eq.n2 : eq.n1 - eq.n2, d: eq.d1 * eq.d2, tag: "sin_cruzar" });
    }
    var deltas = [1, -1, 2, -2, 3, -3];
    for (var i = 0; i < deltas.length; i++) list.push({ n: eq.resN + deltas[i], d: eq.resD, tag: "vecino" });
    return list;
  },

  generateFracOptions: function () {
    var eq = this.eq;
    var self = this;
    var options = [{ n: eq.resN, d: eq.resD, correct: true }];

    var isDup = function (n, d) {
      for (var i = 0; i < options.length; i++) {
        if (self._isEquivalent(n, d, options[i].n, options[i].d)) return true;
      }
      return false;
    };

    var candidates = this._distractorCandidates();
    for (var c = 0; c < candidates.length && options.length < 4; c++) {
      var cand = candidates[c];
      if (!(cand.n >= 1) || !(cand.d >= 1)) continue;
      if (isDup(cand.n, cand.d)) continue;
      options.push({ n: cand.n, d: cand.d, tag: cand.tag });
    }
    // Relleno de seguridad (nunca se queda en bucle): sube el numerador hasta completar.
    var extra = eq.resN + 4;
    var guard = 0;
    while (options.length < 4 && guard < 50) {
      guard++;
      if (!isDup(extra, eq.resD)) options.push({ n: extra, d: eq.resD, tag: "vecino" });
      extra++;
    }

    for (var i = options.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = options[i]; options[i] = options[j]; options[j] = tmp;
    }

    var container = document.createElement("div");
    container.className = "flex flex-col items-center w-full mt-4 animate-fade-in";
    container.id = "options-container";
    container.innerHTML = "<div class=\"text-xl md:text-2xl text-slate-500 mb-3 math-font\">¿Cuál es la fracción resultante?</div>";

    var btnsDiv = document.createElement("div");
    btnsDiv.className = "flex flex-wrap justify-center gap-3";

    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-sans flex flex-col items-center justify-center bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xl md:text-2xl w-16 h-20 md:w-20 md:h-24 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all";
      btn.innerHTML =
        "<span class=\"border-b-4 border-indigo-300 w-10 md:w-12 text-center leading-none pb-1\">" + opt.n + "</span>" +
        "<span class=\"leading-none pt-1\">" + opt.d + "</span>";
      btn.onclick = function () { self.verify(opt, btn); };
      btnsDiv.appendChild(btn);
    });

    container.appendChild(btnsDiv);
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (opt, btn) {
    var self = this;
    var eq = this.eq;
    if (this._isEquivalent(opt.n, opt.d, eq.resN, eq.resD)) {
      handleCorrectOption(btn, function () {
        var simp = self._simplified(eq.resN, eq.resD);
        var extra = "";
        if (simp.d === 1) {
          extra = " Fíjate que <b>" + eq.resN + "/" + eq.resD + "</b> es lo mismo que <b>" + simp.n + "</b> entero" + (simp.n === 1 ? "" : "s") + ".";
        } else if (simp.n !== eq.resN) {
          extra = " Y si la simplificas (dividiendo arriba y abajo entre " + self._gcd(eq.resN, eq.resD) + ") queda <b>" + simp.n + "/" + simp.d + "</b>.";
        }
        App.updateTeacher(
          "¡Fracción perfecta! 🎉",
          "¡Muy bien! El resultado es <b>" + eq.resN + "/" + eq.resD + "</b>." + extra,
          "🌟"
        );
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var errExtra = "";
      if (opt.tag === "sumo_denominadores" || opt.tag === "sumo_directo") {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Los números de abajo (denominadores) <b>no se suman ni se restan</b>. " +
          (eq.d1 === eq.d2 ? "Como son iguales, el de abajo se queda igual." : "Aquí se multiplican: " + eq.d1 + " × " + eq.d2 + " = " + (eq.d1 * eq.d2) + ".");
      } else if (opt.tag === "op_contraria") {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Fíjate en el signo: es una <b>" + (eq.op === "+" ? "suma" : "resta") + "</b>, no una " + (eq.op === "+" ? "resta" : "suma") + ".";
      } else if (opt.tag === "multiplico") {
        errExtra = "<br><br>💡 <b>Tip de oro:</b> Los números de arriba se <b>" + (eq.op === "+" ? "suman" : "restan") + "</b>, no se multiplican entre sí.";
      } else if (eq.d1 === eq.d2) {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Como los denominadores (abajo) son iguales, <b>solo debes " +
          (eq.op === "+" ? "sumar" : "restar") +
          " los de arriba</b> y dejar el mismo número abajo.";
      } else {
        errExtra =
          "<br><br>💡 <b>Tip de oro:</b> Tienen denominadores distintos. Sigue las <span class=\"text-red-500 font-bold\">flechas rojas</span> para multiplicar en cruz, y la <span class=\"text-blue-500 font-bold\">sonrisa azul</span> para multiplicar los de abajo.";
      }
      if (eq.d1 !== eq.d2) {
        var svgHint = document.getElementById("frac-hint-svg");
        if (svgHint) svgHint.classList.replace("opacity-0", "opacity-100");
      }
      handleWrongOption(btn, function () {
        App.updateTeacher(
          "¡Casi! Revisa tu fracción",
          "Elegiste <b>" + opt.n + "/" + opt.d + "</b>, pero no es el resultado. " + errExtra,
          "🤔"
        );
      });
    }
  },

  cleanup: function () {}
};
