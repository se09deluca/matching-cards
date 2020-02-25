import Card from './Card'
import { imageDictionary, saveMatch, shuffle } from './utils'

const LEFT_SIDE = 'LEFT';
const RIGHT_SIDE = 'RIGHT';

function GameManager(tableCtx, headerAPI) {

    this.hasStarted = false;

    this.initialCardNumber = 0;
    this.cardNumber = 0;
    this.remainingCards = 0;

    this.matchedCards = [];

    this.startGame = function () {

        alert(`Preparati, hai ${ this.initialCardNumber * 10 } secondi da ora per giocare!`);

        headerAPI.timerHandler.startTimer();
        this.hasStarted = true;
    }

    const selectionInitialState = {
        first: undefined,
        second: undefined
    };

    const resetSelection = () => {
        currentSelection = { ...selectionInitialState };
    }

    const preventSelection = () => {
        clickBlocked = true;
        setTimeout(function () {
            clickBlocked = false;
        }, 1500);
    }

    let currentSelection = { ...selectionInitialState };

    let clickBlocked = false;

    const calculatePoints = function (time, cardsNumber) {
        return cardsNumber * (100 - time);
    }

    this.selectCard = function(card) {

        if(clickBlocked) { return; }

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

                }, 1000
            )
            return;
        }

        if(currentSelection['first'].getSide() === currentSelection['second'].getSide()) {

            preventSelection();
            setTimeout(
                () => {

                    currentSelection['first'].toggleCard();
                    currentSelection['second'].toggleCard();

                    resetSelection();
                }, 1000
            )
            return;
        }


        this.matchedCards.push(card.getName());
        currentSelection['first'].setMatched();
        currentSelection['second'].setMatched();

        preventSelection();
        resetSelection();

        headerAPI.scoreHandler.incrementScore();

        this.remainingCards = this.remainingCards - 1;

        headerAPI.scoreHandler.setRemainingCards(this.remainingCards);

        if(this.remainingCards == 0) {
            headerAPI.timerHandler.stopTimer();

            let username = prompt('Hai vinto!\nInserisci il tuo nome per essere per entrare in classifica:');

            saveMatch(username, calculatePoints(headerAPI.timerHandler.time, this.initialCardNumber));
        }
    };

    this.newCard = function (name, image) {

        let leftCard = new Card(name, image, LEFT_SIDE, this);
        let rightCard = new Card(name, image, RIGHT_SIDE, this);

        return { leftCard, rightCard };
    }

    this.append = (card) => {
        card.attach(tableCtx);
    }

    this.initTable = function (cardNumber) {

        this.initialCardNumber = cardNumber;
        this.cardNumber = cardNumber;
        this.remainingCards = cardNumber;


        let cards = [];

        for(let i = 0; i < cardNumber; i++) {

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
