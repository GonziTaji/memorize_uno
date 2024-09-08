import Image from "next/image";
import { Card } from "@/app/interfaces";

interface GameCardProps {
    cardOnClick: () => void
    canPlay: boolean;
    card: Card;
}

export default function GameCard({ canPlay, card, cardOnClick }: GameCardProps) {
    function getCardCursor(card: Card) {
        if (canPlay && !card.pairFound && !card.turnedOver) {
            return 'cursor-pointer';
        }

        return '';
    }


    return (
        <div
            // relative for image fill
            className={`
                relative w-14 h-20 md:w-24 md:h-32 m-2 
                border border-gray-700 bg-violet-100
                flex justify-center items-center
                ${getCardCursor(card)}`}
            onClick={cardOnClick}
        >
            {card.turnedOver
                ? <Image
                    className="object-cover"
                    style={{ visibility: card.turnedOver ? 'visible' : 'hidden'}}
                    src={card.imageData.url}
                    alt={card.imageData.title}
                    fill
                />
                : <div className="text-3xl md:text-7xl" style={{ visibility: card.turnedOver ? 'hidden': 'visible' }}>
                    ?
                </div>
            }
        </div>
    );
}