import {ChainConfig} from "./chain-config";
import {ABIs} from "./contracts";

export const ChainConfigAvaxMain: ChainConfig = {
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    symbol: "AVAX",
    explorerUrl: "https://cchain.explorer.avax.network",
    CryptoPuffies: {
        address: "0xaF7CB6Bf00ea3457965CB05dbA034C762d6492A0",
        abi: ABIs.CryptoPuffies,
    },
}