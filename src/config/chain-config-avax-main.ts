import {ChainConfig} from "./chain-config";
import {ABIs} from "./contracts";

export const ChainConfigAvaxMain: ChainConfig = {
    chainId: 43114,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    symbol: "AVAX",
    explorerUrl: "https://cchain.explorer.avax.network",
    CryptoPuffies: {
        address: "0x3cc3717Ce6C3A76D8032c54aC16924Cb338884e4",
        abi: ABIs.CryptoPuffies,
    },
}