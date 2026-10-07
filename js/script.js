// =========================
// HERO - EFEITO DE SCROLL
// =========================

const heroContent = document.querySelector(".hero-content");
const scrollIndicator = document.querySelector(".scroll-indicator");
const revealElements = document.querySelectorAll(".reveal-on-scroll");

let ticking = false;

function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function updateScrollEffects() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const heroProgress = clamp(scrollY / windowHeight);

    // HOME: sobe e desaparece conforme o usuário desce.
    const textProgress = clamp((heroProgress - 0.05) / 0.50);
    heroContent.style.opacity = 1 - textProgress;
    heroContent.style.transform = `translateY(${heroProgress * -50}px)`;

    scrollIndicator.style.opacity = Math.max(1 - heroProgress * 4, 0);

    // ESTOQUE: animação ligada diretamente ao scroll.
    // Ao descer, os elementos sobem e aparecem.
    // Ao voltar para cima, o movimento acontece ao contrário.
    revealElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();

        // Cada item entra um pouco depois do anterior.
        const delay = Math.min(index * 0.035, 0.14);
        const start = windowHeight * (0.94 + delay);
        const end = windowHeight * (0.56 + delay);
        const progress = clamp((start - rect.top) / (start - end));

        element.style.opacity = progress;
        element.style.transform = `translateY(${(1 - progress) * 58}px)`;
    });

    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

updateScrollEffects();

// =========================
// ESTOQUE - CARROSSEL GANTUS
// =========================
const carousel = document.querySelector("#vehicleCarousel");

if (carousel) {
    const cards = [...carousel.querySelectorAll(".showcase-card")];
    const prevButton = document.querySelector(".carousel-arrow-left");
    const nextButton = document.querySelector(".carousel-arrow-right");
    const dotsContainer = document.querySelector(".carousel-dots");
    let activeIndex = 2;
    let dragStartX = 0;
    let dragging = false;

    cards.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Ver veículo ${index + 1}`);
        dot.addEventListener("click", () => { activeIndex = index; renderCarousel(); });
        dotsContainer.appendChild(dot);
    });

    const dots = [...dotsContainer.querySelectorAll(".carousel-dot")];

    function circularOffset(index) {
        let offset = index - activeIndex;
        const half = Math.floor(cards.length / 2);
        if (offset > half) offset -= cards.length;
        if (offset < -half) offset += cards.length;
        return offset;
    }

    function renderCarousel() {
        cards.forEach((card, index) => {
            const offset = circularOffset(index);
            card.style.setProperty("--offset", offset);
            card.classList.toggle("is-active", offset === 0);
            card.classList.toggle("is-hidden", Math.abs(offset) > 2);
            card.setAttribute("aria-hidden", Math.abs(offset) > 2 ? "true" : "false");
        });
        dots.forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
    }

    function move(direction) {
        activeIndex = (activeIndex + direction + cards.length) % cards.length;
        renderCarousel();
    }

    prevButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    carousel.addEventListener("pointerdown", (event) => {
        dragging = true;
        dragStartX = event.clientX;
        carousel.classList.add("is-dragging");
        carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener("pointerup", (event) => {
        if (!dragging) return;
        const distance = event.clientX - dragStartX;
        if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1);
        dragging = false;
        carousel.classList.remove("is-dragging");
    });

    carousel.addEventListener("pointercancel", () => {
        dragging = false;
        carousel.classList.remove("is-dragging");
    });

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
    });

    renderCarousel();
}


// =========================
// ESTOQUE COMPLETO - FILTROS DEMONSTRATIVOS
// =========================
const inventorySearch = document.querySelector("#inventorySearch");
const brandFilter = document.querySelector("#brandFilter");
const yearFilter = document.querySelector("#yearFilter");
const kmFilter = document.querySelector("#kmFilter");
const transmissionFilter = document.querySelector("#transmissionFilter");
const stockCards = [...document.querySelectorAll(".stock-card")];
const stockEmpty = document.querySelector("#stockEmpty");

function filterStock() {
    if (!stockCards.length) return;

    const query = (inventorySearch?.value || "").toLowerCase().trim();
    const brand = brandFilter?.value || "";
    const year = yearFilter?.value || "";
    const maxKm = Number(kmFilter?.value || 0);
    const transmission = transmissionFilter?.value || "";
    let visible = 0;

    stockCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cardBrand = card.dataset.brand;
        const cardYear = card.dataset.year;
        const cardKm = Number(card.dataset.km);
        const cardTransmission = card.dataset.transmission;

        const matches =
            (!query || text.includes(query)) &&
            (!brand || cardBrand === brand) &&
            (!year || cardYear === year) &&
            (!maxKm || cardKm <= maxKm) &&
            (!transmission || cardTransmission === transmission);

        card.style.display = matches ? "" : "none";
        if (matches) visible++;
    });

    if (stockEmpty) stockEmpty.style.display = visible ? "none" : "block";
}

[inventorySearch, brandFilter, yearFilter, kmFilter, transmissionFilter]
    .filter(Boolean)
    .forEach(control => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterStock));


// =========================
// HISTÓRIA GANTUS — SCROLL REVERSÍVEL
// =========================
const storySection = document.querySelector(".gantus-story");
const storyChapters = [...document.querySelectorAll(".story-chapter")];
const storyProgress = document.querySelector(".story-track-progress");

function updateGantusStory() {
    if (!storySection || !storyChapters.length) return;

    const viewport = window.innerHeight;
    const storyRect = storySection.getBoundingClientRect();

    // A linha vermelha é desenhada conforme atravessamos a história.
    const totalTravel = Math.max(storySection.offsetHeight - viewport, 1);
    const traveled = Math.min(Math.max(-storyRect.top, 0), totalTravel);
    const overallProgress = traveled / totalTravel;

    if (storyProgress) {
        storyProgress.style.height = `${overallProgress * 100}%`;
    }

    // Cada capítulo reage continuamente ao scroll — descendo e subindo.
    storyChapters.forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const copy = chapter.querySelector(".story-copy");
        if (!copy) return;

        const center = rect.top + rect.height / 2;
        const viewportCenter = viewport / 2;
        const distance = Math.abs(center - viewportCenter);

        // 0 longe do centro, 1 quando o capítulo chega ao centro da tela.
        const visibility = Math.min(Math.max(1 - distance / (viewport * .72), 0), 1);

        const opacity = .08 + visibility * .92;
        const moveY = (1 - visibility) * 90;
        const scale = .97 + visibility * .03;

        copy.style.opacity = opacity;
        copy.style.transform = `translateY(${moveY}px) scale(${scale})`;
    });
}

window.addEventListener("scroll", updateGantusStory, { passive: true });
window.addEventListener("resize", updateGantusStory);
updateGantusStory();


// =========================
// FILTROS MOBILE — ABRIR / FECHAR
// =========================
const mobileFilterToggle = document.querySelector("#mobileFilterToggle");
const inventoryToolsMobile = document.querySelector("#inventoryTools");

if (mobileFilterToggle && inventoryToolsMobile) {
    mobileFilterToggle.addEventListener("click", () => {
        const open = inventoryToolsMobile.classList.toggle("filters-open");
        mobileFilterToggle.classList.toggle("is-open", open);
        mobileFilterToggle.setAttribute("aria-expanded", String(open));
    });
}
