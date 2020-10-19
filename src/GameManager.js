import Card from './Card';
import {
    colorPalette,
    imageDictionary,
    imageIndexes,
    saveMatch,
    setStyle,
    shuffle,
    tableStyle,
    takeNRandom
} from './utils';
import winImage from './assets/images/win.png';
import loseImage from './assets/images/lose.png';

const LEFT_SIDE = 'LEFT';
const RIGHT_SIDE = 'RIGHT';

export const CARD_POINTS = 1000;
export const TIME_POINTS = 50;
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

    this.matchedCards = [];

    const getInitialTime = function () { return Math.round(cardsNumber * LEVEL_MULTIPLIER.TIME[level]); }

    this.timer = getInitialTime();
    headerAPI.timerHandler.setTime(this.timer);

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
                    setStyle(loseImg, {
                        width: `${ tableActualWidth - (parseInt(tableStyle.padding) * 2) }px`,
                        height: '70vh',
                        objectFit: 'contain'
                    });

                    const restartBtn = generateRestartBtn();

                    tableCtx.append(loseImg, restartBtn);
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

    const calculatePoints = () => ((cardsNumber * CARD_POINTS) - (TIME_POINTS * (getInitialTime() - this.timer))) * LEVEL_MULTIPLIER.POINTS[level];

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
            stopTimer();
            saveMatch(username, calculatePoints());

            setTimeout(function () {

                alert('Complimenti! Hai vinto!');

                headerAPI.generateLastMatchBox();

                let tableActualWidth = tableCtx.getBoundingClientRect().width;
                tableCtx.innerHTML = '';
                let winImg = document.createElement('img');
                winImg.src = winImage;
                winImg.alt = 'winImage';
                setStyle(winImg, {
                    width: `${ tableActualWidth - (parseInt(tableStyle.padding) * 2) }px`,
                    height: '70vh',
                    objectFit: 'contain'
                });


                const restartBtn = generateRestartBtn();

                tableCtx.append(winImg, restartBtn);
            }, 1000);
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

        // take n random indexes to get n random card's images from a dictionary of pictures
        let deck = takeNRandom(imageIndexes, cardsNumber);
        for(let card of deck) {
            let cardPair = this.newCard(`card-${card}`, imageDictionary[`card-${card}`]);
            cards.push(cardPair['leftCard']);
            cards.push(cardPair['rightCard']);
        }

        // Mix up the couples of cards
        cards = shuffle(cards);
        for(let card of cards) {
            this.append( card );
        }

    }

}

function generateRestartBtn () {
    let restartBtn = document.createElement('button');
    restartBtn.innerText = "Cominicia una nuova partita!";
    setStyle(restartBtn, {
        height: 'fit-content',
        padding: '8px',
        borderRadius: '8px',
        backgroundColor: colorPalette.primary,
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold'
    });
    restartBtn.addEventListener('click', function () {
        let restartGameEvent = new Event("restartGame");
        dispatchEvent(restartGameEvent);
    });
    return restartBtn;
}

export default GameManager;
