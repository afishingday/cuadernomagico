/**
 * Juego de Balanceo de Ecuaciones Químicas (11º Grado).
 * El estudiante ajusta coeficientes hasta igualar la cantidad de átomos
 * en reactivos (izquierda) y productos (derecha).
 */
var ChemGame = {
  eqData: null,

  start: function (level) {
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
    this.eqData = JSON.parse(JSON.stringify(list[Math.floor(Math.random() * list.length)]));

    this.eqData.left.forEach(function (m) { m.coef = 1; });
    this.eqData.right.forEach(function (m) { m.coef = 1; });
  },

  showExample: function (container) {
    container.innerHTML =
      "<div class=\"p-4 md:p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200\">" +
      "<p class=\"font-bold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 text-xl\">Ejemplo: Método de Tanteo</p>" +
      "<ul class=\"list-decimal pl-6 space-y-3\">" +
      "<li><b>Identifica átomos:</b> Haz una lista mental de los átomos presentes (ej. imagina una ecuación con H y O).</li>" +
      "<li><b>Cuenta:</b> Revisa cuántos hay de cada lado. Si a la izquierda hay 2 de H y a la derecha solo 1, ¡están desbalanceados!</li>" +
      "<li><b>Multiplica:</b> Presiona los botones <span class=\"bg-fuchsia-200 text-fuchsia-800 font-bold px-1 rounded\">+</span> y <span class=\"bg-fuchsia-200 text-fuchsia-800 font-bold px-1 rounded\">-</span> para cambiar el número grande (coeficiente). Este número multiplicará a TODOS los átomos de esa molécula.</li>" +
      "<li><b>Comprueba:</b> Cuando creas que tienes exactamente el mismo número de todos los átomos a la izquierda y a la derecha de la flecha, presiona \"¡Comprobar Balanceo!\".</li>" +
      "</ul>" +
      "</div>";
  },

  changeCoef: function (side, idx, delta) {
    var mol = this.eqData[side][idx];
    mol.coef += delta;
    if (mol.coef > 8) mol.coef = 1;
    if (mol.coef < 1) mol.coef = 8;
    this.renderRow();
  },

  resetBalance: function () {
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
    var l = this.eqData.left.map(function (m) { return m.coef + m.label; }).join(" + ");
    var r = this.eqData.right.map(function (m) { return m.coef + m.label; }).join(" + ");
    return l + " = " + r;
  },

  renderRow: function () {
    var container = document.getElementById("lines-container");
    container.innerHTML = "";

    var row = document.createElement("div");
    row.className = "flex flex-wrap items-center justify-center gap-3 math-font text-slate-700 w-full animate-fade-in";

    var html = "";

    function renderCoefControl(side, i, coef) {
      return (
        '<div class="flex items-center bg-fuchsia-100 border-4 border-fuchsia-400 rounded-xl shadow-sm overflow-hidden mx-1">' +
        '<button onclick="ChemGame.changeCoef(\'' + side + "', " + i + ', -1)" class="px-2 md:px-3 py-1 bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200 font-bold active:bg-fuchsia-300 transition-colors text-xl md:text-2xl">-</button>' +
        '<span class="text-fuchsia-800 font-black text-2xl md:text-3xl w-6 md:w-8 text-center select-none bg-white py-1">' + coef + "</span>" +
        '<button onclick="ChemGame.changeCoef(\'' + side + "', " + i + ', 1)" class="px-2 md:px-3 py-1 bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200 font-bold active:bg-fuchsia-300 transition-colors text-xl md:text-2xl">+</button>' +
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
    actionBtnsDiv.innerHTML =
      '<button onclick="ChemGame.resetBalance()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-lg md:text-xl py-3 px-6 rounded-full shadow-[0_4px_0_#94a3b8] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">' +
      "<span>🔄</span> Reiniciar" +
      "</button>" +
      '<button onclick="ChemGame.checkBalance()" class="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-black text-lg md:text-xl py-3 px-8 rounded-full shadow-[0_4px_0_#a21caf] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">' +
      "<span>⚖️</span> ¡Comprobar Balanceo!" +
      "</button>";
    container.appendChild(actionBtnsDiv);
  },

  checkBalance: function () {
    var leftAtoms = {};
    var rightAtoms = {};

    this.eqData.left.forEach(function (m) {
      for (var atom in m.atoms) {
        leftAtoms[atom] = (leftAtoms[atom] || 0) + m.atoms[atom] * m.coef;
      }
    });

    this.eqData.right.forEach(function (m) {
      for (var atom in m.atoms) {
        rightAtoms[atom] = (rightAtoms[atom] || 0) + m.atoms[atom] * m.coef;
      }
    });

    var isBalanced = true;
    var errorMsg = "";

    var allAtoms = {};
    Object.keys(leftAtoms).forEach(function (a) { allAtoms[a] = true; });
    Object.keys(rightAtoms).forEach(function (a) { allAtoms[a] = true; });

    Object.keys(allAtoms).forEach(function (atom) {
      var l = leftAtoms[atom] || 0;
      var r = rightAtoms[atom] || 0;
      if (l !== r) {
        isBalanced = false;
        errorMsg = "Tienes <b>" + l + "</b> átomo(s) de <b>" + atom + "</b> a la izquierda, pero <b>" + r + "</b> a la derecha. ¡Siguen desbalanceados!";
      }
    });

    if (isBalanced) {
      App.updateTeacher(
        "¡Balanceado Perfectamente! 🎉",
        "¡La materia se ha conservado! Tienes la misma cantidad de átomos en los reactivos que en los productos.",
        "👩‍🔬"
      );

      var lastChild = document.getElementById("lines-container").lastChild;
      if (lastChild) {
        lastChild.innerHTML =
          '<div class="bg-green-100 border-4 border-green-500 text-green-700 font-black text-xl py-3 px-8 rounded-full flex items-center gap-2 mt-4 shadow-md animate-fade-in">' +
          '<span class="text-3xl">✓</span> ¡Ecuación Balanceada!' +
          "</div>";
      }

      document.getElementById("success-area").classList.remove("hidden-el");
      App.triggerConfetti();
    } else {
      App.updateTeacher(
        "¡Reacción inestable!",
        errorMsg + " Sigue ajustando los coeficientes.",
        "💥"
      );
      var container = document.getElementById("lines-container");
      container.classList.add("animate-shake");
      setTimeout(function () { container.classList.remove("animate-shake"); }, 400);
    }
  },

  cleanup: function () {
    // No hay listeners globales que limpiar actualmente, pero se deja por consistencia.
  }
};

