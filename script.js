const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
document.getElementById("score").textContent = "Score: " + score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    console.log(cards);
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length; // this is 18 :D
  let randomIndex;
  let tempvalue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    tempvalue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = tempvalue;
  }
}
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
    <img class="front-image" src= ${card.image}> 
    </div>
    <div class="back">
    </div> `;
    cardElement.addEventListener("click", flipcard);
    cardElement.addEventListener("touch", flipcard);
    cardsContainer.appendChild(cardElement);
  }
}
function flipcard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  checkFortMatch();
}
function checkFortMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) disableCards();
  else unflipCards();
}
function disableCards() {
  firstCard.removeEventListener("click", flipcard);
  secondCard.removeEventListener("click", flipcard);
  firstCard.removeEventListener("touch", flipcard);
  secondCard.removeEventListener("touch", flipcard);
  score++;
  document.getElementById("score").textContent = "Score: " + score;
  unlockBoard();
}
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 950);
}

function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  cardsContainer.innerHTML = "";
  shuffleCards();
  generateCards();
  score = 0;
  document.getElementById("score").textContent = "Score: " + score;
  lockBoard = false;
}
