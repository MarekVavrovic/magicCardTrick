let selectedCards = []; // Use first 20
let cardMap = {};
let currentBit = 0; //0-4
let answerBits = 0;
const maxBits = 5; //5 bits = 32 values
let fullDeck = []; //all cards -52

const cardPickContainer = document.getElementById("card-pick");
const groupContainer = document.getElementById("card-group");
const revealContainer = document.getElementById("revealed-card");

// Fetch cards from the Deck of Cards API
async function fetchCards() {
  try {
    const res = await fetch(
      "https://deckofcardsapi.com/api/deck/new/draw/?count=52"
    );
    const data = await res.json();

    fullDeck = data.cards;

  
    selectedCards = fullDeck.slice(0, 32); // Use first 20 cards for the trick

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

// Create 3-column layout for cards
function fanCards(container, cards) {
  container.innerHTML = ""; // Clear existing cards

  cards.forEach((card) => {
    const img = document.createElement("img");
    img.src = card.image;
    img.alt = `${card.value} of ${card.suit}`;
    img.title = `${card.value} of ${card.suit}`;
    container.appendChild(img);
  });
}


// Begin the trick
function startTrick() {
  document.getElementById("step-1").classList.add("hidden");
  document.getElementById("main-title").classList.add("hidden");
  document.getElementById("step-2").classList.remove("hidden");
  showNextGroup();
}

// Show the next group of cards based on binary position
const MAX_DISPLAY_CARDS = 14;

function showNextGroup() {
  groupContainer.innerHTML = "";

  const bit = 1 << currentBit;

  // Group = cards that match the current bit
  const group = selectedCards.filter((card) => (card.binaryValue & bit) !== 0);

  // Get extras to fill space
  const availableExtras = fullDeck.filter((c) => !selectedCards.includes(c));
  const shuffledExtras = availableExtras.sort(() => Math.random() - 0.5);
  const maxExtras = Math.max(0, MAX_DISPLAY_CARDS - group.length);
  const extras = shuffledExtras.slice(0, maxExtras);

  // Combine group + extras
  const combined = [...group, ...extras].sort(() => Math.random() - 0.5);

  //  No slicing here — real group cards are guaranteed to be shown
  fanCards(groupContainer, combined);
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






// Process the user's answer
function answer(isYes) {
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

const isThumbnail =
  window.location.href.includes("pen") &&
  !window.location.href.includes("edit");
if (isThumbnail) {
  window.addEventListener("load", () => {
    startTrick();
    for (let i = 0; i < maxBits; i++) {
      setTimeout(() => {
        answer(Math.random() < 0.5);
      }, i * 800);
    }
  });
} else {
  // Initialize the trick
  fetchCards();
}


window.addEventListener("DOMContentLoaded", () => {
  fetchCards();
});
