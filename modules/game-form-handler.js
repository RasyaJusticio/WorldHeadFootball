/** @type {HTMLFormElement} */
const gameForm = document.getElementById("gameForm");
const submittedData = {
  name: "Rasya",
  player1Country: "Brazil",
  player2Country: "Germany",
  difficulty: "30",
  ball: "02",
};

gameForm.addEventListener("submit", (ev) => {
  ev.preventDefault();

  for (const key in submittedData) {
    submittedData[key] = ev.target[key].value.trim();
  }

  timer = Number(submittedData.difficulty);

  navigate("game");
});

BALL_IMG.src = `./assets/Ball ${submittedData.ball}.png`;
COUNTRY_1_IMG.src = `./assets/Flag/${submittedData.player1Country}.png`;
COUNTRY_2_IMG.src = `./assets/Flag/${submittedData.player2Country}.png`;
