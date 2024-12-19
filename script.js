const playAgainButton = document.querySelector('.play-again');
const gameModal = document.querySelector('.game-modal');
const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");

let currentWord, wrongGuessCount = 0;
const maxGuesses = 6;

const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  console.log(word);
  document.querySelector(".hint-text b").innerText = hint;
  wordDisplay.innerHTML = word.split("").map(() => '<li class="letter"></li>').join(""); // Clear the word display
};

const gameOver = (isVictory) => {
  setTimeout(() => {
    const modalText = isVictory ? `You found the word: ` : `The correct word was: `;
    const gameOverImg = gameModal.querySelector("img");

    // Show the Santa victory GIF when the player wins
    if (isVictory) {
      gameOverImg.src = 'svictory.gif';  // Show Santa victory image
    } else {
      gameOverImg.src = 'lsanta.gif';  // Show Santa loss GIF when the player loses
    }

    gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over!'}`;
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
  }, 300);
};

const initGame = (clickedLetter, button) => {
  let correctGuess = false;

  // Check if the clicked letter is part of the current word
  if (currentWord.includes(clickedLetter)) {
    // Iterate over each letter of the word and reveal the correct one
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
        correctGuess = true;
      }
    });
  } else { 
    // If the guess is wrong, increment the wrong guess count
    wrongGuessCount++;

    // Update the hangman image according to the wrong guess count
    hangmanImage.src = `hangman-${wrongGuessCount}.png`;
  }

  button.disabled = true; // Disable the button after it is clicked
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  // Check if game over
  if (wrongGuessCount === maxGuesses) return gameOver(false); // Game over if max wrong guesses reached

  // Check if the word is fully guessed
  if (Array.from(wordDisplay.querySelectorAll("li")).every(li => li.classList.contains("guessed"))) {
    return gameOver(true); // Player wins if all letters are guessed
  }
};

// Create keyboard buttons and add event listeners
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);

  button.addEventListener("click", (e) => {
    const clickedLetter = String.fromCharCode(i);
    initGame(clickedLetter, button); // Pass the button to initGame function
  });
}

// Handle play again logic
playAgainButton.addEventListener("click", () => {
  // Restart the game (reset variables, reset UI)
  wrongGuessCount = 0;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  hangmanImage.src = "hangman-0.png";
  gameModal.classList.remove("show");

  // Reset the keyboard buttons
  keyboardDiv.querySelectorAll("button").forEach(button => button.disabled = false);

  // Reinitialize the game
  getRandomWord();
});

getRandomWord(); // Start the game when the page loads
