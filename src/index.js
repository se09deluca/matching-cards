import GameManager, {CARD_POINTS, TIME_POINTS} from './GameManager';
import {
    colorPalette,
    createInput,
    createRadioInput,
    dashboardStyle,
    defaultBoxStyle, fontFamily,
    getAllMatches,
    setStyle,
    tableStyle
} from './utils';
import tableBackgroundImage from '../src/assets/images/table-bg.jpg';
import '../src/styles.css';

const onLoadListener = () => {

    setStyle(document.body,{ backgroundImage: `url(${ tableBackgroundImage })` });

    let container = document.getElementById('root');
    setStyle(container,{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        position: 'fixed', overflow: 'scroll', top: 0, left: 0, right: 0, bottom: 0,
        fontFamily
    });

    let gameFormContainer = document.createElement('div');
    setStyle(gameFormContainer, { ...defaultBoxStyle, width: '40vw', height: 'fit-content' });

    let startGameForm = document.createElement('form');
    startGameForm.onsubmit = function (ev) {
        ev.preventDefault();

        this.elements['level'].value
        let result = {};
        for(let element of [ 'username', 'cardsNumber', 'level' ]) {
            result[element] = this.elements[element].value;
        }

        let { username, cardsNumber, level } = result;

        startGame({ username, cardsNumber, level });
    };



    let title = document.createElement('h1');
    title.innerText = "Matching cards";

    let infoTitle = document.createElement('span');
    setStyle(infoTitle, { fontSize: '18px', fontWeight: 'bold' });
    infoTitle.innerText = "Istruzioni";

    let info = document.createElement('p');
    info.innerText = `Matching cards è un memory game in cui l'obiettivo è essere il più veloce possibile.\nScala la classifica grazie alla tua memoria visiva!\n\nOgni coppia di carte vale ${ CARD_POINTS } punti.\nSe scegli il livello difficile, guadagnerai più punti,ma avrai anche meno tempo! 😈😈`;

    let divider = document.createElement('hr');
    setStyle(divider, { borderColor: colorPalette.primary });
    let breakline = document.createElement('br');
    let breakline2 = document.createElement('br');
    setStyle(breakline2, { margin: '8px 0' });

    gameFormContainer.append(title, infoTitle, info, divider);

    // Form inputs
    let configSectionLabel = document.createElement('p');
    setStyle(configSectionLabel, { fontWeight: 'bold' });
    configSectionLabel.innerText = 'Configura la tua partita';


    // Field: username
    let usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for', 'cardsNumber');
    usernameLabel.innerText = "Nome giocatore: ";
    setStyle(usernameLabel, { marginRight: '12px' });
    let usernameField = createInput({ name: 'username', required: true });

    // Field: cards number
    let numCardsLabel = document.createElement('label');
    numCardsLabel.setAttribute('for', 'cardsNumber');
    numCardsLabel.innerText = "Numero di carte: ";
    setStyle(numCardsLabel, { marginRight: '12px' });
    let numCardsField = createInput({ name: 'cardsNumber', type: 'number', min: 2, max: 21, required: true });

    // Field: level select
    let levelRadioLabel = document.createElement('label');
    levelRadioLabel.setAttribute('for', 'level');
    levelRadioLabel.innerText = "Livello: ";
    setStyle(levelRadioLabel, { marginRight: '12px' });
    let levelRadios = createRadioInput({ name: 'level', type: 'radio', required: true }, [ 'EASY', 'NORMAL', 'HARD' ]);

    let levelRadioFieldCtr = document.createElement('div');
    setStyle(levelRadioFieldCtr, { display: 'flex', margin: '8px 0' });
    levelRadioFieldCtr.append(levelRadioLabel, ...levelRadios);

    // Submit button
    let submit = createInput({ type: 'submit', value: "INIZIA!" });




    startGameForm.append(
        configSectionLabel,
        usernameLabel, usernameField,
        breakline,
        numCardsLabel, numCardsField,
        breakline2,
        levelRadioFieldCtr,
        submit
    );


    gameFormContainer.appendChild(startGameForm);

    container.appendChild(gameFormContainer);

};

function startGame(gameConfig) {

    let container = document.getElementById('root');
    container.innerHTML = '';
    setStyle(container, { alignItems: 'inherit' });

    let dashboard = document.createElement('div');

    container.appendChild(dashboard);


    function generateHeader () {

        setStyle(dashboard, dashboardStyle);

        let infoBox = document.createElement('div');
        let scoreBox = document.createElement('div');
        let lastMatchBox = document.createElement('div');

        setStyle(infoBox, defaultBoxStyle);
        setStyle(scoreBox, defaultBoxStyle);
        setStyle(lastMatchBox, { display: 'flex' });

        dashboard.appendChild(infoBox);
        dashboard.appendChild(scoreBox);


        // INFO BOX

        let title = document.createElement('h2');
        setStyle(title, {
            marginTop: '0',
            fontSize: '28px'
        });
        title.innerHTML = `Ciao ${ gameConfig.username }!`;

        let subtitle = document.createElement('p');
        subtitle.innerHTML = `Benvenuto nel memory game, cerca di battere il record accoppiando tutte le carte nel minor tempo possibile!<br/>Il timer inizia al tocco della prima carta.<br/><br/>Buona fortuna!`;

        infoBox.appendChild(title);
        infoBox.appendChild(subtitle);



        // SCORE

        let score = 0;

        let scoreTitle = document.createElement('span');
        setStyle(scoreTitle, { fontSize: 18, fontWeight: 'bold', marginTop: '5px' });

        scoreTitle.innerHTML = `Punteggio: <span id="score"></span>`;

        scoreBox.appendChild(scoreTitle);

        let scoreValueComponent = document.getElementById('score');

        function setScore(score) { scoreValueComponent.innerText = score.toString(); }
        setScore(0);

        function incrementScore() { setScore(++score); }

        let remainingCardsTitle = document.createElement('span');
        setStyle(remainingCardsTitle, { float: 'right', display: 'none', fontSize: 18, fontWeight: 'bold', marginTop: '5px' });
        remainingCardsTitle.innerHTML = `Carte restanti: <span id="remainingCards"></span>`;

        scoreBox.append(remainingCardsTitle);

        let remainingCardsComponent = document.getElementById('remainingCards');
        function setRemainingCards(cardsNumber) {
            remainingCardsComponent.innerText = cardsNumber.toString();
            setStyle(remainingCardsTitle, { display: 'block' })
        }

        const scoreHandler = {
            score,
            incrementScore,
            setRemainingCards
        }


        let divider = document.createElement('hr');
        setStyle(divider, { borderColor: colorPalette.primary, margin: '10px 0px' });

        // TIMER

        let timerTitle = document.createElement('span');
        setStyle(timerTitle, { fontSize: '16px', marginTop: '5px' });
        timerTitle.innerHTML = `Tempo:&nbsp;&nbsp;&nbsp;&nbsp;<span id="timer"></span>`;

        scoreBox.append( divider, timerTitle);

        let timerValue = document.getElementById('timer');

        function setTime(remainingTime = 0) {
            timerValue.innerText = remainingTime.toString();
        }
        setTime();


        const timerHandler = {
            setTime
        }



        // LAST MATCH
        const generateLastMatchBox = () => {

            let lastMatchContent = document.createElement('div');
            setStyle(lastMatchContent, { ...defaultBoxStyle, flexDirection: 'column' });

            let lastGamesHeading = document.createElement('h3');
            setStyle(lastGamesHeading, { marginTop: '5px' });

            let lastMatchContainer = document.createElement('div');
            setStyle(lastMatchContainer, {
                overflowY: 'scroll',
                paddingRight: '1em'
            });

            let unorderedList = document.createElement('ul');
            setStyle(unorderedList, {
                marginTop: '0',
                paddingLeft: '20px'
            });


            let lastMatches;
            lastMatches = getAllMatches();

            if(lastMatches) {

                dashboard.appendChild(lastMatchBox);

                lastGamesHeading.innerHTML = `Partite recenti:`;
                lastMatchContent.appendChild(lastGamesHeading);

                for (let match of lastMatches) {

                    let playerDetailItem = document.createElement('li');
                    playerDetailItem.innerHTML = `<b>Giocatore:</b> ${match.player}`;

                    let matchDetailItem = document.createElement('ul');

                    let pointsDetail = document.createElement('li');
                    pointsDetail.innerHTML = `<b>Punti:</b>    ${match.points}`;

                    let dateDetail = document.createElement('li');
                    dateDetail.innerHTML = `<b>Data:</b>&nbsp;${new Date(match.date).toLocaleString('it', {
                        dateStyle: "medium",
                        timeStyle: "short"
                    })}`;

                    setStyle(matchDetailItem, {
                        paddingLeft: '25px',
                        marginBottom: '15px'
                    });

                    setStyle(pointsDetail, { fontSize: '13px' });
                    setStyle(dateDetail, { fontSize: '13px' });
                    matchDetailItem.append(pointsDetail, dateDetail);

                    unorderedList.append(playerDetailItem, matchDetailItem);
                }
            } else {
                let playerDetailItem = document.createElement('li');
                playerDetailItem.innerHTML = `Nessuna partita. Vinci la tua prima partita per entrare in classifica!`;
                unorderedList.append();
            }

            lastMatchContainer.appendChild(unorderedList);

            lastMatchContent.appendChild(lastMatchContainer);


            lastMatchBox.innerHTML = "";
            lastMatchBox.appendChild(lastMatchContent);
        }
        generateLastMatchBox();


        return {
            scoreHandler,
            timerHandler,
            generateLastMatchBox
        };

    }

    let header = generateHeader(dashboard);









    let table = document.createElement('div');
    setStyle(table, tableStyle);
    container.appendChild(table);


    let gameManager = new GameManager(table, header, gameConfig);

    gameManager.play();

}

window.addEventListener(
    'load',
    onLoadListener
);

window.addEventListener('restartGame', function () {
    let container = document.getElementById('root');
    container.innerHTML = '';
    dispatchEvent(new Event("load"));
});
