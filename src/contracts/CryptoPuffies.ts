import {ContractBase} from "../common/contract-base";

export class CryptoPuffies extends ContractBase {
    readonly ownerOf = (tokenId: number) =>
        new Promise<string | null>(resolve => {
            this.underlyingContract.methods["ownerOf"](tokenId)
                .call({})
                .then(r => {
                    resolve(r["0"].valueOf() as string)
                })
                .catch(_ => {
                    resolve(null)
                })
        });

    readonly totalSupply = () => new Promise<number>(resolve => {
        this.underlyingContract.methods["totalSupply"]()
            .call({})
            .then(r => {
                resolve(r.valueOf() as number)
            })
            .catch(_ => {
                resolve(0)
            })
    });
}