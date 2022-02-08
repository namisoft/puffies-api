/**
 * Created by IntelliJ IDEA.
 * Author: @cryptoz
 * Date: 10/24/2021
 * Time: 10:00 AM
 */
import {injectable, singleton} from "tsyringe";

import express = require("express");
import {CryptoPuffiesService} from "./CryptoPuffiesService";

@singleton()
@injectable()
export class DataController {
    constructor(private puffiesService: CryptoPuffiesService) {
    }

    getTokenData = (req: express.Request, res: express.Response) => {
        console.log(`Request received: ${req.url}`);
        const tokenId = req.params.id;
        if (!tokenId || isNaN(Number(tokenId))) {
            res.status(400).send("Bad request");
            return;
        }
        this.puffiesService.getTokenData(Number(tokenId)).then(r => {
            if (r) {
                // return token data
                res.json(r)
            } else {
                // return empty data
                res.json({})
            }
        }).catch(e => {
            console.error(`Request ${req.url} failed: ${e.toString()}`);
            res.status(500).send("Server error");
        })
    };
}

namespace ReqBodyData {
    export interface SendEther {
        fromAddress: string;
        toAddress: string;
        amount: number;
    }
}
