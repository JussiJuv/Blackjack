var dealerScore = 0;
var playerScore = 0;

var dealerAceCount = 0;
var playerAceCount = 0;

var dealerDeck = [];
var playerDeck = [];

var hidden;
var deck = [];
var shuffledDeck = [];

var canHit = false;
var canStay = false;

var gamesPlayed = 0;
var canPlayAgain = false;

var canBet = true;
var balance = 10000;
var currentBet = 0;
var lastBet;
// chips 5, 25, 50, 100

window.onload = function() {
    document.getElementById("balance").innerText = "Balance: " + balance;
    document.getElementById("currentBet").innerText = "Current Bet: 0"
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("playAgain").addEventListener("click", playAgain);
    document.getElementById("placeBet").addEventListener("click", placeBet);
    document.getElementById("5bet").addEventListener("click", () => {chooseBet(5)});
    document.getElementById("25bet").addEventListener("click", () => {chooseBet(25)});
    document.getElementById("50bet").addEventListener("click",  () => {chooseBet(50)});
    document.getElementById("100bet").addEventListener("click", () => {chooseBet(100)});
    //HandleGame();
}

function HandleGame() {
    canPlayAgain = false;
    canHit = true;
    document.getElementById("playAgain").disabled = true;
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;

    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    let suits = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + suits[i]);
        }
    }
}

function shuffleDeck() {
    // Fisher-Yates shuffle
    for (let i = 0; i < 52; i++) {
        index = Math.floor(Math.random() * (deck.length));
        shuffledDeck.push(deck[index]);
        deck.splice(index, 1);
    }
}

function chooseBet(betValue) {
    if (canBet) {
        currentBet = 0;
        currentBet = betValue;
        document.getElementById("currentBet").innerText = "Current Bet: " + betValue;
    }
}

function placeBet() {
    console.log("Placed bet: " + currentBet);
    if (currentBet != 0) {
        document.getElementById("placeBet").disabled = true;
        balance = balance - currentBet;
        document.getElementById("balance").innerText = "Balance: " + balance;

        canHit = true;
        canStay = true;
        HandleGame();
        canBet = false;
    }
}

// Jacks, Queens, Kings and Ten are 10 points
// Ace is 1 or 11
// Rest are values on the card
function checkScore(deck, aceCount) {
    let tens = ["T", "J", "Q", "K"];
    let score = 0;

    for (let i = 0; i < deck.length; i++) {
        value = deck[i].charAt(0);
        if (tens.includes(value)) {
            score = score + 10;
        }
        else if (value == "A") {
            if (score + 11 <= 21) {
                score = score + 11;
            } 
            else {
                score = score + 1;
                aceCount--;
            }
        }
        else {
            score = score + parseInt(value);
        }
    }
    // If the score exceeds 21 and the deck holder has ace(s)
    // Subctract 10 points (A = 11 -> A = 1)
    if (score > 21 && aceCount > 0) {
        score = score - 10;
        aceCount--;
    } 

    return [score, aceCount];
}

function checkForAce(deck) {
    let aceCount = 0;
    for (let i = 0; i < deck.length; i++) {
        value = deck[i].charAt(0);
        if (value == "A") {
            aceCount++;
        }
    }
    return aceCount;
}

function startGame() {
    // Start the game with dealers hidden card
    hidden = shuffledDeck.pop();
    dealerDeck.push(hidden);
    let hiddenImg = document.createElement("img");
    hiddenImg.src = "/img/SVG-cards/2B.svg";
    hiddenImg.setAttribute("id", "hidden");
    document.getElementById("dealerCards").append(hiddenImg);

    let hiddenAce = checkForAce(dealerDeck);
    let hiddenTemp = checkScore(dealerDeck, hiddenAce);
    let hiddenScore = hiddenTemp[0];
    
    // Dealer second card
    let dealerCard = shuffledDeck.pop();
    dealerDeck.push(dealerCard);
    let cardImg = document.createElement("img");
    cardImg.src = "./img/SVG-cards/" + dealerCard + ".svg";
    document.getElementById("dealerCards").append(cardImg);

    // Shows non hidden dealer card score
    dealerAceCount = checkForAce(dealerDeck);
    let dtemp = checkScore(dealerDeck, dealerAceCount);
    dealerScore = dtemp[0];
    dealerAceCount = dtemp[1];
    let dealerScoreText = "Dealer Score: " + (dealerScore - hiddenScore);
    document.getElementById("dealerScore").innerText = dealerScoreText;

    // Two player cards
    for (let i = 0; i < 2; i++) {
        let playerCard = shuffledDeck.pop();
        playerDeck.push(playerCard);
        let cardImg = document.createElement("img");
        cardImg.src = "./img/SVG-cards/" + playerCard + ".svg";
        document.getElementById("playerCards").append(cardImg);
    }
    playerAceCount = checkForAce(playerDeck);
    let temp = checkScore(playerDeck, playerAceCount);
    playerScore = temp[0];
    playerAceCount = temp[1];
    
    document.getElementById("playerScore").innerText = "Player Score: " + playerScore;

}


function hit() {
    if (!canHit) {
        return;
    }

    let card = shuffledDeck.pop();
    playerDeck.push(card);
    let cardImg = document.createElement("img");
    cardImg.src = "./img/SVG-cards/" + card + ".svg";
    
    playerAceCount = checkForAce(playerDeck);
    let temp = checkScore(playerDeck, playerAceCount);
    playerScore = temp[0];
    playerAceCount = temp[1];
    document.getElementById("playerCards").append(cardImg);
    document.getElementById("playerScore").innerText = "Player Score: " + playerScore;

    if (playerScore > 21) {
        canHit = false;
        results();
    }
}


function stay() {
    if (!canStay) {
        return;
    }
    canHit = false;
    //document.getElementById("hidden").src = "./img/SVG-cards/" + hidden + ".svg";

    while (dealerScore < 17) {
        let card = shuffledDeck.pop();
        dealerDeck.push(card);
        let cardImg = document.createElement("img");
        cardImg.src = "./img/SVG-cards/" + card + ".svg";
    
        dealerAceCount = checkForAce(dealerDeck);
    
        let temp = checkScore(dealerDeck, dealerAceCount);
        dealerScore = temp[0];
        dealerAceCount = temp[1];
        document.getElementById("dealerCards").append(cardImg);
    }

    results();
}

function results() {
    document.getElementById("hidden").src = "./img/SVG-cards/" + hidden + ".svg";

    let resultText = "";
    if (playerScore > 21) {
        resultText = "You Lose";
    }
    else if (dealerScore > 21) {
        resultText = "You Win";
        balance = balance + 2*currentBet;
        document.getElementById("balance").innerText = "Balance: " + balance;
    }
    else if (playerScore == dealerScore) {
        resultText = "Tie";
        balance = balance + currentBet;
        document.getElementById("balance").innerText = "Balance: " + balance;
    }
    else if (playerScore < dealerScore) {
        resultText = "You Lose";
    }
    else if (playerScore > dealerScore) {
        resultText = "You Win";
        balance = balance + 2*currentBet;
        document.getElementById("balance").innerText = "Balance: " + balance;
    }

    console.log(resultText);
    document.getElementById("results").innerText = resultText;
    document.getElementById("dealerScore").innerText = "Dealer Score: " + dealerScore;
    gameOver();
}

function gameOver() {
    canPlayAgain = true;
    document.getElementById("playAgain").disabled = false;
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
}

function playAgain() {
    console.log("Play again");

    // Clear all card arrays for a new game
    dealerDeck = [];
    playerDeck = [];
    deck = [];
    shuffledDeck = [];

    // Clear cards on screen
    const playerCardElements = document.getElementById("playerCards");
    const dealerCardElements = document.getElementById("dealerCards");
    const resultText = document.getElementById("results");

    playerCardElements.innerHTML = "";
    dealerCardElements.innerHTML = "";
    resultText.innerHTML = "";

    document.getElementById("placeBet").disabled = false;
    canBet = true;
    //HandleGame();
}