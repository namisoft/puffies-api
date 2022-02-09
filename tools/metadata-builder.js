const path = require("path");
const fs = require("fs-extra");

const traitsFilePath = path.resolve(__dirname, "../data/traits.json");
const traitsData = fs.readJsonSync(traitsFilePath);
const outputData = [];
for(const it of traitsData) {
    const tokenId = it['tokenId'];
    const attributes = [
        { trait_type: "Background", value: it['Background']},
        { trait_type: "Color", value: it['Color']},
        { trait_type: "Face", value: it['Face']},
        { trait_type: "Hairstyle", value: it['Hairstyle']},
        { trait_type: "Hat", value: it['Hat']},
        { trait_type: "Tail", value: it['Tail']},
        { trait_type: "Accessory", value: it['Accessory']}
    ];
    outputData.push({
        external_url: "https://penguinfinance.org/",
        name: `Test Puffy #${tokenId}`,
        description: "TEST ONLY",
        type: "ERC721",
        image: `${tokenId}.jpg`,
        tokenId: tokenId,
        attributes: attributes
    })
}

const outputFilePath =  path.resolve(__dirname, "../data/puffies.json");
fs.writeJsonSync(outputFilePath, outputData);