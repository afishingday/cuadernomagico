# -*- coding: utf-8 -*-
"""
Prueba funcional de El Cuaderno Mágico (no toca datos reales).

Sirve la carpeta del proyecto en http://127.0.0.1:8766 pero reemplaza js/config.js
por una configuración NEUTRA (sin Gemini, sin Firebase, sin tracking), así se
puede jugar como "Zorro" sin escribir el progreso real de Sofía.

Recorre los 17 temas x 3 niveles: abre y cierra el Paso a Paso, contesta una
opción incorrecta y luego la correcta, y verifica que el ejercicio se complete,
que Sofía reciba puntos y que no haya errores de JavaScript.

Uso:  python scripts/prueba-funcional.py [rondas]      (requiere: pip install playwright && playwright install chromium)
"""
import json, re, sys, threading, functools, traceback
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

SCR = Path(__file__).resolve().parent
SITE = SCR.parent  # raíz del proyecto
PORT = 8766
BASE = f"http://127.0.0.1:{PORT}/"
ROUNDS = int(sys.argv[1]) if len(sys.argv) > 1 else 2

NEUTRAL_CONFIG = b'window.CuadernoMagicoConfig = { apiKey: "", parentPin: "1234", trackingUrl: "", firebase: null };'


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(SITE), **k)

    def do_GET(self):
        if self.path.split("?")[0] == "/js/config.js":
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(NEUTRAL_CONFIG)))
            self.end_headers()
            self.wfile.write(NEUTRAL_CONFIG)
            return
        return super().do_GET()

    def log_message(self, *a, **k):
        pass


srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

TOPICS = {
    "5": {"matematicas": ["ecuaciones", "polinomios", "potencias", "radicacion", "fracciones", "geometria", "estadistica"],
          "espanol": ["textos", "refranes", "guion"],
          "ingles": ["vocabulario", "favoritos"],
          "historia": ["precolombinas"]},
    "11": {"matematicas": ["inecuaciones"], "estadistica": ["probabilidad"], "tecnologia": ["circuitos"], "quimica": ["balanceo"]},
}
LEVELS = ["facil", "medio", "dificil"]

# JS que devuelve el texto/selector de la opción correcta para el ejercicio actual.
CORRECT_JS = r"""
(topic) => {
  const norm = s => (s || "").replace(/\s+/g, " ").trim();
  const btns = Array.from(document.querySelectorAll("#options-container button"));
  const byText = (pred) => { const b = btns.find(b => pred(norm(b.textContent))); return b ? btns.indexOf(b) : -1; };
  switch (topic) {
    case "ecuaciones": return byText(t => t === String(EqGame.eq.resultFinal));
    case "potencias": return byText(t => t === String(PowerGame.eq.res));
    case "radicacion": return byText(t => t === String(RadicationGame.eq.root));
    case "geometria": return byText(t => t === String(GeoGame.eq.res));
    case "estadistica": {
      const eq = StatGame.eq;
      const want = eq.kind === "frecuencia" ? StatGame._fmtVal(eq.askType, eq.res) : String(eq.res);
      return byText(t => t === want);
    }
    case "fracciones": {
      const eq = FracGame.eq;
      const i = btns.findIndex(b => { const sp = b.querySelectorAll("span"); if (sp.length < 2) return false;
        const n = parseInt(sp[0].textContent, 10), d = parseInt(sp[1].textContent, 10); return n * eq.resD === d * eq.resN; });
      return i;
    }
    case "probabilidad": return byText(t => ProbGame._sameValue(t, ProbGame.eq.res));
    case "inecuaciones": {
      const sign = IneqGame.eq.type === "mult_neg" ? IneqGame.getFlippedSign(IneqGame.eq.sign) : IneqGame.eq.sign;
      const want = IneqGame.getIntervalString(sign, IneqGame.eq.resultFinal);
      return byText(t => t === want);
    }
    case "circuitos": return byText(t => t.indexOf("Es " + CircuitGame.answer) !== -1);
    case "vocabulario": return byText(t => t === EnglishGame.currentWord.es);
    case "favoritos": return byText(t => t === FavoritesGame.eq.en);
    case "precolombinas": return byText(t => t.indexOf(HistoryGame.eq.ans) !== -1);
    case "textos": {
      const eq = TextGame.eq;
      if (eq.kind === "clasificar") return byText(t => t.toLowerCase().startsWith(eq.correct));
      if (eq.kind === "verbos") return byText(t => t.startsWith(eq.correct + " verbo"));
      return byText(t => t === "... " + eq.correct);
    }
    case "refranes": {
      const eq = RefranGame.eq;
      if (eq.kind === "situacion") return byText(t => t === '"' + eq.correct + '"');
      if (eq.kind === "completar") return byText(t => t === "... " + eq.correct);
      return byText(t => t === eq.correct);
    }
    case "guion": return byText(t => t === norm(GuionGame.eq.correct));
    case "polinomios": {
      const i = PolyGame.getCorrectOpIndex();
      const l = PolyGame.tokens[i - 1].v, r = PolyGame.tokens[i + 1].v, op = PolyGame.tokens[i].v;
      const res = op === "+" ? l + r : op === "-" ? l - r : op === "×" ? l * r : l / r;
      return byText(t => t === String(res));
    }
  }
  return -1;
}
"""

log = {"errors": [], "console_errors": [], "results": []}


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        page.on("pageerror", lambda e: log["errors"].append(f"PAGEERROR {current['tag']}: {str(e)[:300]}"))
        page.on("console", lambda m: log["console_errors"].append(f"{current['tag']}: {m.text[:200]}") if m.type == "error" and "generativelanguage" not in m.text else None)
        current = {"tag": "init"}
        page.goto(BASE, wait_until="networkidle")

        for grade, subjects in TOPICS.items():
            user = "zorro" if grade == "5" else "mapache"
            page.evaluate(f"App.setUser('{user}')")
            page.wait_for_timeout(800)
            for subject, topics in subjects.items():
                for topic in topics:
                    for level in LEVELS:
                        for rnd in range(ROUNDS):
                            tag = f"{grade}/{subject}/{topic}/{level}#{rnd+1}"
                            current["tag"] = tag
                            res = {"tag": tag, "ok": False, "note": ""}
                            try:
                                page.evaluate(f"""() => {{ App.grade='{grade}'; App.subject='{subject}'; App.selectSubject('{subject}'); App.selectTopic('{topic}'); }}""")
                                page.wait_for_timeout(250)
                                page.evaluate(f"App.setLevel('{level}')")
                                page.wait_for_timeout(400)
                                before = page.evaluate("App.user && App.user.id==='zorro' ? App.Stats.getBalance() : -1")
                                # Paso a paso abre y cierra sin error
                                page.evaluate("App.showExample()")
                                page.wait_for_timeout(120)
                                ex_len = page.evaluate("document.getElementById('example-content').textContent.trim().length")
                                page.evaluate("App.hideExample()")
                                page.wait_for_timeout(700)  # deja terminar el scroll suave antes de arrastrar
                                if ex_len < 40:
                                    res["note"] += " pasoapaso-vacio"
                                solved = solve(page, topic)
                                res["ok"] = solved
                                if solved:
                                    after = page.evaluate("App.user && App.user.id==='zorro' ? App.Stats.getBalance() : -1")
                                    if before >= 0 and after <= before:
                                        res["note"] += f" sin-puntos({before}->{after})"
                                    # nuevo ejercicio tras acertar
                                    page.evaluate("App.generateContent()")
                                    page.wait_for_timeout(250)
                                else:
                                    res["note"] += " no-resuelto"
                            except Exception as e:
                                res["note"] += " EXC " + str(e)[:200].replace("\n", " ")
                            log["results"].append(res)
        ctx.close()
        browser.close()


def drag_to_bridge(page, drag_sel, bridge_sel):
    d = page.locator(drag_sel).first
    b = page.locator(bridge_sel).first
    db = d.bounding_box(); bb = b.bounding_box()
    if not db or not bb:
        return False
    page.mouse.move(db["x"] + db["width"] / 2, db["y"] + db["height"] / 2)
    page.mouse.down()
    page.mouse.move(bb["x"] + bb["width"] + 60, bb["y"] + bb["height"] / 2, steps=8)
    page.mouse.up()
    page.wait_for_timeout(300)
    return True


def click_correct(page, topic):
    idx = page.evaluate(CORRECT_JS, topic)
    if idx is None or idx < 0:
        return False
    page.locator("#options-container button").nth(idx).click()
    page.wait_for_timeout(700)
    return True


def solve(page, topic):
    if topic in ("ecuaciones", "inecuaciones"):
        pre = "eq" if topic == "ecuaciones" else "ineq"
        if not drag_to_bridge(page, f"#{pre}-drag", f"#{pre}-bridge"):
            return False
        # primero una respuesta incorrecta (prueba el camino de error), luego la correcta
        wrong_first(page, topic)
        if not click_correct(page, topic):
            return False
    elif topic == "polinomios":
        for _ in range(6):
            if page.evaluate("!document.getElementById('success-area').classList.contains('hidden-el')"):
                break
            i = page.evaluate("PolyGame.getCorrectOpIndex()")
            if i < 0:
                break
            # toca primero un operador incorrecto si hay otro (camino de error)
            page.evaluate("""(i) => { const ops = Array.from(document.querySelectorAll('.poly-op:not(.pointer-events-none)'));
              const wrong = ops.find(b => !b.getAttribute('onclick').includes('clickOp(' + i + ',')); if (wrong) wrong.click(); }""", i)
            page.wait_for_timeout(120)
            page.evaluate("""(i) => { const ops = Array.from(document.querySelectorAll('.poly-op:not(.pointer-events-none)'));
              const ok = ops.find(b => b.getAttribute('onclick').includes('clickOp(' + i + ',')); ok.click(); }""", i)
            page.wait_for_timeout(150)
            if not click_correct(page, topic):
                return False
    elif topic == "balanceo":
        # 1) el doble de la solución debe ser rechazado; 2) la mínima aceptada
        ok = page.evaluate("""() => {
          const eq = ChemGame.eqData; const mols = eq.left.concat(eq.right); const n = mols.length;
          const counts = (coefs) => { const L={}, R={}; eq.left.forEach((m,i)=>{for(const a in m.atoms) L[a]=(L[a]||0)+m.atoms[a]*coefs[i];});
            eq.right.forEach((m,i)=>{for(const a in m.atoms) R[a]=(R[a]||0)+m.atoms[a]*coefs[eq.left.length+i];}); return Object.keys(L).every(a=>L[a]===(R[a]||0)) && Object.keys(R).every(a=>R[a]===(L[a]||0)); };
          const gcd=(a,b)=>b?gcd(b,a%b):a;
          let best=null; const total=Math.pow(4,n);
          for(let k=0;k<total&&!best;k++){ const c=[]; let x=k; for(let i=0;i<n;i++){c.push(x%4+1); x=Math.floor(x/4);} if(counts(c)&&c.reduce((g,v)=>gcd(g,v),c[0])===1) best=c; }
          if(!best) return false;
          const apply=(c)=>{ mols.forEach((m,i)=>{ m.coef=c[i]; }); ChemGame.renderRow(); };
          apply(best.map(v=>v*2)); ChemGame.checkBalance(); const rejected = ChemGame.done===false;
          apply(best); ChemGame.checkBalance();
          return rejected && ChemGame.done===true;
        }""")
        page.wait_for_timeout(200)
        return bool(ok)
    else:
        wrong_first(page, topic)
        if not click_correct(page, topic):
            return False
    for _ in range(10):
        if page.evaluate("!document.getElementById('success-area').classList.contains('hidden-el')"):
            return True
        page.wait_for_timeout(150)
    return False


def wrong_first(page, topic):
    idx = page.evaluate(CORRECT_JS, topic)
    n = page.locator("#options-container button").count()
    if idx is None or idx < 0 or n < 2:
        return
    w = 0 if idx != 0 else 1
    page.locator("#options-container button").nth(w).click()
    page.wait_for_timeout(120)


try:
    run()
except Exception:
    log["errors"].append("FATAL " + traceback.format_exc()[-800:])
srv.shutdown()
res = log["results"]
ok = sum(1 for r in res if r["ok"] and not r["note"].strip())
print(f"ejercicios probados: {len(res)} · ok: {ok} · con nota: {len(res)-ok}")
for r in res:
    if not r["ok"] or r["note"].strip():
        print(" ", r["tag"], "->", "OK" if r["ok"] else "FALLO", r["note"])
print("pageerrors:", len(log["errors"]))
for e in log["errors"][:30]: print(" ", e)
print("console errors:", len(log["console_errors"]))
for e in log["console_errors"][:20]: print(" ", e)
(SCR / "prueba-funcional.log.json").write_text(json.dumps(log, ensure_ascii=False, indent=1), encoding="utf-8")
