const path = require("path");
const fs = require("fs-extra");

const NUMBER_OF_PUFFIES_TO_GENERATE = 1000;

const FAKE_ATTRIBUTES = [
    {trait_type: "Background", value: "Pink"},
    {trait_type: "Color", value: "Blue"},
    {trait_type: "Face", value: "Doll"},
    {trait_type: "Hairstyle", value: "Original"},
    {trait_type: "Hat", value: "Sherpa"},
    {trait_type: "Tail", value: "Mouse"},
    {trait_type: "Accessory", value: "DiceRight"}
];

const AllPuffiesOutputFilePath =  path.resolve(__dirname, "../data/puffies.json");

const wholeData = [];
for (let tokenId = 0; tokenId < NUMBER_OF_PUFFIES_TO_GENERATE; tokenId++) {
    const puffyData = {
        external_url: "https://penguinfinance.org/",
        name: `PUFFY #${tokenId}`,
        description: `PUFFY #${tokenId}`,
        type: "ERC721",
        image: `${tokenId}.jpg`,
        tokenId: tokenId,
        attributes: FAKE_ATTRIBUTES
    };
    wholeData.push(puffyData);
}

fs.writeJsonSync(AllPuffiesOutputFilePath, wholeData);