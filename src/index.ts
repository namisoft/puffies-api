import * as http from 'http';
import express from 'express';
import "reflect-metadata";
import {container} from "tsyringe";
import {AppConfig} from "./config/app-config";
import {ChainConfigAvaxTest} from "./config/chain-config-avax-test";
import {ChainConfigAvaxMain} from "./config/chain-config-avax-main";
import {ChainConfig} from "./config/chain-config";
import {CryptoPuffiesDataJson} from "./CryptoPuffiesDataJson";

const bodyParser = require('body-parser');

const Web3 = require('web3');

const argv = require('minimist')(process.argv.slice(2));


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

const app: express.Express = express();
const server: http.Server = new http.Server(app);
app.use(bodyParser.json());

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const dataCtrl = container.resolve(DataController);
app.get("/puffies/token-data/:id", dataCtrl.getTokenData);

server.listen(AppConfig.HttpPort);

server.on('error', (e: Error) => {
    console.log('Error starting HTTP server' + e);
});

server.on('listening', () => {
    console.log(`HTTP server started on port ${AppConfig.HttpPort} on env ${process.env.NODE_ENV || 'dev'}`);
});