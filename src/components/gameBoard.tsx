'use client'

import Image from "next/image";
import { MUImageData } from "@/app/interfaces";
import { useState } from "react";

interface GameBoardProps {
    images: MUImageData[]
}

interface Card {
    imageData: MUImageData,
    turnedOver: boolean,
    pairFound: boolean,
}

export default function GameBoard({ images }: GameBoardProps) {
    const [hits, setHits] = useState(0);
    const [wrongs, setWrongs] = useState(0);
    const [canPlay, setCanPlay] = useState(true); // to avoid click handling when showing a wrong pair

    const [cards, setCards] = useState(() => {
        const cardsCount = 6 * 3; // cols * rows
        const cards: Card[] = images.map(img => ({
            imageData: img,
            turnedOver: false,
            pairFound: false
        }));
        let index: number;

        // remove extras
        while (cards.length > cardsCount / 2) {
            index = Math.floor(Math.random() * images.length);
            cards.splice(index, 1);
        }

        // add pairs
        for (let i = cards.length - 1; i >= 0; i--) {
            cards.push(cards[i]);
        }

        // scramble
        shuffleCards(cards);
        return cards;
    });
    
    console.log(cards);

    function cardOnClick(position: number) {
        if (cards[position].turnedOver) {
            console.log('Already turned over. Ignoring selection');
            return;
        }
        
        if (!canPlay) {
            console.log('Cannot play. Ignoring selection');
            return;
        }

        const turnedOverCardsIndex = []
        const newCards: Card[] = [];

        for (let i = 0; i < cards.length; i++) {
            const card = {...cards[i]};
            
            if (i === position) {
                card.turnedOver = true;
            }

            if (card.turnedOver && !card.pairFound) {
                turnedOverCardsIndex.push(i);
            }
            
            newCards.push(card);
        }

        if (turnedOverCardsIndex.length === 2) {
            // check equality
            if (newCards[turnedOverCardsIndex[0]].imageData.uuid === newCards[turnedOverCardsIndex[1]].imageData.uuid) {
                newCards[turnedOverCardsIndex[0]].pairFound = true;
                newCards[turnedOverCardsIndex[1]].pairFound = true;
                
                setHits(hits+1);
            } else {
                setWrongs(wrongs+1);
                setCanPlay(false);

                setTimeout(() => {
                    setCards(newCards.map(c => ({
                        ...c,
                        turnedOver: c.pairFound ? true : false
                    })));
                    
                    setCanPlay(true);
                }, 700);
            }
        }

        setCards(newCards);
    }

    return (
        <div>
            <div className="flex justify-center gap-4">
                <div>Aciertos: {hits}</div>
                <div>-</div>
                <div>Errores: {wrongs}</div>
            </div>

            <div className="grid grid-cols-6">
                {cards.map(({ imageData, turnedOver, pairFound }, i) =>
                    <div
                        key={i}
                        // relative for image fill
                        className="w-24 h-32 relative m-2 border border-gray-700 flex justify-center items-center bg-gray-100"
                        onClick={() => cardOnClick(i)}
                    >
                        {turnedOver
                            ? <Image
                                className="object-cover"
                                src={imageData.url}
                                alt={imageData.title}
                                priority
                                fill
                            />
                            : pairFound
                            ? <div></div>
                            : <div className="text-7xl">?</div>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

// Fisher–Yates (Knuth) Shuffle
function shuffleCards(array: Card[]) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}