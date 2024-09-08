import Image from "next/image";
import { CardData } from "@/app/interfaces";

interface GameCardProps {
    cardOnClick: () => void
    canPlay: boolean;
    card: CardData;
}

export default function GameCard({ canPlay, card, cardOnClick }: GameCardProps) {
    function getCardCursor(card: CardData) {
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
                border-2 border-gray-700 rounded-md bg-violet-100
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
