import GameBoard from '@/components/gameBoard';
import { MUImageData } from './interfaces';

export default async function Home() {
    const imagesResponse = await fetch("https://challenge-uno.vercel.app/api/images");
    const imageData: MUImageData[] = await imagesResponse.json();

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <GameBoard images={imageData} />
            </main>
        </div>
    );
}
