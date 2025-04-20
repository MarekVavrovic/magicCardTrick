let selectedCards = []; // Use first n-cards /18
let cardMap = {};
let currentBit = 0; //0-5
let answerBits = 0;
const maxBits = 5; //5 bits = 32 values
let fullDeck = []; //all cards -52

const cardPickContainer = document.getElementById("card-pick");
const groupContainer = document.getElementById("card-group");
const revealContainer = document.getElementById("revealed-card");

// Fetch cards from the public API
async function fetchCards() {
  try {
    const res = await fetch(
      "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
    );
    const data = await res.json();

    fullDeck = data.cards;

    selectedCards = fullDeck.slice(0, 18); // Use first 18 cards 

    // Assign binary values to each card (1-20)
    selectedCards.forEach((card, i) => {
      card.binaryValue = i + 1;
      cardMap[card.binaryValue] = card;
    });

    // Add cards to the initial selection display
    selectedCards.forEach((card) => {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = `${card.value} of ${card.suit}`;
      cardPickContainer.appendChild(img);
    });

    fanCards(cardPickContainer, selectedCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
}




function fanCards(container, cards) {
  container.innerHTML = "";

  cards.forEach((card, i) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const frontImg = document.createElement("img");
    frontImg.src = card.image;
    frontImg.alt = `${card.value} of ${card.suit}`;
    frontImg.title = `${card.value} of ${card.suit}`;
    cardFront.appendChild(frontImg);

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    //  Back design for cards
    cardBack.innerHTML = `<div class="back-pattern"></div>`;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardWrapper.appendChild(cardInner);
    container.appendChild(cardWrapper);

    // slight animation delay
    cardWrapper.style.animationDelay = `${i * 50}ms`;
  });
}


// Begin the trick
function startTrick() {
  document.getElementById("step-1").classList.add("hidden");
  document.getElementById("main-title").classList.add("hidden");
  document.getElementById("step-2").classList.remove("hidden");

  // 💡 Scroll to top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });

  showNextGroup();
}

function showNextGroup() {
  groupContainer.innerHTML = "";

  const bit = 1 << currentBit;

  const group = selectedCards
    .filter((card) => (card.binaryValue & bit) !== 0)
    .sort(() => Math.random() - 0.5); // shuffle the group

  fanCards(groupContainer, group);
}

// Reset the trick
function shuffleDeck() {
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("main-title").classList.remove("hidden");
  document.getElementById("step-1").classList.remove("hidden");

  // Clear all card containers
  cardPickContainer.innerHTML = "";
  groupContainer.innerHTML = "";
  revealContainer.innerHTML = "";

  // Reset variables
  currentBit = 0;
  answerBits = 0;
  selectedCards = [];
  cardMap = {};

  // Start fresh
  fetchCards();
}

function answer(isYes) {
  // Blur all buttons to reset visual "press"
  document
    .querySelectorAll("#group-controls button")
    .forEach((btn) => btn.blur());
  if (isYes) answerBits += 1 << currentBit;
  currentBit++;

  if (currentBit >= maxBits) {
    revealCard();
  } else {
    showNextGroup();
  }
}

// Reveal the selected card with animation
function revealCard() {
  document.getElementById("step-2").classList.add("hidden");
  document.getElementById("step-3").classList.remove("hidden");

  const card = cardMap[answerBits];

  if (card) {
    // Create the main center card first
    const mainCard = document.createElement("img");
    mainCard.src = card.image;
    mainCard.alt = `${card.value} of ${card.suit}`;
    mainCard.className = "main-card"; // Special class for center card
    revealContainer.appendChild(mainCard);
  } else {
    revealContainer.innerHTML = `<div class="error-message">Card not found. Try again!</div>`;
  }
}

// Reset the trick
function shuffleDeck() {
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("main-title").classList.remove("hidden");
  document.getElementById("step-1").classList.remove("hidden");

  // Clear all card containers
  cardPickContainer.innerHTML = "";
  groupContainer.innerHTML = "";
  revealContainer.innerHTML = "";

  // Reset variables
  currentBit = 0;
  answerBits = 0;
  selectedCards = [];
  cardMap = {};

  // Start fresh
  fetchCards();
}


//NOTIFICATION
function showPopupIfFirstVisit() {
  const hasResponded = localStorage.getItem("subconsciousConsent");
  if (!hasResponded) {
    document.getElementById("subconscious-popup").classList.remove("hidden");
  }
}

function handlePopup(consent) {
  localStorage.setItem("subconsciousConsent", consent ? "granted" : "denied");
  document.getElementById("subconscious-popup").classList.add("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  showPopupIfFirstVisit(); // 
  fetchCards();
});

