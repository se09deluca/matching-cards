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

export const imageDictionary = {
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
    "card-20": cardImage20,
};

export const setStyle = (elem, style) => {
    for(let property in style) {
        elem.style[property] = style[property];
    }
};

/**
 *
 * @returns {string}
 */
export const getAllMatches = () => {

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
export const saveMatch = (playerName, points) => {

    let match = {
        date: Date.now(),
        player: playerName,
        points: points
    }

    let lastMatches = [];

    if(localStorage.getItem('LAST_MATCHES') !== null) {
        lastMatches = JSON.parse(localStorage.getItem('LAST_MATCHES'));
    }

    return localStorage.setItem('LAST_MATCHES', JSON.stringify([ match, ...lastMatches ]));
}

/**
 *
 * @param array
 * @returns {*}
 */
export const shuffle = (array) => {
    var m = array.length, t, i;

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


