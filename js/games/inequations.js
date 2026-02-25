/**
 * Juego de Inecuaciones (11º Grado): desigualdades, despeje y intervalos.
 */
var IneqGame = {
  eq: null,
  step: 1,
  activeEl: null,
  cloneEl: null,
  offsetX: 0,
  offsetY: 0,
  bridge: null,
  dragStartHandler: null,
  dragMoveHandler: null,
  dragEndHandler: null,

  start: function (level) {
    this.step = 1;
    this.generateValues(level);
    App.updateTeacher("Paso 1: Despeja la X", "Como en las ecuaciones, mueve el número cruzando la desigualdad. ¡Atento a las reglas si es negativo!");
    this.renderRow1();
  },

  generateValues: function (level) {
    var signs = ["<", "≤", ">", "≥"];
    var randSign = function () { return signs[Math.floor(Math.random() * signs.length)]; };

    this.eq = { var: "x", op: "", val: 0, res: 0, resultFinal: 0, sign: randSign() };

    if (level === "facil") {
      var isAdd = Math.random() > 0.5;
      this.eq.op = isAdd ? "+" : "-";
      this.eq.val = Math.floor(Math.random() * 15) + 1;
      this.eq.resultFinal = Math.floor(Math.random() * 20) - 10;
      this.eq.res = isAdd ? this.eq.resultFinal + this.eq.val : this.eq.resultFinal - this.eq.val;
      this.eq.type = "add";
    } else if (level === "medio") {
      this.eq.op = "×";
      this.eq.val = Math.floor(Math.random() * 5) + 2;
      this.eq.resultFinal = Math.floor(Math.random() * 10) - 5;
      this.eq.res = this.eq.resultFinal * this.eq.val;
      this.eq.type = "mult_pos";
    } else {
      this.eq.op = "×";
      this.eq.val = (Math.floor(Math.random() * 5) + 2) * -1;
      this.eq.resultFinal = Math.floor(Math.random() * 10) - 5;
      this.eq.res = this.eq.resultFinal * this.eq.val;
      this.eq.type = "mult_neg";
    }
  },

  getOppositeOp: function (op) {
    var ops = { "+": "-", "-": "+", "×": "÷" };
    return ops[op] || op;
  },

  getFlippedSign: function (sign) {
    var flips = { "<": ">", "≤": "≥", ">": "<", "≥": "≤" };
    return flips[sign] || sign;
  },

  getSignName: function (sign) {
    var names = { "<": "menor que", "≤": "menor o igual que", ">": "mayor que", "≥": "mayor o igual que" };
    return names[sign] || "";
  },

  getIntervalString: function (sign, num) {
    if (sign === "<") return "(-∞, " + num + ")";
    if (sign === "≤") return "(-∞, " + num + "]";
    if (sign === ">") return "(" + num + ", ∞)";
    if (sign === "≥") return "[" + num + ", ∞)";
    return "";
  },

  renderRow1: function () {
    var row = document.createElement("div");
    row.className = "flex items-center gap-2 md:gap-4 math-font text-slate-700 w-full";
    var draggableHTML = "";
    if (this.eq.type === "mult_neg" || this.eq.type === "mult_pos") {
      draggableHTML =
        "<div class=\"flex-1 flex justify-end gap-1 pr-2 md:pr-4\">" +
        "<span id=\"ineq-drag\" class=\"draggable text-slate-800 shadow-sm px-2\">" + this.eq.val + "</span>" +
        "<span class=\"font-bold text-indigo-600\">x</span>" +
        "</div>";
    } else {
      draggableHTML =
        "<div class=\"flex-1 flex justify-end gap-2 pr-2 md:pr-4\">" +
        "<span class=\"font-bold text-indigo-600\">x</span>" +
        "<span id=\"ineq-drag\" class=\"draggable text-slate-800 shadow-sm px-2\">" + this.eq.op + " " + Math.abs(this.eq.val) + "</span>" +
        "</div>";
    }
    row.innerHTML =
      draggableHTML +
      "<div id=\"ineq-bridge\" class=\"magic-bridge font-bold text-slate-400 w-8 text-center\">" + this.eq.sign + "</div>" +
      "<div class=\"flex-1 pl-2 md:pl-4\"><span>" + this.eq.res + "</span></div>";
    document.getElementById("lines-container").appendChild(row);

    this.bridge = document.getElementById("ineq-bridge");
    var dragEl = document.getElementById("ineq-drag");
    var self = this;
    this.dragStartHandler = function (e) { self.dragStart(e); };
    this.dragMoveHandler = function (e) { self.dragMove(e); };
    this.dragEndHandler = function (e) { self.dragEnd(e); };
    dragEl.addEventListener("pointerdown", this.dragStartHandler);
  },

  dragStart: function (e) {
    if (this.step !== 1) return;
    this.activeEl = e.target.closest && e.target.closest(".draggable") || e.target;
    if (!this.activeEl || !this.activeEl.classList || !this.activeEl.classList.contains("draggable")) return;
    e.preventDefault();
    var clientX = e.clientX;
    var clientY = e.clientY;
    var rect = this.activeEl.getBoundingClientRect();
    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;

    this.cloneEl = this.activeEl.cloneNode(true);
    this.cloneEl.id = "ineq-drag-clone";
    this.cloneEl.style.position = "fixed";
    this.cloneEl.style.left = rect.left + "px";
    this.cloneEl.style.top = rect.top + "px";
    this.cloneEl.style.margin = "0";
    this.cloneEl.style.zIndex = "1000";
    this.cloneEl.style.pointerEvents = "none";
    this.cloneEl.style.transform = "scale(1.1) rotate(2deg)";
    this.cloneEl.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    document.body.appendChild(this.cloneEl);
    this.activeEl.style.opacity = "0.2";
    if (this.activeEl.setPointerCapture) this.activeEl.setPointerCapture(e.pointerId);
    document.addEventListener("pointermove", this.dragMoveHandler);
    document.addEventListener("pointerup", this.dragEndHandler);
    document.addEventListener("pointercancel", this.dragEndHandler);
  },

  dragMove: function (e) {
    if (!this.cloneEl) return;
    var currentX = e.clientX;
    var currentY = e.clientY;
    this.cloneEl.style.left = (currentX - this.offsetX) + "px";
    this.cloneEl.style.top = (currentY - this.offsetY) + "px";
    var bridgeRect = this.bridge.getBoundingClientRect();
    var cloneRect = this.cloneEl.getBoundingClientRect();
    var cloneCenter = cloneRect.left + cloneRect.width / 2;

    if (cloneCenter > bridgeRect.left) {
      var oppOp = this.getOppositeOp(this.eq.op);
      var displayVal = this.eq.type === "add" ? Math.abs(this.eq.val) : this.eq.val;
      this.cloneEl.innerHTML = "<span class=\"text-pink-600 font-bold\">" + oppOp + "</span> " + displayVal;
      if (this.eq.type === "mult_neg") {
        this.bridge.innerText = this.getFlippedSign(this.eq.sign);
        this.bridge.classList.add("bridge-flipped");
      } else {
        this.bridge.classList.add("bridge-active");
      }
    } else {
      if (this.eq.type === "add") {
        this.cloneEl.innerHTML = this.eq.op + " " + Math.abs(this.eq.val);
      } else {
        this.cloneEl.innerHTML = "" + this.eq.val;
      }
      this.bridge.innerText = this.eq.sign;
      this.bridge.classList.remove("bridge-active", "bridge-flipped");
    }
  },

  dragEnd: function (e) {
    if (!this.activeEl || !this.cloneEl) return;
    if (this.activeEl.releasePointerCapture) this.activeEl.releasePointerCapture(e.pointerId);
    document.removeEventListener("pointermove", this.dragMoveHandler);
    document.removeEventListener("pointerup", this.dragEndHandler);
    document.removeEventListener("pointercancel", this.dragEndHandler);

    var bridgeRect = this.bridge.getBoundingClientRect();
    var cloneRect = this.cloneEl.getBoundingClientRect();
    var cloneCenter = cloneRect.left + cloneRect.width / 2;

    if (cloneCenter > bridgeRect.left) {
      this.step = 2;
      this.bridge.classList.remove("bridge-active", "bridge-flipped");

      var parent = this.activeEl.parentNode;
      var staticSpan = document.createElement("span");
      staticSpan.className = "text-slate-400 opacity-60 line-through decoration-2 decoration-slate-300 transition-all duration-500 px-2";
      if (this.eq.type === "add") staticSpan.innerText = this.eq.op + " " + Math.abs(this.eq.val);
      else staticSpan.innerText = "" + this.eq.val;
      parent.replaceChild(staticSpan, this.activeEl);

      var noteRow = document.createElement("div");
      noteRow.className = "w-full text-center md:text-right pr-4 md:pr-12 text-sm md:text-base font-sans font-bold -mt-2 md:-mt-4 mb-2 animate-fade-in";
      var oppOp = this.getOppositeOp(this.eq.op);
      var displayVal = this.eq.type === "add" ? Math.abs(this.eq.val) : this.eq.val;
      if (this.eq.type === "mult_neg") {
        noteRow.classList.add("text-red-500");
        noteRow.innerHTML = "🚨 ¡Regla de Oro! Al pasar a dividir el negativo <span class=\"bg-red-50 px-2 rounded\">" + this.eq.val + "</span>, la desigualdad se invierte a <span class=\"font-black text-xl\">" + this.getFlippedSign(this.eq.sign) + "</span>";
        this.bridge.innerText = this.getFlippedSign(this.eq.sign);
      } else {
        noteRow.classList.add("text-indigo-400");
        noteRow.innerHTML = "↳ Se pasa al otro lado con operación contraria: <span class=\"bg-pink-50 px-2 py-0.5 rounded text-pink-600\">" + oppOp + " " + displayVal + "</span>";
      }
      document.getElementById("lines-container").appendChild(noteRow);
      this.cloneEl.remove();
      this.renderRow2(oppOp, displayVal);
    } else {
      this.activeEl.style.opacity = "1";
      this.bridge.innerText = this.eq.sign;
      this.bridge.classList.remove("bridge-active", "bridge-flipped");
      this.cloneEl.remove();
    }
    this.cloneEl = null;
    this.activeEl = null;
  },

  renderRow2: function (oppOp, displayVal) {
    var currentSign = this.eq.type === "mult_neg" ? this.getFlippedSign(this.eq.sign) : this.eq.sign;
    var row = document.createElement("div");
    row.className = "flex items-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in";
    row.innerHTML =
      "<div class=\"flex-1 flex justify-end pr-2 md:pr-4\"><span class=\"font-bold text-indigo-600\">x</span></div>" +
      "<div class=\"font-bold text-slate-800 w-8 text-center\">" + currentSign + "</div>" +
      "<div class=\"flex-1 pl-2 md:pl-4 flex items-center\">" +
      "<span>" + this.eq.res + " <span class=\"text-pink-600 font-bold px-1\">" + oppOp + "</span> " + displayVal + "</span>" +
      "</div>";
    document.getElementById("lines-container").appendChild(row);

    var signName = this.getSignName(currentSign);
    App.updateTeacher("Paso 2: Intervalo Final", "El signo <b>" + currentSign + "</b> se lee \"" + signName + "\". Selecciona qué **Intervalo** representa esta respuesta final.", "🤔");

    var finalSign = currentSign;
    var finalNum = this.eq.resultFinal;
    var correctInterval = this.getIntervalString(finalSign, finalNum);

    var optionsSet = new Set([correctInterval]);
    var fakeSigns = ["<", "≤", ">", "≥"].filter(function (s) { return s !== finalSign; });
    optionsSet.add(this.getIntervalString(fakeSigns[0], finalNum));
    optionsSet.add(this.getIntervalString(fakeSigns[1], finalNum));
    optionsSet.add(this.getIntervalString(finalSign, finalNum + 2));
    var options = Array.from(optionsSet).sort(function () { return Math.random() - 0.5; });

    var optionsContainer = document.createElement("div");
    optionsContainer.className = "flex flex-wrap justify-center gap-3 mt-8 animate-fade-in w-full";
    optionsContainer.id = "options-container";
    var self = this;
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "font-sans bg-white border-4 border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xl md:text-2xl py-3 px-5 rounded-2xl shadow-[0_4px_0_#c7d2fe] active:translate-y-1 active:shadow-none transition-all tracking-wider";
      btn.innerText = opt;
      btn.onclick = function () { self.verify(opt, correctInterval, finalSign, finalNum, btn); };
      optionsContainer.appendChild(btn);
    });
    document.getElementById("lines-container").appendChild(optionsContainer);
  },

  verify: function (selectedVal, correctVal, finalSign, finalNum, btn) {
    var self = this;
    if (selectedVal === correctVal) {
      handleCorrectOption(btn, function () {
        var row = document.createElement("div");
        row.className = "flex items-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in";
        row.innerHTML =
          "<div class=\"flex-1 flex justify-end pr-2 md:pr-4\"><span class=\"font-bold text-indigo-600\">x</span></div>" +
          "<div class=\"font-bold text-slate-800 w-8 text-center\">" + finalSign + "</div>" +
          "<div class=\"flex-1 pl-2 md:pl-4 relative\">" +
          "<span class=\"font-bold text-green-600 border-2 border-green-500 rounded-lg px-2 py-1 bg-green-50 shadow-sm\">" + finalNum + "</span>" +
          "<span class=\"absolute -right-4 -top-4 md:-top-6 text-red-500 text-3xl md:text-4xl rotate-12 font-bold opacity-80 animate-pulse\">✓</span>" +
          "</div>";
        document.getElementById("lines-container").appendChild(row);

        var intRow = document.createElement("div");
        intRow.className = "w-full text-center mt-6 animate-fade-in";
        intRow.innerHTML = "<span class=\"bg-indigo-600 text-white font-sans font-black text-2xl md:text-3xl px-6 py-2 rounded-xl shadow-lg border-b-4 border-indigo-800 tracking-wider\">Resp: x ∈ " + correctVal + "</span>";
        document.getElementById("lines-container").appendChild(intRow);

        var reason = (finalSign === "≤" || finalSign === "≥")
          ? "tiene el símbolo igual (≤, ≥), usamos <b>corchete [ ]</b> para indicar que sí incluye el número."
          : "es estricto (<, >), usamos <b>paréntesis ( )</b> para indicar que no incluye el número.";
        var direction = (finalSign === "<" || finalSign === "≤") ? "menores" : "mayores";
        var signName = this.getSignName(finalSign);
        App.updateTeacher("¡Completado! 🎉", "¡Perfecto! El signo <b>" + finalSign + "</b> significa \"<b>" + signName + "</b>\". Como los valores son " + direction + " a " + finalNum + ", el intervalo va hacia el infinito. Y como " + reason, "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      }.bind(this));
    } else {
      var signName = this.getSignName(finalSign);
      var rule = (finalSign === "≤" || finalSign === "≥")
        ? "el signo <b>" + finalSign + "</b> (\"" + signName + "\") requiere corchetes <b>[ ]</b>"
        : "el signo <b>" + finalSign + "</b> (\"" + signName + "\") requiere paréntesis <b>( )</b>";
      var direction = (finalSign === "<" || finalSign === "≤") ? "-∞ a la izquierda" : "∞ a la derecha";
      handleWrongOption(btn, function () {
        App.updateTeacher("¡Revisa tus apuntes!", "Elegiste <b>" + selectedVal + "</b>, pero fíjate en tu inecuación: <b>x " + finalSign + " " + finalNum + "</b>. Recuerda que " + rule + " y debe ir hacia el <b>" + direction + "</b>.", "🫣");
      });
    }
  },

  cleanup: function () {
    if (this.cloneEl && this.cloneEl.parentNode) this.cloneEl.remove();
    if (this.dragMoveHandler) document.removeEventListener("pointermove", this.dragMoveHandler);
    if (this.dragEndHandler) {
      document.removeEventListener("pointerup", this.dragEndHandler);
      document.removeEventListener("pointercancel", this.dragEndHandler);
    }
  }
};
