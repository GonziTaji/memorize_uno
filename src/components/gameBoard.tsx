'use client'

import Image from "next/image";
import { MUImageData } from "@/app/interfaces";
import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

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

    const [storedPlayerName, setStoredPlayerName] = useLocalStorage('playername', '');
    const [playerName, setPlayerName] = useState(storedPlayerName);

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
            const card = { ...cards[i] };

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

                setHits(hits + 1);
            } else {
                setWrongs(wrongs + 1);
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

    function changeNameOnClick() {
        setStoredPlayerName(playerName);
        setPlayerName(playerName);
    }

    function getCardCursor(card: Card) {
        if (canPlay && !card.pairFound && !card.turnedOver) {
            return 'cursor-pointer';
        }

        return '';
    }

    return (
        <div className="pt-10 w-fit mx-auto">
            <section className="flex justify-center gap-4">
                <div>Aciertos: {hits}</div>
                <div>-</div>
                <div>Errores: {wrongs}</div>
            </section>

            <section className="grid grid-cols-3 md:grid-cols-6">
                {cards.map((card, i) =>
                    <div
                        key={i}
                        // relative for image fill
                        className={`
                            relative w-14 h-20 md:w-24 md:h-32 m-2 
                            border border-gray-700 bg-violet-100
                            flex justify-center items-center
                            ${getCardCursor(card)}`}
                        onClick={() => cardOnClick(i)}
                    >
                        {card.turnedOver
                            ? <Image
                                className="object-cover"
                                src={card.imageData.url}
                                alt={card.imageData.title}
                                fill
                            />
                            : <div className="text-3xl md:text-7xl">?</div>
                        }
                    </div>
                )}
            </section>

            <div id="modal_username" className="modal_overlay">
                <div className="modal">
                    <h1 className="text-xl">
                        Bienvenid@ {storedPlayerName || 'Invitado'}!
                    </h1>

                    <div className="block">
                        <label htmlFor="input_player_name">
                            {storedPlayerName ? 'Ingresa tu nombre' : 'Cambiar de nombre'}
                        </label>
                        <input
                            id="input_player_name"
                            type="text"
                            className="border-b border-gray-700 text-center md:text-right w-32"
                            value={playerName}
                            onInput={(ev) => setPlayerName(ev.currentTarget.value)} />
                        <button
                            type="button"
                            className="rounded-md bg-cyan-500 text-white font-bold px-4 py-2"
                            onClick={changeNameOnClick}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
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