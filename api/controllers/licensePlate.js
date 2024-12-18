// const imgArray = [
//     "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
//     "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
//     "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
//     "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
//     "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
//     "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
// ];

// const cleanArray = [
//     "SH56 BFV",
//     "SH56 BFV",
//     "SH56 BFV",
//     "SH56 BFV",
//     "MH65 FBU",
//     "SH56 BFV",
//     "MH65 FBU",
//     "SH56 BFV",
// ];

const getGoogleVisionText = require("../services/googleVision");

const getLicensePlate = async (req, res) => {
    const imgUrl = req.query.imgUrl;
    const imgTextRaw = await getGoogleVisionText(imgUrl);
    const isolatedText = imgTextRaw.responses[0].textAnnotations[0].description;
    const isoTextSpaces = isolatedText.replace(/\n/g, " ");
    const regex =
        /\b([A-Z]{2}\d{2}[\s\n]?[A-Z]{3}|\d{1,3}[\s\n]?[A-Z]{3}|\d{1,3}[A-Z]{1,3}[A-Z]?)\b/gm;

    const licensePlates = isoTextSpaces.match(regex) || [];
    if (licensePlates.length === 0) {
        return res.status(404).json({ message: "No number plate found." });
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

const processImgText = (imgText) => {
    if (Object.keys(imgText.responses[0]).length === 0) {
        return;
    }
    const isolatedText = imgText.responses[0].textAnnotations[0].description;
    const isoTextSpaces = isolatedText.replace(/\n/g, " ");
    const regex =
        /\b([A-Z]{2}\d{2}[\s\n]?[A-Z]{3}|\d{1,3}[\s\n]?[A-Z]{3}|\d{1,3}[A-Z]{1,3}[A-Z]?)\b/gm;
    const licensePlates = isoTextSpaces.match(regex);
    if (!licensePlates) {
        return;
    } else {
        const validPlates = [];
        for (let plate of licensePlates) {
            if (plate.length === 7 || plate.length === 8) {
                validPlates.push(plate);
            }
        }
        // console.log(validPlates)
        return validPlates;
    }
};

const getMostCommonLicensePlate = async (req, res) => {
    const imgUrlArray = req.body;
    const outputPlates = [];

    const licensePlates = await Promise.all(
        imgUrlArray.map(async (url) => await getGoogleVisionText(url))
    );

    licensePlates.forEach((imgText) =>
        outputPlates.push(processImgText(imgText))
    );
    const filteredOutputPlates = outputPlates
        .flat()
        .filter((plate) => plate != undefined);
    const mostCommonPlate = getMostCommon(filteredOutputPlates);

    console.log("Most common: ", mostCommonPlate);
    return res.status(200).json({ mostCommonPlate });
};

const getMostCommon = (arr) => {
    return arr
        .sort(
            (a, b) =>
                arr.filter((v) => v === a).length -
                arr.filter((v) => v === b).length
        )
        .pop();
};

const licensePlateController = {
    getLicensePlate: getLicensePlate,
    getMostCommonLicensePlate: getMostCommonLicensePlate,
};

module.exports = { licensePlateController };
