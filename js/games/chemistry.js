/**
 * Juego de Balanceo de Ecuaciones Químicas (11º Grado).
 * El estudiante ajusta coeficientes hasta igualar la cantidad de átomos
 * en reactivos (izquierda) y productos (derecha).
 */
var ChemGame = {
  eqData: null,
  done: false,
  _lastKey: null,

  start: function (level) {
    this.done = false;
    this.generateValues(level);
    App.updateTeacher(
      "Paso 1: Iguala la balanza",
      "Ajusta los coeficientes usando los botones + y - hasta que tengas la misma cantidad de átomos a la izquierda y a la derecha.",
      "👩‍🔬"
    );
    this.renderRow();
  },

  generateValues: function (level) {
    var equations = {
      facil: [
        {
          left: [
            { label: "Zn", atoms: { Zn: 1 } },
            { label: "HCl", atoms: { H: 1, Cl: 1 } }
          ],
          right: [
            { label: "ZnCl₂", atoms: { Zn: 1, Cl: 2 } },
            { label: "H₂", atoms: { H: 2 } }
          ]
        },
        {
          left: [
            { label: "Na", atoms: { Na: 1 } },
            { label: "H₂O", atoms: { H: 2, O: 1 } }
          ],
          right: [
            { label: "NaOH", atoms: { Na: 1, O: 1, H: 1 } },
            { label: "H₂", atoms: { H: 2 } }
          ]
        }
      ],
      medio: [
        {
          left: [
            { label: "P", atoms: { P: 1 } },
            { label: "O₂", atoms: { O: 2 } }
          ],
          right: [
            { label: "P₂O₃", atoms: { P: 2, O: 3 } }
          ]
        },
        {
          left: [
            { label: "N₂", atoms: { N: 2 } },
            { label: "O₂", atoms: { O: 2 } }
          ],
          right: [
            { label: "N₂O₃", atoms: { N: 2, O: 3 } }
          ]
        }
      ],
      dificil: [
        {
          left: [
            { label: "HCl", atoms: { H: 1, Cl: 1 } },
            { label: "Ca(OH)₂", atoms: { Ca: 1, O: 2, H: 2 } }
          ],
          right: [
            { label: "CaCl₂", atoms: { Ca: 1, Cl: 2 } },
            { label: "H₂O", atoms: { H: 2, O: 1 } }
          ]
        },
        {
          left: [
            { label: "Al₂O₃", atoms: { Al: 2, O: 3 } },
            { label: "H₂SO₄", atoms: { H: 2, S: 1, O: 4 } }
          ],
          right: [
            { label: "Al₂(SO₄)₃", atoms: { Al: 2, S: 3, O: 12 } },
            { label: "H₂O", atoms: { H: 2, O: 1 } }
          ]
        }
      ]
    };

    var list = equations[level] || equations.facil;
    var idx = Math.floor(Math.random() * list.length);
    if (list.length > 1 && this._lastKey === level + idx) idx = (idx + 1) % list.length; // sin repetir la anterior
    this._lastKey = level + idx;
    this.eqData = JSON.parse(JSON.stringify(list[idx]));

    this.eqData.left.forEach(function (m) { m.coef = 1; });
    this.eqData.right.forEach(function (m) { m.coef = 1; });
  },

  // Cuenta los átomos de cada lado con los coeficientes actuales.
  _countAtoms: function () {
    var left = {}, right = {};
    this.eqData.left.forEach(function (m) {
      for (var a in m.atoms) left[a] = (left[a] || 0) + m.atoms[a] * m.coef;
    });
    this.eqData.right.forEach(function (m) {
      for (var b in m.atoms) right[b] = (right[b] || 0) + m.atoms[b] * m.coef;
    });
    return { left: left, right: right };
  },

  _atomOrder: function () {
    var order = [];
    var seen = {};
    this.eqData.left.concat(this.eqData.right).forEach(function (m) {
      for (var a in m.atoms) if (!seen[a]) { seen[a] = true; order.push(a); }
    });
    return order;
  },

  // Paso a paso con la ecuación ACTUAL y los coeficientes que tiene puestos ahora.
  showExample: function (container) {
    var counts = this._countAtoms();
    var atoms = this._atomOrder();
    var rows = atoms.map(function (a) {
      var l = counts.left[a] || 0, r = counts.right[a] || 0;
      var ok = l === r;
      return "<tr class=\"" + (ok ? "text-green-700" : "text-red-600 font-bold") + "\"><td class=\"px-3 py-1 font-black\">" + a + "</td><td class=\"px-3 py-1 text-center\">" + l + "</td><td class=\"px-3 py-1 text-center\">" + r + "</td><td class=\"px-3 py-1\">" + (ok ? "✓ igual" : "✗ distinto") + "</td></tr>";
    }).join("");
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Método de tanteo, con tu ecuación</p>" +
      "<p class=\"math-font text-2xl mb-3\">" + this.getEquationString() + "</p>" +
      "<p class=\"font-sans text-sm text-slate-600 mb-2\">Así van tus átomos con los coeficientes que tienes puestos ahora:</p>" +
      "<table class=\"bg-white border-2 border-indigo-200 rounded-xl overflow-hidden font-sans text-base mb-4\"><thead><tr class=\"bg-indigo-100 text-indigo-700 font-black\"><td class=\"px-3 py-1\">Átomo</td><td class=\"px-3 py-1\">Izquierda</td><td class=\"px-3 py-1\">Derecha</td><td class=\"px-3 py-1\"></td></tr></thead><tbody>" + rows + "</tbody></table>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>Cuenta:</b> multiplica el coeficiente (número grande) por el subíndice (número chiquito) de cada átomo. Ej: 2 H₂O tiene 4 H y 2 O.</li>" +
      "<li><b>Orden mágico:</b> balancea primero los <b>metales</b>, luego los <b>no metales</b>, después el <b>hidrógeno</b> y deja el <b>oxígeno</b> para el final.</li>" +
      "<li><b>Ajusta:</b> usa <span class=\"bg-fuchsia-200 text-fuchsia-800 font-bold px-1 rounded\">+</span> y <span class=\"bg-fuchsia-200 text-fuchsia-800 font-bold px-1 rounded\">−</span> solo en los coeficientes; los subíndices nunca se tocan.</li>" +
      "<li><b>Coeficientes mínimos:</b> si todos los números se pueden dividir entre el mismo (2, 4, 2, 2 → 1, 2, 1, 1), hay que usar los más pequeños.</li>" +
      "<li><b>Comprueba:</b> cuando cada átomo tenga el mismo número a los dos lados de la flecha, presiona \"¡Comprobar Balanceo!\".</li>" +
      "</ul>" +
      "</div>";
  },

  changeCoef: function (side, idx, delta) {
    if (this.done) return;
    var mol = this.eqData[side][idx];
    mol.coef = Math.max(1, Math.min(8, mol.coef + delta));
    this.renderRow();
  },

  resetBalance: function () {
    if (this.done) return;
    this.eqData.left.forEach(function (m) { m.coef = 1; });
    this.eqData.right.forEach(function (m) { m.coef = 1; });
    App.updateTeacher(
      "Balanza a cero",
      "Hemos devuelto todos los coeficientes a 1. ¡Inténtalo de nuevo!",
      "🧹"
    );
    this.renderRow();
  },

  getEquationString: function () {
    var fmt = function (m) { return (m.coef > 1 ? m.coef + " " : "") + m.label; };
    var l = this.eqData.left.map(fmt).join(" + ");
    var r = this.eqData.right.map(fmt).join(" + ");
    return l + " → " + r;
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    container.innerHTML = "";

    var row = document.createElement("div");
    row.className = "flex flex-wrap items-center justify-center gap-3 math-font text-slate-700 w-full animate-fade-in";

    var html = "";

    var done = this.done;
    function renderCoefControl(side, i, coef) {
      if (done) {
        return '<span class="text-green-700 font-black text-2xl md:text-3xl bg-green-100 border-4 border-green-400 rounded-xl px-2 md:px-3 py-1 mx-1">' + coef + "</span>";
      }
      return (
        '<div class="flex items-center bg-fuchsia-100 border-4 border-fuchsia-400 rounded-xl shadow-sm overflow-hidden mx-1">' +
        '<button type="button" aria-label="Bajar coeficiente" onclick="ChemGame.changeCoef(\'' + side + "', " + i + ', -1)" class="px-3 py-2 min-w-[40px] bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200 font-bold active:bg-fuchsia-300 transition-colors text-2xl">−</button>' +
        '<span class="text-fuchsia-800 font-black text-2xl md:text-3xl w-7 md:w-9 text-center select-none bg-white py-1">' + coef + "</span>" +
        '<button type="button" aria-label="Subir coeficiente" onclick="ChemGame.changeCoef(\'' + side + "', " + i + ', 1)" class="px-3 py-2 min-w-[40px] bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200 font-bold active:bg-fuchsia-300 transition-colors text-2xl">+</button>' +
        "</div>"
      );
    }

    this.eqData.left.forEach(function (m, i) {
      html +=
        '<div class="flex items-center gap-1">' +
        renderCoefControl("left", i, m.coef) +
        '<span class="text-3xl md:text-5xl font-bold text-slate-800 tracking-wider">' + m.label + "</span>" +
        "</div>";
      if (i < ChemGame.eqData.left.length - 1) {
        html += '<span class="text-3xl md:text-5xl font-black text-slate-400 mx-1">+</span>';
      }
    });

    html += '<span class="text-3xl md:text-5xl font-black text-slate-400 mx-2 md:mx-4">➔</span>';

    this.eqData.right.forEach(function (m, i) {
      html +=
        '<div class="flex items-center gap-1">' +
        renderCoefControl("right", i, m.coef) +
        '<span class="text-3xl md:text-5xl font-bold text-slate-800 tracking-wider">' + m.label + "</span>" +
        "</div>";
      if (i < ChemGame.eqData.right.length - 1) {
        html += '<span class="text-3xl md:text-5xl font-black text-slate-400 mx-1">+</span>';
      }
    });

    row.innerHTML = html;
    container.appendChild(row);

    var actionBtnsDiv = document.createElement("div");
    actionBtnsDiv.className = "w-full flex flex-wrap justify-center gap-4 mt-10 animate-fade-in";
    if (this.done) {
      actionBtnsDiv.innerHTML =
        '<div class="bg-green-100 border-4 border-green-500 text-green-700 font-black text-xl py-3 px-8 rounded-full flex items-center gap-2 shadow-md">' +
        '<span class="text-3xl">✓</span> ¡Ecuación Balanceada!' +
        "</div>";
      container.appendChild(actionBtnsDiv);
      return;
    }
    actionBtnsDiv.innerHTML =
      '<button onclick="ChemGame.resetBalance()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-lg md:text-xl py-3 px-6 rounded-full shadow-[0_4px_0_#94a3b8] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">' +
      "<span>🔄</span> Reiniciar" +
      "</button>" +
      '<button onclick="ChemGame.checkBalance()" class="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-black text-lg md:text-xl py-3 px-8 rounded-full shadow-[0_4px_0_#a21caf] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">' +
      "<span>⚖️</span> ¡Comprobar Balanceo!" +
      "</button>";
    container.appendChild(actionBtnsDiv);
  },

  _gcd: function (a, b) {
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  },

  checkBalance: function () {
    if (this.done) return;
    var counts = this._countAtoms();
    var atoms = this._atomOrder();
    var problems = [];
    atoms.forEach(function (atom) {
      var l = counts.left[atom] || 0;
      var r = counts.right[atom] || 0;
      if (l !== r) problems.push("<b>" + atom + "</b>: " + l + " a la izquierda y " + r + " a la derecha");
    });

    var container = document.getElementById("lines-container");
    var shake = function () {
      container.classList.add("animate-shake");
      setTimeout(function () { container.classList.remove("animate-shake"); }, 400);
    };

    if (problems.length) {
      App.updateTeacher(
        "¡Reacción inestable!",
        "Todavía no cuadran: " + problems.join("; ") + ". Sigue ajustando los coeficientes.",
        "💥"
      );
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();
      shake();
      return;
    }

    // Balanceada, pero ¿con los coeficientes más pequeños posibles?
    var coefs = this.eqData.left.concat(this.eqData.right).map(function (m) { return m.coef; });
    var g = coefs.reduce(function (acc, c) { return ChemGame._gcd(acc, c); }, coefs[0]);
    if (g > 1) {
      App.updateTeacher(
        "¡Casi! Está balanceada, pero no con los números más pequeños",
        "Todos tus coeficientes (" + coefs.join(", ") + ") se pueden dividir entre <b>" + g + "</b>. En química se usan siempre los <b>coeficientes enteros mínimos</b>: divide cada uno entre " + g + " y vuelve a comprobar.",
        "🧐"
      );
      if (typeof registerWrongAttempt === "function") registerWrongAttempt();
      shake();
      return;
    }

    this.done = true;
    App.updateTeacher(
      "¡Balanceado perfectamente! 🎉",
      "¡La materia se ha conservado! <b>" + this.getEquationString() + "</b>: la misma cantidad de átomos de cada elemento en los reactivos y en los productos.",
      "👩‍🔬"
    );
    this.renderRow();
    document.getElementById("success-area").classList.remove("hidden-el");
    App.triggerConfetti();
    if (typeof awardExercisePoints === "function") awardExercisePoints();
  },

  cleanup: function () {
    // No hay listeners globales que limpiar actualmente, pero se deja por consistencia.
  }
};

