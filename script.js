const form = document.querySelector(".lead-form");
const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  if (!button) return;

  button.textContent = "Solicitud lista para conectar";
  button.disabled = true;
  button.style.opacity = "0.82";

  window.setTimeout(() => {
    button.textContent = "Enviar solicitud";
    button.disabled = false;
    button.style.opacity = "1";
  }, 2600);
});
