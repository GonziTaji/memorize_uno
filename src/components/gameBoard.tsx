'use client'

import Image from "next/image";
import { Card, MUImageData } from "@/app/interfaces";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, Flex, Input, Modal, Space } from "antd";
import GameCard from "./gameCard";

interface GameBoardProps {
    images: MUImageData[]
}

const PLAYERNAME_KEY = 'playername';

export default function GameBoard({ images }: GameBoardProps) {
    const [hits, setHits] = useState(0);
    const [wrongs, setWrongs] = useState(0);
    const [canPlay, setCanPlay] = useState(true); // to avoid click handling when showing a wrong pair

    const [playerName, setPlayerName] = useLocalStorage(PLAYERNAME_KEY, '');
    const [newPlayerName, setNewPlayerName] = useState('');
    const [isPlayerNameModalOpen, setIsPlayerNameModalOpen] = useState(false);
    const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
    const [cards, setCards] = useState(getCardSetFromImages());

    useEffect(() => {
        // avoid hidration error doing this here instead of using default values
        setIsPlayerNameModalOpen(true);
        setNewPlayerName(playerName);
    }, []);

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
            console.log(newCards[turnedOverCardsIndex[0]].imageData, newCards[turnedOverCardsIndex[1]].imageData);
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
        if (!newPlayerName) {
            alert('Debes agregar un nombre para comenzar a jugar');
            return;
        }

        setPlayerName(newPlayerName);
        setIsPlayerNameModalOpen(false);
    }

    function playAgainOnClick() {
        setWrongs(0);
        setHits(0);
        setCards(getCardSetFromImages());
        setIsGameOverModalOpen(false);
    }

    function playerNameModalCancel() {
        if (!playerName) {
            alert('Debes agregar un nombre para comenzar a jugar');
            return;
        }

        setIsPlayerNameModalOpen(false);
    }

    function getCardCursor(card: Card) {
        if (canPlay && !card.pairFound && !card.turnedOver) {
            return 'cursor-pointer';
        }

        return '';
    }

    // supress because playername comes from localstorage
    const PlayerName = () => <span suppressHydrationWarning>{playerName}</span>;

    return (
        <div className="mt-10 w-fit mx-auto">
            <section>
                <p>Jugando: <PlayerName /></p>
                <Flex gap="middle" justify="center">
                    <span>Aciertos: {hits}</span>
                    <span>-</span>
                    <span>Equivocaciones: {wrongs}</span>
                </Flex>
            </section>

            <section className="grid grid-cols-3 md:grid-cols-6">
                {cards.map((card, i) =>
                    <GameCard key={i} canPlay={canPlay} card={card} cardOnClick={() => cardOnClick(i)} />
                )}
            </section>

            <Modal
                title="Memorize Uno!"
                open={isPlayerNameModalOpen}
                onCancel={playerNameModalCancel}
                footer={[
                    <Button key={0} type="primary" onClick={changeNameOnClick}>Continuar</Button>
                ]}
            >

                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <h1 className="text-xl">
                        Bienvenid@!
                    </h1>

                    <div className="block pt">
                        <label htmlFor="input_player_name">
                            Ingresa tu nombre
                        </label>
                        <Input name="input_player_name" type="text" value={newPlayerName} onInput={(ev) => setNewPlayerName(ev.currentTarget.value)} />
                    </div>
                </Space>
            </Modal>

            <Modal
                title="Fin del juego"
                open={isGameOverModalOpen}
                footer={[
                    <Button key={0} type="primary" onClick={playAgainOnClick}>Jugar de nuevo</Button>
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