const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const currentRound = document.getElementById("current-round");
const currentRoundRolls = document.getElementById("current-round-rolls");
const totalScore = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let total = 0;
let round = 1;
let rolls = 0;

const rollDice = () => {
  diceValuesArr = [];

  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  };

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });


};

const updateStats = () => {
  currentRoundRolls.textContent = rolls;
  currentRound.textContent = round;
};

const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;
  scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScore.textContent = score;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
  const counts = {};

  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  let highestCount = 0;

  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  updateRadioOption(5, 0);
};

const detectFullHouse = (arr) => {
  const counts = {};

  for (const num of arr) {
    if (counts[num]) {
      counts[num] ++;
    }
    else {
      counts[num] = 1;
    }
  }

  let hasThree = false;
  let hasTwo = false;

  for (const key in counts) {
    if (counts[key] === 3) {
      hasThree = true;
    }
    else if (counts[key] === 2) {
      hasTwo = true;
    }
  }

  hasThree && hasTwo ? updateRadioOption(2, 25) : updateRadioOption(5, 0);
};

const resetRadioOptions = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScore.textContent = score;
  scoreHistory.innerHTML = "";

  currentRoundRolls.textContent = rolls;
  currentRound.textContent = round;

  resetRadioOptions();
};

const checkForStraights = (arr) => {
  const sortedArray = [...arr].sort((a,b) => a - b);
  console.log(sortedArray);
  const uniqueValuesArr = [...new Set(sortedArray)].join("");
  console.log(uniqueValuesArr);
  const smallStraight = ["1234", "2345", "3456"];
  const largeStraight = ["12345", "23456"];

  if (largeStraight.some(straight => uniqueValuesArr.includes(straight))) {
    updateRadioOption(4, 40); 
    updateRadioOption(3, 30); 
    updateRadioOption(5, 0);
  } 
  if (smallStraight.some(straight => uniqueValuesArr.includes(straight))) {
    updateRadioOption(3, 30); 
    updateRadioOption(5, 0);
  }
  else {
    updateRadioOption(5, 0);
  }
};

// const checkForStraights = (arr) => {
//   console.log(arr);
//   let sizeOfStraights = 1;
//   arr.forEach((number, index) => {
//     let nextArrNumber = arr[index + 1];
//     if (number + 1 === nextArrNumber) {
//       sizeOfStraights ++;
//     }
//     console.log("This is the number: ", number)
//     console.log("This should be the next number in the array: ", nextArrNumber);
//   });
//   console.log(sizeOfStraights);
//   if (sizeOfStraights === 4) {
//     updateRadioOption(3, 30);
//   }
//   else if (sizeOfStraights === 5) {
//     updateRadioOption(4, 40);
//   }
//   else {
//     updateRadioOption(5, 0);
//   }
// };

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);
    checkForStraights(diceValuesArr);
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);
    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice");
  }
});