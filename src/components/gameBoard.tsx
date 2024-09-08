'use client'

import Image from "next/image";
import { MUImageData } from "@/app/interfaces";
import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Flex, Input, Modal, Space } from "antd";

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
    const [isPlayerNameModalOpen, setIsPlayerNameModalOpen] = useState(false);
    const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(true);

    const [cards, setCards] = useState(getCardSetFromImages());

    function getCardSetFromImages() {
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
    }

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

                if (newCards.filter(c => c.pairFound).length === newCards.length) {
                    setIsGameOverModalOpen(true);
                }
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
        setIsPlayerNameModalOpen(false);
    }

    function playAgainOnClick() {
        setWrongs(0);
        setHits(0);
        setCards(getCardSetFromImages());
        setIsGameOverModalOpen(false);
    }
    
    function getCardCursor(card: Card) {
        if (canPlay && !card.pairFound && !card.turnedOver) {
            return 'cursor-pointer';
        }

        return '';
    }
    
    return (
        <div className="pt-10 w-fit mx-auto">
            <section>
                <Flex gap="middle" justify="center">
                    <span>Aciertos: {hits}</span>
                    <span>-</span>
                    <span>Equivocaciones: {wrongs}</span>
                </Flex>
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

            <Modal
                title="Memorize Uno!"
                open={isPlayerNameModalOpen}
                footer={[
                    <Button type="primary" onClick={changeNameOnClick}>Continuar</Button>
                ]}
            >

                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <h1 className="text-xl">
                        Bienvenid@ {storedPlayerName || 'Invitado'}!
                    </h1>

                    <div className="block pt">
                        <label htmlFor="input_player_name">
                            {storedPlayerName ? 'Cambiar de nombre' : 'Ingresa tu nombre'}
                        </label>
                        <Input name="input_player_name" type="text" value={playerName} onInput={(ev) => setPlayerName(ev.currentTarget.value)} />
                    </div>
                </Space>
            </Modal>
            
            <Modal
                title="Fin del juego"
                open={isGameOverModalOpen}
                footer={[
                    <Button type="primary" onClick={playAgainOnClick}>Jugar de nuevo</Button>
                ]}
            >
                <Space direction="vertical">
                    <p>
                        Has ganado, {playerName}!
                    </p>
                    <p>
                        Juntaste todos los pares con solo {wrongs} equivocaciones.
                    </p>
                </Space>
                </Modal>
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