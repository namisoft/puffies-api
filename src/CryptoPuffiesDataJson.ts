import {CryptoPuffiesData, PuffiesTokenMetadata} from "./CryptoPuffiesData";
import path from "path";
import fs from "fs-extra";

const DataFileName = path.resolve(__dirname, "../data", "puffies-metadata.json")

export class CryptoPuffiesDataJson implements CryptoPuffiesData{
    private readonly metadata: PuffiesTokenMetadata[];

    constructor() {
        this.metadata = fs.readJsonSync(DataFileName);
    }

    getTokenData(tokenId: number): Promise<PuffiesTokenMetadata | undefined> {
        const tokenData = this.metadata.find(p => p.tokenId === tokenId);
        return Promise.resolve(tokenData);
    }
}