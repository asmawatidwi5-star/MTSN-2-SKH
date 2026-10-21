(() => {
  const D = window.SITE, $ = (s, r = document) => r.querySelector(s);
  document.documentElement.classList.add("js");
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  const watch = r => (r || document).querySelectorAll("[data-r]:not(.in)").forEach(el => io.observe(el));

  // Prestasi dengan filter
  const st = { tingkat: "Semua", tahun: "Semua" };
  const uniq = k => [...new Set(D.prestasi.map(p => String(p[k])))];
  const chips = (id, k) => { $(id).innerHTML = ["Semua", ...uniq(k)].map(v => `<button class="chip${st[k] === v ? " on" : ""}" aria-pressed="${st[k] === v}" data-k="${k}" data-v="${v}">${v}</button>`).join(""); };
  const drawP = () => {
    const l = D.prestasi.filter(p => (st.tingkat === "Semua" || p.tingkat === st.tingkat) && (st.tahun === "Semua" || String(p.tahun) === st.tahun));
    $("#plist").innerHTML = l.length ? l.map((p, i) => `<article class="card" data-r style="--i:${i}"><svg class="ic" aria-hidden="true"><use href="#i-trophy"/></svg><h3>${p.peringkat}</h3><p>${p.lomba}</p><p class="meta">${p.tingkat}, ${p.tahun}</p></article>`).join("") : '<p class="meta">Belum ada prestasi untuk pilihan ini.</p>';
    watch($("#plist"));
  };
  const drawF = () => { chips("#f-tingkat", "tingkat"); chips("#f-tahun", "tahun"); drawP(); };
  document.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { st[b.dataset.k] = b.dataset.v; drawF(); } });
  drawF();

  // Berita
  $("#blist").innerHTML = D.berita.map((b, i) => `<article class="card" data-r style="--i:${i}"><p class="meta">${b.kategori}, ${b.tahun}</p><h3>${b.judul}</h3><div class="row"><a class="btn" href="${b.url}" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-ext"/></svg>Buka sumber</a><button class="btn ghost" data-share="${b.url}" data-title="${b.judul}"><svg class="ic" aria-hidden="true"><use href="#i-share"/></svg>Bagikan</button></div></article>`).join("");

  // Foto galeri (jika sudah diisi di data.js)
  if (D.galeri.length) $("#gfoto").innerHTML = D.galeri.map((g, i) => `<img data-r style="--i:${i}" src="${g.src}" alt="${g.alt}" loading="lazy" width="800" height="600">`).join("");

  // Salin dan bagikan
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]");
    if (c) { if (navigator.clipboard) navigator.clipboard.writeText(c.dataset.copy); const s = c.querySelector("span"), t = s.textContent; s.textContent = "Tersalin"; setTimeout(() => (s.textContent = t), 1500); }
    const s = e.target.closest("[data-share]");
    if (s) { const d = { title: s.dataset.title, url: s.dataset.share }; if (navigator.share) navigator.share(d).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(d.url); }
  });

  // Formulir pesan membuka aplikasi email
  $("#pesan").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    location.href = `mailto:mtsnskh@gmail.com?subject=${encodeURIComponent("Pesan dari website: " + f.nama.value)}&body=${encodeURIComponent("Nama: " + f.nama.value + "\n\n" + f.isi.value)}`;
  });

  // Menu aktif saat scroll
  const links = [...document.querySelectorAll("nav a")];
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));
  watch();
})();
