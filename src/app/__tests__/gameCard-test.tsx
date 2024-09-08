import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import GameCard from '@/components/gameCard';
import { CardData } from '../interfaces';
  
const card: CardData = {
    imageData: { content_type: '', title: 'imagedata', url: '', uuid: '' },
    pairFound: false,
    turnedOver: false,
}

describe('GameBoard', () => {
    it('it shows the card facing', () => {
        render(<GameCard canPlay={true} card={card} cardOnClick={() => {}} />);

        expect(screen.getByText(/\?/i)).toBeInTheDocument();
    });
    
    it('shows the image when turned over', () => {
        card.turnedOver = true;
        render(<GameCard canPlay={true} card={card} cardOnClick={() => {}} />);

        expect(screen.getByTitle('imagedata')).toBeInTheDocument();
    })
});

