// Use of prefix because ImageData interface is a web API interface
export interface MUImageData {
    url: string;
    uuid: string;
    title: string;
    content_type: string;
}

export interface Card {
    imageData: MUImageData,
    turnedOver: boolean,
    pairFound: boolean,
}
