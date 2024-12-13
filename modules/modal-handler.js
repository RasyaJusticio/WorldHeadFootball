const modalOpeners = document.querySelectorAll(".modal-open-button");
const modalClosers = document.querySelectorAll(".modal-close-button");

modalOpeners.forEach((button) => {
  const modal = document.querySelector(
    ".modal-overlay#" + button.dataset.modalid
  );

  if (!modal) {
    console.warn(
      "[modal-handler]: Unable to find modal:" + button.dataset.modalid
    );

    return;
  }

  button.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
});

modalClosers.forEach((button) => {
  const modal = document.querySelector(
    ".modal-overlay#" + button.dataset.modalid
  );

  if (!modal) {
    console.warn(
      "[modal-handler]: Unable to find modal:" + button.dataset.modalid
    );

    return;
  }

  button.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.activeElement.blur();
  });
});
