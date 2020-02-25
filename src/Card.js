import backCard from './assets/images/back-card.jpg'
import backCardChecked from './assets/images/back-card-checked.jpg'
import { setStyle } from './utils'

const FRONT_FACE = 'FRONT_FACE';
const BACK_FACE = 'BACK_FACE';

function Card (name, image, side, ctx) {

    let cardSide = side;
    let cardName = name;
    let visibleFace = BACK_FACE;
    let card, cardInner, front, back, frontCardImage, backCardImage;


    this.getSide = () => cardSide;
    this.getName = () => cardName;
    this.getVisibleFace = () => visibleFace;

    let frontImage = image;
    let backImage = backCard;

    this.toggleCard = () => {
        cardInner.classList.toggle("flip");
    }

    this.setMatched = function () {
        // Add fade out transition effect
        cardInner.classList.add('fade-out');
        setTimeout(function () {
            // Hide card after fade out effect (1sec)
            setStyle(cardInner, { display: 'none' });
        }, 1000);
    };

    (() => {

        card = document.createElement('div');
        card.classList.add('flip-box');

        cardInner = document.createElement('div');
        cardInner.classList.add('flip-box-inner');

        front = document.createElement('div');
        front.classList.add('flip-box-front');

        frontCardImage = document.createElement('img');
        frontCardImage.src = frontImage;
        frontCardImage.alt = 'frontImage';
        frontCardImage.height = 245;
        frontCardImage.back = 165;
        frontCardImage.style.borderRadius = '7px';
        frontCardImage.style.boxShadow = '0 1px 6px 0 #000000d4';
        front.appendChild(frontCardImage);

        back = document.createElement('div');
        back.classList.add('flip-box-back');

        backCardImage = document.createElement('img');
        backCardImage.src = backImage;
        backCardImage.alt = 'backCardImage';
        backCardImage.height = 245;
        backCardImage.back = 165;
        backCardImage.style.borderRadius = '7px';
        backCardImage.style.boxShadow = '0 1px 6px 0 #000000d4';
        back.appendChild(backCardImage);

        card.appendChild(cardInner);
        cardInner.appendChild(back);
        cardInner.appendChild(front);

        card.addEventListener(
            'click',
            () => ctx.selectCard(this)
        );

    })();


    this.attach = (parentNode) => {
        parentNode.appendChild(card);
    }
    this.detach = () => {
        card.parentNode.removeChild(card);
    }

}

Card.prototype.setStyle = setStyle;

export default Card;
