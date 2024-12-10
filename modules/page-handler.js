const PAGES = {
  lobby: document.getElementById("lobby"),
  game: document.getElementById("game"),
};
const registeredCallbacks = [];
let currentPage = "";

function navigate(pageId) {
  if (pageId in PAGES && currentPage !== pageId) {
    for (const pageKey in PAGES) {
      /** @type {HTMLDivElement} */
      const page = PAGES[pageKey];

      page.classList.add("hidden");
    }

    registeredCallbacks.forEach((callback) => {
      callback(pageId);
    });

    PAGES[pageId].classList.remove("hidden");
    currentPage = pageId;
  }
}

function onPageChange(callback) {
  registeredCallbacks.push(callback);
}

navigate("lobby");
