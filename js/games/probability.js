/**
 * Juego de Probabilidad (Estadística 11º): dado, moneda, ruleta, urna, cartas, frutas, porcentaje.
 */
var ProbGame = {
  eq: null,
  _lastKey: null,

  start: function (level) {
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Identifica los Casos",
      "Recuerda la fórmula: <b>Probabilidad = Casos Favorables ÷ Casos Posibles</b>. ¡Cuenta con cuidado!",
      "🎲"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var pool = [];
    if (level === "facil") {
      // Lista plana: muchos ejercicios distintos, se elige uno al azar (moneda queda solo 2 de ~30)
      var dado = [
        { type: "dado", desc: "sacar un número PAR", fav: 3, total: 6, res: "3/6" },
        { type: "dado", desc: "sacar un número IMPAR", fav: 3, total: 6, res: "3/6" },
        { type: "dado", desc: "sacar un 5", fav: 1, total: 6, res: "1/6" },
        { type: "dado", desc: "sacar un 2", fav: 1, total: 6, res: "1/6" },
        { type: "dado", desc: "sacar un número menor a 3", fav: 2, total: 6, res: "2/6" },
        { type: "dado", desc: "sacar un múltiplo de 3", fav: 2, total: 6, res: "2/6" },
        { type: "dado", desc: "sacar un número mayor a 4", fav: 2, total: 6, res: "2/6" },
        { type: "dado", desc: "sacar un número primo (2, 3 o 5)", fav: 3, total: 6, res: "3/6" },
        { type: "dado", desc: "sacar un número menor o igual a 2", fav: 2, total: 6, res: "2/6" }
      ];
      var moneda = [
        { type: "moneda", desc: "sacar cara", fav: 1, total: 2, res: "1/2" },
        { type: "moneda", desc: "sacar sello", fav: 1, total: 2, res: "1/2" }
      ];
      var ruleta = [
        { type: "ruleta", desc: "sacar un número par", fav: 4, total: 8, res: "4/8" },
        { type: "ruleta", desc: "sacar un número mayor a 5", fav: 3, total: 8, res: "3/8" },
        { type: "ruleta", desc: "sacar un múltiplo de 2", fav: 4, total: 8, res: "4/8" },
        { type: "ruleta", desc: "sacar el 1 o el 8", fav: 2, total: 8, res: "2/8" },
        { type: "ruleta", desc: "sacar un número menor a 4", fav: 3, total: 8, res: "3/8" },
        { type: "ruleta", desc: "sacar el 3, el 5 o el 7", fav: 3, total: 8, res: "3/8" }
      ];
      // Bolsa/canicas (fácil): pocas canicas, dos colores
      var colores = [
        { emoji: "🔴", name: "ROJA" }, { emoji: "🔵", name: "AZUL" }, { emoji: "🟢", name: "VERDE" },
        { emoji: "🟡", name: "AMARILLA" }, { emoji: "🟣", name: "MORADA" }
      ];
      var bolsaFacil = [
        [2, 3], [2, 4], [3, 4], [1, 4], [3, 5], [2, 5], [1, 3], [4, 5], [2, 6], [3, 6]
      ];
      for (var b = 0; b < bolsaFacil.length; b++) {
        var par = bolsaFacil[b];
        var nF = par[0], nO = par[1], total = nF + nO;
        var c1 = colores[Math.floor(Math.random() * colores.length)];
        var c2 = colores[Math.floor(Math.random() * colores.length)];
        while (c1.name === c2.name) c2 = colores[Math.floor(Math.random() * colores.length)];
        pool.push({
          type: "urna",
          desc: "sacar una canica " + c1.name,
          fav: nF, total: total, res: nF + "/" + total,
          cFav: nF, cOtro: nO, emojiFav: c1.emoji, emojiOtro: c2.emoji
        });
      }
      pool = pool.concat(dado).concat(moneda).concat(ruleta);
    } else if (level === "medio") {
      // Urna: varias combinaciones de colores y cantidades
      var coloresM = [
        { emoji: "🔴", name: "ROJA" }, { emoji: "🔵", name: "AZUL" }, { emoji: "🟢", name: "VERDE" },
        { emoji: "🟡", name: "AMARILLA" }, { emoji: "🟣", name: "MORADA" }
      ];
      for (var u = 0; u < 12; u++) {
        var c1 = coloresM[Math.floor(Math.random() * coloresM.length)];
        var c2 = coloresM[Math.floor(Math.random() * coloresM.length)];
        while (c1.name === c2.name) c2 = coloresM[Math.floor(Math.random() * coloresM.length)];
        var nFav = Math.floor(Math.random() * 10) + 3;
        var nOtro = Math.floor(Math.random() * 10) + 3;
        var total = nFav + nOtro;
        pool.push({
          type: "urna",
          desc: "sacar una bola " + c1.name,
          fav: nFav, total: total, res: nFav + "/" + total,
          cFav: nFav, cOtro: nOtro, emojiFav: c1.emoji, emojiOtro: c2.emoji
        });
      }
      var cartas = [
        { type: "cartas", desc: "sacar un as", fav: 4, total: 52, res: "4/52", cFav: 4, cOtro: 48, emojiFav: "🂡", emojiOtro: "🃏" },
        { type: "cartas", desc: "sacar una figura (J, Q o K)", fav: 12, total: 52, res: "12/52", cFav: 12, cOtro: 40, emojiFav: "🂻", emojiOtro: "🃏" },
        { type: "cartas", desc: "sacar un corazón", fav: 13, total: 52, res: "13/52", cFav: 13, cOtro: 39, emojiFav: "🂱", emojiOtro: "🃏" },
        { type: "cartas", desc: "sacar un rey", fav: 4, total: 52, res: "4/52", cFav: 4, cOtro: 48, emojiFav: "🂮", emojiOtro: "🃏" }
      ];
      var frutas = [
        { emoji: "🍎", name: "MANZANA" }, { emoji: "🍊", name: "NARANJA" },
        { emoji: "🍋", name: "LIMÓN" }, { emoji: "🍇", name: "UVA" }, { emoji: "🍓", name: "FRESA" }
      ];
      for (var f = 0; f < 8; f++) {
        var f1 = frutas[Math.floor(Math.random() * frutas.length)];
        var f2 = frutas[Math.floor(Math.random() * frutas.length)];
        while (f1.name === f2.name) f2 = frutas[Math.floor(Math.random() * frutas.length)];
        var nF = Math.floor(Math.random() * 6) + 2;
        var nO = Math.floor(Math.random() * 6) + 2;
        var total = nF + nO;
        pool.push({
          type: "frutas",
          desc: "sacar una " + f1.name.toLowerCase(),
          fav: nF, total: total, res: nF + "/" + total,
          cFav: nF, cOtro: nO, emojiFav: f1.emoji, emojiOtro: f2.emoji
        });
      }
      pool = pool.concat(cartas);
    } else {
      // Difícil: urna en % y cartas en %
      var coloresD = [
        { emoji: "🔴", name: "ROJA" }, { emoji: "🔵", name: "AZUL" },
        { emoji: "🟢", name: "VERDE" }, { emoji: "🟡", name: "AMARILLA" }
      ];
      var poolsPerc = [[1, 3], [1, 4], [2, 3], [1, 9], [3, 7], [2, 8], [4, 6], [2, 5], [3, 8], [1, 5]];
      for (var p = 0; p < poolsPerc.length; p++) {
        var par = poolsPerc[p];
        var nF = par[0], nO = par[1], total = nF + nO, perc = Math.round((nF / total) * 100);
        var c1 = coloresD[Math.floor(Math.random() * coloresD.length)];
        var c2 = coloresD[Math.floor(Math.random() * coloresD.length)];
        while (c1.name === c2.name) c2 = coloresD[Math.floor(Math.random() * coloresD.length)];
        pool.push({
          type: "urna_perc",
          desc: "sacar una bola " + c1.name + " (en porcentaje)",
          fav: nF, total: total, res: perc + "%",
          cFav: nF, cOtro: nO, emojiFav: c1.emoji, emojiOtro: c2.emoji, perc: perc
        });
      }
      var percC = Math.round((4 / 52) * 100);
      pool.push({
        type: "cartas_perc",
        desc: "sacar un as (en porcentaje)",
        fav: 4, total: 52, res: percC + "%",
        cFav: 4, cOtro: 48, emojiFav: "🂡", emojiOtro: "🃏", perc: percC
      });
      percC = Math.round((13 / 52) * 100);
      pool.push({
        type: "cartas_perc",
        desc: "sacar un corazón (en porcentaje)",
        fav: 13, total: 52, res: percC + "%",
        cFav: 13, cOtro: 39, emojiFav: "🂱", emojiOtro: "🃏", perc: percC
      });
    }
    var idx = Math.floor(Math.random() * pool.length);
    var chosen = pool[idx];
    var key = chosen.type + "|" + (chosen.desc || "") + "|" + (chosen.res || "");
    if (pool.length > 1 && key === this._lastKey) {
      idx = (idx + 1) % pool.length;
      chosen = pool[idx];
      key = chosen.type + "|" + (chosen.desc || "") + "|" + (chosen.res || "");
    }
    this._lastKey = key;
    this.eq = chosen;
  },

  showExample: function (container) {
    var examples = {
      dado:
        "<li><b>Problema:</b> Probabilidad de sacar un 4 en un dado.</li>" +
        "<li><b>Casos Favorables:</b> ¿Cuántos '4' tiene un dado? Solo <b>1</b>.</li>" +
        "<li><b>Casos Posibles:</b> Un dado tiene <b>6</b> caras (del 1 al 6).</li>" +
        "<li><b>Fórmula (CF/CP):</b> 1 / 6 → <b>1/6</b>.</li>",
      moneda:
        "<li><b>Problema:</b> Probabilidad de sacar cara al lanzar una moneda.</li>" +
        "<li><b>Casos Favorables:</b> La moneda tiene 1 cara → <b>1</b>.</li>" +
        "<li><b>Casos Posibles:</b> Solo hay 2 resultados: cara o sello → <b>2</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 1 / 2 → <b>1/2</b>.</li>",
      ruleta:
        "<li><b>Problema:</b> Una ruleta tiene los números del 1 al 8. ¿Probabilidad de sacar par?</li>" +
        "<li><b>Casos Favorables:</b> Los pares son 2, 4, 6, 8 → <b>4</b>.</li>" +
        "<li><b>Casos Posibles:</b> Total de números → <b>8</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 4 / 8 → <b>4/8</b> (o 1/2).</li>",
      urna:
        "<li><b>Problema:</b> Sacar una bola negra de una caja con 7 negras y 4 blancas.</li>" +
        "<li><b>Casos Favorables:</b> Bolas negras → <b>7</b>.</li>" +
        "<li><b>Casos Posibles:</b> Total 7 + 4 = <b>11</b>.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 7 / 11 → <b>7/11</b>.</li>",
      cartas:
        "<li><b>Problema:</b> Sacar un as de una baraja de 52 cartas.</li>" +
        "<li><b>Casos Favorables:</b> Hay 4 ases en la baraja → <b>4</b>.</li>" +
        "<li><b>Casos Posibles:</b> La baraja tiene <b>52</b> cartas.</li>" +
        "<li><b>Fórmula (CF/CP):</b> 4 / 52 → <b>4/52</b>.</li>",
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
        "<li><b>Problema:</b> Probabilidad de sacar un as (52 cartas), en porcentaje.</li>" +
        "<li><b>Fracción (CF/CP):</b> 4 / 52.</li>" +
        "<li><b>A Porcentaje:</b> (4 ÷ 52) × 100 ≈ <b>8%</b>.</li>"
    };
    var t = this.eq.type;
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
      row.innerHTML =
        "<div class=\"bg-slate-200/50 p-6 rounded-3xl border-4 border-slate-300 shadow-inner flex justify-center items-center gap-8\">" +
        "<span class=\"text-6xl md:text-7xl\">🪙</span><span class=\"text-6xl md:text-7xl\">🪙</span>" +
        "</div>";
    } else if (this.eq.type === "ruleta") {
      var nums = [];
      for (var n = 1; n <= 8; n++) nums.push("<span class=\"bg-white border-2 border-slate-400 rounded-lg px-2 py-1 text-2xl md:text-3xl font-black text-slate-700 shadow-sm\">" + n + "</span>");
      row.innerHTML =
        "<div class=\"bg-slate-200/50 p-4 rounded-3xl border-4 border-slate-300 shadow-inner\">" +
        "<div class=\"flex justify-center mb-2\"><span class=\"text-4xl md:text-5xl\">🎡</span></div>" +
        "<div class=\"flex flex-wrap justify-center gap-2 max-w-md mx-auto\">" + nums.join("") + "</div>" +
        "</div>";
    } else {
      // Urna, cartas, frutas, urna_perc, cartas_perc: varios elementos repartidos en varias líneas (grid)
      var cOtro = typeof this.eq.cOtro === "number" ? this.eq.cOtro : 0;
      var arr = [];
      for (var i = 0; i < this.eq.cFav; i++) arr.push(this.eq.emojiFav);
      for (var j = 0; j < cOtro; j++) arr.push(this.eq.emojiOtro);
      for (var k = arr.length - 1; k > 0; k--) {
        var idx = Math.floor(Math.random() * (k + 1));
        var tmp = arr[k]; arr[k] = arr[idx]; arr[idx] = tmp;
      }
      var cells = arr.map(function (emoji) {
        return "<span class=\"inline-flex justify-center items-center text-2xl md:text-3xl\">" + emoji + "</span>";
      }).join("");
      var total = this.eq.total != null ? this.eq.total : arr.length;
      var palabra = this.eq.type === "urna" && (this.eq.desc || "").indexOf("canica") !== -1 ? "canicas" : this.eq.type === "frutas" ? "frutas" : this.eq.type === "cartas" || this.eq.type === "cartas_perc" ? "cartas" : "elementos";
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

  generateProbOptions: function () {
    var optionsSet = {};
    optionsSet[this.eq.res] = true;
    var isPerc = this.eq.type === "urna_perc" || this.eq.type === "cartas_perc";
    while (Object.keys(optionsSet).length < 4) {
      if (isPerc && this.eq.perc != null) {
        var fake = this.eq.perc + (Math.floor(Math.random() * 40) - 20);
        if (fake < 1) fake = 1;
        if (fake > 100) fake = 99;
        optionsSet[fake + "%"] = true;
      } else {
        var fakeFav = this.eq.fav + (Math.floor(Math.random() * 5) - 2);
        if (fakeFav < 1) fakeFav = 1;
        var fakeTot = this.eq.total + (Math.floor(Math.random() * 6) - 3);
        if (fakeTot < fakeFav) fakeTot = fakeFav + 1;
        optionsSet[fakeFav + "/" + fakeTot] = true;
      }
    }
    var options = Object.keys(optionsSet).sort(function () { return Math.random() - 0.5; });

    var container = document.createElement("div");
    container.className = "flex flex-col items-center w-full mt-4 animate-fade-in";
    container.id = "options-container";
    container.innerHTML = "<div class=\"text-xl md:text-2xl text-slate-500 mb-3 math-font text-center\">¿Cuál es la probabilidad de <b>" + this.eq.desc + "</b>?</div>";

    var btnsDiv = document.createElement("div");
    btnsDiv.className = "flex flex-wrap justify-center gap-3";
    for (var k = 0; k < options.length; k++) {
      var opt = options[k];
      var btn = document.createElement("button");
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
    if (val === this.eq.res) {
      btn.classList.replace("border-orange-200", "border-green-500");
      btn.classList.replace("text-orange-700", "text-white");
      btn.classList.add("bg-green-500");
      document.getElementById("options-container").classList.add("pointer-events-none", "opacity-50");
      var self = this;
      setTimeout(function () {
        var opts = document.getElementById("options-container");
        if (opts) opts.remove();
        App.updateTeacher("¡Probabilidad Correcta! 🎉", "¡Exacto! Tienes <b>" + self.eq.fav + "</b> casos a favor, de un total de <b>" + self.eq.total + "</b> posibles.", "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      }, 500);
    } else {
      btn.classList.replace("border-orange-200", "border-red-400");
      btn.classList.add("bg-red-50", "text-red-600", "animate-shake");
      var errExtra = (this.eq.type === "urna_perc" || this.eq.type === "cartas_perc")
        ? "💡 <b>Tip:</b> Primero halla la fracción (Casos Favorables / Total), luego multiplícala por 100 para el porcentaje."
        : "💡 <b>Tip:</b> El número de arriba son los casos favorables, el de abajo el total de casos posibles.";
      App.updateTeacher("¡Ups, revisa tus casos!", "Elegiste <b>" + val + "</b>, pero no es correcto. " + errExtra, "🫣");
      var btnRef = btn;
      setTimeout(function () {
        btnRef.classList.remove("bg-red-50", "text-red-600", "animate-shake");
        btnRef.classList.replace("border-red-400", "border-orange-200");
      }, 800);
    }
  },

  cleanup: function () {}
};
