/**
 * Persistencia de puntos/racha de Sofía en Firestore (colección players).
 * Config: window.CuadernoMagicoConfig.firebase (desde js/config.js).
 */
var FirebaseStats = {
  db: null,
  COLLECTION: "players",

  isConfigured: function () {
    var cfg = window.CuadernoMagicoConfig && window.CuadernoMagicoConfig.firebase;
    return !!(cfg && cfg.projectId && typeof firebase !== "undefined");
  },

  init: function () {
    if (this.db) return true;
    if (!this.isConfigured()) return false;
    var cfg = window.CuadernoMagicoConfig.firebase;
    if (!firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
    this.db = firebase.firestore();
    return true;
  },

  load: function (playerId) {
    var self = this;
    if (!this.init()) {
      return Promise.reject(new Error("Firebase no configurado"));
    }
    return this.db.collection(this.COLLECTION).doc(playerId).get().then(function (snap) {
      if (!snap.exists) return null;
      return snap.data();
    });
  },

  save: function (playerId, data) {
    if (!this.init()) {
      return Promise.reject(new Error("Firebase no configurado"));
    }
    var payload = Object.assign({}, data, {
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return this.db.collection(this.COLLECTION).doc(playerId).set(payload, { merge: true });
  }
};
