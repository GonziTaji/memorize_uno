'use client'

import Image from "next/image";
import { MUImageData } from "@/app/interfaces";

interface GameBoardProps {
    images: MUImageData[]
}

export default function GameBoard({ images }: GameBoardProps) {
    const cardsCount = 6 * 3; // cols * rows
    const cards = [...images];
    let index: number;
    
    // remove extras
    while (cards.length > cardsCount / 2) {
        index = Math.floor(Math.random() * images.length + 1) -1; // + 1 - 1 to include 0
        cards.splice(index, 1);
        console.log('removed index: ' + index);
    }

    // add duplicates
    for (let i = cards.length -1; i >= 0; i--) {
        cards.push(cards[i]);
    }

    // scramble
    shuffle(cards);


    return <div className="grid grid-cols-6">
        {cards.map((image) =>
            // relative for image fill
            <div key={image.uuid} className="w-24 h-32 relative m-2 border border-gray-700">
                <Image
                    className="object-cover"
                    src={image.url}
                    alt={image.title}
                    priority
                    fill
                />
            </div>
        )}</div>
}

// Fisher–Yates Shuffle
function shuffle(array: any[]) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}