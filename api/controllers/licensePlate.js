const getGoogleVisionText = require("../services/googleVision");

const getLicensePlate = async (req, res) => {
    const imgUrl = req.params.imgUrl;
    const imgTextRaw = await getGoogleVisionText(imgUrl);
    const isolatedText = imgTextRaw.responses[0].textAnnotations[0].description;
    const isoTextSpaces = isolatedText.replace(/\n/g, " ");
    const regex =
        /\b([A-Z]{2}\d{2}[\s\n]?[A-Z]{3}|\d{1,3}[\s\n]?[A-Z]{3}|\d{1,3}[A-Z]{1,3}[A-Z]?)\b/gm;
    // const licensePlate = regex.exec(isoTextSpaces);
    // console.log(licensePlate);
    const licensePlates = isoTextSpaces.match(regex);
    if (!licensePlates) {
        return res.status(404);
    } else if (licensePlates.length === 1) {
        return res.status(201).json({ licensePlates: licensePlates[0] });
    } else {
        const validPlates = [];
        for (let plate of licensePlates) {
            if (plate.length === 7 || plate.length === 8) {
                validPlates.push(plate);
            }
            return res.status(201).json({ licensePlates: validPlates });
        }
    }
};

const licensePlateController = {
    getLicensePlate: getLicensePlate,
};

module.exports = { licensePlateController };
