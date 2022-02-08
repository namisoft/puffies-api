import {inject, singleton} from "tsyringe";
import {CryptoPuffies} from "./contracts/CryptoPuffies";
import {ChainConfig} from "./config/chain-config";
import {CryptoPuffiesData} from "./CryptoPuffiesData";

const BLACK_HOLE = "0x0000000000000000000000000000000000000000";

@singleton()
export class CryptoPuffiesService {
    private readonly cryptoPuffiesContract: CryptoPuffies;

    constructor(@inject("ChainConfig") private chainConfig: ChainConfig,
                @inject("CryptoPuffiesData") private cryptoPuffiesData: CryptoPuffiesData) {
        this.cryptoPuffiesContract = new CryptoPuffies(this.chainConfig.CryptoPuffies);
    }

    async tokenExists(tokenId: number) {
        const owner = await this.cryptoPuffiesContract.ownerOf(tokenId);
        return (owner && owner !== BLACK_HOLE)
    }

    async getTokenData(tokenId: number) {
        const tokenData = await this.cryptoPuffiesData.getTokenData(tokenId);
        if (!tokenData) {
            // token not found in database
            console.log(`Token #${tokenId} not found in database`);
            return null;
        }
        const tokenMinted = await this.tokenExists(tokenId);
        if (tokenMinted) {
            // return token data
            return tokenData;
        } else {
            // not return (or return some parts of data?)
            console.log(`Token #${tokenId} not minted yet`);
            return null;
        }
    }
}