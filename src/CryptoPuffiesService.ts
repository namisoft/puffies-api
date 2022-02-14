import {inject, singleton} from "tsyringe";
import {CryptoPuffies} from "./contracts/CryptoPuffies";
import {ChainConfig} from "./config/chain-config";
import {CryptoPuffiesData} from "./CryptoPuffiesData";
import {TokenTracker} from "./TokenTracker";
import {AppConfig} from "./config/app-config";
import {SequentialTaskQueue} from "sequential-task-queue";

const BLACK_HOLE = "0x0000000000000000000000000000000000000000";

@singleton()
export class CryptoPuffiesService {
    private readonly cryptoPuffiesContract: CryptoPuffies;
    private synDataTimer: NodeJS.Timer = null;
    private readonly syncDataTaskQueue = new SequentialTaskQueue();

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

        // construct token image URL
        tokenData.image = `${AppConfig.PuffiesImages.RootUrl}/${tokenId}${AppConfig.PuffiesImages.FileExt}`;

        /*  if (tokenId <= TokenTracker.maxMintedId) {
              // token already minted
              return tokenData;
          } else {
              // check if token exists in the contract
              const tokenMinted = await this.tokenExists(tokenId);
              if (tokenMinted) {
                  // update tracker
                  TokenTracker.maxMintedId = tokenId;
                  // return token data
                  return tokenData;
              } else {
                  // not return (or return some parts of data?)
                  console.log(`Token #${tokenId} not minted yet`);
                  return null;
              }
          }*/

        return (tokenId <= TokenTracker.maxMintedId ? tokenData : null)
    }

    syncData() {
        if (this.synDataTimer) {
            // sync already running
            return;
        }
        this.synDataTimer = setInterval(
            () => {
                return this.syncDataTaskQueue.push(() => {
                    return this._syncDataRoutine().then().catch()
                })
            },
            500
        );
    }

    private async _syncDataRoutine() {
        const totalMintedTokens = await this.cryptoPuffiesContract.totalSupply();
        if (totalMintedTokens - 1 > TokenTracker.maxMintedId) {
            TokenTracker.maxMintedId = totalMintedTokens - 1;
            console.log(`Max minted tokenId synced: ${TokenTracker.maxMintedId}`)
        }
    }
}