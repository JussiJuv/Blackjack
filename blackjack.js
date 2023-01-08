var dealerScore = 0;
var playerScore = 0;

var dealerAceCount = 0;
var playerAceCount = 0;

var dealerDeck = [];
var playerDeck = [];

var hidden;
var deck = [];
var shuffledDeck = [];

var canHit = true;

window.onload = function() {
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
    console.log(deck);
}

function shuffleDeck() {
    // Fisher-Yates shuffle
    for (let i = 0; i < 52; i++) {
        index = Math.floor(Math.random() * (deck.length));
        shuffledDeck.push(deck[index]);
        deck.splice(index, 1);
    }
    console.log(shuffledDeck);
}

// Jacks, Queens, Kings and Ten is 10 points
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
    // and deal 2 cards to player and dealer
    hidden = shuffledDeck.pop();
    dealerDeck.push(hidden);
    let hiddenAce = checkForAce(dealerDeck);
    let hiddenTemp = checkScore(dealerDeck, hiddenAce);
    let hiddenScore = hiddenTemp[0];
    
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
    console.log(dealerScoreText);
    document.getElementById("dealerScore").innerText = dealerScoreText;

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
    console.log(playerScore);
    
    document.getElementById("playerScore").innerText = "Player Score: " + playerScore;

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}


function hit() {
    console.log("Pressed Hit");
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
    console.log(playerScore);
    document.getElementById("playerScore").innerText = "Player Score: " + playerScore;

    if (playerScore > 21) {
        canHit = false;
        results();
    }
}


function stay() {
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

        console.log(dealerScore);
        console.log(dealerDeck.length);
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
    }
    else if (playerScore == dealerScore) {
        resultText = "Tie";
    }
    else if (playerScore < dealerScore) {
        resultText = "You Lose";
    }
    else if (playerScore > dealerScore) {
        resultText = "You Win";
    }

    console.log(resultText);
    document.getElementById("results").innerText = resultText;
    document.getElementById("dealerScore").innerText = "Dealer Score: " + dealerScore;
}