const form = document.querySelector(".lead-form");
const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const trackEvent = (name, params = {}) => {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
};

if (!prefersReducedMotion && hero && heroImage) {
  const moveHero = () => {
    const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
    heroImage.style.setProperty("--hero-shift", `${progress * 42}px`);
  };

  moveHero();
  window.addEventListener("scroll", moveHero, { passive: true });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const status = form.querySelector("[data-form-status]");
  if (!button) return;

  if (!form.reportValidity()) return;

  const defaultText = button.textContent;
  const showStatus = (message, type) => {
    if (!status) return;
    status.textContent = message;
    status.className = `form-status is-visible is-${type}`;
  };

  button.textContent = "Enviando solicitud...";
  button.disabled = true;
  button.style.opacity = "0.82";

  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error("formspree-error");
      form.reset();
      trackEvent("generate_lead", {
        event_category: "form",
        event_label: "quote_form",
      });
      showStatus("Listo. Recibimos tu solicitud y el equipo de Corte a Comer te contactara pronto.", "success");
    })
    .catch(() => {
      showStatus("No pudimos enviar la solicitud. Intenta otra vez o contactanos por WhatsApp.", "error");
    })
    .finally(() => {
      button.textContent = defaultText;
      button.disabled = false;
      button.style.opacity = "1";
    });
});

document.querySelectorAll('a[href="#cotizacion"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("select_content", {
      event_category: "cta",
      event_label: link.textContent.trim(),
    });
  });
});

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("contact", {
      event_category: "cta",
      event_label: link.textContent.trim(),
    });
  });
});
