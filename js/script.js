// Datos (equivalente a constants.tsx)
const CLAN_NAME = "⚜️ 〔 𝐍𝐄𝐍𝐀𝐒 ʸˢ 〕 ⚜️";
const CLAN_SLOGAN = "Unidos por el juego, el respeto y la comunidad";

const CLAN_RULES = [
  { id: 1, title: "Respeto Total", description: "Respeto entre todos los miembros sin importar el rango.", icon: "💗" },
  { id: 2, title: "Cero Discriminación", description: "No se permiten insultos ni discriminación de ningún tipo.", icon: "🛡️" },
  { id: 3, title: "No Spam", description: "Prohibido el spam o contenido +18 en nuestros canales oficiales.", icon: "⚠️" },
  { id: 4, title: "Buena Convivencia", description: "Mantener siempre la buena vibra y el espíritu deportivo.", icon: "👥" },
  { id: 5, title: "Gestión de Conflictos", description: "Los problemas se hablan directamente con administración.", icon: "💬" },
];

const INITIAL_MEMBERS = [
  { id: "1", name: "Nena_Leader", role: "Líder", playerId: "1234567890", avatar: "https://picsum.photos/seed/nena1/200/200", rank: "Gran Maestro", level: 75 },
  { id: "2", name: "Iron_Admin", role: "Administrador", playerId: "9988776655", avatar: "https://picsum.photos/seed/nena2/200/200", rank: "Heroico", level: 68 },
  { id: "3", name: "Shadow_Nena", role: "Administrador", playerId: "4455667788", avatar: "https://picsum.photos/seed/nena3/200/200", rank: "Diamante IV", level: 62 },
  { id: "4", name: "Toxic_Vibe", role: "Miembro", playerId: "1112223334", avatar: "https://picsum.photos/seed/nena4/200/200", rank: "Heroico", level: 55 },
];

const SECTIONS = ["inicio", "sobre-nosotros", "reglas", "miembros", "unete"];

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function renderRules() {
  const grid = qs("#rulesGrid");
  if (!grid) return;

  grid.innerHTML = CLAN_RULES.map(rule => `
    <article class="rule" data-rule="${rule.id}">
      <div class="rule__icon" aria-hidden="true">${rule.icon}</div>
      <h3 class="rule__title font-gamer">${escapeHtml(rule.title)}</h3>
      <p class="rule__desc">${escapeHtml(rule.description)}</p>
    </article>
  `).join("");
}

function renderMembers() {
  const grid = qs("#membersGrid");
  if (!grid) return;

  const cards = INITIAL_MEMBERS.map(m => `
    <article class="member">
      <div class="member__imgWrap">
        <img class="member__img" src="${m.avatar}" alt="${escapeHtml(m.name)}">
      </div>
      <div class="member__body">
        <div class="member__top">
          <h3 class="member__name font-gamer">${escapeHtml(m.name)}</h3>
          <span class="badge">${escapeHtml(m.role)}</span>
        </div>
        <div class="member__meta">
          <span class="spark" aria-hidden="true">⚡</span>
          <span>Nivel ${Number(m.level)}</span>
          <span class="dot" aria-hidden="true">•</span>
          <span>${escapeHtml(m.rank)}</span>
        </div>

        <div class="member__id">
          ID: <span>${escapeHtml(m.playerId || "—")}</span>
        </div>

    </article>
  `).join("");

  const placeholder = `
    <div class="placeholder" role="note" aria-label="Espacio para futuros miembros">
      <div class="placeholder__icon" aria-hidden="true">👥</div>
      <div class="placeholder__text font-gamer">Espacio para futuros miembros destacados</div>
    </div>
  `;

  grid.innerHTML = cards + placeholder;
}

function setClanText() {
  const nameEl = qs("#clanName");
  const slogEl = qs("#clanSlogan");
  if (nameEl) nameEl.textContent = CLAN_NAME;
  if (slogEl) slogEl.textContent = CLAN_SLOGAN;
}

function setFooterYear() {
  const el = qs("#copyright");
  if (!el) return;
  const year = new Date().getFullYear();
  el.textContent = `© ${year} NENAS. Todos los derechos reservados.`;
}

function setupSmoothScroll() {
  // para <a data-scroll> y botones con data-target
  qsa("[data-scroll]").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const id = href.slice(1);
      scrollToSection(id);
    });
  });

  const goBtns = qsa("[data-target]");
  goBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      if (!id) return;
      scrollToSection(id);

      // si es menú móvil, cerrarlo
      const mobile = qs("#mobileMenu");
      const burger = qs("#burger");
      if (mobile && burger && !mobile.hidden) {
        mobile.hidden = true;
        burger.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupMobileMenu() {
  const burger = qs("#burger");
  const mobile = qs("#mobileMenu");
  if (!burger || !mobile) return;

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !mobile.hidden;
    mobile.hidden = isOpen;
    burger.setAttribute("aria-expanded", String(!isOpen));
  });

  // Cerrar tocando fuera
  document.addEventListener("click", (e) => {
    const isOpen = !mobile.hidden;
    if (!isOpen) return;

    const clickedInsideMenu = mobile.contains(e.target);
    const clickedBurger = burger.contains(e.target);
    if (!clickedInsideMenu && !clickedBurger) {
      mobile.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      mobile.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // cerrar al cambiar tamaño a desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      mobile.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }
  });
}


function setupActiveSection() {
  const desktopLinks = qsa(".nav__link");
  const mobileLinks = qsa(".mobile__item");

  function setActive(id) {
    desktopLinks.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-target") === id));
    mobileLinks.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-target") === id));
  }

  function onScroll() {
    const scrollPos = window.scrollY + 110;
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        setActive(id);
        break;
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Utils */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
    const discordBtn = document.getElementById("discordBtn");
  const discordToast = document.getElementById("discordToast");

  if (discordBtn && discordToast) {
    discordBtn.addEventListener("click", () => {
      discordToast.hidden = false;
      clearTimeout(window.__discordToastTimer);
      window.__discordToastTimer = setTimeout(() => {
        discordToast.hidden = true;
      }, 2500);
    });
  }

  setClanText();
  renderRules();
  ;
  setFooterYear();
  setupSmoothScroll();
  setupMobileMenu();
  setupActiveSection();
}); 
