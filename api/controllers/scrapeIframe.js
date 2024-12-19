const axios = require("axios");
const cheerio = require("cheerio");

const getIframeUrlFromEbayUrl = async (req, res) => {
    try {
        const ebayUrl = req.query.url;
        const response = await axios.get(ebayUrl);
        const $ = cheerio.load(response.data);
        const iframeUrl = $("#desc_ifr").attr("src");
        if (iframeUrl) {
            return res.status(200).json({ iframeUrl });
        } else {
            return res.status(400).json({
                message: "This website does not contain a valid iframe url",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error when accessing ebay urls",
        });
    }
};

const getBusinessInfoFromIframeUrl = async (req, res) => {
    try {
        const url = req.query.url;
        console.log(url);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        if ($("div.motors-details-wrapper").length > 0) {
            const companyDetails = getDataFromMotorDetails($);
            if (
                companyDetails.companyName != "" &&
                companyDetails.companyPostcode != null
            ) {
                return res.status(200).json({ companyDetails });
            } else {
                return res
                    .status(400)
                    .json({ message: "Company name and postcode not found" });
            }
        } else {
            const companyDetails = getDataFromEmp($);
            if (
                companyDetails.companyName != "" &&
                companyDetails.companyPostcode != null
            ) {
                return res.status(200).json({ companyDetails });
            } else {
                return res
                    .status(400)
                    .json({ message: "Company name and postcode not found" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error when accessing iframe urls",
        });
    }
};

const getDataFromEmp = ($) => {
    const businessName = $(
        "body > div > div.emp__ad.emp__ad--trf > div:nth-child(8) > div.emp__contactWrap > div.emp__contact > h5"
    )
        .text()
        .trim();
    const businessAddress = $(
        "body > div > div.emp__ad.emp__ad--trf > div:nth-child(8) > div.emp__contactWrap > div.emp__contact > div.emp__address"
    )
        .text()
        .trim();
    const companyDetails = {
        companyName: businessName,
        companyPostcode: getPostcode(businessAddress),
    };
    return companyDetails;
};

const getDataFromMotorDetails = ($) => {
    const businessName = $(
        "body > div > div > div.motors-details-wrapper > div.motors-details > p.motors-seller-name"
    )
        .text()
        .trim();
    const businessAddress = $(
        "body > div > div > div.motors-details-wrapper > div.motors-details > div.motors-seller-address"
    )
        .text()
        .trim();
    const companyDetails = {
        companyName: businessName,
        companyPostcode: getPostcode(businessAddress),
    };
    return companyDetails;
};

const getPostcode = (address) => {
    const regex =
        /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    const postcode = address.match(regex);
    return postcode ? postcode[0] : null;
};

const scrapeIframeController = {
    getIframeUrlFromEbayUrl: getIframeUrlFromEbayUrl,
    getBusinessInfoFromIframeUrl: getBusinessInfoFromIframeUrl,
};

module.exports = { scrapeIframeController };
