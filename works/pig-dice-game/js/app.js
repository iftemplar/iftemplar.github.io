/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

+ A player loses hit ENTIRE score when he rolls two 6 in a row.
+ Add an input field to the HTML where players can set the winning score, so they can change the predefined score of 100.
+ Add another dice. A player loses if one of dices shows 1

*/

var scores, roundScore, activePlayer, gamePlaying, dicePreviousSix, ScoreToReach;
var theScoreInput = document.getElementById('finalScoreInput');

// reset scores
init();

document.querySelector('.btn-roll').addEventListener('click', function () {
	if(gamePlaying) {
		ScoreToReach = theScoreInput.value;

		// lock the input
		theScoreInput.disabled = true;
		theScoreInput.classList.add('locked');
		
		// 1. Random number
		// the Formula: Math.random() * (max - min) + min;	
		var rarerifyOne = Math.random() * (1.9 - 1.5) + 1.5
		var dice = Math.floor(Math.random() * (6 - rarerifyOne) + rarerifyOne);
		var dice2 = Math.floor(Math.random() * (6 - rarerifyOne) + rarerifyOne);

		// // FOR TESTING, GIVES 5 or 6 only
		// var dice = Math.floor(Math.random() * (7 - 5) + 5);
		// var dice2 = Math.floor(Math.random() * (7 - 5) + 5);

		// 2. Display the result 1
		var diceDOM = document.querySelector('.dice');
		diceDOM.classList.remove('hidden');
		diceDOM.src = 'img/dice-' + dice + '.png';

		// 2. Display the result 2
		var diceDOM2 = document.querySelector('.dice-2');
		diceDOM2.classList.remove('hidden');
		diceDOM2.src = 'img/dice-' + dice2 + '.png';

		// 3. Update the round score IF the rolled number was NOT 1
		if(dice !== 1 && dice2 !== 1) {
			//debugger;
			// if player got 6 on one of the cubes
			if(dice == 6 || dice2 == 6){
				// Check if this is the second occurence of 6 in a row	
				if(dicePreviousSix == true){
					var listSixs = document.querySelectorAll("[src='img/dice-6.png']");
					for(var i = 0; i < listSixs.length; i++){
						// SHAKE EVERY SIX
						if(listSixs[i]){
							listSixs[i].classList.add('shake');
							document.querySelector('.btn-roll').setAttribute('disabled','disabled');
							document.querySelector('.btn-hold').setAttribute('disabled','disabled');
						}
					}
					// MAKE WHOLE SCORE BLINKING
					// Start after 0.5 second
					setTimeout(function(){
						document.getElementById('score-' + activePlayer).classList.add('blink');
						// stop blining after X more seconds
						setTimeout(function(){
							document.getElementById('score-' + activePlayer).classList.remove('blink');
							dropPlayersScore();
							nextPlayer(1000);
						}, 1000);
					}, 500);
				// mark that this is the first occurence on 6 on cubes
				// than on the next round if user gets 6 the score will be erased
				} else{
					// save the value to 'previous' variable
					dicePreviousSix = true;
					roundScore += dice + dice2;
					document.querySelector('#current-' + activePlayer).textContent = roundScore;
				}
				// set the varible watching 6 value on cubes false
				// for exmaple combination may've been 5+6, 1+5
			} else{
				dicePreviousSix = false;
				// Add round score
				roundScore += dice + dice2;
				document.querySelector('#current-' + activePlayer).textContent = roundScore;
			}
		// if the dice == 1
		// switch players
		} else {
			nextPlayer(1000);
		} 
	}
});


// Add players current score to global score
document.querySelector('.btn-hold').addEventListener('click', function() {
	if(gamePlaying) {

		// add current score to global score
		scores[activePlayer] += roundScore;

		// update the ui
		document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

		// Check if player won the game
		if(scores[activePlayer] >= ScoreToReach) {
			document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
			document.querySelector('.dice').classList.add('hidden');
			document.querySelector('.dice-2').classList.add('hidden');
			document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
			document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
			gamePlaying = false;
		} else {
			// next player with minimun delay
			nextPlayer(100);

		}
	}
});


function nextPlayer(theTimeout) {
	// debugger;
	// switch players	
	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
	roundScore = 0;
	dicePreviousSix = false;
	document.querySelector('.dice').classList.remove('shake');
	document.querySelector('.dice-2').classList.remove('shake');

	// Show zeros on scores
	document.getElementById('current-0').textContent = 0;
	document.getElementById('current-1').textContent = 0;

	// Activate new player's board
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	// Find all the cubes
	var listAll = document.querySelectorAll('.dice');

	// Find the cubes with value of 1
	var listOnes = document.querySelectorAll("[src='img/dice-1.png']");

	if(listOnes.length > 0){
		for (var i = 0; i < listOnes.length; i++ ) {
			// Forbid clicking on the button ROLL DICE while animating
			document.querySelector('.btn-roll').setAttribute('disabled','disabled');
			listOnes[i].classList.add('shake');
		}
	}

	// hide the dices
	setTimeout(function(theTimeout){
		for (var ii = 0; ii < listAll.length; ii++ ) {
			listAll[ii].classList.add('hidden');
			// if dice with one is om a table - shake it
			if(listOnes[ii]){
				listOnes[ii].classList.remove('shake');
			}
			// make the ROLL DICE button working again
			document.querySelector('.btn-roll').removeAttribute('disabled');
		}
	}, theTimeout);
}


// ///////////////
// Start new game
// ///////////////
document.querySelector('.btn-new').addEventListener('click', init); // setting the init function as callback

function init() {
	scores = [0, 0];
	activePlayer = 0; // current round score for each player
	roundScore = 0;
	gamePlaying = true;
	dicePreviousSix = false;

	// Hide the dice before any rolls
	document.querySelector('.dice').classList.add('hidden');
	document.querySelector('.dice-2').classList.add('hidden');
	document.getElementById('score-0').textContent = '0'; // getElementByID is faster
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';
	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');

	// disable the input for changing the final score
	theScoreInput.disabled = false;
	theScoreInput.classList.remove('locked');
}

// Clear entire player's score
function dropPlayersScore(){
	scores[activePlayer] = 0;
	document.getElementById('score-' + activePlayer).textContent = 0;
}


// HELP button
document.querySelector('.help').addEventListener('click', function () {
	document.querySelector('.help-rules').classList.add('visible');
})

document.querySelector('.help-rules-close').addEventListener('click', function () {
	document.querySelector('.help-rules').classList.remove('visible');
})


