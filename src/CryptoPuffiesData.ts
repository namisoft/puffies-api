export type PuffiesTokenMetadata = {
    tokenId: number;
    external_url: string;
    name: string;
    description: string;
    type: string;
    image: string;
    attributes: any[]
}

export interface CryptoPuffiesData {
    getTokenData(tokenId: number): Promise<PuffiesTokenMetadata | undefined>;
}