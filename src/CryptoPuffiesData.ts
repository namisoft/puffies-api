export type PuffiesTokenMetadata = {
    tokenId: number;
    Background: string;
    Mouth: string;
    Eyes: string;
    imageIPFS: string;
}

export interface CryptoPuffiesData {
    getTokenData(tokenId: number): Promise<PuffiesTokenMetadata | undefined>;
}