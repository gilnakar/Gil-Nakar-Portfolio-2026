/* ===========================================================
   Markiply MVP v1.1: shared engine.
   State, top bar and stepper, the Decision summary panel, lock, projects,
   expert, connect and tool selection. Static and front-end only.
   State lives in localStorage (one store, many decisions).
   All scripted content is in data.js.
   =========================================================== */

const MK = (function () {
  const KEY = "markiply_mvp11";
  const D = MKDATA;
  const SEP = D.SEP;
  let memFallback = null;

  /* ---------- storage ---------- */
  function read() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* blocked */ }
    return memFallback;
  }
  function write(db) { memFallback = db; try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* keep in memory */ } }
  function db() {
    let s = read();
    if (!s) { s = { user: null, decisions: [], projects: [], events: [], currentId: null, ui: { tags: false, panel: { flow: true, browse: false } } }; write(s); }
    if (!s.projects) s.projects = [];
    if (!s.ui) s.ui = {};
    if (!s.ui.panel || typeof s.ui.panel !== "object") s.ui.panel = { flow: true, browse: false };
    return s;
  }
  function save(s) { write(s); }
  function reset() { memFallback = null; try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } window.location.href = "login.html"; }

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const go = url => { window.location.href = url; };
  const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const here = () => (location.pathname.split("/").pop() || "") + location.search;
  const svg = (p, s) => '<svg class="i" width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  const ICON = {
    check: svg('<path d="M20 6L9 17l-5-5"/>', 16),
    shield: svg('<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>', 16),
    help: svg('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 014.8.9c0 1.6-2.4 2-2.4 3.4M12 17h.01"/>', 16),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', 18),
    warn: svg('<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/>', 18),
    chev: svg('<path d="M6 9l6 6 6-6"/>', 18).replace('class="i"', 'class="i chev"'),
    wand: svg('<path d="M15 4V2M15 16v-2M8 9H6M20 9h-2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>', 18),
    download: svg('<path d="M12 3v12M7 11l5 5 5-5M5 21h14"/>', 18),
    share: svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>', 18),
    back: svg('<path d="M19 12H5M12 19l-7-7 7-7"/>', 18),
    arrow: svg('<path d="M5 12h14M12 5l7 7-7 7"/>', 18),
    chevL: svg('<path d="M15 6l-6 6 6 6"/>', 18),
    chevR: svg('<path d="M9 6l6 6-6 6"/>', 18),
    building: svg('<path d="M4 21V5l8-2v18M12 9l8 2v10M8 9h.01M8 13h.01M8 17h.01M16 15h.01M16 18h.01"/>', 22),
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>', 18),
    unlock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 017.5-2"/>', 18),
    pencil: svg('<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>', 16),
    external: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>', 16),
    folder: svg('<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>', 22),
    pin: svg('<path d="M12 17v5M8 3h8l-1 6 3 4H6l3-4-1-6z"/>', 18),
    plus: svg('<path d="M12 5v14M5 12h14"/>', 18),
    dots: svg('<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>', 20),
    send: svg('<path d="M5 12h14M12 5l7 7-7 7"/>', 18),
    summary: svg('<path d="M6 3h9l4 4v14H6V3z"/><path d="M15 3v4h4M9 12l1.5 1.5L13.5 10.5M9 17h7"/>', 18),
    file: svg('<path d="M6 3h8l5 5v13H6V3z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', 22),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', 18),
    chat: svg('<path d="M4 5h16v11H9l-5 4V5z"/>', 18),
    eye: svg('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 16),
    trash: svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', 16)
  };

  /* ---------- auth (US 1.1, 1.2) ---------- */
  function login(email) {
    const key = String(email || "").trim().toLowerCase();
    const u = D.USERS[key];
    if (!u) return null;
    const s = db();
    s.user = { email: key, name: u.name, first: u.first, phone: (s.user && s.user.phone) || "" };
    if (!s.decisions.length) {
      s.decisions = D.SEED.map(x => {
        const c = D.CASES[x.caseKey], d = Object.assign({ request: c.request, edits: {}, ans: {}, followups: [], extras: [], tools: {}, expertReqs: [], contacts: [], toolSel: [], notes: [], pick: {}, nav: null }, JSON.parse(JSON.stringify(x)));
        for (let i = 0; i < d.step && i < c.chat.length; i++) d.ans[i] = c.chat[i].pick;
        return d;
      });
      s.projects = JSON.parse(JSON.stringify(D.SEED_PROJECTS));
    }
    save(s);
    return s.user;
  }
  function requireLogin() {
    const s = db();
    if (!s.user) { window.location.replace("login.html"); return null; }
    return s;
  }
  function logout() { const s = db(); s.user = null; save(s); go("login.html"); }

  /* ---------- decisions ---------- */
  function caseOf(d) {
    if (!d) return null;
    if (d.caseKey === "gen") return D.genCase(d.request || "");
    return D.CASES[d.caseKey];
  }
  function cur() { const s = db(); return s.decisions.find(x => x.id === s.currentId) || null; }
  function byId(id) { return db().decisions.find(x => x.id === id) || null; }
  function setCur(id) { const s = db(); s.currentId = id; save(s); }
  function mutate(id, fn) {
    const s = db();
    const d = s.decisions.find(x => x.id === id);
    if (d) { fn(d, s); save(s); }
    return d;
  }
  function log(type, payload) {
    const s = db();
    s.events.push(Object.assign({ t: type, when: today(), who: s.user ? s.user.name : "", ts: Date.now() }, payload || {}));
    save(s);
  }
  function classify(text) {
    const t = String(text || "").toLowerCase();
    if (/(30[- ]?second|script (is )?ready)/.test(t) && /(video|film)/.test(t)) return "fast";
    if (/blueprint/.test(t)) return "bp";
    if (/(\$1\.2m|(split|allocat|plan).{0,30}budget|budget.{0,30}(split|allocat|2027))/.test(t) && !/(launch|spin-?off)/.test(t)) return "budget";
    if (/(video|film|shoot|producer|production)/.test(t) && !/(seo|paid search)/.test(t)) return "1";
    if (/(launch|spin-?off|go-?to-?market|gtm)/.test(t)) return "2";
    if (/(not sure what'?s missing|from scratch|where to start|ad hoc|diagnos|what'?s missing)/.test(t)) return "3";
    if (/(seo|paid search)/.test(t)) return "4";
    return "gen";
  }
  function start(caseKey, text) {
    const s = db();
    const c = caseKey === "gen" ? D.genCase(text) : D.CASES[caseKey];
    const d = {
      id: "d" + Date.now(), caseKey: caseKey, request: (text && text.trim()) || c.request,
      step: 0, ans: {}, view: null, reco: false, planned: false, locked: false, stageIndex: 0, created: today(), subs: [],
      edits: {}, exec: {}, connected: {}, tools: {}, followups: [], extras: [], expertReqs: [], pinned: false, projectId: null,
      contacts: [], toolSel: [], notes: [], pick: {}, nav: null
    };
    if (c.projectId) {
      if (!s.projects.find(p => p.id === c.projectId)) s.projects.push({ id: c.projectId, name: c.project, pinned: true, created: today() });
      d.projectId = c.projectId;
    }
    s.decisions.unshift(d);
    s.currentId = d.id;
    save(s);
    log("start", { decisionId: d.id, title: c.title, request: d.request, card: c.scenario.mode === "card" ? c.scenario.card : null });
    if (c.scenario.mode === "ai") log("gap", { decisionId: d.id, title: c.title, request: d.request, note: "AI guidance given. Awaiting expert review." });
    return d;
  }

  /* ---------- questions: one at a time, answers kept in the summary ---------- */
  function activeList(d) {
    const c = caseOf(d), ans = d.ans || {}, out = [];
    const byK = k => { const i = c.chat.findIndex(q => q.know && q.know.k === k); return i > -1 ? ans[i] : undefined; };
    c.chat.forEach((q, i) => {
      if (!q.showIf) { out.push(i); return; }
      const v = byK(q.showIf.k);
      if (v != null && new RegExp(q.showIf.test, "i").test(v)) out.push(i);
    });
    return out;
  }
  function progress(d) {
    const active = activeList(d), ans = d.ans || {};
    const answered = active.filter(i => ans[i] != null).length;
    const next = active.find(i => ans[i] == null);
    return { active: active, answered: answered, total: active.length, next: next === undefined ? null : next, complete: next === undefined };
  }
  function ansOf(d, i) {
    const c = caseOf(d), k = c.chat[i].know && c.chat[i].know.k;
    if (d.postEdits && d.postEdits[k] != null) return d.postEdits[k];
    if (d.edits && d.edits[k] != null) return d.edits[k];
    return d.ans ? d.ans[i] : undefined;
  }
  function setAnswer(id, i, value) {
    let note = null;
    mutate(id, d => {
      const c = caseOf(d), k = c.chat[i].know.k;
      if (d.locked) return;
      if (d.reco) {
        d.postEdits = d.postEdits || {};
        if (value !== ansOf(d, i)) { d.postEdits[k] = value; log("edit", { decisionId: d.id, title: c.title, request: k + ": " + ansOf(d, i) + " to " + value, note: "Edited after the recommendation. Not regenerated." }); }
        d.view = null;
        return;
      }
      d.ans = d.ans || {};
      const before = activeList(d), had = d.ans[i] != null, prev = d.ans[i];
      d.ans[i] = value;
      d.view = null;
      if (had && prev !== value) {
        const after = activeList(d);
        const added = after.filter(x => before.indexOf(x) < 0 && d.ans[x] == null);
        const removed = before.filter(x => after.indexOf(x) < 0);
        if (added.length) note = "Because you changed " + k.toLowerCase() + ", I have " + (added.length === 1 ? "one new question" : added.length + " new questions") + ". Your other answers stay.";
        else if (removed.length) note = "Because you changed " + k.toLowerCase() + ", one question no longer applies and I dropped it. Your other answers stay.";
        else note = "Updated. Your other answers stay.";
        log("edit", { decisionId: d.id, title: c.title, request: k + ": " + prev + " to " + value, note: "Changed during clarification." });
      }
      d.note = note;
      d.step = Math.max(d.step || 0, progress(d).answered);
    });
  }
  function jumpTo(qi) { const d = cur(); if (!d) return; mutate(d.id, x => { x.view = qi; }); go("clarify.html"); }
  function addNote(text) {
    const d = cur(); if (!d || !text.trim()) return;
    mutate(d.id, x => { x.notes = x.notes || []; x.notes.push({ id: "n" + Date.now(), t: text.trim(), at: today(), after: !!x.reco }); });
    log("note", { decisionId: d.id, title: caseOf(d).title, request: text.trim(), note: "Added by the person after the questions. Does not change the recommendation." });
  }

  /* ---------- state: locked or not. Draft and Final are not shown as chips ---------- */
  function stateOf(d) {
    if (d.locked) return { key: "locked", label: "Locked" };
    if (d.reco && progress(d).complete) return { key: "final", label: "Final" };
    return { key: "draft", label: "Draft" };
  }
  function isActing(d) { return !!((d.contacts || []).length || (d.toolSel || []).length || Object.keys(d.exec || {}).length || Object.keys(d.connected || {}).length || Object.keys(d.tools || {}).length); }
  function statusText(d) {
    const P = progress(d), nc = (d.contacts || []).length, nt = (d.toolSel || []).length;
    if (d.locked) return "Locked";
    if (!P.complete && !d.reco) return P.answered === 0 ? "Not started" : "Answering questions";
    if (!d.reco) return "Ready for your recommendation";
    if (nc || nt) return "Acting: " + [nc ? nc + (nc === 1 ? " provider contacted" : " providers contacted") : "", nt ? nt + (nt === 1 ? " tool selected" : " tools selected") : ""].filter(Boolean).join(", ");
    return d.planned ? "Action plan ready" : "Recommendation ready";
  }
  function statusOf(d) { const st = stateOf(d); return { cls: st.key, label: statusText(d), state: st.key }; }
  function statusChip(d) { return '<span class="stx">' + esc(statusText(d)) + "</span>"; }
  function stateHtml(d) { return d.locked ? '<span class="note-s" style="display:inline-flex;gap:6px;align-items:center;">' + ICON.lock + "Locked</span>" : ""; }
  function enterDecide() {
    const d = cur();
    if (!d) return null;
    if (!d.reco && progress(d).complete) {
      mutate(d.id, x => { x.reco = true; x.stageIndex = Math.max(x.stageIndex || 0, 1); });
      log("final", { decisionId: d.id, title: caseOf(d).title, note: "All questions answered and the recommendation viewed." });
    }
    return cur();
  }
  function titleOf(d) {
    const c = caseOf(d);
    if (!c) return "";
    return (progress(d).answered === 0 && !d.reco && c.chat.length) ? "New decision…" : c.title;
  }

  /* ---------- actions and paths ---------- */
  function allActions(c, d) {
    d = d || cur();
    const b = (d && caseOf(d) === c) ? briefOf(d) : c.brief, out = [];
    if (b.actions) b.actions.forEach(a => out.push(Object.assign({ stage: null }, a)));
    if (b.priorities) ["now", "next", "later"].forEach(st => b.priorities[st].forEach(a => out.push(Object.assign({ stage: st }, a))));
    return out;
  }
  function findAction(c, id) { return allActions(c).find(a => a.id === id) || null; }
  function pathsOf(a) {
    const S = a.set && D.SETS[a.set], T = a.tset && D.TSETS[a.tset];
    return { providers: !!(S && ((S.vetted && S.vetted.length) || (S.ai && S.ai.length))), tools: !!T };
  }
  function matchesOf(c) {
    const acts = [], b = c.brief;
    (b.actions || []).forEach(a => acts.push(a));
    if (b.priorities) ["now", "next", "later"].forEach(st => b.priorities[st].forEach(a => acts.push(a)));
    const p = new Set(), t = new Set();
    acts.forEach(a => {
      const S = a.set && D.SETS[a.set], T = a.tset && D.TSETS[a.tset];
      if (S && S.vetted) S.vetted.forEach(x => p.add(x));
      if (T && !T.generic) T.vetted.concat(T.listed || []).forEach(x => t.add(x));
    });
    return { providers: p.size, tools: t.size };
  }
  /* The choice made on Decide for one step: any of provider, tool, markiply */
  function pickOf(d, a) {
    const p = (d.pick || {})[a.id];
    if (p && p.length) return p;
    const pa = pathsOf(a), out = [];
    if (a.suggested === "tool" && pa.tools) out.push("tool");
    else if (pa.providers) out.push("provider");
    else if (pa.tools) out.push("tool");
    return out.length ? out : ["markiply"];
  }
  function setPick(aid, picks) { const d = cur(); mutate(d.id, x => { x.pick = x.pick || {}; x.pick[aid] = picks; }); }
  function resultsUrl(aid, picks) {
    const pr = picks.indexOf("provider") > -1, tl = picks.indexOf("tool") > -1;
    return "results.html?a=" + aid + "&k=" + (pr && tl ? "both" : (tl ? "tools" : "providers"));
  }

  function decisionRows(d, forBrief) {
    const c = caseOf(d), rows = [];
    const push = (k, v, src, qi) => {
      const pe = !forBrief && d.postEdits && d.postEdits[k] != null;
      const ed = d.edits && d.edits[k] != null;
      rows.push({ k: k, v: pe ? d.postEdits[k] : (ed ? d.edits[k] : v), src: src, edited: ed || pe, after: pe, qi: qi == null ? null : qi });
    };
    (c.picked || []).forEach(r => push(r.k, r.v, "From your message", null));
    activeList(d).forEach(i => {
      const a = d.ans && d.ans[i];
      if (a != null) push(c.chat[i].know.k, a, "You answered", i);
    });
    (d.extras || []).forEach((x, i) => push("Added detail " + (i + 1), x, "You added", null));
    return rows;
  }
  function fill(str, rows) {
    return String(str).replace(/\{([^}]+)\}/g, (m, k) => { const r = rows.find(x => x.k === k); return r ? r.v : m; });
  }
  function variantOf(d) {
    const c = caseOf(d), rows = decisionRows(d, true);
    return (c.variants || []).find(v => { const r = rows.find(x => x.k === v.k); return r && new RegExp(v.test, "i").test(r.v); }) || null;
  }
  function briefOf(d) {
    const c = caseOf(d), rows = decisionRows(d, true), v = variantOf(d);
    const b = JSON.parse(JSON.stringify(c.brief));
    if (v && v.brief) Object.keys(v.brief).forEach(k => { b[k] = JSON.parse(JSON.stringify(v.brief[k])); });
    const walk = o => {
      if (typeof o === "string") return fill(o, rows);
      if (Array.isArray(o)) return o.map(walk);
      if (o && typeof o === "object") { Object.keys(o).forEach(k => { o[k] = walk(o[k]); }); return o; }
      return o;
    };
    return walk(b);
  }
  function hasUnresolved(s) { return /\{[^}]+\}/.test(String(s)); }

  function editValue(k, val) {
    const d = cur();
    if (!d || d.locked) return;
    const row = decisionRows(d).find(r => r.k === k);
    if (!row || val === row.v) return;
    const c = caseOf(d);
    mutate(d.id, x => {
      if (x.reco) { x.postEdits = x.postEdits || {}; x.postEdits[k] = val; }
      else if (row.qi != null) { x.ans[row.qi] = val; }
      else { x.edits[k] = val; }
    });
    log("edit", { decisionId: d.id, title: c.title, request: k + ": " + row.v + " to " + val, note: d.reco ? "Edited after the recommendation. Not regenerated." : "" });
  }
  function lockDecision() { const d = cur(); mutate(d.id, x => { x.locked = true; x.lockedAt = today(); }); log("lock", { decisionId: d.id, title: caseOf(d).title, note: "Decision saved and locked." }); }
  function unlockDecision() { const d = cur(); mutate(d.id, x => { x.locked = false; }); log("unlock", { decisionId: d.id, title: caseOf(d).title, note: "Unlocked to edit." }); }
  function updateBlueprint() {
    const d = cur();
    mutate(d.id, x => { Object.assign(x.edits, x.postEdits || {}); x.postEdits = {}; x.version = (x.version || 1) + 1; x.updatedAt = today(); });
    log("update", { decisionId: d.id, title: caseOf(d).title, note: "Blueprint updated to a new version from the edited answers." });
  }

  /* ---------- projects and pinning (My decisions) ---------- */
  function projectOf(id) { return db().projects.find(p => p.id === id) || null; }
  function createProject(name) {
    const s = db(), id = "p" + Date.now();
    s.projects.push({ id: id, name: name.trim() || "New project", pinned: false, created: today() });
    save(s); return id;
  }
  function renameProject(id, name) { const s = db(), p = s.projects.find(x => x.id === id); if (p && name.trim()) { p.name = name.trim(); save(s); } }
  function pinProject(id) { const s = db(), p = s.projects.find(x => x.id === id); if (p) { p.pinned = !p.pinned; save(s); } }
  function deleteProject(id) {
    const s = db();
    s.decisions.forEach(d => { if (d.projectId === id) d.projectId = null; });
    s.projects = s.projects.filter(p => p.id !== id);
    save(s);
  }
  function moveDecision(did, pid) { mutate(did, d => { d.projectId = pid || null; if (pid) d.pinned = false; }); }
  function pinDecision(did) { mutate(did, d => { d.pinned = !d.pinned; }); }
  function crumb(d) { const pr = d && d.projectId && projectOf(d.projectId); return pr ? '<div class="crumb"><a href="decisions.html">My decisions</a> › ' + esc(pr.name) + "</div>" : ""; }

  /* ---------- Back and Forward memory ---------- */
  function goBack(target) { const d = cur(); if (d) mutate(d.id, x => { x.nav = { at: target, fwd: here() }; }); go(target); }
  function fwdTarget() { const d = cur(); return d && d.nav && d.nav.at === here() ? d.nav.fwd : null; }
  function navRow(backUrl, backLabel, rightHtml) {
    const f = fwdTarget();
    return '<div class="navrow"><div class="grp2">' +
      (backUrl ? '<button type="button" class="navb" data-back="' + esc(backUrl) + '" aria-label="Back: ' + esc(backLabel || "previous page") + '">' + ICON.back + "Back</button>" : "") +
      (f ? '<button type="button" class="navb" data-fwd="' + esc(f) + '" aria-label="Forward">Forward' + ICON.arrow + "</button>" : "") +
      "</div>" + (rightHtml || "") + "</div>";
  }
  function wireNav(scope) {
    (scope || document).querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => goBack(b.dataset.back)));
    (scope || document).querySelectorAll("[data-fwd]").forEach(b => b.addEventListener("click", () => go(b.dataset.fwd)));
  }

  /* ---------- journey stepper: Clarify, Decide, Act ---------- */
  const STAGES = [
    { key: "clarify", label: "Clarify", url: "clarify.html" },
    { key: "decide", label: "Decide", url: "decide.html" },
    { key: "act", label: "Act", url: "act.html" }
  ];
  function stageUrl(k) { return STAGES.find(x => x.key === k).url; }
  function markStage(key) {
    const d = cur();
    if (!d) return;
    const idx = STAGES.findIndex(x => x.key === key);
    mutate(d.id, x => { x.stageIndex = Math.max(x.stageIndex || 0, idx); });
  }
  function renderStepper(currentKey, o) {
    o = o || {};
    const slot = document.getElementById("stepslot");
    if (!slot) return;
    const d = cur(), P = d ? progress(d) : { complete: false, answered: 0 };
    const enabled = { clarify: true, decide: !!d && (P.answered > 0 || P.complete || d.reco), act: !!d && !!d.planned };
    const done = { clarify: P.complete, decide: !!(d && d.planned), act: false };
    let h = "";
    STAGES.forEach((st, i) => {
      const isCur = st.key === currentKey;
      const cls = isCur ? "current" : (done[st.key] ? "done" : (enabled[st.key] ? "open" : ""));
      const dot = (done[st.key] && !isCur) ? ICON.check : '<span class="num">' + (i + 1) + "</span>";
      h += '<button type="button" class="step ' + cls + '" ' + (!isCur && enabled[st.key] ? 'data-go="' + st.url + '"' : "disabled") + (isCur ? ' aria-current="step"' : "") + '><span class="dot">' + dot + '</span><span class="lbl2">' + st.label + "</span></button>";
      if (i < STAGES.length - 1) h += '<span class="rail2 ' + (done[st.key] ? "fill" : "") + '"></span>';
    });
    const n = d ? decisionRows(d).length + (d.contacts || []).length + (d.toolSel || []).length + (d.notes || []).length : 0;
    slot.innerHTML = '<div class="stepbar" data-us="7.2"><nav class="steps" id="steps" aria-label="Progress">' + h + "</nav>" +
      (o.panel === false ? "" : '<button type="button" class="sum-toggle" id="sumToggle" aria-expanded="true" aria-controls="panel" data-tip="Your answers, contacts, tools and notes for this decision, in one place."><span aria-hidden="true">' + ICON.summary + '</span><span class="t">Decision summary</span><span class="n" id="sumN">' + n + "</span></button>") + "</div>";
    slot.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => { const dd = cur(); if (dd && b.dataset.go === "clarify.html") mutate(dd.id, x => { x.view = null; }); go(b.dataset.go); }));
    const t = document.getElementById("sumToggle");
    if (t) t.addEventListener("click", togglePanel);
    updateStick();
    applyPanelLayout();
  }

  /* ---------- chrome: presenter strip, top bar ---------- */
  let headHidden = false;
  function updateStick() {
    const hw = document.getElementById("headWrap"), tb = document.getElementById("hbTop"), st = document.getElementById("stepslot");
    if (!hw || !tb) return;
    const tbH = tb.offsetHeight, stH = st ? st.offsetHeight : 0;
    const r = document.documentElement.style;
    r.setProperty("--tb-h", tbH + "px");
    r.setProperty("--stick", (headHidden ? stH : tbH + stH) + "px");
  }
  function setHeadHidden(v) {
    const hw = document.getElementById("headWrap");
    if (!hw || headHidden === v) return;
    headHidden = v;
    hw.classList.toggle("tb-hidden", v);
    updateStick();
  }
  function mount() {
    const s = db(), host = document.getElementById("chrome");
    if (!host) return;
    const li = !!s.user, page = (location.pathname.split("/").pop() || "").toLowerCase();
    host.innerHTML =
      '<div class="hotzone" id="hotzone"></div>' +
      '<div class="strip" id="strip"><span><b>Markiply MVP v1.1.</b> Scripted flows, fictional providers and tools, sample numbers.</span>' +
      '<label class="switch"><input type="checkbox" id="tagToggle" ' + (s.ui && s.ui.tags ? "checked" : "") + '><span class="track"></span><span>Show PRD tags <kbd>T</kbd></span></label>' +
      (li ? '<a href="team.html">Team view</a>' : "") + '<a href="design-system.html">Design system</a><button class="link" id="resetBtn" type="button">Reset demo</button></div>' +
      '<div class="head-wrap" id="headWrap"><div class="hb-top" id="hbTop"><div class="pinkline"></div><header class="topbar"><a class="logo" href="' + (li ? "home.html" : "login.html") + '" aria-label="Markiply home"><img src="assets/logo.png" alt="Markiply"></a>' +
      (li ? '<a class="btn partner" id="partnerBtn" href="https://www.markiply.com/en" target="_blank" rel="noopener" data-us="BP"><span class="long">Partner with Markiply</span><span class="short">Partner</span>' + ICON.external + "</a>" : "") +
      '<div class="right">' +
      (li ? '<nav class="nav" aria-label="Main"><a href="decisions.html" data-us="BP"' + (page === "decisions.html" ? ' class="on" aria-current="page"' : "") + ">My decisions</a></nav>" +
        '<div class="rel"><button class="avatar-btn" id="profileBtn" type="button" data-us="1.3" aria-haspopup="true" aria-expanded="false" aria-label="Account: ' + esc(s.user.name) + '">' + esc(s.user.first.charAt(0)) + "</button>" +
        '<div class="pop" id="profilePop" hidden><h4>' + esc(s.user.name) + '</h4><div class="sub2">' + esc(s.user.email) + "</div>" +
        D.PROFILE.map(r => '<div class="kv"><span>' + esc(r.k) + "</span><span>" + esc(r.v) + "</span></div>").join("") +
        '<div class="sub2" style="margin:10px 0 0;">Learned from your conversations and used only where it helps.</div><div class="foot"><span></span><button class="link" id="logoutBtn" type="button">Sign out</button></div></div></div>' : "") +
      '</div></header></div><div id="stepslot"></div></div>';

    const strip = document.getElementById("strip");
    let hideT = null, touchT = null, lastY = window.scrollY || 0;
    const open = () => { clearTimeout(hideT); strip.classList.add("open"); };
    const close = () => { hideT = setTimeout(() => { if (!strip.contains(document.activeElement)) strip.classList.remove("open"); }, 250); };
    document.addEventListener("mousemove", e => {
      if (e.clientY <= 8) { if (headHidden) setHeadHidden(false); else open(); }
      else if (strip.classList.contains("open") && e.clientY > strip.offsetHeight + 24) close();
    });
    document.addEventListener("touchstart", e => {
      const t = e.touches[0];
      if (t && t.clientY < 18) { open(); clearTimeout(touchT); touchT = setTimeout(close, 6000); }
    }, { passive: true });
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y <= 40) setHeadHidden(false);
      else if (y > lastY + 6 && y > 120) setHeadHidden(true);
      else if (y < lastY - 6) setHeadHidden(false);
      lastY = y;
    }, { passive: true });
    window.addEventListener("resize", updateStick);
    document.getElementById("hbTop").addEventListener("focusin", () => setHeadHidden(false));
    document.getElementById("tagToggle").addEventListener("change", e => setTags(e.target.checked));
    document.getElementById("resetBtn").addEventListener("click", reset);
    document.addEventListener("keydown", e => {
      if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || "") && !e.target.isContentEditable) {
        setTags(!(db().ui && db().ui.tags));
        document.getElementById("tagToggle").checked = !!db().ui.tags;
      }
    });
    if (li) {
      document.getElementById("logoutBtn").addEventListener("click", logout);
      const pb = document.getElementById("profileBtn"), pp = document.getElementById("profilePop");
      pb.addEventListener("click", e => { e.stopPropagation(); pp.hidden = !pp.hidden; pb.setAttribute("aria-expanded", String(!pp.hidden)); });
      document.addEventListener("click", e => { if (!pp.hidden && !pp.contains(e.target)) { pp.hidden = true; pb.setAttribute("aria-expanded", "false"); } });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && !pp.hidden) { pp.hidden = true; pb.setAttribute("aria-expanded", "false"); pb.focus(); } });
    }
    initTips();
    updateStick();
    applyTags();
  }
  function setTags(on) { const st = db(); st.ui = st.ui || {}; st.ui.tags = !!on; save(st); applyTags(); }

  function applyTags() {
    document.querySelectorAll(".us-tag").forEach(n => n.remove());
    const on = !!(db().ui && db().ui.tags);
    document.body.classList.toggle("show-tags", on);
    if (!on) return;
    document.querySelectorAll("[data-us]").forEach(el => {
      const codes = el.getAttribute("data-us").split(",").map(x => x.trim()).filter(Boolean);
      if (!codes.length) return;
      const span = document.createElement("span");
      const lab = c => c === "BP" ? "Proposed, beyond PRD" : (c === "DR" ? "PRD scope note" : (c === "ILL" ? "Illustration" : "US " + c));
      span.className = "us-tag" + (codes.indexOf("BP") > -1 ? " beyond" : "");
      span.textContent = codes.map(lab).join(" + ") + " · " + (D.US[codes[0]] || "");
      el.appendChild(span);
    });
  }

  /* ---------- tooltips: any element with data-tip ---------- */
  function initTips() {
    if (window.__mkTips) return;
    window.__mkTips = true;
    let el = null;
    const hide = () => { if (el) { el.remove(); el = null; } };
    const show = t => {
      hide();
      const txt = t.getAttribute("data-tip"); if (!txt) return;
      el = document.createElement("div");
      el.className = "tip"; el.setAttribute("role", "tooltip"); el.textContent = txt;
      document.body.appendChild(el);
      const r = t.getBoundingClientRect();
      let top = r.top - el.offsetHeight - 8;
      if (top < 8) top = r.bottom + 8;
      el.style.left = Math.max(8, Math.min(window.innerWidth - el.offsetWidth - 8, r.left + r.width / 2 - el.offsetWidth / 2)) + "px";
      el.style.top = top + "px";
      requestAnimationFrame(() => { if (el) el.classList.add("show"); });
    };
    document.addEventListener("mouseover", e => { const t = e.target.closest && e.target.closest("[data-tip]"); if (t) show(t); });
    document.addEventListener("mouseout", e => { const t = e.target.closest && e.target.closest("[data-tip]"); if (t && !t.contains(e.relatedTarget)) hide(); });
    document.addEventListener("focusin", e => { const t = e.target.closest && e.target.closest("[data-tip]"); if (t) show(t); });
    document.addEventListener("focusout", hide);
    document.addEventListener("click", hide);
    document.addEventListener("keydown", e => { if (e.key === "Escape") hide(); });
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- modal, toast, tip ---------- */
  function openModal(html, onMount) {
    closeModal();
    const o = document.createElement("div");
    o.className = "overlay"; o.id = "mkModal";
    o.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="x" aria-label="Close" id="mkClose" type="button">×</button>' + html + "</div>";
    document.body.appendChild(o);
    o.addEventListener("click", e => { if (e.target === o) closeModal(); });
    document.getElementById("mkClose").addEventListener("click", closeModal);
    document.addEventListener("keydown", escClose);
    if (onMount) onMount(o);
    applyTags();
    const first = o.querySelector("textarea, input:not([readonly])");
    if (first) first.focus();
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }
  function closeModal() { const o = document.getElementById("mkModal"); if (o) o.remove(); document.removeEventListener("keydown", escClose); }
  function swapModal(o, html, after) {
    o.querySelector(".modal").innerHTML = '<button class="x" aria-label="Close" id="mkClose2" type="button">×</button>' + html;
    o.querySelector("#mkClose2").addEventListener("click", () => { closeModal(); if (after) after(); });
    return o.querySelector(".modal");
  }
  function toast(msg, action) {
    const old = document.querySelector(".toast"); if (old) old.remove();
    const t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.innerHTML = ICON.check + "<span>" + esc(msg) + "</span>" + (action ? '<button type="button" class="link">' + esc(action.label) + "</button>" : "");
    document.body.appendChild(t);
    if (action) t.querySelector("button").addEventListener("click", () => { t.remove(); action.fn(); });
    setTimeout(() => t.classList.add("show"), 10);
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 250); }, action ? 5200 : 2800);
  }
  function tip(btn, text) {
    const old = document.querySelector(".tip.once"); if (old) old.remove();
    const t = document.createElement("div");
    t.className = "tip once"; t.setAttribute("role", "status"); t.textContent = text;
    document.body.appendChild(t);
    const r = btn.getBoundingClientRect();
    t.style.left = Math.max(12, Math.min(window.innerWidth - t.offsetWidth - 12, r.left + r.width / 2 - t.offsetWidth / 2)) + "px";
    t.style.top = Math.max(8, r.top - t.offsetHeight - 10) + "px";
    setTimeout(() => t.classList.add("show"), 10);
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 200); }, 2600);
  }
  function confirmBox(title, body, okLabel, danger, onOk) {
    openModal('<h2>' + esc(title) + '</h2><p class="lead">' + esc(body) + '</p><div class="btn-row"><button class="btn primary" id="cfOk" type="button">' + esc(okLabel) + '</button><button class="btn" id="cfNo" type="button">Cancel</button></div>', o => {
      o.querySelector("#cfNo").addEventListener("click", closeModal);
      o.querySelector("#cfOk").addEventListener("click", () => { closeModal(); onOk(); });
    });
  }

  /* ---------- Talk to a Markiply expert (US 6.1, beyond PRD) ---------- */
  function openExpert(ctx) {
    ctx = ctx || {};
    const d = cur(), c = caseOf(d), rows = decisionRows(d).slice(0, 6), P = progress(d);
    const step = ctx.step || null;
    const reco = P.complete ? briefOf(d).answer : (c.draft ? c.draft.answer : "");
    openModal(
      "<h2>" + (step ? "Ask about this step" : "Talk to a Markiply expert about this decision") + '</h2><p class="lead">' + (step ? "Your question goes to a Markiply expert together with this step and your decision." : "A Markiply expert reads everything below, so you do not need to explain it again.") + "</p>" +
      '<div class="share" aria-label="Shared with your request"><div class="lbl" style="padding-top:8px;">Shared with your request</div>' +
      '<div class="krow"><span class="k">Decision</span><span class="v">' + esc(c.title) + "</span></div>" +
      '<div class="krow"><span class="k">Your ask</span><span class="v" style="font-weight:500;">' + esc(d.request) + "</span></div>" +
      (step ? '<div class="krow"><span class="k">This step</span><span class="v">' + esc(step.text) + "</span></div>" : "") +
      (rows.length ? '<div class="krow"><span class="k">Your answers</span><span class="v" style="font-weight:500;">' + rows.map(r => esc(r.k) + ": " + esc(r.v)).join("<br>") + "</span></div>" : "") +
      (reco ? '<div class="krow"><span class="k">' + (P.complete ? "Recommendation" : "Early view (draft)") + '</span><span class="v" style="font-weight:500;">' + esc(reco) + "</span></div>" : "") + "</div>" +
      '<div class="field"><label for="xNote">Add a note (optional)</label><textarea id="xNote" placeholder="' + (step ? "What would you like to know about this step?" : "What would you like help with?") + '"></textarea></div>' +
      '<div class="btn-row"><button class="btn primary" id="xSend" type="button" data-us="BP">Send to a Markiply expert</button><button class="btn" id="xCancel" type="button">Cancel</button></div>',
      o => {
        o.querySelector("#xCancel").addEventListener("click", closeModal);
        o.querySelector("#xSend").addEventListener("click", () => {
          const note = o.querySelector("#xNote").value.trim();
          mutate(d.id, x => { x.expertReqs = x.expertReqs || []; x.expertReqs.push({ at: today(), step: step ? step.text : null, note: note }); });
          log("consult", { decisionId: d.id, title: c.title, request: (step ? "Step: " + step.text + ". " : "") + (note || "No note added."), note: "Sent from the decision. Follow-up by the team." });
          const m = swapModal(o, '<h2>Request sent</h2><p class="lead">A Markiply expert will review it with everything you shared. You can keep working in the meantime.</p>' +
            '<div class="note ok" style="margin-top:16px;">' + ICON.check + "<div>Linked to <b>" + esc(c.title) + "</b>" + (step ? ", step: " + esc(step.text) : "") + ".</div></div>" +
            '<div class="btn-row"><button class="btn primary" id="xDone" type="button">Done</button></div>', ctx.onSent);
          m.querySelector("#xDone").addEventListener("click", () => { closeModal(); if (ctx.onSent) ctx.onSent(); });
        });
      }
    );
  }

  /* ---------- connect to a provider through Markiply (US 5.5) ---------- */
  function connectDraft(d, p, a) {
    const c = caseOf(d), s = db();
    const know = decisionRows(d).map(r => r.k.toLowerCase() + ": " + r.v).join("; ");
    return "Hi " + p.name + ",\n\nI'm " + s.user.name + ", " + D.PROFILE[0].v + " at " + D.PROFILE[1].v + ". Through Markiply I'm looking for help with: " + (a ? a.text.toLowerCase() : c.title) + ".\n\nWhat I have shared with Markiply so far: " + know + ".\n\nMarkiply matched us based on your track record with similar work. I'd like to understand how you could help and discuss next steps.\n\nThanks,\n" + s.user.first;
  }
  function openConnect(providerId, actionId, onSent) {
    const d = cur(), c = caseOf(d), p = D.PROVIDERS[providerId], a = findAction(c, actionId);
    const early = !progress(d).complete;
    const draft = connectDraft(d, p, a);
    openModal(
      "<h2>Connect with " + esc(p.name) + '</h2><p class="lead">Markiply sends this for you and keeps a record of the connection. You can see it again in your Decision summary.</p>' +
      (early ? '<div class="note warn" style="margin-top:16px;">' + ICON.warn + "<div>Your decision is not fully clarified yet, so this message shares only what you have answered so far.</div></div>" : "") +
      '<div class="field"><label for="msgBody">Your message (edit if you like)</label><textarea id="msgBody" style="min-height:230px;">' + esc(draft) + "</textarea></div>" +
      '<div class="btn-row"><button class="btn primary" id="sendConn" type="button">Send through Markiply</button><button class="btn" id="cancelConn" type="button">Cancel</button></div>',
      o => {
        o.querySelector("#cancelConn").addEventListener("click", closeModal);
        o.querySelector("#sendConn").addEventListener("click", () => {
          const msg = o.querySelector("#msgBody").value;
          mutate(d.id, x => {
            x.contacts = x.contacts || [];
            x.contacts = x.contacts.filter(k => !(k.pid === providerId && k.aid === actionId));
            x.contacts.push({ id: "ct" + Date.now(), pid: providerId, name: p.name, aid: actionId, at: today(), msg: msg });
            x.connected[actionId] = p.name; x.exec[actionId] = "provider"; x.stageIndex = Math.max(x.stageIndex || 0, 2);
          });
          log("connect", { decisionId: d.id, title: c.title, request: p.name + " for: " + (a ? a.text : c.title), note: early ? "Connection sent from the early list (decision not fully clarified)." : "Connection sent through Markiply." });
          const m = swapModal(o, '<h2>Sent to ' + esc(p.name) + '</h2><p class="lead">The connection is saved in your Decision summary, with the message you sent.</p><div class="btn-row"><button class="btn primary" id="connDone" type="button">Done</button></div>', onSent);
          m.querySelector("#connDone").addEventListener("click", () => { closeModal(); if (onSent) onSent(); });
        });
      }
    );
  }
  function viewSent(contactId) {
    const d = cur(), k = (d.contacts || []).find(x => x.id === contactId);
    if (!k) return;
    const p = D.PROVIDERS[k.pid], a = findAction(caseOf(d), k.aid);
    const msg = k.msg || (p ? connectDraft(d, p, a) : "");
    openModal("<h2>What you sent to " + esc(k.name) + '</h2><p class="lead">Sent through Markiply on ' + esc(k.at) + (a ? ". For: " + esc(a.text) : "") + ".</p><pre>" + esc(msg) + '</pre><div class="btn-row"><button class="btn primary" id="vsDone" type="button">Close</button></div>', o => o.querySelector("#vsDone").addEventListener("click", closeModal));
  }
  /* Tools: select and unselect. Several tools can be selected for one step. */
  function toolSelected(d, toolId, actionId) { return (d.toolSel || []).some(x => x.id === toolId && x.aid === actionId); }
  function toggleTool(toolId, actionId) {
    const d = cur(), c = caseOf(d), t = D.TOOLS[toolId], a = findAction(c, actionId);
    let on = false;
    mutate(d.id, x => {
      x.toolSel = x.toolSel || [];
      const i = x.toolSel.findIndex(k => k.id === toolId && k.aid === actionId);
      if (i > -1) x.toolSel.splice(i, 1);
      else { x.toolSel.push({ id: toolId, name: t.name, aid: actionId, at: today() }); on = true; }
      const rest = x.toolSel.filter(k => k.aid === actionId);
      if (rest.length) { x.tools[actionId] = rest.map(k => k.name).join(", "); x.exec[actionId] = x.exec[actionId] || "tool"; x.stageIndex = Math.max(x.stageIndex || 0, 2); }
      else { delete x.tools[actionId]; if (x.exec[actionId] === "tool") delete x.exec[actionId]; }
    });
    log("tool", { decisionId: d.id, title: c.title, request: t.name + " for: " + (a ? a.text : c.title), note: (on ? "Tool selected. " : "Tool unselected. ") + D.LABELS[t.label].text + "." });
    return on;
  }
  function removeToolSel(toolId, actionId) { if (toolSelected(cur(), toolId, actionId)) toggleTool(toolId, actionId); }

  /* ---------- shared fragments ---------- */
  const tagH = (cls, ic, text, tip, us) => '<span class="tb ' + cls + '" tabindex="0" data-tip="' + esc(tip) + '"' + (us ? ' data-us="' + us + '"' : "") + ">" + (ic || "") + esc(text) + "</span>";
  function scenarioBadge(c) {
    return c.scenario.mode === "card"
      ? tagH("card", ICON.shield, "Expert-guided", D.TIPS.card, "2.2")
      : tagH("ai", ICON.help, "AI guidance · not yet verified", D.TIPS.ai, "2.4");
  }
  function label(key) { const l = D.LABELS[key]; return tagH(key, key === "unverified" || key === "notcurated" ? ICON.help : ICON.check, l.text, l.about); }
  function providerLabels(p) {
    let h = tagH("verified", ICON.shield, D.LABELS.verified.text, D.LABELS.verified.about, "5.2");
    if (p.expert) h += tagH("network", ICON.check, D.LABELS.network.text, D.LABELS.network.about);
    if (p.community > 0) h += tagH("peers", "", D.LABELS.peers.text + " · " + p.community, D.LABELS.peers.about);
    return h;
  }

  /* ---------- the Decision summary panel (US 1.3, 2.3, 3.2; beyond PRD: one panel) ----------
     Own scroll, no rounded corners, opened and closed from the stepper row. */
  let panelCtx = null;
  function panelOpen(kind) { const u = db().ui.panel || {}; return kind === "browse" ? u.browse === true : u.flow !== false; }
  function setPanelOpen(kind, v) { const s = db(); s.ui.panel[kind === "browse" ? "browse" : "flow"] = !!v; save(s); }
  function applyPanelLayout() {
    const dl = document.getElementById("dl"), t = document.getElementById("sumToggle");
    if (!panelCtx || !dl) return;
    const open = panelOpen(panelCtx.kind);
    dl.classList.toggle("closed", !open);
    if (t) t.setAttribute("aria-expanded", String(open || document.getElementById("panel").classList.contains("sheet-open")));
  }
  function togglePanel() {
    if (!panelCtx) return;
    const host = document.getElementById("panel");
    if (window.innerWidth <= 980) { if (host.classList.contains("sheet-open")) closeSheet(host); else openSheet(host); return; }
    setPanelOpen(panelCtx.kind, !panelOpen(panelCtx.kind));
    applyPanelLayout();
    updateStick();
  }
  function panelPrep(host, o) { panelCtx = Object.assign({ kind: "flow" }, o || {}); }

  function bpProgress(d, c) {
    const bp = c.blueprint;
    if (!bp) return "";
    const done = d.reco ? 1 : 0;
    const missing = bp.sections.filter(x => x.req && !x.me).length;
    let h = '<div class="grp" data-us="BP"><div class="lbl">Blueprint · ' + esc(bp.name) + '</div>';
    bp.sections.forEach(x => {
      const st = x.me ? (d.reco ? "Done" : "In progress") : (x.req ? "Required, missing" : "Later");
      h += '<div class="crow"><span class="t">' + esc(x.a) + '</span><span class="m">' + (x.me ? "This task" : "Not started") + '</span><span class="a pill ' + (x.me ? (d.reco ? "ok" : "brand") : (x.req ? "warn" : "neutral")) + '">' + st + "</span></div>";
    });
    h += '<p class="note-s" style="margin-top:6px;">' + done + " of " + bp.sections.length + " sections done. " + missing + " required " + (missing === 1 ? "section is" : "sections are") + " still missing.</p></div>";
    return h;
  }

  function renderPanel(host, o) {
    o = o || {};
    const d = cur(), c = caseOf(d);
    if (!d || !host) return;
    panelPrep(host, o);
    const rows = decisionRows(d), P = progress(d), locked = !!d.locked, final = !!d.reco;
    const b = P.complete ? briefOf(d) : null;
    host.className = "panel" + (host.classList.contains("sheet-open") ? " sheet-open" : "");
    host.setAttribute("aria-label", "Decision summary");
    const left = P.total - P.answered;
    const contacts = d.contacts || [], tools = d.toolSel || [], notes = d.notes || [];
    const rowHtml = r => {
      let act = "";
      if (locked) act = '<span class="sr">Locked</span>';
      else if (!final && r.qi != null) act = '<button type="button" class="go" data-jump="' + r.qi + '" aria-label="Change answer: ' + esc(r.k) + '">' + ICON.pencil + "</button>";
      else act = '<button type="button" class="go" data-edit="' + esc(r.k) + '" aria-label="Edit ' + esc(r.k) + '">' + ICON.pencil + "</button>";
      return '<div class="krow" data-k="' + esc(r.k) + '"><span class="k">' + esc(r.k) + (r.after ? ' <span class="edit-tag">edited after recommendation</span>' : (r.edited ? ' <span class="edit-tag">edited</span>' : "")) + '</span><span class="v"><span class="val">' + esc(r.v) + "</span>" + act + "</span></div>";
    };
    const li = a => '<ul class="bullets">' + a.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>";
    const actById = id => findAction(c, id);
    host.innerHTML =
      '<div class="panel-h"><h3 data-us="2.3"><span aria-hidden="true">' + ICON.summary + '</span>Decision summary</h3><button class="btn quiet icon" id="pClose" type="button" aria-label="Close the summary" data-tip="Close">×</button></div>' +
      '<div class="panel-b">' +
      '<div class="pstatus"><div style="flex:1;min-width:0;"><div>' + (P.complete ? esc(statusText(d)) : (P.answered + " of " + P.total + (P.total === 1 ? " question answered" : " questions answered"))) + "</div>" + (!P.complete ? '<div class="bar" aria-hidden="true"><i style="width:' + (P.total ? Math.round(P.answered / P.total * 100) : 0) + '%"></i></div>' : "") + "</div></div>" +
      (locked ? '<div class="panel-lock">' + ICON.lock + 'Locked <button class="link" id="pUnlock" type="button">Unlock to edit</button></div>' : "") +
      '<div class="grp"><div class="lbl">Your answers</div>' +
      (rows.length ? rows.map(rowHtml).join("") : '<div class="pempty">Nothing yet. Your answers appear here as you give them.</div>') +
      (!P.complete && P.answered > 0 ? '<p class="note-s" style="margin-top:8px;">' + left + (left === 1 ? " more question" : " more questions") + " to go.</p>" : "") + "</div>" +
      (notes.length ? '<div class="grp"><div class="lbl">Added by you</div>' + notes.map(n => '<div class="nrow">' + esc(n.t) + '<div class="m">' + esc(n.at) + (n.after ? " · after the recommendation" : "") + "</div></div>").join("") + "</div>" : "") +
      (b ? '<details class="pfold" open data-us="4.2"><summary>Brief' + ICON.chev + '</summary><div class="in">' + li(b.understood) + (b.scope ? '<div class="sub-h">' + esc(b.scope.title) + "</div>" + li(b.scope.items) : "") + "</div></details>" : "") +
      (b && b.reasoning ? '<details class="pfold"><summary>How I got here' + ICON.chev + '</summary><div class="in"><div class="sub-h">What I considered</div>' + li(b.reasoning.considered) + '<div class="sub-h">Why this</div><p>' + esc(b.reasoning.why) + "</p></div></details>" : "") +
      bpProgress(d, c) +
      ((final || contacts.length) ? '<div class="grp" data-us="5.5"><div class="lbl">Contacted providers</div>' + (contacts.length ? contacts.map(k => {
        const a = actById(k.aid);
        return '<div class="crow"><span class="t">' + esc(k.name) + '</span><span class="m">Contacted ' + esc(k.at) + (a ? " · " + esc(a.text) : "") + '</span><span class="a"><button type="button" class="link" data-view="' + esc(k.id) + '">View what I sent</button></span></div>';
      }).join("") : '<div class="pempty">No one contacted yet.</div>') + "</div>" : "") +
      ((final || tools.length) ? '<div class="grp" data-us="BP"><div class="lbl">Selected tools</div>' + (tools.length ? tools.map(k => {
        const a = actById(k.aid), t = D.TOOLS[k.id];
        return '<div class="crow"><span class="t">' + esc(k.name) + '</span><span class="m">Selected ' + esc(k.at) + (t ? " · " + esc(t.cat) : "") + (a ? " · " + esc(a.text) : "") + '</span><span class="a"><button type="button" class="link" data-rmtool="' + esc(k.id) + '" data-aid="' + esc(k.aid) + '" aria-label="Remove ' + esc(k.name) + '">Remove</button></span></div>';
      }).join("") : '<div class="pempty">No tools selected yet.</div>') + "</div>" : "") +
      '<details class="pfold" data-us="1.3"><summary>About you and this scenario' + ICON.chev + '</summary><div class="in"><div>' + D.PROFILE.map(r => '<div class="krow"><span class="k">' + esc(r.k) + '</span><span class="v">' + esc(r.v) + "</span></div>").join("") + "</div>" +
      '<div data-us="3.2">' + scenarioBadge(c) + (c.scenario.parent ? '<p class="note-s" style="margin-top:8px;">Related: ' + esc((c.scenario.related || []).join(", ")) + "</p>" : "") + "</div></div></details>" +
      '<div class="pfoot"><button class="btn sm" id="pDl" type="button" data-us="4.2">' + ICON.download + 'Download</button><button class="btn sm" id="pShare" type="button" data-us="4.2">' + ICON.share + 'Share</button><button class="link" id="pExpert" type="button" data-us="BP" style="margin-left:auto;font-size:14px;">Talk to a Markiply expert</button></div>' +
      "</div>";

    const q = id => host.querySelector(id);
    q("#pClose").addEventListener("click", () => { if (window.innerWidth <= 980) closeSheet(host); else { setPanelOpen(panelCtx.kind, false); applyPanelLayout(); updateStick(); } });
    q("#pExpert").addEventListener("click", () => openExpert({}));
    q("#pDl").addEventListener("click", function () { tip(this, "Download is shown for design only in this prototype."); });
    q("#pShare").addEventListener("click", function () { tip(this, "Sharing is shown for design only in this prototype."); });
    const ul = q("#pUnlock"); if (ul) ul.addEventListener("click", () => openUnlock(() => { if (o.onChange) o.onChange(); else renderPanel(host, o); }));
    host.querySelectorAll("[data-view]").forEach(bn => bn.addEventListener("click", () => viewSent(bn.dataset.view)));
    host.querySelectorAll("[data-rmtool]").forEach(bn => bn.addEventListener("click", () => { removeToolSel(bn.dataset.rmtool, bn.dataset.aid); toast("Tool removed from your summary"); if (o.onChange) o.onChange(); else renderPanel(host, o); }));
    host.querySelectorAll("[data-jump]").forEach(bn => bn.addEventListener("click", () => { const qi = +bn.dataset.jump; if (o.onJump) { closeSheet(host); o.onJump(qi); } else jumpTo(qi); }));
    host.querySelectorAll("[data-edit]").forEach(bn => bn.addEventListener("click", () => {
      const row = bn.closest(".krow"), k = bn.dataset.edit, val = row.querySelector(".val").textContent;
      row.classList.add("editing");
      row.querySelector(".v").innerHTML = '<input aria-label="' + esc(k) + '" value="' + esc(val) + '"><span style="display:flex;gap:4px;"><button type="button" class="btn sm primary" data-save>Save</button><button type="button" class="btn sm" data-cancel>Cancel</button></span>';
      row.querySelector(".v").style.flexWrap = "wrap";
      const inp = row.querySelector("input"); inp.focus(); inp.select();
      const done = () => { const v = inp.value.trim(); if (v) editValue(k, v); renderPanel(host, o); if (o.onChange) o.onChange(); };
      row.querySelector("[data-save]").addEventListener("click", done);
      row.querySelector("[data-cancel]").addEventListener("click", () => renderPanel(host, o));
      inp.addEventListener("keydown", e => { if (e.key === "Enter") done(); if (e.key === "Escape") renderPanel(host, o); });
    }));
    const n = document.getElementById("sumN"); if (n) n.textContent = rows.length + contacts.length + tools.length + notes.length;
    applyPanelLayout();
    updateStick();
    applyTags();
  }
  function openSheet(host) {
    host.classList.add("sheet-open");
    let sc = document.getElementById("mkSheetScrim");
    if (!sc) { sc = document.createElement("div"); sc.id = "mkSheetScrim"; sc.className = "sheet-scrim"; document.body.appendChild(sc); sc.addEventListener("click", () => closeSheet(host)); }
    requestAnimationFrame(() => sc.classList.add("show"));
    const t = document.getElementById("sumToggle"); if (t) t.setAttribute("aria-expanded", "true");
  }
  function closeSheet(host) {
    host.classList.remove("sheet-open");
    const sc = document.getElementById("mkSheetScrim"); if (sc) sc.classList.remove("show");
    applyPanelLayout();
  }
  function openUnlock(onDone) {
    openModal('<h2>Unlock to edit?</h2><p class="lead">Changing your answers will not update the recommendation. Your edits are saved and marked “edited after recommendation”.</p>' +
      '<div class="btn-row"><button class="btn primary" id="ulOk" type="button">Unlock to edit</button><button class="btn" id="ulNo" type="button">Keep it locked</button></div>', o => {
      o.querySelector("#ulNo").addEventListener("click", closeModal);
      o.querySelector("#ulOk").addEventListener("click", () => { unlockDecision(); closeModal(); if (onDone) onDone(); });
    });
  }

  return {
    db: db, save: save, reset: reset, esc: esc, go: go, today: today, here: here, ICON: ICON, D: D, SEP: SEP,
    login: login, requireLogin: requireLogin, logout: logout,
    caseOf: caseOf, cur: cur, byId: byId, setCur: setCur, mutate: mutate, log: log, classify: classify, start: start,
    activeList: activeList, progress: progress, ansOf: ansOf, setAnswer: setAnswer, jumpTo: jumpTo, addNote: addNote,
    stateOf: stateOf, stateHtml: stateHtml, statusText: statusText, statusOf: statusOf, statusChip: statusChip, isActing: isActing, enterDecide: enterDecide, titleOf: titleOf,
    allActions: allActions, findAction: findAction, pathsOf: pathsOf, matchesOf: matchesOf, pickOf: pickOf, setPick: setPick, resultsUrl: resultsUrl,
    decisionRows: decisionRows, variantOf: variantOf, briefOf: briefOf, hasUnresolved: hasUnresolved, editValue: editValue,
    lockDecision: lockDecision, unlockDecision: unlockDecision, openUnlock: openUnlock, updateBlueprint: updateBlueprint,
    projectOf: projectOf, createProject: createProject, renameProject: renameProject, pinProject: pinProject, deleteProject: deleteProject, moveDecision: moveDecision, pinDecision: pinDecision, crumb: crumb,
    goBack: goBack, navRow: navRow, wireNav: wireNav, fwdTarget: fwdTarget,
    STAGES: STAGES, stageUrl: stageUrl, markStage: markStage, renderStepper: renderStepper,
    mount: mount, applyTags: applyTags, openModal: openModal, closeModal: closeModal, confirmBox: confirmBox, toast: toast, tip: tip,
    openExpert: openExpert, openConnect: openConnect, viewSent: viewSent, toggleTool: toggleTool, toolSelected: toolSelected, removeToolSel: removeToolSel,
    scenarioBadge: scenarioBadge, label: label, providerLabels: providerLabels, tagH: tagH,
    initTips: initTips, renderPanel: renderPanel, openSheet: openSheet, closeSheet: closeSheet, panelOpen: panelOpen, togglePanel: togglePanel, applyPanelLayout: applyPanelLayout, updateStick: updateStick
  };
})();
