export interface ChainConfig {
    readonly chainId: number,
    readonly rpcUrl: string,
    readonly symbol: string,
    readonly explorerUrl: string,
    readonly CryptoPuffies: {
        readonly address: string,
        readonly abi: any[]
    },
}