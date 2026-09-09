/**
 * Juego de Probabilidad (Estadística 11º): dado, moneda, ruleta, urna, cartas, frutas, porcentaje.
 * Se acepta cualquier fracción equivalente (3/6 y 1/2 valen igual) y los
 * porcentajes del nivel difícil siempre son exactos (sin redondeos ocultos).
 */
var ProbGame = {
  eq: null,
  // Anti-repetición: evita que el mismo ejercicio salga en los últimos intentos.
  _lastKeys: [],

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Identifica los Casos",
      "Recuerda la fórmula: <b>Probabilidad = Casos Favorables ÷ Casos Posibles</b>. ¡Cuenta con cuidado!",
      "🎲"
    );
    this.renderRow();
  },

  _gcd: function (a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  },

  _pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },

  _pickTwo: function (arr) {
    var c1 = this._pick(arr);
    var c2 = this._pick(arr);
    while (c1.name === c2.name) c2 = this._pick(arr);
    return [c1, c2];
  },

  generateValues: function (level) {
    var pool = [];
    var self = this;
    var colores = [
      { emoji: "🔴", name: "ROJA" }, { emoji: "🔵", name: "AZUL" }, { emoji: "🟢", name: "VERDE" },
      { emoji: "🟡", name: "AMARILLA" }, { emoji: "🟣", name: "MORADA" }
    ];
    if (level === "facil") {
      var dado = [
        { type: "dado", desc: "sacar un número par", fav: 3, total: 6 },
        { type: "dado", desc: "sacar un número impar", fav: 3, total: 6 },
        { type: "dado", desc: "sacar un 5", fav: 1, total: 6 },
        { type: "dado", desc: "sacar un 2", fav: 1, total: 6 },
        { type: "dado", desc: "sacar un número menor que 3", fav: 2, total: 6 },
        { type: "dado", desc: "sacar un múltiplo de 3", fav: 2, total: 6 },
        { type: "dado", desc: "sacar un número mayor que 4", fav: 2, total: 6 },
        { type: "dado", desc: "sacar un número primo (2, 3 o 5)", fav: 3, total: 6 },
        { type: "dado", desc: "sacar un número menor o igual que 2", fav: 2, total: 6 }
      ];
      // Moneda (dos lanzamientos): 4 resultados posibles.
      var moneda = [
        { type: "moneda", desc: "sacar 2 caras", fav: 1, total: 4, coins: 2 },
        { type: "moneda", desc: "sacar 2 sellos", fav: 1, total: 4, coins: 2 },
        { type: "moneda", desc: "sacar al menos una cara", fav: 3, total: 4, coins: 2 },
        { type: "moneda", desc: "sacar exactamente una cara", fav: 2, total: 4, coins: 2 },
        { type: "moneda", desc: "sacar una pareja igual (dos caras o dos sellos)", fav: 2, total: 4, coins: 2 }
      ];
      var ruleta = [
        { type: "ruleta", desc: "sacar un número par", fav: 4, total: 8 },
        { type: "ruleta", desc: "sacar un número mayor que 5", fav: 3, total: 8 },
        { type: "ruleta", desc: "sacar un múltiplo de 2", fav: 4, total: 8 },
        { type: "ruleta", desc: "sacar el 1 o el 8", fav: 2, total: 8 },
        { type: "ruleta", desc: "sacar un número menor que 4", fav: 3, total: 8 },
        { type: "ruleta", desc: "sacar el 3, el 5 o el 7", fav: 3, total: 8 }
      ];
      var bolsaFacil = [[2, 3], [2, 4], [3, 4], [1, 4], [3, 5], [2, 5], [1, 3], [4, 5], [2, 6], [3, 6]];
      bolsaFacil.forEach(function (par) {
        var cs = self._pickTwo(colores);
        pool.push({
          type: "urna", desc: "sacar una canica " + cs[0].name,
          fav: par[0], total: par[0] + par[1],
          cFav: par[0], cOtro: par[1], emojiFav: cs[0].emoji, emojiOtro: cs[1].emoji, word: "canicas"
        });
      });
      pool = pool.concat(dado).concat(moneda).concat(ruleta);
    } else if (level === "medio") {
      for (var u = 0; u < 12; u++) {
        var cs2 = this._pickTwo(colores);
        var nFav = Math.floor(Math.random() * 10) + 3;
        var nOtro = Math.floor(Math.random() * 10) + 3;
        pool.push({
          type: "urna", desc: "sacar una bola " + cs2[0].name,
          fav: nFav, total: nFav + nOtro,
          cFav: nFav, cOtro: nOtro, emojiFav: cs2[0].emoji, emojiOtro: cs2[1].emoji, word: "bolas"
        });
      }
      var cartas = [
        { type: "cartas", desc: "sacar un as", fav: 4, total: 52, cFav: 4, cOtro: 48, emojiFav: "🅰️", emojiOtro: "🃏", word: "cartas" },
        { type: "cartas", desc: "sacar una figura (J, Q o K)", fav: 12, total: 52, cFav: 12, cOtro: 40, emojiFav: "👑", emojiOtro: "🃏", word: "cartas" },
        { type: "cartas", desc: "sacar un corazón", fav: 13, total: 52, cFav: 13, cOtro: 39, emojiFav: "❤️", emojiOtro: "🃏", word: "cartas" },
        { type: "cartas", desc: "sacar un rey", fav: 4, total: 52, cFav: 4, cOtro: 48, emojiFav: "👑", emojiOtro: "🃏", word: "cartas" }
      ];
      var frutas = [
        { emoji: "🍎", name: "MANZANA", art: "una" }, { emoji: "🍊", name: "NARANJA", art: "una" },
        { emoji: "🍋", name: "LIMÓN", art: "un" }, { emoji: "🍇", name: "UVA", art: "una" }, { emoji: "🍓", name: "FRESA", art: "una" }
      ];
      for (var f = 0; f < 8; f++) {
        var fs = this._pickTwo(frutas);
        var nF = Math.floor(Math.random() * 6) + 2;
        var nO = Math.floor(Math.random() * 6) + 2;
        pool.push({
          type: "frutas", desc: "sacar " + fs[0].art + " " + fs[0].name.toLowerCase(),
          fav: nF, total: nF + nO,
          cFav: nF, cOtro: nO, emojiFav: fs[0].emoji, emojiOtro: fs[1].emoji, word: "frutas"
        });
      }
      pool = pool.concat(cartas);
    } else {
      // Difícil: en porcentaje. Solo pares (favorables, otros) cuyo porcentaje es exacto.
      var coloresD = colores.slice(0, 4);
      var poolsPerc = [[1, 3], [1, 4], [2, 3], [1, 9], [3, 7], [2, 8], [4, 6], [1, 1], [3, 2], [3, 1], [4, 1], [9, 1], [1, 19], [7, 3]];
      poolsPerc.forEach(function (par) {
        var total = par[0] + par[1];
        var perc = (par[0] / total) * 100;
        if (perc !== Math.round(perc)) return; // seguridad: nunca un porcentaje con decimales
        var cs3 = self._pickTwo(coloresD);
        pool.push({
          type: "urna_perc", desc: "sacar una bola " + cs3[0].name + " (en porcentaje)",
          fav: par[0], total: total, perc: perc,
          cFav: par[0], cOtro: par[1], emojiFav: cs3[0].emoji, emojiOtro: cs3[1].emoji, word: "bolas"
        });
      });
      pool.push({
        type: "cartas_perc", desc: "sacar una carta roja (corazones o diamantes) (en porcentaje)",
        fav: 26, total: 52, perc: 50,
        cFav: 26, cOtro: 26, emojiFav: "❤️", emojiOtro: "🃏", word: "cartas"
      });
      pool.push({
        type: "cartas_perc", desc: "sacar un corazón (en porcentaje)",
        fav: 13, total: 52, perc: 25,
        cFav: 13, cOtro: 39, emojiFav: "❤️", emojiOtro: "🃏", word: "cartas"
      });
    }

    pool.forEach(function (item) {
      item.res = item.perc != null ? item.perc + "%" : item.fav + "/" + item.total;
    });

    var idx = Math.floor(Math.random() * pool.length);
    var chosen = pool[idx];
    var key = chosen.type + "|" + (chosen.desc || "") + "|" + (chosen.res || "");

    // Evita que el mismo ejercicio se repita seguido (últimos 10).
    var attempt = 0;
    while (pool.length > 1 && attempt < 30 && this._lastKeys.indexOf(key) !== -1) {
      idx = Math.floor(Math.random() * pool.length);
      chosen = pool[idx];
      key = chosen.type + "|" + (chosen.desc || "") + "|" + (chosen.res || "");
      attempt++;
    }
    this._lastKeys.push(key);
    if (this._lastKeys.length > 10) this._lastKeys.shift();

    this.eq = chosen;
  },

  _isPerc: function () {
    return this.eq.type === "urna_perc" || this.eq.type === "cartas_perc";
  },

  showExample: function (container) {
    var examples = {
      dado:
        "<li><b>Problema:</b> Probabilidad de sacar un 4 en un dado.</li>" +
        "<li><b>Casos Favorables:</b> ¿Cuántos '4' tiene un dado? Solo <b>1</b>.</li>" +
        "<li><b>Casos Posibles:</b> Un dado tiene <b>6</b> caras (del 1 al 6).</li>" +
        "<li><b>Fórmula (CF/CP):</b> 1 / 6 → <b>1/6</b>.</li>",
      moneda:
        "<li><b>Problema:</b> Probabilidad de sacar dos caras con dos lanzamientos de moneda.</li>" +
        "<li><b>Casos Posibles (CP):</b> Con dos lanzamientos hay <b>4</b> resultados: CC, CS, SC, SS.</li>" +
        "<li><b>Casos Favorables (CF):</b> Solo <b>CC</b> cumple → <b>1</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 1 / 4 → <b>1/4</b>. Para \"al menos una cara\" serían CC, CS y SC → 3/4.</li>",
      ruleta:
        "<li><b>Problema:</b> Una ruleta tiene los números del 1 al 8. ¿Probabilidad de sacar par?</li>" +
        "<li><b>Casos Favorables:</b> Los pares son 2, 4, 6, 8 → <b>4</b>.</li>" +
        "<li><b>Casos Posibles:</b> Total de números → <b>8</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 4 / 8 → <b>4/8</b>, que simplificada es <b>1/2</b>. Las dos formas son correctas.</li>",
      urna:
        "<li><b>Problema:</b> Sacar una bola negra de una caja con 7 negras y 4 blancas.</li>" +
        "<li><b>Casos Favorables:</b> Bolas negras → <b>7</b>.</li>" +
        "<li><b>Casos Posibles:</b> Total 7 + 4 = <b>11</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 7 / 11 → <b>7/11</b>.</li>",
      cartas:
        "<li><b>Problema:</b> Sacar un as de una baraja de 52 cartas.</li>" +
        "<li><b>Casos Favorables:</b> Hay 4 ases en la baraja → <b>4</b>.</li>" +
        "<li><b>Casos Posibles:</b> La baraja tiene <b>52</b> cartas.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 4 / 52 → <b>4/52</b> (simplificada: 1/13).</li>",
      frutas:
        "<li><b>Problema:</b> En una canasta hay 5 manzanas y 3 naranjas. ¿Probabilidad de sacar una manzana?</li>" +
        "<li><b>Casos Favorables:</b> Manzanas → <b>5</b>.</li>" +
        "<li><b>Casos Posibles:</b> Total 5 + 3 = <b>8</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 5 / 8 → <b>5/8</b>.</li>",
      urna_perc:
        "<li><b>Problema:</b> Sacar una bola roja de 1 roja y 3 azules, en porcentaje.</li>" +
        "<li><b>Fracción (CF/CP):</b> 1 de 4 → <b>1/4</b>.</li>" +
        "<li><b>A Porcentaje:</b> (1 ÷ 4) × 100 = <b>25%</b>.</li>",
      cartas_perc:
        "<li><b>Problema:</b> Probabilidad de sacar un corazón (52 cartas, 13 son corazones), en porcentaje.</li>" +
        "<li><b>Fracción (CF/CP):</b> 13 / 52 = 1/4.</li>" +
        "<li><b>A Porcentaje:</b> (13 ÷ 52) × 100 = <b>25%</b>.</li>"
    };
    var t = this.eq ? this.eq.type : "urna";
    var exampleHTML = examples[t] || examples.urna;
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-orange-50 rounded-xl border-2 border-orange-200\">" +
      "<p class=\"font-bold text-orange-800 mb-4 border-b-2 border-orange-200 pb-2 text-xl\">Ejemplo: Fórmula P(A) = CF / CP</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" + exampleHTML + "</ul>" +
      "</div>";
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    var row = document.createElement("div");
    row.className = "flex flex-col items-center justify-center gap-4 text-slate-700 w-full animate-fade-in mb-4";

    if (this.eq.type === "dado") {
      row.innerHTML = "<div class=\"text-7xl md:text-9xl hover:scale-110 transition-transform hover:rotate-12 cursor-default drop-shadow-lg\">🎲</div>";
    } else if (this.eq.type === "moneda") {
      var coins = typeof this.eq.coins === "number" ? this.eq.coins : 2;
      var coinHTML = "";
      for (var i = 0; i < coins; i++) coinHTML += "<span class=\"text-6xl md:text-7xl\">🪙</span>";
      row.innerHTML =
        "<div class=\"bg-slate-200/50 p-6 rounded-3xl border-4 border-slate-300 shadow-inner flex justify-center items-center gap-8\">" +
        coinHTML +
        "</div>" +
        "<p class=\"text-sm md:text-base text-slate-500 font-sans text-center\">Dos lanzamientos: los resultados posibles son CC, CS, SC y SS.</p>";
    } else if (this.eq.type === "ruleta") {
      var nums = [];
      for (var n = 1; n <= 8; n++) nums.push("<span class=\"bg-white border-2 border-slate-400 rounded-lg px-2 py-1 text-2xl md:text-3xl font-black text-slate-700 shadow-sm\">" + n + "</span>");
      row.innerHTML =
        "<div class=\"bg-slate-200/50 p-4 rounded-3xl border-4 border-slate-300 shadow-inner\">" +
        "<div class=\"flex justify-center mb-2\"><span class=\"text-4xl md:text-5xl\">🎡</span></div>" +
        "<div class=\"flex flex-wrap justify-center gap-2 max-w-md mx-auto\">" + nums.join("") + "</div>" +
        "</div>";
    } else {
      // Urna, cartas, frutas, urna_perc, cartas_perc: elementos repartidos en una rejilla
      var cOtro = typeof this.eq.cOtro === "number" ? this.eq.cOtro : 0;
      var arr = [];
      for (var a = 0; a < this.eq.cFav; a++) arr.push(this.eq.emojiFav);
      for (var j = 0; j < cOtro; j++) arr.push(this.eq.emojiOtro);
      for (var k = arr.length - 1; k > 0; k--) {
        var idx = Math.floor(Math.random() * (k + 1));
        var tmp = arr[k]; arr[k] = arr[idx]; arr[idx] = tmp;
      }
      var cells = arr.map(function (emoji) {
        return "<span class=\"inline-flex justify-center items-center text-2xl md:text-3xl\">" + emoji + "</span>";
      }).join("");
      var total = this.eq.total != null ? this.eq.total : arr.length;
      var palabra = this.eq.word || "elementos";
      row.innerHTML =
        "<div class=\"bg-slate-200/50 p-4 md:p-6 rounded-3xl border-4 border-slate-300 shadow-inner w-full\">" +
        "<div class=\"grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 md:gap-2 justify-items-center max-w-2xl mx-auto\">" +
        cells + "</div>" +
        "<p class=\"text-center text-slate-600 font-bold mt-2 md:mt-3 text-sm md:text-base\">Total: " + total + " " + palabra + "</p>" +
        "</div>";
    }
    container.appendChild(row);
    this.generateProbOptions();
  },

  _parseFrac: function (str) {
    var parts = String(str).split("/");
    return { n: parseInt(parts[0], 10), d: parseInt(parts[1], 10) };
  },

  _sameValue: function (aStr, bStr) {
    if (this._isPerc()) return parseInt(aStr, 10) === parseInt(bStr, 10);
    var a = this._parseFrac(aStr), b = this._parseFrac(bStr);
    return a.n * b.d === b.n * a.d;
  },

  generateProbOptions: function () {
    var eq = this.eq;
    var self = this;
    var options = [eq.res];
    var isDup = function (s) {
      for (var i = 0; i < options.length; i++) if (self._sameValue(s, options[i])) return true;
      return false;
    };
    var push = function (s) { if (!isDup(s)) options.push(s); };

    if (this._isPerc()) {
      // Distractores: el complemento, la fracción "al revés" en %, y vecinos.
      var comp = 100 - eq.perc;
      var cands = [comp, Math.round((eq.cOtro / eq.total) * 100), eq.perc + 10, eq.perc - 10, eq.perc + 25, eq.perc - 5];
      for (var c = 0; c < cands.length && options.length < 4; c++) {
        var v = cands[c];
        if (v >= 1 && v <= 100) push(v + "%");
      }
      var guardP = 0;
      while (options.length < 4 && guardP < 40) {
        guardP++;
        var fake = eq.perc + (Math.floor(Math.random() * 40) - 20);
        if (fake >= 1 && fake <= 100) push(fake + "%");
      }
    } else {
      var fixedTotal = eq.type === "dado" || eq.type === "moneda" || eq.type === "ruleta" || eq.type === "cartas";
      var favCands = [eq.total - eq.fav, eq.fav + 1, eq.fav - 1, eq.fav + 2, eq.fav - 2];
      for (var f = 0; f < favCands.length && options.length < 4; f++) {
        var ff = favCands[f];
        if (ff >= 1 && ff <= eq.total) push(ff + "/" + eq.total);
      }
      if (!fixedTotal) {
        // En urnas/frutas también vale confundir el total (contar solo las otras).
        push(eq.fav + "/" + eq.cOtro);
        push(eq.fav + "/" + (eq.total + 1));
      }
      var guard = 0;
      while (options.length < 4 && guard < 40) {
        guard++;
        var fakeFav = Math.max(1, eq.fav + (Math.floor(Math.random() * 5) - 2));
        var fakeTot = fixedTotal ? eq.total : Math.max(fakeFav + 1, eq.total + (Math.floor(Math.random() * 6) - 3));
        push(fakeFav + "/" + fakeTot);
      }
    }
    options = options.slice(0, 4);
    for (var i = options.length - 1; i > 0; i--) {
      var jj = Math.floor(Math.random() * (i + 1));
      var t2 = options[i]; options[i] = options[jj]; options[jj] = t2;
    }

    var container = document.createElement("div");
    container.className = "flex flex-col items-center w-full mt-4 animate-fade-in";
    container.id = "options-container";
    container.innerHTML = "<div class=\"text-xl md:text-2xl text-slate-500 mb-3 math-font text-center\">¿Cuál es la probabilidad de <b>" + eq.desc + "</b>?</div>";

    var btnsDiv = document.createElement("div");
    btnsDiv.className = "flex flex-wrap justify-center gap-3";
    for (var k = 0; k < options.length; k++) {
      var opt = options[k];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-sans bg-white border-4 border-orange-200 hover:border-orange-400 text-orange-700 font-bold text-xl md:text-2xl py-2 px-5 rounded-2xl shadow-[0_4px_0_#fdba74] active:translate-y-1 active:shadow-none transition-all tracking-wider";
      btn.innerText = opt;
      btn.onclick = (function (val) {
        return function () { ProbGame.verify(val, this); };
      })(opt);
      btnsDiv.appendChild(btn);
    }
    container.appendChild(btnsDiv);
    document.getElementById("lines-container").appendChild(container);
  },

  verify: function (val, btn) {
    var eq = this.eq;
    if (this._sameValue(val, eq.res)) {
      btn.classList.replace("border-orange-200", "border-green-500");
      btn.classList.replace("text-orange-700", "text-white");
      btn.classList.add("bg-green-500");
      var optsNow = document.getElementById("options-container");
      if (optsNow) optsNow.classList.add("pointer-events-none", "opacity-50");
      var self = this;
      setTimeout(function () {
        var opts = document.getElementById("options-container");
        if (optsNow && opts !== optsNow) return;
        if (opts) opts.remove();
        var msg = "¡Exacto! Tienes <b>" + eq.fav + "</b> casos a favor, de un total de <b>" + eq.total + "</b> posibles";
        if (self._isPerc()) {
          msg += ": (" + eq.fav + " ÷ " + eq.total + ") × 100 = <b>" + eq.perc + "%</b>.";
        } else {
          var g = self._gcd(eq.fav, eq.total);
          msg += ": <b>" + eq.fav + "/" + eq.total + "</b>" + (g > 1 ? ", que simplificada es <b>" + (eq.fav / g) + "/" + (eq.total / g) + "</b>." : ".");
        }
        App.updateTeacher("¡Probabilidad correcta! 🎉", msg, "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
        if (typeof awardExercisePoints === "function") awardExercisePoints();
      }, 500);
    } else {
      btn.classList.replace("border-orange-200", "border-red-400");
      btn.classList.add("bg-red-50", "text-red-600", "animate-shake");
      var errExtra = this._isPerc()
        ? "💡 <b>Tip:</b> Primero halla la fracción (Casos Favorables / Total), luego multiplícala por 100 para el porcentaje."
        : "💡 <b>Tip:</b> El número de arriba son los casos favorables, el de abajo el total de casos posibles. Si simplificas, también vale.";
      App.updateTeacher("¡Ups, revisa tus casos!", "Elegiste <b>" + val + "</b>, pero no es correcto. " + errExtra, "🫣");
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();
      var btnRef = btn;
      setTimeout(function () {
        btnRef.classList.remove("bg-red-50", "text-red-600", "animate-shake");
        btnRef.classList.replace("border-red-400", "border-orange-200");
      }, 800);
    }
  },

  cleanup: function () {}
};
