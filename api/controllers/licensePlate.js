const getGoogleVisionText = require("../services/googleVision");

const getLicensePlate = async (req, res) => {
    const imgUrl = req.query.imgUrl;
    const imgTextRaw = await getGoogleVisionText(imgUrl);
    const isolatedText = imgTextRaw.responses[0].textAnnotations[0].description;
    const isoTextSpaces = isolatedText.replace(/\n/g, " ");
    const regex =
        /\b([A-Z]{2}\d{2}[\s\n]?[A-Z]{3}|\d{1,3}[\s\n]?[A-Z]{3}|\d{1,3}[A-Z]{1,3}[A-Z]?)\b/gm;

    const licensePlates = isoTextSpaces.match(regex);
    if (licensePlates.length === 0) {
        return res.status(404);
    } else if (licensePlates.length === 1) {
        return res.status(201).json({ licensePlates: licensePlates[0] });
    } else {
        const validPlates = [];
        for (let plate of licensePlates) {
            if (plate.length === 7 || plate.length === 8) {
                validPlates.push(plate);
            }
        }
        return res.status(201).json({ licensePlates: validPlates });
    }
};

const imgArray = [
    "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
    "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
    "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
    "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
    "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
    "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
];

const processImgText = (imgText) => {
    const isolatedText = imgText.responses[0].textAnnotations[0].description;
    const isoTextSpaces = isolatedText.replace(/\n/g, " ");
    const regex =
        /\b([A-Z]{2}\d{2}[\s\n]?[A-Z]{3}|\d{1,3}[\s\n]?[A-Z]{3}|\d{1,3}[A-Z]{1,3}[A-Z]?)\b/gm;
    const licensePlates = isoTextSpaces.match(regex);
    if (licensePlates.length === 0) {
        return;
    } else if (licensePlates.length === 1) {
        return licensePlates[0];
    } else {
        const validPlates = [];
        for (let plate of licensePlates) {
            if (plate.length === 7 || plate.length === 8) {
                validPlates.push(plate);
            }
        }
        return validPlates;
    }
};

// const getLicensePlateBetter = async (imgArray) => {
//     const imgUrlArray = imgArray;
//     const outputPlates = [];
//     // (imgUrlArray.map((async (url) => await getGoogleVisionText(url)).map((rawText) => processImgText(rawText)))

//     const licensePlates = await Promise.all(
//         imgUrlArray.map(async (url) => await getGoogleVisionText(url))
//     );

//     licensePlates.forEach((imgText) =>
//         outputPlates.push(processImgText(imgText))
//     );
//     console.log("clean: ", outputPlates.flat());

//     // );
//     // const licensePlates = [];
//     // imgUrlArray.forEach((url) => {
//     //     // eslint-disable-next-line promise/catch-or-return
//     //     getGoogleVisionText(url).then((plate) => licensePlates.push(plate));
//     // });
//     // console.log("license plates: ", licensePlates);
//     // .map(async (rawText) => await processImgText(rawText));
// };

const cleanArray = [
    "SH56 BFV",
    "SH56 BFV",
    "SH56 BFV",
    "SH56 BFV",
    "MH65 FBU",
    "SH56 BFV",
    "MH65 FBU",
    "SH56 BFV",
];

function mode(arr) {
    const store = {};
    arr.forEach((num) => (store[num] ? (store[num] += 1) : (store[num] = 1)));
    return Object.keys(store).sort((a, b) => store[b] - store[a])[0];
}

function mode2(arr) {
    return arr
        .sort(
            (a, b) =>
                arr.filter((v) => v === a).length -
                arr.filter((v) => v === b).length
        )
        .pop();
}

const licensePlateController = {
    getLicensePlate: getLicensePlate,
};

console.log("hello");
console.log(mode(cleanArray));
console.log(mode2(cleanArray));

module.exports = { licensePlateController };
