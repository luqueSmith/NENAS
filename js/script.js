// =========================
// Datos
// =========================
const CLAN_NAME = "⚜️ 〔 𝐍𝐄𝐍𝐀𝐒 ʸˢ 〕 ⚜️";
const CLAN_SLOGAN = "Unidos por el juego, el respeto y la comunidad";

const CLAN_RULES = [
  { id: 1, title: "Respeto Total", description: "Respeto entre todos los miembros sin importar el rango.", icon: "💗" },
  { id: 2, title: "Cero Discriminación", description: "No se permiten insultos ni discriminación de ningún tipo.", icon: "🛡️" },
  { id: 3, title: "No Spam", description: "Prohibido el spam o contenido +18 en nuestros canales oficiales.", icon: "⚠️" },
  { id: 4, title: "Buena Convivencia", description: "Mantener siempre la buena vibra y el espíritu deportivo.", icon: "👥" },
  { id: 5, title: "Gestión de Conflictos", description: "Los problemas se hablan directamente con administración.", icon: "💬" },
];

// Icono fijo para TODOS los miembros (adelante)
const MEMBER_ICON = "img/IconoFreFire.png";

const INITIAL_MEMBERS = [
  {
    id: "1",
    name: "yirmaris",
    role: "Lider",
    playerId: "10056122947",
    avatar: MEMBER_ICON,        
    banner: "img/INT/Yeimi.png",      
    rank: "Heroico",
    level: 55
  },
  {
    id: "2",
    name: "∞ Kismet ϟN",
    role: "Decano",
    playerId: "882803480",
    avatar: MEMBER_ICON,
    banner: "img/INT/Smith.png",
    rank: "Heroico",
    level: 48
  },
  {
    id: "3",
    name: "꧁༺ SeLiM ༻꧂",
    role: "Miembro",
    playerId: "2111970305",
    avatar: MEMBER_ICON,
    banner: "img/INT/SELLIM.png",
    rank: "Heroico",
    level: 48
  },
  {
    id: "4",
    name: "꧁༺ mLeyd m ༻꧂",
    role: "Miembro",
    playerId: "128423111",
    avatar: MEMBER_ICON,
    banner: "img/INT/Leydy.png",
    rank: "Heroico",
    level: 48
  }
];

const SECTIONS = ["inicio", "sobre-nosotros", "reglas", "miembros", "unete"];

// =========================
// Helpers DOM
// =========================
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// =========================
// Render reglas
// =========================
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

// =========================
// Modal miembros (1 sola vez)
// =========================
let memberModalReady = false;

function ensureMemberModal() {
  if (qs("#memberModal")) return;

  const modal = document.createElement("div");
  modal.className = "mModal";
  modal.id = "memberModal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="mModal__backdrop" data-close></div>

    <div class="mModal__panel" role="dialog" aria-modal="true" aria-label="Foto del miembro">
      <button class="mModal__close" type="button" aria-label="Cerrar" data-close>✕</button>

      <div class="mModal__header">
        <div class="mModal__title font-gamer" id="memberModalTitle">Miembro</div>
        <div class="mModal__sub muted">Toca fuera para cerrar</div>
      </div>

      <div class="mModal__imgWrap">
        <img class="mModal__img" id="memberModalImg" alt="Foto del miembro">
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function openMemberModal(name, bannerSrc) {
  const modal = qs("#memberModal");
  const img = qs("#memberModalImg");
  const title = qs("#memberModalTitle");
  if (!modal || !img || !title) return;

  title.textContent = name || "Miembro";
  img.src = bannerSrc || "";
  img.alt = `Foto de ${name || "miembro"}`;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeMemberModal() {
  const modal = qs("#memberModal");
  const img = qs("#memberModalImg");
  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = "";

  // limpia src para evitar bugs en móvil
  if (img) img.src = "";
}

function setupMemberModalSystem() {
  if (memberModalReady) return;
  memberModalReady = true;

  ensureMemberModal();

  const modal = qs("#memberModal");
  const membersGrid = qs("#membersGrid");

  // 1) Cerrar modal: click en X o backdrop (delegado)
  modal.addEventListener("click", (e) => {
    const closeEl = e.target.closest("[data-close]");
    if (closeEl) {
      e.preventDefault();
      closeMemberModal();
    }
  });

  // 2) ESC para cerrar
  document.addEventListener("keydown", (e) => {
    const m = qs("#memberModal");
    if (m && !m.hidden && e.key === "Escape") closeMemberModal();
  });

  // 3) Abrir modal desde el grid (delegado, no se duplica)
  if (membersGrid) {
    membersGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".member.member--tap");
      if (!card) return;

      const name = card.getAttribute("data-name") || "Miembro";
      const banner = card.getAttribute("data-banner") || "";
      openMemberModal(name, banner);
    });

    // Accesibilidad (Enter/Espacio)
    membersGrid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".member.member--tap");
      if (!card) return;

      e.preventDefault();
      const name = card.getAttribute("data-name") || "Miembro";
      const banner = card.getAttribute("data-banner") || "";
      openMemberModal(name, banner);
    });
  }
}

// =========================
// Render miembros (sin foto arriba)
// =========================
function renderMembers() {
  const grid = qs("#membersGrid");
  if (!grid) return;

  const cards = INITIAL_MEMBERS.map(m => `
    <article
      class="member member--tap"
      role="button"
      tabindex="0"
      aria-label="Ver foto de ${escapeHtml(m.name)}"
      data-banner="${escapeHtml(m.banner || m.avatar || "")}"
      data-name="${escapeHtml(m.name)}"
    >
      <div class="member__body">
        <div class="member__top">
          <div class="member__who">
            <img class="member__mini" src="${MEMBER_ICON}" alt="" aria-hidden="true">
            <h3 class="member__name font-gamer">${escapeHtml(m.name)}</h3>
          </div>

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

        <div class="member__hint">Toca para ver la foto</div>
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

// =========================
// Texto / footer
// =========================
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

// =========================
// Navegación
// =========================
function setupSmoothScroll() {
  qsa("[data-scroll]").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      scrollToSection(href.slice(1));
    });
  });

  qsa("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      if (!id) return;
      scrollToSection(id);

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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      mobile.hidden = true;
      burger.setAttribute("aria-expanded", "false");
    }
  });

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

// =========================
// Utils
// =========================
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =========================
// Init
// =========================
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
  renderMembers();
  setupMemberModalSystem(); // <- activa el sistema del modal (sin duplicar)
  setFooterYear();

  setupSmoothScroll();
  setupMobileMenu();
  setupActiveSection();
});
