/**
 * Panel familiar (papá/mamá): saldo, tienda de premios y canjes de Sofía.
 * PIN en window.CuadernoMagicoConfig.parentPin (js/config.js, no subir a Git).
 */
var ParentPanel = {
  AUTH_KEY: "cm_parent_auth",

  init: function () {
    var trigger = document.getElementById("parent-panel-trigger");
    if (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        ParentPanel.open();
      });
    }
    var logo = document.querySelector("#view-landing img[alt*='Logo']");
    if (logo) {
      var clicks = 0;
      var timer = null;
      logo.style.cursor = "default";
      logo.addEventListener("click", function () {
        clicks++;
        clearTimeout(timer);
        timer = setTimeout(function () { clicks = 0; }, 2500);
        if (clicks >= 5) {
          clicks = 0;
          ParentPanel.open();
        }
      });
    }
  },

  getPin: function () {
    var cfg = window.CuadernoMagicoConfig || {};
    return (cfg.parentPin && String(cfg.parentPin)) || "";
  },

  isAuthed: function () {
    return sessionStorage.getItem(this.AUTH_KEY) === "1";
  },

  setAuthed: function (ok) {
    if (ok) sessionStorage.setItem(this.AUTH_KEY, "1");
    else sessionStorage.removeItem(this.AUTH_KEY);
  },

  open: function () {
    var modal = document.getElementById("parent-panel-modal");
    if (!modal) return;
    modal.classList.remove("hidden-el");
    if (this.isAuthed()) this.showDashboard();
    else this.showLogin();
  },

  close: function () {
    var modal = document.getElementById("parent-panel-modal");
    if (modal) modal.classList.add("hidden-el");
  },

  showLogin: function () {
    var login = document.getElementById("parent-panel-login");
    var dash = document.getElementById("parent-panel-dashboard");
    if (login) login.classList.remove("hidden-el");
    if (dash) dash.classList.add("hidden-el");
    var err = document.getElementById("parent-pin-error");
    if (err) err.classList.add("hidden-el");
    var input = document.getElementById("parent-pin-input");
    if (input) {
      input.value = "";
      setTimeout(function () { input.focus(); }, 100);
    }
  },

  showDashboard: function () {
    var login = document.getElementById("parent-panel-login");
    var dash = document.getElementById("parent-panel-dashboard");
    if (login) login.classList.add("hidden-el");
    if (dash) dash.classList.remove("hidden-el");
    this.refresh();
  },

  tryLogin: function () {
    var pin = this.getPin();
    var input = document.getElementById("parent-pin-input");
    var err = document.getElementById("parent-pin-error");
    if (!pin) {
      if (err) {
        err.textContent = "Configura parentPin en js/config.js (copia desde config.example.js).";
        err.classList.remove("hidden-el");
      }
      return;
    }
    if (!input || input.value !== pin) {
      if (err) {
        err.textContent = "PIN incorrecto.";
        err.classList.remove("hidden-el");
      }
      return;
    }
    this.setAuthed(true);
    this.showDashboard();
  },

  logout: function () {
    this.setAuthed(false);
    this.showLogin();
  },

  refresh: function () {
    var self = this;
    if (typeof App === "undefined" || !App.Stats) return;
    App.Stats.load().then(function () {
      self._renderDashboard();
    });
  },

  _renderDashboard: function () {
    if (typeof App === "undefined" || !App.Stats) return;
    App.Stats.ensureMonth();
    var snap = App.Stats.getSnapshot();
    var eco = App.PointsEconomy;
    var pending = typeof RewardsStore !== "undefined" ? RewardsStore.getPendingRedemptions() : [];

    var set = function (id, text) {
      var el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    set("parent-month-label", snap.monthKey);
    set("parent-balance", snap.balance);
    set("parent-month-earned", snap.monthEarned);
    var uncapped = App.Stats.isUncappedToday();
    set("parent-daily-points", snap.dailyPoints);
    set("parent-daily-cap", uncapped ? "∞" : eco.DAILY_CAP);
    set("parent-exercises-today", snap.dailyExerciseCount);

    var uncappedBtn = document.getElementById("parent-uncapped-btn");
    if (uncappedBtn) {
      uncappedBtn.textContent = App.Stats.isUncappedByWindow()
        ? "🚀 Sin límite esta semana (hasta el " + eco.UNCAPPED_UNTIL + ") — configurado"
        : (uncapped ? "🚀 Sin límite hoy (activo) — tocar para reactivar el tope" : "🚀 Quitar el tope de puntos solo por hoy");
      uncappedBtn.className = uncapped
        ? "w-full bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 rounded-xl"
        : "w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl";
    }
    set("parent-meta-streak", snap.metaDayStreak);
    set("parent-streak", snap.streak);
    set("parent-grace", snap.grace);
    set("parent-last-date", snap.lastDate || "—");
    set("parent-pending-count", pending.length);
    set("parent-session-correct", snap.sessionCorrect);

    var status = document.getElementById("parent-goal-status");
    if (status) {
      if (pending.length) {
        status.className = "text-sm font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-xl px-3 py-2";
        status.textContent = "📬 Hay " + pending.length + " pedido(s) esperando entrega. Al marcar «Entregado» se descuentan los puntos.";
      } else {
        status.className = "text-sm font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2";
        status.textContent = "Saldo acumulado: " + snap.balance + " pts · Sofía puede pedir premios desde su tienda.";
      }
    }

    if (typeof RewardsStore !== "undefined") RewardsStore.renderParentSection();
    if (typeof App.updatePointsUI === "function") App.updatePointsUI();

    var cloudEl = document.getElementById("parent-cloud-status");
    if (cloudEl) {
      if (snap.cloud) {
        cloudEl.textContent = "☁️ Datos en Firebase (sincronizados entre dispositivos)";
        cloudEl.className = "text-xs font-bold text-green-600";
      } else {
        cloudEl.textContent = "⚠️ Firebase no configurado — usando respaldo local";
        cloudEl.className = "text-xs font-bold text-amber-600";
      }
    }
  },

  confirmAction: function (msg, fn) {
    if (window.confirm(msg)) fn();
  },

  adjustPoints: function (delta) {
    var self = this;
    this.confirmAction(
      (delta > 0 ? "¿Sumar " : "¿Restar ") + Math.abs(delta) + " puntos al saldo?",
      function () {
        App.Stats.adjustBalance(delta);
        App.Stats.persist().then(function () { self.refresh(); });
      }
    );
  },

  setPointsFromInput: function () {
    var input = document.getElementById("parent-set-points-input");
    if (!input) return;
    var n = parseInt(input.value, 10);
    if (isNaN(n) || n < 0) {
      alert("Escribe un número válido (0 o más).");
      return;
    }
    var self = this;
    this.confirmAction("¿Fijar el saldo acumulado en " + n + " pts?", function () {
      App.Stats.setBalance(n);
      input.value = "";
      self.refresh();
    });
  },

  resetBalance: function () {
    var self = this;
    this.confirmAction("¿Reiniciar el saldo acumulado a 0? (no borra la racha ni el catálogo)", function () {
      App.Stats.resetBalance();
      self.refresh();
    });
  },

  resetToday: function () {
    var self = this;
    this.confirmAction("¿Reiniciar solo los puntos de hoy? (puede volver a ganar hasta el tope diario)", function () {
      App.Stats.resetDailyPoints();
      self.refresh();
    });
  },

  toggleUncapped: function () {
    var self = this;
    if (App.Stats.isUncappedByWindow()) {
      alert("El tope está desactivado por configuración hasta el " + App.PointsEconomy.UNCAPPED_UNTIL + " (semana de repaso). Se reactiva solo al día siguiente.");
      return;
    }
    var isOn = App.Stats.isUncappedToday();
    if (isOn) {
      this.confirmAction("¿Reactivar el tope diario de 200 pts?", function () {
        App.Stats.setUncappedToday(false);
        self.refresh();
      });
    } else {
      this.confirmAction("¿Quitar el tope de puntos SOLO por hoy? Mañana vuelve solo al límite normal.", function () {
        App.Stats.setUncappedToday(true);
        self.refresh();
      });
    }
  },

  resetStreak: function () {
    var self = this;
    this.confirmAction("¿Reiniciar la racha de días a 0?", function () {
      App.Stats.resetStreak();
      self.refresh();
    });
  },

  saveCatalog: function () {
    var self = this;
    if (typeof RewardsStore === "undefined") return;
    var catalog = RewardsStore.readCatalogFromParentForm();
    RewardsStore.saveCatalog(catalog);
    App.Stats.persist().then(function () {
      alert("Catálogo guardado.");
      self.refresh();
    });
  },

  resetCatalog: function () {
    var self = this;
    this.confirmAction("¿Restaurar el catálogo de premios por defecto?", function () {
      RewardsStore.resetCatalogToDefaults();
      App.Stats.persist().then(function () { self.refresh(); });
    });
  },

  addReward: function () {
    if (typeof RewardsStore === "undefined") return;
    var catalog = RewardsStore.readCatalogFromParentForm();
    catalog.push({
      id: RewardsStore._slugId("nuevo"),
      title: "Nuevo premio",
      description: "",
      emoji: "🎁",
      cost: 500,
      type: "other",
      enabled: true,
      sortOrder: catalog.length + 1
    });
    RewardsStore.saveCatalog(catalog);
    this._renderDashboard();
  },

  removeReward: function (idx) {
    if (typeof RewardsStore === "undefined") return;
    var catalog = RewardsStore.readCatalogFromParentForm();
    catalog.splice(idx, 1);
    RewardsStore.saveCatalog(catalog);
    this._renderDashboard();
  },

  confirmRedemption: function (redemptionId) {
    var self = this;
    if (typeof RewardsStore === "undefined") return;
    this.confirmAction("¿Confirmas que ya entregaste este premio? Se descontarán los puntos.", function () {
      var result = RewardsStore.confirmRedemption(redemptionId);
      if (!result.ok) {
        alert(result.error || "No se pudo confirmar.");
        return;
      }
      self.refresh();
    });
  },

  cancelRedemption: function (redemptionId) {
    var self = this;
    this.confirmAction("¿Cancelar este pedido? (no se descuentan puntos)", function () {
      RewardsStore.cancelRedemption(redemptionId);
      self.refresh();
    });
  }
};
