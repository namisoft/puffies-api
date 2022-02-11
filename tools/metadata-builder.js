const path = require("path");
const fs = require("fs-extra");

const TraitsInputFilePath = path.resolve(__dirname, "../data/traits.json");
const AllPuffiesOutputFilePath =  path.resolve(__dirname, "../data/puffies.json");
const singlePuffyOutputFilePath = (tokenId) => path.resolve(__dirname, `../data/puffies/${tokenId}.json`);

const traitsData = fs.readJsonSync(TraitsInputFilePath);
const wholeData = [];
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
    const puffyData = {
        external_url: "https://penguinfinance.org/",
        name: `PUFFY #${tokenId}`,
        description: `PUFFY #${tokenId}`,
        type: "ERC721",
        image: `${tokenId}.jpg`,
        tokenId: tokenId,
        attributes: attributes
    };
    wholeData.push(puffyData);
    fs.writeJsonSync(singlePuffyOutputFilePath(tokenId), puffyData);
}

fs.writeJsonSync(AllPuffiesOutputFilePath, wholeData);