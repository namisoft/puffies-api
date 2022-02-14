import {ChainConfig} from "./chain-config";
import {ABIs} from "./contracts";

export const ChainConfigAvaxMain: ChainConfig = {
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    symbol: "AVAX",
    explorerUrl: "https://cchain.explorer.avax.network",
    CryptoPuffies: {
        address: "0x6efd0C1936349CA2514BB5e3a13db65A5B4E36C8",
        abi: ABIs.CryptoPuffies,
    },
}