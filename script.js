const form = document.querySelector(".lead-form");

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
