import {ChainConfig} from "./chain-config";
import {ABIs} from "./contracts";

export const ChainConfigAvaxTest: ChainConfig = {
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    symbol: "AVAX",
    explorerUrl: "https://cchain.explorer.avax.network",
    CryptoPuffies: {
        address: "0xd9145CCE52D386f254917e481eB44e9943F39138",
        abi: ABIs.CryptoPuffies,
    },
}