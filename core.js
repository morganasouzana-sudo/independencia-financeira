/* =========================
   CORE.JS – MOTOR FINANCEIRO
========================= */

const TAXA_FIRE = 0.04;

/* ===== ACUMULAÇÃO ===== */
function acumular(d) {
  let p = d.patrimonio;
  for (let i = 1; i <= d.anosAcc; i++) {
    p = p * (1 + d.retorno) + d.aporte * 12;
  }
  return p;
}

/* ===== PATRIMÔNIO NECESSÁRIO ===== */
function patrimonioNecessario(d) {
  const base = (d.saque * 12) / TAXA_FIRE;
  return base * (1 + d.margem);
}

/* ===== USUFRUTO ===== */
function sustentaUsufruto(pInicial, d) {
  let p = pInicial;
  let saqueAno = d.saque;

  for (let i = 1; i <= d.anosUsu; i++) {
    if (d.modo === "nominal") {
      saqueAno *= (1 + d.inflacao);
    }
    p = p * (1 + d.retorno) - saqueAno * 12;
    if (p <= 0) return false;
  }
  return true;
}

/* ===== SIMULAÇÃO BASE ===== */
function simularPlano(d) {
  const patrimonioFinal = acumular(d);
  const necessario = patrimonioNecessario(d);
  const sobra = patrimonioFinal - necessario;
  const durou = sustentaUsufruto(patrimonioFinal, d);

  return { patrimonioFinal, necessario, sobra, durou };
}

/* ===== RISCO DE RUÍNA ===== */
function riscoRuina(d, simulacoes = 300) {
  let falhas = 0;

  for (let s = 0; s < simulacoes; s++) {
    let p = d.patrimonio;

    for (let i = 1; i <= d.anosAcc; i++) {
      const r = d.retorno + (Math.random() - 0.5) * 0.2;
      p = p * (1 + r) + d.aporte * 12;
    }

    let saqueAno = d.saque;
    for (let i = 1; i <= d.anosUsu; i++) {
      if (d.modo === "nominal") saqueAno *= (1 + d.inflacao);
      const r = d.retorno + (Math.random() - 0.5) * 0.2;
      p = p * (1 + r) - saqueAno * 12;
      if (p <= 0) {
        falhas++;
        break;
      }
    }
  }

  return (falhas / simulacoes) * 100;
}

/* ===== CRISE ===== */
function simularCrise(d) {
  let p = acumular(d);
  p *= 0.7; // -30%
  return sustentaUsufruto(p, d);
}
