const getGoogleVisionText = require("../services/googleVision");

const getLicensePlate = async (req, res) => {
    const imgUrl = req.params.imgUrl;
    const imgTextRaw = await getGoogleVisionText(imgUrl);
    const isolatedText = imgTextRaw.responses[0].textAnnotations[0].description;
    const isoTextSpaces = isolatedText.replace(/\n/g, " ");
    const regex =
        /\b([A-Z]{2}\d{2}[\s\n]?[A-Z]{3}|\d{1,3}[\s\n]?[A-Z]{3}|\d{1,3}[A-Z]{1,3}[A-Z]?)\b/m;
    // const licensePlate = regex.exec(isoTextSpaces);
    // console.log(licensePlate);
    const licensePlate = isoTextSpaces.match(regex);
    console.log(licensePlate[0]);


    res.status(201).json({ licensePlate: licensePlate[0] });
};

const licensePlateController = {
    getLicensePlate: getLicensePlate,
};

module.exports = { licensePlateController };
