// Use of prefix because ImageData interface is a web API interface
export interface MUImageData {
    url: string;
    uuid: string;
    title: string;
    content_type: string;
}

export interface CardData {
    imageData: MUImageData,
    turnedOver: boolean,
    pairFound: boolean,
}
