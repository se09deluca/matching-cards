import GameManager from './GameManager'
import { getAllMatches, imageDictionary, setStyle, shuffle } from './utils'
import tableBackgroundImage from '../src/assets/images/table-bg.jpg'
import '../src/styles.css'

function generateHeader (container) {

    setStyle(container, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: '25px 4vw',
        padding: '20px'
    });

    let defaultBoxStyle = {
        padding: '20px',
        background: 'linear-gradient(rgb(193, 203, 212), rgb(119, 128, 136)) repeat-x rgb(108, 117, 125)',
        border: "2px solid rebeccapurple",
        borderRadius: '10px',
        boxShadow: '#000000ab 0px 3px 6px 1px',
        minWidth: '15vw'
    };

    let infoBox = document.createElement('div');
    let scoreBox = document.createElement('div');
    let timerBox = document.createElement('div');

    setStyle(infoBox, {
        ...defaultBoxStyle,

    });
    setStyle(scoreBox, {
        ...defaultBoxStyle,

    });
    setStyle(timerBox, {
        ...defaultBoxStyle,

    });

    container.appendChild(infoBox);
    container.appendChild(scoreBox);
    container.appendChild(timerBox);


    // INFO BOX

    let title = document.createElement('h1');
    setStyle(title, {
        marginTop: '0',
        fontSize: '32px'
    });
    title.innerHTML = `Memory game`;

    let subtitle = document.createElement('p');
    subtitle.innerHTML = `Memory game`;

    infoBox.appendChild(title);
    infoBox.appendChild(subtitle);



    // SCORE

    let score = 0;

    let scoreTitle = document.createElement('h3');
    setStyle(scoreTitle, {
        marginTop: '5px'
    });

    scoreTitle.innerHTML = `Punteggio: <span id="score"></span>`;

    scoreBox.appendChild(scoreTitle);

    let scoreValueComponent = document.getElementById('score');

    function setScore(score) { scoreValueComponent.innerText = score.toString(); }
    setScore(0);

    function decrementScore() {
        setScore(--score);
    }

    function incrementScore() {
        setScore(++score);
    }



    let remainingCardsTitle = document.createElement('h4');
    setStyle(remainingCardsTitle, {
        marginTop: '5px',
        display: 'none'
    });

    remainingCardsTitle.innerHTML = `Carte restanti: <span id="remainingCards"></span>`;

    scoreBox.appendChild(remainingCardsTitle);

    let remainingCardsComponent = document.getElementById('remainingCards');

    function setRemainingCards(cardsNumber) {
        remainingCardsComponent.innerText = cardsNumber.toString();
        setStyle(remainingCardsTitle, { display: 'block' })
    }


    let scoreHandler = {
        score,
        incrementScore,
        decrementScore,
        setRemainingCards
    }



    // TIMER

    let timerTitle = document.createElement('h3');
    setStyle(timerTitle, {
        marginTop: '5px'
    });
    timerTitle.innerHTML = `Tempo:&nbsp;&nbsp;&nbsp;&nbsp;<span id="timer"></span>`;

    timerBox.appendChild(timerTitle);

    let timerValue = document.getElementById('timer');

    let time = 0;
    let timer;

    function setTime() { timerValue.innerText = time.toString(); }
    setTime(0);

    const startTimer = function () {

        time = 0;
        setTime();

        timer = setInterval(
            () => {
                time++;
                setTime();
            }, 1000);

    }

    const stopTimer = function () {

        clearInterval(timer);
    }

    let timerHandler = {
        time,
        startTimer,
        stopTimer
    }



    // LAST MATCH
    const showLastMatchBox = () => {

        let lastMatchBox = document.createElement('div');

        let lastGamesHeading = document.createElement('h3');
        setStyle(lastGamesHeading, {
            marginTop: '5px'
        });
        lastGamesHeading.innerHTML = `Partite recenti:`;
        lastMatchBox.appendChild(lastGamesHeading);

        let lastMatchContainer = document.createElement('div');
        setStyle(lastMatchContainer, {
            maxHeight: "150px",
            overflowY: 'scroll',
            paddingRight: '1em'
        });

        let unorderedList = document.createElement('ul');
        setStyle(unorderedList, {
            marginTop: '0',
            paddingLeft: '20px'
        });

        for(let match of lastMatches) {

            let playerDetailItem = document.createElement('li');
            playerDetailItem.innerHTML = `<b>Giocatore:</b> ${match.player}`;

            let matchDetailItem = document.createElement('ul');

            let pointsDetail = document.createElement('li');
            pointsDetail.innerHTML = `<b>Punti:</b>    ${match.points}`;

            let dateDetail = document.createElement('li');
            dateDetail.innerHTML = `<b>Data:</b>&nbsp;${new Date(match.date).toLocaleString('it', { dateStyle: "medium", timeStyle: "short" })}`;

            setStyle(matchDetailItem, {
                paddingLeft: '25px',
                marginBottom: '15px'
            });

            setStyle(pointsDetail, {
                fontSize: '13px'
            });
            setStyle(dateDetail, {
                fontSize: '13px'
            });
            matchDetailItem.appendChild(pointsDetail);
            matchDetailItem.appendChild(dateDetail);

            unorderedList.appendChild(playerDetailItem);
            unorderedList.appendChild(matchDetailItem);
        }

        lastMatchContainer.appendChild(unorderedList);

        lastMatchBox.appendChild(lastMatchContainer);

        setStyle(lastMatchBox, {
            ...defaultBoxStyle,

        });

        container.appendChild(lastMatchBox);
    }

    let lastMatches;
    lastMatches = getAllMatches();

    if(lastMatches) {
        showLastMatchBox();
    }

    return {
        scoreHandler,
        timerHandler
    };

}

const onLoadListener = () => {

    let container = document.getElementById('root');
    setStyle(document.body,{  backgroundImage: `url(${ tableBackgroundImage })` });

    setStyle(container, {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'scroll',
        fontFamily: 'MontSerrat'
    });


    let dashboard = document.createElement('div');

    container.appendChild(dashboard);

    let header = generateHeader(dashboard);









    let table = document.createElement('div');
    setStyle(table, {
        position: 'relative',
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: "stretch",
        margin: '25px 4vw',
        padding: '15px',
    });
    container.appendChild(table);


    let gameManager = new GameManager(table, header);

    gameManager.initTable(6);

};

window.addEventListener(
    'load',
    onLoadListener
);
