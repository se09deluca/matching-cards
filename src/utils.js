import cardImage0 from "../src/assets/images/card-0.jpg";
import cardImage1 from "../src/assets/images/card-1.jpg";
import cardImage2 from "../src/assets/images/card-2.jpg";
import cardImage3 from "../src/assets/images/card-3.jpg";
import cardImage4 from "../src/assets/images/card-4.jpg";
import cardImage5 from "../src/assets/images/card-5.jpg";
import cardImage6 from "../src/assets/images/card-6.jpg";
import cardImage7 from "../src/assets/images/card-7.jpg";
import cardImage8 from "../src/assets/images/card-8.jpg";
import cardImage9 from "../src/assets/images/card-9.jpg";
import cardImage10 from "../src/assets/images/card-10.jpg";
import cardImage11 from "../src/assets/images/card-11.jpg";
import cardImage12 from "../src/assets/images/card-12.jpg";
import cardImage13 from "../src/assets/images/card-13.jpg";
import cardImage14 from "../src/assets/images/card-14.jpg";
import cardImage15 from "../src/assets/images/card-15.jpg";
import cardImage16 from "../src/assets/images/card-16.jpg";
import cardImage17 from "../src/assets/images/card-17.jpg";
import cardImage18 from "../src/assets/images/card-18.jpg";
import cardImage19 from "../src/assets/images/card-19.jpg";
import cardImage20 from "../src/assets/images/card-20.jpg";

const imageDictionary = {
    "card-0": cardImage0,
    "card-1": cardImage1,
    "card-2": cardImage2,
    "card-3": cardImage3,
    "card-4": cardImage4,
    "card-5": cardImage5,
    "card-6": cardImage6,
    "card-7": cardImage7,
    "card-8": cardImage8,
    "card-9": cardImage9,
    "card-10": cardImage10,
    "card-11": cardImage11,
    "card-12": cardImage12,
    "card-13": cardImage13,
    "card-14": cardImage14,
    "card-15": cardImage15,
    "card-16": cardImage16,
    "card-17": cardImage17,
    "card-18": cardImage18,
    "card-19": cardImage19,
    "card-20": cardImage20
};

const imageIndexes = Array(Object.keys(imageDictionary).length).fill(0).map((a, i) => a + i);

const colorPalette = {
    primary: '#7230b3',
    accent: '#ca04ca',
    light: '#f3d6ff',
    lighter: '#d3d3d3'
}

const fontFamily = 'Rubik';

const setStyle = (elem, style) => {
    for(let property in style) {
        elem.style[property] = style[property];
    }
};

const defaultBoxStyle = {
    padding: '20px',
    marginBottom: '20px',
    background: 'linear-gradient(rgb(193, 203, 212), rgb(119, 128, 136)) repeat-x rgb(108, 117, 125)',
    border: "2px solid rebeccapurple",
    borderRadius: '10px',
    boxShadow: '#000000ab 0px 3px 6px 1px',
    width: '30vw'
};

const defaultInputStyle = {
    height: '24px',
    width: '150px',
    fontSize: '16px',
    backgroundColor: colorPalette.lighter,
    borderColor: colorPalette.primary,
    borderRadius: '8px',
    margin: '4px 0 4px 0',

    outlineColor: colorPalette.accent
};

const defaultSubmitStyle = {
    height: '40px',
    width: '100px',
    float: 'right',
    backgroundColor: colorPalette.primary,
    outlineColor: colorPalette.primary,
    color: '#FFF'
};

const dashboardStyle = {
    display: 'flex',
    flexDirection: 'column',
    margin: '25px 4vw',
    padding: '20px'
};

const tableStyle = {
    position: 'relative',
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: "stretch",
    margin: '25px 4vw',
    padding: '15px',
};

const createInput = function (attributes) {
    // create element
    let field = document.createElement('input');
    let isSubmit = attributes.type && attributes.type === 'submit';
    // set attributes
    for(let qualifiedName in attributes) {
        field.setAttribute(qualifiedName, attributes[qualifiedName])
    }
    setStyle(field, defaultInputStyle);

    if(isSubmit) {
        setStyle(field, defaultSubmitStyle);
        field.addEventListener('focus', function () { this.style.backgroundColor = colorPalette.accent; });
        field.addEventListener('blur', function () { this.style.backgroundColor = colorPalette.primary; });
        return field;
    }
    field.addEventListener('focus', function () { this.style.backgroundColor = colorPalette.light; });
    field.addEventListener('blur', function () { this.style.backgroundColor = colorPalette.lighter; });

    return field;
}

const createRadioInput = function (attributes, options) {

    let fields = [];
    for(let option of options) {
        let fieldContainer = document.createElement('div');
        let label = document.createElement('label');
        label.innerText = option;
        label.setAttribute('for', option);
        let radio = document.createElement('input');
        // set attributes
        for(let qualifiedName in attributes) {
            radio.setAttribute(qualifiedName, attributes[qualifiedName])
        }
        radio.setAttribute('id', option);
        radio.setAttribute('value', option);
        setStyle(radio, { height: '16px', width: '16px' });

        radio.addEventListener('focus', function () { this.style.backgroundColor = colorPalette.light; });
        radio.addEventListener('blur', function () { this.style.backgroundColor = colorPalette.lighter; });

        fieldContainer.append(radio, label);
        fields.push(fieldContainer);
    }

    return fields;
}

/**
 *
 * @returns {string}
 */
const getAllMatches = function () {

    let lastMatches = localStorage.getItem('LAST_MATCHES');

    if(lastMatches) {
        lastMatches = JSON.parse(lastMatches);
    }

    return lastMatches;
}

/**
 *
 * @param playerName
 * @param points
 */
const saveMatch = function (playerName, points) {

    let match = {
        date: Date.now(),
        player: playerName,
        points: points
    }
    let lastMatches = [];

    if(localStorage.getItem('LAST_MATCHES') !== null) {
        lastMatches = JSON.parse(localStorage.getItem('LAST_MATCHES'));
    }
    localStorage.setItem('LAST_MATCHES', JSON.stringify([ match, ...lastMatches ]));
}

/**
 *
 * @param array
 * @returns {*}
 */
const shuffle = function (array) {
    let m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

const takeNRandom = function (arr, num) {
    // create a clone of the array so we do not modify the original
    let clone = arr.slice(0);
    let result = [];

    for (let i = 0; i < Math.min(num, clone.length); i++) {
        let random = Math.floor(Math.random() * clone.length);
        // splice value at "num"
        // this returns an array with 1 item so we take its first value
        // this modifies the array so the value no longer exists in it
        // so we do not have to worry about picking it again
        let item = clone.splice(random, 1)[0];

        // then push it to the result array
        result.push(item);
    }

    return result;
}

export {
    imageDictionary,
    imageIndexes,
    colorPalette,
    fontFamily,
    defaultBoxStyle,
    defaultInputStyle,
    defaultSubmitStyle,
    dashboardStyle,
    tableStyle,
    setStyle,
    createInput,
    createRadioInput,
    getAllMatches,
    saveMatch,
    shuffle,
    takeNRandom
}
