/**
 * Juego de Ecuaciones (5º Grado): arrastrar término al otro lado del = (con elemento fantasma).
 */
var EqGame = {
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
    App.updateTeacher("Paso 1: Mueve al intruso", "Para dejar la <b>X</b> sola, toma el <b>" + this.eq.op + " " + this.eq.val + "</b> y arrástralo cruzando el puente mágico (=).");
    this.renderRow1();
  },

  generateValues: function (level) {
    this.eq = { var: "x", op: "+", val: 0, res: 0, resultFinal: 0 };
    if (level === "facil") {
      var isAdd = Math.random() > 0.5;
      this.eq.op = isAdd ? "+" : "-";
      this.eq.val = Math.floor(Math.random() * 9) + 1;
      this.eq.resultFinal = Math.floor(Math.random() * 10) + 5;
      this.eq.res = isAdd ? this.eq.resultFinal + this.eq.val : this.eq.resultFinal - this.eq.val;
    } else if (level === "medio") {
      var isAdd = Math.random() > 0.5;
      this.eq.op = isAdd ? "+" : "-";
      this.eq.val = Math.floor(Math.random() * 30) + 10;
      this.eq.resultFinal = Math.floor(Math.random() * 30) + 15;
      this.eq.res = isAdd ? this.eq.resultFinal + this.eq.val : this.eq.resultFinal - this.eq.val;
    } else {
      var isMult = Math.random() > 0.5;
      this.eq.op = isMult ? "×" : "÷";
      this.eq.val = Math.floor(Math.random() * 8) + 2;
      if (isMult) {
        this.eq.resultFinal = Math.floor(Math.random() * 10) + 2;
        this.eq.res = this.eq.resultFinal * this.eq.val;
      } else {
        this.eq.res = Math.floor(Math.random() * 10) + 2;
        this.eq.resultFinal = this.eq.res * this.eq.val;
      }
    }
  },

  renderRow1: function () {
    var row = document.createElement("div");
    row.className = "flex items-center gap-2 md:gap-4 math-font text-slate-700 w-full";
    row.innerHTML =
      "<div class=\"flex-1 flex justify-end gap-2 pr-2 md:pr-4\">" +
      "<span class=\"font-bold text-indigo-600\">x</span>" +
      "<span id=\"eq-drag\" class=\"draggable text-slate-800 shadow-sm\">" + this.eq.op + " " + this.eq.val + "</span>" +
      "</div>" +
      "<div id=\"eq-bridge\" class=\"magic-bridge font-bold text-slate-400\">=</div>" +
      "<div class=\"flex-1 pl-2 md:pl-4\"><span>" + this.eq.res + "</span></div>";
    document.getElementById("lines-container").appendChild(row);

    this.bridge = document.getElementById("eq-bridge");
    var dragEl = document.getElementById("eq-drag");
    var self = this;
    this.dragStartHandler = function (e) { self.dragStart(e); };
    this.dragMoveHandler = function (e) { self.dragMove(e); };
    this.dragEndHandler = function (e) { self.dragEnd(e); };
    dragEl.addEventListener("pointerdown", this.dragStartHandler);
  },

  getOppositeOp: function (op) {
    var ops = { "+": "-", "-": "+", "×": "÷", "÷": "×" };
    return ops[op] || op;
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
    this.cloneEl.id = "eq-drag-clone";
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
      this.bridge.classList.add("bridge-active");
      this.cloneEl.innerHTML = "<span class=\"text-pink-600 font-bold\">" + this.getOppositeOp(this.eq.op) + "</span> " + this.eq.val;
    } else {
      this.bridge.classList.remove("bridge-active");
      this.cloneEl.innerHTML = this.eq.op + " " + this.eq.val;
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
      this.bridge.classList.remove("bridge-active");

      var parent = this.activeEl.parentNode;
      var staticSpan = document.createElement("span");
      staticSpan.className = "text-slate-400 opacity-60 line-through decoration-2 decoration-slate-300 transition-all duration-500";
      staticSpan.innerText = this.eq.op + " " + this.eq.val;
      parent.replaceChild(staticSpan, this.activeEl);

      var noteRow = document.createElement("div");
      noteRow.className = "w-full text-center md:text-right pr-4 md:pr-12 text-sm md:text-base font-sans text-indigo-400 font-bold -mt-2 md:-mt-4 mb-2 animate-fade-in";
      noteRow.innerHTML = "↳ Se pasa el <span class=\"bg-slate-100 px-2 py-0.5 rounded text-slate-500 line-through decoration-slate-400\">" + this.eq.op + " " + this.eq.val + "</span> al otro lado como <span class=\"bg-pink-50 px-2 py-0.5 rounded text-pink-600\">" + this.getOppositeOp(this.eq.op) + " " + this.eq.val + "</span>";
      document.getElementById("lines-container").appendChild(noteRow);

      this.cloneEl.remove();
      this.renderRow2(this.getOppositeOp(this.eq.op));
    } else {
      this.activeEl.style.opacity = "1";
      this.cloneEl.remove();
    }

    this.cloneEl = null;
    this.activeEl = null;
  },

  renderRow2: function (oppOp) {
    var row = document.createElement("div");
    row.className = "flex items-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in";
    row.innerHTML =
      "<div class=\"flex-1 flex justify-end pr-2 md:pr-4\"><span class=\"font-bold text-indigo-600\">x</span></div>" +
      "<div class=\"font-bold text-slate-800\">=</div>" +
      "<div class=\"flex-1 pl-2 md:pl-4 flex items-center\">" +
      "<span>" + this.eq.res + " <span class=\"text-pink-600 font-bold px-1\">" + oppOp + "</span> " + this.eq.val + "</span>" +
      "</div>";
    document.getElementById("lines-container").appendChild(row);
    App.updateTeacher("Paso 2: ¡Calcula!", "El signo cambió a su contrario. Resuelve la operación y selecciona el resultado.", "🤔");
    var self = this;
    var oppOp = this.getOppositeOp(this.eq.op);
    generateOptionsUI(this.eq.resultFinal, function (val, btn) { self.verify(val, btn, oppOp); });
  },

  verify: function (val, btn, oppOp) {
    var self = this;
    var resultFinal = this.eq.resultFinal;
    if (val === resultFinal) {
      handleCorrectOption(btn, function () {
        var row = document.createElement("div");
        row.className = "flex items-center gap-2 md:gap-4 math-font text-slate-700 w-full animate-fade-in";
        row.innerHTML =
          "<div class=\"flex-1 flex justify-end pr-2 md:pr-4\"><span class=\"font-bold text-indigo-600\">x</span></div>" +
          "<div class=\"font-bold text-slate-800\">=</div>" +
          "<div class=\"flex-1 pl-2 md:pl-4 relative\">" +
          "<span class=\"font-bold text-green-600 border-2 border-green-500 rounded-lg px-2 py-1 bg-green-50\">" + resultFinal + "</span>" +
          "<span class=\"absolute -right-4 -top-4 md:-top-6 text-red-500 text-3xl md:text-4xl rotate-12 font-bold opacity-80 animate-pulse\">✓</span>" +
          "</div>";
        document.getElementById("lines-container").appendChild(row);
        App.updateTeacher("¡Completado! 🎉", "¡Excelente! <b>" + self.eq.res + " " + (oppOp || self.getOppositeOp(self.eq.op)) + " " + self.eq.val + "</b> es exactamente <b>" + resultFinal + "</b>. ¡Despejaste la X!", "🌟");
        document.getElementById("success-area").classList.remove("hidden-el");
        App.triggerConfetti();
      });
    } else {
      var opp = oppOp || this.getOppositeOp(this.eq.op);
      handleWrongOption(btn, function () {
        App.updateTeacher("¡Ups, revisa tu cálculo!", "Elegiste <b>" + val + "</b>, pero si calculas detalladamente <b>" + this.eq.res + " " + opp + " " + this.eq.val + "</b>, el resultado no es ese. ¡Vuelve a intentarlo!", "🫣");
      }.bind(this));
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
