import Card from './Card';
import {imageDictionary, saveMatch, shuffle, tableStyle} from './utils';
import winImage from './assets/images/win.png';
import loseImage from './assets/images/lose.png';

const LEFT_SIDE = 'LEFT';
const RIGHT_SIDE = 'RIGHT';

export const CARD_POINTS = 1000;
export const TIME_POINTS = 10;
export const LEVEL_MULTIPLIER = {
    TIME: {
        EASY: 7,
        NORMAL: 5,
        HARD: 3,
    },
    POINTS: {
        EASY: .75,
        NORMAL: 1,
        HARD: 1.25
    }
}


function GameManager(tableCtx, headerAPI, { username, cardsNumber, level }) {

    this.hasStarted = false;

    this.remainingCards = 0;
    this.timer = Math.round(cardsNumber * LEVEL_MULTIPLIER.TIME[level]);
    headerAPI.timerHandler.setTime(this.timer);

    this.matchedCards = [];


    let timeWatcher;
    const startTimer = () => {

        timeWatcher = setInterval(
            () => {

                if(this.timer <= 0) {
                    alert('Hai perso!');

                    let tableActualWidth = tableCtx.getBoundingClientRect().width;
                    tableCtx.innerHTML = '';
                    let loseImg = document.createElement('img');
                    loseImg.src = loseImage;
                    loseImg.alt = 'loseImage';
                    loseImg.width = tableActualWidth - (parseInt(tableStyle.padding)  * 2);

                    tableCtx.appendChild(loseImg);
                    stopTimer();
                    return;
                }
                headerAPI.timerHandler.setTime(--this.timer);
            }, 1000);
    }

    const stopTimer = function () { clearInterval(timeWatcher); }

    this.startGame = function () {

        alert(`Preparati, hai ${ this.timer } secondi da ora per giocare!`);

        startTimer();
        this.hasStarted = true;
    }

    const selectionInitialState = {
        first: undefined,
        second: undefined
    };

    const resetSelection = () => currentSelection = { ...selectionInitialState };

    const preventSelection = () => {
        clickBlocked = true;
        setTimeout(function () {
            clickBlocked = false;
        }, 1500);
    }

    let currentSelection = { ...selectionInitialState };

    let clickBlocked = false;

    const calculatePoints = () => ((cardsNumber * CARD_POINTS) - (TIME_POINTS * this.timer)) * LEVEL_MULTIPLIER.POINTS[level];

    this.selectCard = function(card) {

        if(clickBlocked) return;

        if(!this.hasStarted) { this.startGame(); }

        if(this.matchedCards.indexOf(card.getName()) !== -1) { return; }

        if(currentSelection['first'] === undefined) {
            currentSelection['first'] = card;
            card.toggleCard();
            return;
        } else {
            currentSelection['second'] = card;
            card.toggleCard();
        }

        if(currentSelection['first'].getName() !== currentSelection['second'].getName()) {

            preventSelection();
            setTimeout(
                () => {

                    currentSelection['first'].toggleCard();
                    currentSelection['second'].toggleCard();

                    resetSelection();

                }, 1000);
            return;
        }

        if(currentSelection['first'].getSide() === currentSelection['second'].getSide()) {

            preventSelection();
            setTimeout(
                () => {

                    currentSelection['first'].toggleCard();
                    currentSelection['second'].toggleCard();

                    resetSelection();
                }, 1000);
            return;
        }


        this.matchedCards.push(card.getName());
        setTimeout(() => {
            currentSelection['first'].setMatched();
            currentSelection['second'].setMatched();
            resetSelection();
        }, 750);

        preventSelection();

        headerAPI.scoreHandler.incrementScore();

        this.remainingCards = this.remainingCards - 1;

        headerAPI.scoreHandler.setRemainingCards(this.remainingCards);

        // WIN
        if(this.remainingCards === 0) {
            stopTimer()

            alert('Complimenti! Hai vinto!');

            saveMatch(username, calculatePoints());

            headerAPI.generateLastMatchBox();

            let tableActualWidth = tableCtx.getBoundingClientRect().width;
            tableCtx.innerHTML = '';
            let winImg = document.createElement('img');
            winImg.src = winImage;
            winImg.alt = 'winImage';
            winImg.width = tableActualWidth - (parseInt(tableStyle.padding) * 2);

            tableCtx.appendChild(winImg);
        }
    };

    this.newCard = function (name, image) {

        let leftCard = new Card(name, image, LEFT_SIDE, this);
        let rightCard = new Card(name, image, RIGHT_SIDE, this);

        return { leftCard, rightCard };
    }

    this.append = (card) => card.attach(tableCtx);

    this.play = function () {

        // Set cards
        this.remainingCards = cardsNumber;

        let cards = [];

        for(let i = 0; i < cardsNumber; i++) {

            let cardPair = this.newCard(`card-${i}`, imageDictionary[`card-${i}`]);
            cards.push(cardPair['leftCard']);
            cards.push(cardPair['rightCard']);
        }

        cards = shuffle(cards);

        for(let card of cards) {
            this.append( card );
        }

    }

}

export default GameManager;
