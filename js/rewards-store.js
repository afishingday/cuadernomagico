/**
 * Tienda de premios: catálogo canjeable, puntos acumulables, solicitudes y entrega (papás).
 */
var RewardsStore = {
  DEFAULT_CATALOG: [
    {
      id: "robux-5",
      title: "Robux ~5 USD",
      description: "Paquete pequeño de Robux",
      emoji: "💎",
      cost: 1000,
      type: "robux",
      enabled: true,
      sortOrder: 1
    },
    {
      id: "robux-10",
      title: "Robux ~10 USD",
      description: "Paquete mediano de Robux",
      emoji: "💎",
      cost: 2000,
      type: "robux",
      enabled: true,
      sortOrder: 2
    },
    {
      id: "robux-20",
      title: "Robux ~20 USD",
      description: "Paquete grande de Robux",
      emoji: "💎",
      cost: 4000,
      type: "robux",
      enabled: true,
      sortOrder: 3
    },
    {
      id: "cash-5",
      title: "Alcancía efectivo $5",
      description: "Se guarda para entregarte en efectivo",
      emoji: "💵",
      cost: 1000,
      type: "cash",
      enabled: true,
      sortOrder: 4
    },
    {
      id: "cash-10",
      title: "Alcancía efectivo $10",
      description: "Ahorro en efectivo",
      emoji: "💵",
      cost: 2000,
      type: "cash",
      enabled: true,
      sortOrder: 5
    },
    {
      id: "cash-20",
      title: "Alcancía efectivo $20",
      description: "Meta grande de ahorro",
      emoji: "🏦",
      cost: 4000,
      type: "cash",
      enabled: true,
      sortOrder: 6
    }
  ],

  _slugId: function (title) {
    return "reward-" + String(title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) + "-" + Date.now().toString(36);
  },

  _ensureStats: function () {
    if (typeof App === "undefined" || !App.Stats) return null;
    App.Stats._ensureData();
    return App.Stats._data;
  },

  _normalizeItem: function (item, index) {
    if (!item || typeof item !== "object") return null;
    var cost = parseInt(item.cost, 10);
    if (isNaN(cost) || cost < 1) return null;
    return {
      id: String(item.id || this._slugId(item.title)),
      title: String(item.title || "Premio").trim(),
      description: String(item.description || "").trim(),
      emoji: String(item.emoji || "🎁").trim() || "🎁",
      cost: cost,
      type: item.type === "cash" || item.type === "robux" ? item.type : "other",
      enabled: item.enabled !== false,
      sortOrder: parseInt(item.sortOrder, 10) || index + 1
    };
  },

  getCatalog: function () {
    var data = this._ensureStats();
    var raw = (data && data.rewardCatalog) || [];
    var list = [];
    var i;
    for (i = 0; i < raw.length; i++) {
      var n = this._normalizeItem(raw[i], i);
      if (n) list.push(n);
    }
    if (!list.length) list = this.DEFAULT_CATALOG.slice();
    list.sort(function (a, b) { return a.sortOrder - b.sortOrder; });
    return list;
  },

  getEnabledCatalog: function () {
    return this.getCatalog().filter(function (r) { return r.enabled; });
  },

  findReward: function (rewardId) {
    var catalog = this.getCatalog();
    var i;
    for (i = 0; i < catalog.length; i++) {
      if (catalog[i].id === rewardId) return catalog[i];
    }
    return null;
  },

  saveCatalog: function (catalog) {
    var data = this._ensureStats();
    if (!data) return false;
    var normalized = [];
    var i;
    for (i = 0; i < catalog.length; i++) {
      var n = this._normalizeItem(catalog[i], i);
      if (n) normalized.push(n);
    }
    if (!normalized.length) normalized = this.DEFAULT_CATALOG.slice();
    data.rewardCatalog = normalized;
    App.Stats._dirty = true;
    return true;
  },

  resetCatalogToDefaults: function () {
    return this.saveCatalog(this.DEFAULT_CATALOG.slice());
  },

  getRedemptions: function () {
    var data = this._ensureStats();
    if (!data || !Array.isArray(data.redemptions)) return [];
    return data.redemptions.slice().sort(function (a, b) {
      return (b.requestedAt || "").localeCompare(a.requestedAt || "");
    });
  },

  getPendingRedemptions: function () {
    return this.getRedemptions().filter(function (r) { return r.status === "pending"; });
  },

  _pendingCostTotal: function () {
    var total = 0;
    this.getPendingRedemptions().forEach(function (r) {
      total += r.cost || 0;
    });
    return total;
  },

  getAvailableBalance: function () {
    var bal = typeof App !== "undefined" && App.Stats ? App.Stats.getBalance() : 0;
    return Math.max(0, bal - this._pendingCostTotal());
  },

  requestRedemption: function (rewardId) {
    var data = this._ensureStats();
    if (!data) return { ok: false, error: "Sin datos" };
    var reward = this.findReward(rewardId);
    if (!reward || !reward.enabled) return { ok: false, error: "Premio no disponible" };

    var available = this.getAvailableBalance();
    if (available < reward.cost) {
      return {
        ok: false,
        error: "Te faltan " + (reward.cost - available) + " pts (tienes " + available + " disponibles)"
      };
    }

    if (!Array.isArray(data.redemptions)) data.redemptions = [];
    var dup = data.redemptions.some(function (r) {
      return r.status === "pending" && r.rewardId === rewardId;
    });
    if (dup) return { ok: false, error: "Ya pediste este premio; espera a que papá lo confirme." };

    var entry = {
      id: "red-" + Date.now().toString(36),
      rewardId: reward.id,
      rewardTitle: reward.title,
      rewardEmoji: reward.emoji,
      cost: reward.cost,
      type: reward.type,
      status: "pending",
      requestedAt: new Date().toISOString()
    };
    data.redemptions.push(entry);
    App.Stats._dirty = true;
    App.Stats.persist();
    return { ok: true, redemption: entry };
  },

  confirmRedemption: function (redemptionId) {
    var data = this._ensureStats();
    if (!data || !Array.isArray(data.redemptions)) return { ok: false, error: "Sin solicitud" };
    var entry = null;
    var i;
    for (i = 0; i < data.redemptions.length; i++) {
      if (data.redemptions[i].id === redemptionId) {
        entry = data.redemptions[i];
        break;
      }
    }
    if (!entry || entry.status !== "pending") return { ok: false, error: "Solicitud no válida" };
    if (App.Stats.getBalance() < entry.cost) {
      return { ok: false, error: "Saldo insuficiente (" + App.Stats.getBalance() + " pts)" };
    }

    App.Stats.deductBalance(entry.cost);
    entry.status = "delivered";
    entry.deliveredAt = new Date().toISOString();
    App.Stats._dirty = true;
    App.Stats.persist();
    return { ok: true, redemption: entry };
  },

  cancelRedemption: function (redemptionId) {
    var data = this._ensureStats();
    if (!data || !Array.isArray(data.redemptions)) return { ok: false };
    var i;
    for (i = 0; i < data.redemptions.length; i++) {
      if (data.redemptions[i].id === redemptionId && data.redemptions[i].status === "pending") {
        data.redemptions[i].status = "cancelled";
        data.redemptions[i].cancelledAt = new Date().toISOString();
        App.Stats._dirty = true;
        App.Stats.persist();
        return { ok: true };
      }
    }
    return { ok: false };
  },

  getNextRewardProgress: function () {
    var available = this.getAvailableBalance();
    var catalog = this.getEnabledCatalog();
    if (!catalog.length) return null;
    var i;
    for (i = 0; i < catalog.length; i++) {
      if (available < catalog[i].cost) {
        return {
          reward: catalog[i],
          remaining: catalog[i].cost - available,
          canAfford: false
        };
      }
    }
    var last = catalog[catalog.length - 1];
    return { reward: last, remaining: 0, canAfford: true };
  },

  renderSofiaCatalog: function () {
    var listEl = document.getElementById("sofia-rewards-list");
    if (!listEl) return;
    var balance = typeof App !== "undefined" && App.Stats ? App.Stats.getBalance() : 0;
    var available = this.getAvailableBalance();
    var pending = this.getPendingRedemptions();
    var catalog = this.getEnabledCatalog();
    var html = "";

    html += "<div class=\"text-xs font-bold text-indigo-600 mb-2\">Saldo: " + balance + " pts";
    if (pending.length) {
      html += " · " + pending.length + " pedido(s) pendiente(s) (" + this._pendingCostTotal() + " pts reservados)";
    }
    html += " · Disponibles para canjear: " + available + " pts</div>";

    if (!catalog.length) {
      html += "<p class=\"text-xs text-slate-500\">No hay premios activos. Papá puede configurarlos en el panel.</p>";
      listEl.innerHTML = html;
      return;
    }

    catalog.forEach(function (reward) {
      var can = available >= reward.cost;
      var typeLabel = reward.type === "cash" ? "Efectivo" : reward.type === "robux" ? "Robux" : "Premio";
      html += "<div class=\"flex flex-wrap items-center gap-2 py-2 border-b border-indigo-100 last:border-0\">";
      html += "<span class=\"text-2xl\">" + reward.emoji + "</span>";
      html += "<div class=\"flex-1 min-w-[8rem]\">";
      html += "<div class=\"font-black text-indigo-800 text-sm\">" + reward.title + "</div>";
      html += "<div class=\"text-[11px] text-slate-500\">" + typeLabel;
      if (reward.description) html += " · " + reward.description;
      html += "</div></div>";
      html += "<div class=\"font-black text-indigo-600 text-sm\">" + reward.cost + " pts</div>";
      if (can) {
        html += "<button type=\"button\" onclick=\"RewardsStore.sofiaRequest('" + reward.id + "')\" class=\"text-xs font-bold bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-full shadow-sm\">Pedir 🎁</button>";
      } else {
        html += "<span class=\"text-[11px] font-bold text-slate-400\">Faltan " + (reward.cost - available) + "</span>";
      }
      html += "</div>";
    });

    if (pending.length) {
      html += "<div class=\"mt-2 pt-2 border-t border-amber-200\"><div class=\"text-xs font-bold text-amber-700 mb-1\">Tus pedidos pendientes</div>";
      pending.forEach(function (r) {
        html += "<div class=\"text-[11px] text-amber-800 font-bold\">⏳ " + (r.rewardEmoji || "🎁") + " " + r.rewardTitle + " (" + r.cost + " pts)</div>";
      });
      html += "</div>";
    }

    listEl.innerHTML = html;
  },

  sofiaRequest: function (rewardId) {
    var self = this;
    var result = this.requestRedemption(rewardId);
    if (typeof App === "undefined") return;
    if (result.ok) {
      App.showToast("¡Pedido enviado a papá/mamá! 🎁", "📬", 3500);
      App.triggerConfetti();
    } else {
      App.showToast(result.error || "No se pudo pedir", "⚠️", 3500);
    }
    this.renderSofiaCatalog();
    if (typeof App.updatePointsUI === "function") App.updatePointsUI();
    App.Stats.persist().then(function () {
      self.renderSofiaCatalog();
    });
  },

  renderParentSection: function () {
    var catalogEl = document.getElementById("parent-rewards-catalog");
    var pendingEl = document.getElementById("parent-rewards-pending");
    var historyEl = document.getElementById("parent-rewards-history");
    if (!catalogEl) return;

    var balance = App.Stats.getBalance();
    var available = this.getAvailableBalance();
    catalogEl.innerHTML = "<p class=\"text-xs font-bold text-slate-600 mb-2\">Saldo acumulado: " + balance + " pts · Disponible (sin pedidos pendientes): " + available + " pts</p>";

    var catalog = this.getCatalog();
    var html = "";
    catalog.forEach(function (r, idx) {
      html += "<div class=\"border border-slate-200 rounded-xl p-2 mb-2 bg-white text-sm\" data-reward-idx=\"" + idx + "\">";
      html += "<div class=\"flex flex-wrap gap-2 items-center mb-2\">";
      html += "<input type=\"text\" class=\"parent-reward-emoji w-10 border rounded-lg text-center font-bold\" value=\"" + (r.emoji || "🎁") + "\" maxlength=\"4\">";
      html += "<input type=\"text\" class=\"parent-reward-title flex-1 min-w-[8rem] border rounded-lg px-2 py-1 font-bold\" value=\"" + r.title.replace(/"/g, "&quot;") + "\">";
      html += "<input type=\"number\" class=\"parent-reward-cost w-20 border rounded-lg px-2 py-1 font-bold\" min=\"1\" value=\"" + r.cost + "\">";
      html += "<label class=\"text-xs font-bold flex items-center gap-1\"><input type=\"checkbox\" class=\"parent-reward-enabled\" " + (r.enabled ? "checked" : "") + "> Activo</label>";
      html += "<button type=\"button\" onclick=\"ParentPanel.removeReward(" + idx + ")\" class=\"text-red-500 font-bold text-xs px-2\">✕</button>";
      html += "</div>";
      html += "<input type=\"text\" class=\"parent-reward-desc w-full border rounded-lg px-2 py-1 text-xs mb-1\" placeholder=\"Descripción\" value=\"" + (r.description || "").replace(/"/g, "&quot;") + "\">";
      html += "<select class=\"parent-reward-type border rounded-lg px-2 py-1 text-xs font-bold\">";
      html += "<option value=\"robux\"" + (r.type === "robux" ? " selected" : "") + ">Robux</option>";
      html += "<option value=\"cash\"" + (r.type === "cash" ? " selected" : "") + ">Efectivo</option>";
      html += "<option value=\"other\"" + (r.type === "other" ? " selected" : "") + ">Otro</option>";
      html += "</select>";
      html += "<input type=\"hidden\" class=\"parent-reward-id\" value=\"" + r.id + "\">";
      html += "</div>";
    });
    catalogEl.innerHTML += html;

    if (pendingEl) {
      var pending = this.getPendingRedemptions();
      if (!pending.length) {
        pendingEl.innerHTML = "<p class=\"text-xs text-slate-400\">Sin pedidos pendientes.</p>";
      } else {
        var ph = "";
        pending.forEach(function (r) {
          ph += "<div class=\"flex flex-wrap items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2 mb-2 text-sm\">";
          ph += "<span class=\"font-bold\">" + (r.rewardEmoji || "🎁") + " " + r.rewardTitle + " · " + r.cost + " pts</span>";
          ph += "<div class=\"flex gap-1\">";
          ph += "<button type=\"button\" onclick=\"ParentPanel.confirmRedemption('" + r.id + "')\" class=\"bg-green-500 text-white font-bold px-3 py-1 rounded-lg text-xs\">Entregado ✓</button>";
          ph += "<button type=\"button\" onclick=\"ParentPanel.cancelRedemption('" + r.id + "')\" class=\"bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg text-xs\">Cancelar</button>";
          ph += "</div></div>";
        });
        pendingEl.innerHTML = ph;
      }
    }

    if (historyEl) {
      var done = this.getRedemptions().filter(function (r) {
        return r.status === "delivered" || r.status === "cancelled";
      }).slice(0, 8);
      if (!done.length) {
        historyEl.innerHTML = "<p class=\"text-xs text-slate-400\">Sin historial aún.</p>";
      } else {
        var hh = "";
        done.forEach(function (r) {
          var label = r.status === "delivered" ? "✅" : "❌";
          hh += "<div class=\"text-xs text-slate-600 py-1 border-b border-slate-100\">" + label + " " + r.rewardTitle + " (" + r.cost + " pts)</div>";
        });
        historyEl.innerHTML = hh;
      }
    }
  },

  readCatalogFromParentForm: function () {
    var catalogEl = document.getElementById("parent-rewards-catalog");
    if (!catalogEl) return [];
    var blocks = catalogEl.querySelectorAll("[data-reward-idx]");
    var catalog = [];
    blocks.forEach(function (block, index) {
      var idEl = block.querySelector(".parent-reward-id");
      var titleEl = block.querySelector(".parent-reward-title");
      var costEl = block.querySelector(".parent-reward-cost");
      if (!titleEl || !costEl) return;
      catalog.push({
        id: idEl ? idEl.value : RewardsStore._slugId(titleEl.value),
        title: titleEl.value,
        description: (block.querySelector(".parent-reward-desc") || {}).value || "",
        emoji: (block.querySelector(".parent-reward-emoji") || {}).value || "🎁",
        cost: parseInt(costEl.value, 10),
        type: (block.querySelector(".parent-reward-type") || {}).value || "other",
        enabled: !!(block.querySelector(".parent-reward-enabled") || {}).checked,
        sortOrder: index + 1
      });
    });
    return catalog;
  }
};
