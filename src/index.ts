import * as http from 'http';
import express from 'express';
import "reflect-metadata";
import {container} from "tsyringe";
import {AppConfig} from "./config/app-config";
import {ChainConfigAvaxTest} from "./config/chain-config-avax-test";
import {ChainConfigAvaxMain} from "./config/chain-config-avax-main";
import {ChainConfig} from "./config/chain-config";
import {CryptoPuffiesDataJson} from "./CryptoPuffiesDataJson";
import {TokenTracker} from "./TokenTracker";

const bodyParser = require('body-parser');

const Web3 = require('web3');

const argv = require('minimist')(process.argv.slice(2));

// read maxMintedTokenId from commandline
let maxMintedTokenId = -1;
if(argv['maxMintedTokenId']){
    maxMintedTokenId = Number(argv['maxMintedTokenId']);
    if(isNaN(maxMintedTokenId)){
        console.error(`Invalid maxMintedTokenId: ${maxMintedTokenId}`);
        process.exit(1);
    }
}
TokenTracker.maxMintedId = maxMintedTokenId;

// Chain config mapping
const ChainConfigMap: { [cfgName: string]: ChainConfig } = {
    avaxmain: ChainConfigAvaxMain,
    avaxtest: ChainConfigAvaxTest,
};

let networkId = "avaxtest";
if (argv['network']) {
    networkId = argv['network'];
}

// Register components
const chainConfig = ChainConfigMap[networkId];
container.register("ChainConfig", {useValue: chainConfig});
container.register("CryptoPuffiesData", {useClass: CryptoPuffiesDataJson});
container.registerInstance("Web3", new Web3(chainConfig.rpcUrl));

// Setup and spin-up a HTTP server -----------------------------------------------------------
import {DataController} from "./DataController";
import path from "path";
import {CryptoPuffiesService} from "./CryptoPuffiesService";

const app: express.Express = express();
const server: http.Server = new http.Server(app);
app.use(bodyParser.json());

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


// image filtering: only returning image for minted token
const filterImages = (urlPath) => {
    app.use(urlPath, (req, res, next) => {
        const fileName = path.basename(req.originalUrl);
        const fileExt = path.extname(req.originalUrl);
        // extract tokenID from file name: 5.jpg <--> tokenId = 5
        const tokenId = Number(path.basename(fileName, fileExt));
        if (isNaN(tokenId) || tokenId < 0) {
            res
                .status(404)
                .setHeader("Cache-Control", "no-cache")
                .setHeader("max-age", 0)
                .send("Not found");
            return;
        }
        if (tokenId <= TokenTracker.maxMintedId) {
            next()
        } else {
            res
                .status(404)
                .setHeader("Cache-Control", "no-cache")
                .setHeader("max-age", 0)
                .send("Not found");
        }
    });
}


// serve standard images
filterImages('/images/:file');
app.use('/images', express.static(path.join(__dirname, ".././public/images"), {
/*    setHeaders: (res => {
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("max-age", 0);
    })*/
}));
// serve non-background images (for hatching animation)
filterImages('/hatch-images/:file');
app.use('/hatch-images', express.static(path.join(__dirname, ".././public/hatch-images")));


// start sync data routine
container.resolve(CryptoPuffiesService).syncData();

const dataCtrl = container.resolve(DataController);
app.get("/api/token-data/:id", dataCtrl.getTokenData);

server.listen(AppConfig.HttpPort);

server.on('error', (e: Error) => {
    console.log('Error starting HTTP server' + e);
});

server.on('listening', () => {
    console.log(`HTTP server started on port ${AppConfig.HttpPort} on env ${process.env.NODE_ENV || 'dev'}`);
});