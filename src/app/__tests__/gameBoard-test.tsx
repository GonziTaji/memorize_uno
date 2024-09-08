import '@testing-library/jest-dom';
import GameBoard from '@/components/gameBoard';
import { screen, render } from '@testing-library/react';
import { MUImageData } from '../interfaces';

const images: MUImageData[] = [
    { uuid: '1', url: '/path/to/image1.png', title: '1', content_type: '' },
    { uuid: '2', url: '/path/to/image2.png', title: '2', content_type: '' },
    { uuid: '3', url: '/path/to/image3.png', title: '3', content_type: '' },
];
  

describe('GameBoard', () => {
    it('renders and displays the initial player name modal', () => {
        render(<GameBoard images={images} />);
    
        expect(screen.getByText(/Bienvenid@!/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ingresa tu nombre/i)).toBeInTheDocument();
    });
});

