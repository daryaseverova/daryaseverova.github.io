(() => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const nav = $("nav"),
    bg = $(".burger");
  const closeNav = () => {
    nav.classList.remove("open");
    bg.setAttribute("aria-expanded", false);
  };
  bg.onclick = () => {
    const o = nav.classList.toggle("open");
    bg.setAttribute("aria-expanded", o);
  };
  $$("nav a").forEach((a) => (a.onclick = closeNav));
  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      !bg.contains(e.target)
    )
      closeNav();
  });
  $$(".acc button").forEach(
    (b) =>
      (b.onclick = () => {
        const o = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", !o);
        $("#" + b.getAttribute("aria-controls")).classList.toggle("open", !o);
      }),
  );
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (e) =>
            e.forEach((x) => {
              if (x.isIntersecting) {
                x.target.classList.add("in");
                io.unobserve(x.target);
              }
            }),
          { threshold: 0.12 },
        )
      : null;
  $$(".rv").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  const lb = $("#lb"),
    li = $("#lbi"),
    lc = $("#lbc"),
    inner = $(".lb-in", lb),
    docs = $$(".doc"),
    page = $$("header, main, footer");
  let cur = 0,
    sx = 0;
  const unzoom = () => {
    li.classList.remove("zoom");
    li.style.width = "";
  };
  const show = (i) => {
    cur = (i + docs.length) % docs.length;
    const d = docs[cur],
      t = $("img", d);
    unzoom();
    inner.scrollTo(0, 0);
    li.src = d.dataset.full || t.src;
    li.alt = t.alt;
    lc.textContent = d.dataset.cap;
  };
  const open = (i) => {
      show(i);
      lb.classList.add("open");
      document.documentElement.classList.add("lb-open");
      page.forEach((el) => (el.inert = true));
      $(".x", lb).focus();
    },
    close = () => {
      lb.classList.remove("open");
      document.documentElement.classList.remove("lb-open");
      page.forEach((el) => (el.inert = false));
      unzoom();
      docs[cur].focus();
    };
  docs.forEach((d, i) => (d.onclick = () => open(i)));
  $(".x", lb).onclick = close;
  $(".p", lb).onclick = () => show(cur - 1);
  $(".n", lb).onclick = () => show(cur + 1);
  li.onclick = () => {
    if (li.classList.contains("zoom")) return unzoom();
    const w = li.getBoundingClientRect().width;
    li.classList.add("zoom");
    li.style.width = w * 1.9 + "px";
    inner.scrollLeft = (inner.scrollWidth - inner.clientWidth) / 2;
    inner.scrollTop = (inner.scrollHeight - inner.clientHeight) / 2;
  };
  lb.onclick = (e) => {
    if (e.target === lb) close();
  };
  lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), {
    passive: true,
  });
  lb.addEventListener("touchend", (e) => {
    const d = e.changedTouches[0].clientX - sx;
    if (Math.abs(d) > 50 && !li.classList.contains("zoom"))
      show(cur + (d < 0 ? 1 : -1));
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "Tab") {
      const f = $$("button", lb),
        a = document.activeElement;
      if (e.shiftKey && a === f[0]) (e.preventDefault(), f[f.length - 1].focus());
      else if (!e.shiftKey && a === f[f.length - 1])
        (e.preventDefault(), f[0].focus());
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeNav();
      bg.focus();
    }
  });
  const FORM_URL = "https://zayavka.dariapogoldina2.workers.dev";
  const f = $("#form");
  f.onsubmit = async (e) => {
    e.preventDefault();
    let ok = true,
      firstBad = null;
    const rules = {
      n: "Введите имя",
      c: "Укажите, как с вами связаться",
      m: "Напишите пару слов о запросе",
      k: "Нужно ваше согласие на обработку данных",
    };
    for (const id in rules) {
      const el = $("#" + id),
        bad = el.type === "checkbox" ? !el.checked : !el.value.trim();
      $(`[data-for=${id}]`).textContent = bad ? rules[id] : "";
      el.setAttribute("aria-invalid", bad);
      if (bad) {
        ok = false;
        firstBad = firstBad || el;
      }
    }
    if (!ok) return firstBad.focus();

    const btn = $("#send"),
      fail = $("#fail"),
      label = btn.textContent;
    fail.textContent = "";
    $("#ok").style.display = "none";
    btn.disabled = true;
    btn.textContent = "Отправляю…";
    try {
      const r = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: $("#n").value.trim(),
          contact: $("#c").value.trim(),
          message: $("#m").value.trim(),
          consent: $("#k").checked,
          website: $("#w").value,
        }),
      });
      const res = await r.json();
      if (!r.ok || !res.ok) throw new Error("send");
      $("#ok").style.display = "block";
      f.reset();
    } catch (err) {
      fail.textContent =
        "Не получилось отправить. Попробуйте ещё раз или напишите мне в Telegram: @dashkaapo";
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  };
  const clean = () =>
    history.replaceState(null, "", location.pathname + location.search);
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1),
        t = id === "top" ? null : document.getElementById(id);
      if (id !== "top" && !t) return;
      e.preventDefault();
      if (t) {
        t.scrollIntoView();
        t.setAttribute("tabindex", "-1");
        t.focus({ preventScroll: true });
      } else window.scrollTo({ top: 0 });
      clean();
    }),
  );
  if (location.hash) setTimeout(clean, 50);
})();
