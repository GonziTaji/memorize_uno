import GameBoard from '@/components/gameBoard';
import { MUImageData } from './interfaces';

export default async function Home() {
    const imagesResponse = await fetch("https://challenge-uno.vercel.app/api/images");
    const imageData: MUImageData[] = await imagesResponse.json();

    return (
        <main className="flex items-center justify-center h-screen">
            <GameBoard images={imageData} />
        </main>
    );
}
