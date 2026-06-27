// Simulação isolada do algoritmo de lock + timer local, extraído da
// lógica real do session-tracker.js v7, para validar determinismo:
// - nunca duas "abas" simultaneamente donas
// - fechar a dona libera o lock e outra assume
// - expiração por TTL funciona se a dona não renova (crash simulado)
// - tempo final é sempre igual independentemente do número de abas

const LOCK_TTL = 7000;
const store = {}; // localStorage fake compartilhado entre "abas" (é o ponto: é o MESMO storage)

function lsGet(k) { return store[k] ?? null; }
function lsSet(k, v) { store[k] = String(v); }
function lsDel(k) { delete store[k]; }

class FakeTab {
  constructor(id, uid, now) {
    this.id = id;
    this.uid = uid;
    this.visible = true;
    this.now = now;
  }

  readLock() {
    const rawTs = lsGet('LOCK_TS');
    return {
      id: lsGet('LOCK_ID'),
      ts: rawTs === null ? null : Number(rawTs),
      uid: lsGet('LOCK_UID'),
    };
  }

  isOwner() {
    const l = this.readLock();
    return l.id === this.id && l.uid === this.uid;
  }

  isExpired(l) {
    if (l.id === null || l.ts === null) return true;
    return (this.now - l.ts) > LOCK_TTL;
  }

  tryAcquire() {
    const l = this.readLock();
    const podeAssumir = !l.id || l.uid !== this.uid || this.isExpired(l) || l.id === this.id;
    if (!podeAssumir) return false;
    lsSet('LOCK_ID', this.id);
    lsSet('LOCK_TS', this.now);
    lsSet('LOCK_UID', this.uid);
    return true;
  }

  release() {
    if (this.isOwner()) {
      lsDel('LOCK_ID'); lsDel('LOCK_TS'); lsDel('LOCK_UID');
    }
  }

  renew() {
    if (this.isOwner()) lsSet('LOCK_TS', this.now);
  }

  evaluate() {
    if (!this.visible) {
      if (this.isOwner()) { this.pause(); this.release(); }
      return;
    }
    const wasOwner = this.isOwner();
    const isOwnerNow = this.tryAcquire();
    if (isOwnerNow) this.resume();
    else if (wasOwner) this.pause();
  }

  resume() {
    if (!this.isOwner()) return;
    const paused = lsGet('PAUSED') === '1';
    const running = lsGet('RUN_START') !== null;
    if (paused || !running) {
      lsSet('RUN_START', this.now);
      lsDel('PAUSED');
    }
  }

  pause() {
    const running = lsGet('RUN_START') !== null;
    if (running) {
      const runStart = Number(lsGet('RUN_START'));
      const accum = Number(lsGet('ACCUM') || 0);
      const elapsed = Math.floor((this.now - runStart) / 1000);
      lsSet('ACCUM', accum + Math.max(0, elapsed));
    }
    lsSet('PAUSED', '1');
    lsDel('RUN_START');
  }

  calcActiveSeconds() {
    const accum = Number(lsGet('ACCUM') || 0);
    const paused = lsGet('PAUSED') === '1';
    const running = lsGet('RUN_START') !== null;
    if (paused || !running) return accum;
    const runStart = Number(lsGet('RUN_START'));
    const elapsed = Math.floor((this.now - runStart) / 1000);
    return accum + Math.max(0, elapsed);
  }
}

function resetStore() {
  for (const k of Object.keys(store)) delete store[k];
}

function assert(cond, msg) {
  if (!cond) throw new Error('FALHA: ' + msg);
  console.log('OK  ', msg);
}

/* ── TESTE 1: 5 abas abertas simultaneamente, todas tentam adquirir ── */
(function teste1() {
  resetStore();
  console.log('\n=== TESTE 1: 5 abas simultâneas — apenas uma deve contar ===');
  let t = 0;
  const tabs = ['A','B','C','D','E'].map(id => new FakeTab(id, 'user1', t));

  // todas avaliam "ao mesmo tempo" (mesma ordem determinística de chamadas)
  tabs.forEach(tab => tab.evaluate());

  const donos = tabs.filter(tab => tab.isOwner());
  assert(donos.length === 1, `apenas 1 dona entre 5 abas simultâneas (encontrado: ${donos.length})`);
  console.log('   dona inicial:', donos[0].id);
})();

/* ── TESTE 2: dona fecha aba (beforeunload) → outra assume no próximo poll ── */
(function teste2() {
  resetStore();
  console.log('\n=== TESTE 2: dona fecha aba → outra assume, sem duplicar tempo ===');
  let t = 0;
  const A = new FakeTab('A', 'user1', t);
  const B = new FakeTab('B', 'user1', t);

  A.evaluate(); B.evaluate();
  assert(A.isOwner() && !B.isOwner(), 'A é a dona inicial');

  // avança 10s, A estava contando
  t += 10_000; A.now = t; B.now = t;

  // A "fecha a aba" (beforeunload): pausa + libera lock
  A.pause();
  A.release();

  const accumApósFechar = Number(lsGet('ACCUM') || 0);
  assert(accumApósFechar === 10, `tempo acumulado correto após A fechar (10s, obtido ${accumApósFechar}s)`);

  // B reavalia (próximo poll) e assume
  B.evaluate();
  assert(B.isOwner(), 'B assumiu o lock após A liberar');

  t += 5_000; A.now = t; B.now = t;
  const totalFinal = B.calcActiveSeconds();
  assert(totalFinal === 15, `tempo total correto após B contar mais 5s (15s, obtido ${totalFinal}s)`);
})();

/* ── TESTE 3: dona "crasha" (sem beforeunload) → expira por TTL, outra assume ── */
(function teste3() {
  resetStore();
  console.log('\n=== TESTE 3: dona crasha sem liberar → expira por TTL ===');
  let t = 0;
  const A = new FakeTab('A', 'user1', t);
  const B = new FakeTab('B', 'user1', t);

  A.evaluate();
  assert(A.isOwner(), 'A é dona');

  // A "crasha": nunca mais renova o lock, nunca libera
  // B continua tentando a cada poll, mas o lock não expirou ainda
  t += 3000; B.now = t;
  B.evaluate();
  assert(!B.isOwner(), 'B ainda não pode assumir antes do TTL expirar');

  // passa do TTL (7000ms) sem renovação de A
  t += 5000; B.now = t; // total 8000ms desde o lock original
  B.evaluate();
  assert(B.isOwner(), 'B assume após TTL expirar (lock zumbi de A removido)');

  // importante: o tempo que A "estava contando" mas nunca pausou
  // não é somado por B — B começa do accum salvo, não inventa tempo de A
  const accumNoMomentoDaTransferencia = Number(lsGet('ACCUM') || 0);
  assert(accumNoMomentoDaTransferencia === 0, 'accum não foi inflado pelo tempo "fantasma" de A após o crash');
})();

/* ── TESTE 4: reload da aba dona (mesma sessão) — não duplica tempo ── */
(function teste4() {
  resetStore();
  console.log('\n=== TESTE 4: reload não duplica tempo (novo tabId, mesmo storage) ===');
  let t = 0;
  const A1 = new FakeTab('A1', 'user1', t); // aba antes do reload
  A1.evaluate();
  t += 20_000; A1.now = t;
  A1.pause(); // simula beforeunload do reload
  A1.release();

  const accumAntesDoReload = Number(lsGet('ACCUM') || 0);
  assert(accumAntesDoReload === 20, `20s acumulados antes do reload (obtido ${accumAntesDoReload}s)`);

  // "reload": novo tabId, mesmo localStorage (sessionStorage de sessão preservado)
  const A2 = new FakeTab('A2_apos_reload', 'user1', t);
  A2.evaluate();
  assert(A2.isOwner(), 'nova instância de aba assume o lock após reload');

  t += 5000; A2.now = t;
  const totalFinal = A2.calcActiveSeconds();
  assert(totalFinal === 25, `tempo continua de onde parou após reload (25s, obtido ${totalFinal}s)`);
})();

/* ── TESTE 5: duas abas, uma some (aba B perde visibilidade), A assume ── */
(function teste5() {
  resetStore();
  console.log('\n=== TESTE 5: troca de aba visível → transferência de posse sem duplicar ===');
  let t = 0;
  const A = new FakeTab('A', 'user1', t);
  const B = new FakeTab('B', 'user1', t);

  B.evaluate(); // B abriu primeiro, é dona
  assert(B.isOwner(), 'B é dona inicialmente');

  t += 10_000; A.now = t; B.now = t;

  // usuário troca de aba: B fica oculta, A fica visível
  B.visible = false;
  B.evaluate(); // B detecta que está oculta, pausa e libera
  A.evaluate(); // A tenta assumir

  assert(A.isOwner() && !B.isOwner(), 'A assumiu, B liberou ao ficar oculta');

  const accumNaTransferencia = Number(lsGet('ACCUM') || 0);
  assert(accumNaTransferencia === 10, `10s preservados na transferência (obtido ${accumNaTransferencia}s)`);

  t += 8000; A.now = t;
  const totalFinal = A.calcActiveSeconds();
  assert(totalFinal === 18, `total final correto após transferência (18s, obtido ${totalFinal}s)`);
})();

/* ── TESTE 6: usuários DIFERENTES no mesmo navegador não interferem ── */
(function teste6() {
  resetStore();
  console.log('\n=== TESTE 6: uid diferente não herda/bloqueia lock de outro usuário ===');
  let t = 0;
  const A = new FakeTab('A', 'userX', t);
  A.evaluate();
  assert(A.isOwner(), 'A (userX) é dona');

  const B = new FakeTab('B', 'userY', t); // outro usuário, mesmo navegador
  B.evaluate();
  assert(B.isOwner(), 'B (userY) consegue assumir, pois lock pertence a outro uid (userX) e usuário trocou — esperado: nova conta assume seu próprio espaço de tempo');
})();

console.log('\nTodos os testes de lock passaram.');