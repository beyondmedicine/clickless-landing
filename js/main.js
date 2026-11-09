// scroll reveal + count-up
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      el.querySelectorAll("[data-count]").forEach(countUp);
      el.querySelectorAll(".bar-fill").forEach(
        (b) => (b.style.width = b.dataset.w + "%"),
      );
      io.unobserve(el);
    }),
  { threshold: 0.2 },
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 1;
  const end = +el.dataset.count,
    comma = el.dataset.fmt === "comma",
    dur = 1500,
    t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / dur, 1),
      v = Math.round(end * (1 - Math.pow(1 - p, 3)));
    el.textContent = comma ? v.toLocaleString("ko-KR") : v;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// clinics (2026.10.20 기준, 사용 승인 의료기관 · rx=실처방)
const CLINICS = [
  ["케이구강악안면외과치과의원", "031-713-2879", 1],
  ["바른정치과의원", "", 1],
  ["한림대학교성심병원 치과", "031-380-3870", 1],
  ["서울삼성치과", "032-567-5755", 1],
  ["의정부TMD치과", "031-841-2875", 1],
  ["래미안서울치과의원", "", 1],
  ["포도나무치과", "032-421-2855", 1],
  ["로덴예인치과", "02-475-2875", 1],
  ["서울디아치과의원", "02-2039-2872", 1],
  ["탑플랜치과의원", "02-2668-2804", 1],
  ["연세미래엔미소치과병원", "02-441-2275", 1],
  ["드림분당예치과병원", "031-713-2875", 1],
  ["연세꿈꾸는치과교정과 평택지제점", "031-618-2828"],
  ["서울유플란트치과의원", "02-957-2879"],
  ["장안연세치과의원", "031-247-2597"],
  ["삼성큐치과의원", "031-415-2804"],
  ["다산리더스치과의원", "031-566-2879"],
  ["서울매스티지치과", "02-3446-8275"],
  ["서울진정치과", "031-838-7528"],
  ["삼성바이오치과", "032-821-2876"],
  ["미소안치과", "02-855-2811"],
  ["연세정직한치과의원", "02-582-7575"],
  ["삼성사랑니졸업치과", "02-2138-2802"],
  ["유어스치과", "055-364-7600"],
  ["문치과의원", "02-593-2875"],
  ["서산웰치과의원", "041-668-2878"],
  ["스타시티치과", "02-462-8275"],
  ["천안바른치과", "041-554-7528"],
  ["두리치과의원", ""],
  ["단국대학교 치과병원", "041-550-0271"],
  ["경기도의료원", ""],
  ["연세여우치과", ""],
  ["연세바로치과", ""],
  ["중랑퍼스트치과", "02-2209-2897"],
  ["서울탑치과", "02-2062-7528"],
  ["연세희망치과의원", "031-972-3285"],
  ["안승민치과", ""],
  ["지동욱치과", ""],
  ["더프라임치과", "031-676-7528"],
  ["연세보스톤치과", "031-444-2875"],
  ["연세굿플란트치과", "02-423-2801"],
  ["구로좋은치과", "02-857-0028"],
  ["국군수도병원", ""],
  ["화이트치과의원", "02-3426-0028"],
  ["이천예치과", "031-631-2275"],
  ["즐거운치과의원", "053-811-2275"],
  ["청아치과의원", "031-638-6938"],
  ["연세고운미소치과 신촌1호점", "02-3143-6321"],
  ["두서울치과의원", "031-715-2275"],
  ["연세에스치과", "031-707-1875"],
  ["형제치과의원", "02-2690-7222"],
  ["원주365안심플란트치과의원", ""],
  ["하나로치과의원", "031-942-2890"],
  ["서울스카이치과", "02-928-2807"],
  ["조원석치과의원", "041-547-0007"],
  ["동탄키움치과", "031-874-8844"],
  ["이스타치과", "02-578-2833"],
  ["튼튼치과의원", "02-512-2833"],
  ["보스턴바우치과", ""],
  ["얼굴에 미소치과의원", "031-573-2875"],
];

(() => {
  const rxEl = document.getElementById("clRx"),
    okEl = document.getElementById("clOk"),
    q = document.getElementById("clQuery");
  const esc = (s) =>
    s.replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const card = ([n, t, rx]) =>
    `<div class="cl-card${rx ? " rx" : ""}"><b>${esc(n)}</b>${t ? `<a href="tel:${t.replace(/-/g, "")}">${t}</a>` : "<span>전화번호는 병원에 문의</span>"}</div>`;
  const render = () => {
    const k = q.value.trim().replace(/\s+/g, "").toLowerCase();
    const hit = CLINICS.filter(
      ([n, t]) =>
        !k ||
        n.replace(/\s+/g, "").toLowerCase().includes(k) ||
        t.replace(/-/g, "").startsWith(k.replace(/-/g, "")),
    );
    const rx = hit.filter((c) => c[2]),
      ok = hit.filter((c) => !c[2]);
    rxEl.innerHTML =
      rx.map(card).join("") || '<p class="cl-empty">검색 결과가 없어요.</p>';
    okEl.innerHTML =
      ok.map(card).join("") || '<p class="cl-empty">검색 결과가 없어요.</p>';
    document.getElementById("clRxN").textContent = rx.length + "곳";
    document.getElementById("clOkN").textContent = ok.length + "곳";
    document.getElementById("clCount").textContent = k ? `${hit.length}곳` : "";
  };
  document.getElementById("clTotal").textContent = CLINICS.length;
  q.addEventListener("input", render);
  render();
})();

// self check
const items = [...document.querySelectorAll(".check-item")],
  out = document.getElementById("checkResult");
const toggle = (it) => {
  it.classList.toggle("on");
  it.setAttribute("aria-checked", it.classList.contains("on"));
  const n = items.filter((i) => i.classList.contains("on")).length;
  out.innerHTML =
    n === 0
      ? "항목을 선택하면 결과가 여기에 표시됩니다."
      : n <= 1
        ? `<b>${n}개</b> 해당 — 지금은 가벼운 신호일 수 있어요. 증상이 반복되면 치과 상담을 권해요.`
        : n <= 3
          ? `<b>${n}개</b> 해당 — 턱관절장애 초기 신호일 수 있어요. 방치하면 만성화되기 쉬우니 치과 상담을 받아 보세요.`
          : `<b>${n}개</b> 해당 — 턱관절장애 가능성이 높아요. 치과 진료를 받고 클릭리스 처방이 필요한지 상담해 보세요.`;
};

items.forEach((it) => {
  it.addEventListener("click", () => toggle(it));
  it.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(it);
    }
  });
});

// tabs
document.querySelectorAll(".tab").forEach((t) =>
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => {
      x.classList.toggle("on", x === t);
      x.setAttribute("aria-selected", x === t);
    });
    document
      .querySelectorAll(".panel")
      .forEach((p) =>
        p.classList.toggle("on", p.id === "panel-" + t.dataset.tab),
      );
    document.getElementById("dash").hidden = t.dataset.tab !== "d";
  }),
);
