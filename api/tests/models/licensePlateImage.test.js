const LicensePlateImage = require("../../models/licensePlateImage");

require("../mongodb_helper");

describe("license plate image data", () => {
    beforeEach(async () => {
        await LicensePlateImage.deleteMany({});
    });
    it("correctly creates a license plate image", async () => {
        const licensePlateImage = await new LicensePlateImage({
            imageUrl:
                "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
            licensePlatesInImage: ["WD66 HXS"],
        });
        await licensePlateImage.save();
        const foundLicensePlate = await LicensePlateImage.findOne({
            imageUrl: licensePlateImage.imageUrl,
        });
        console.log(foundLicensePlate);
        expect(foundLicensePlate.imageUrl).toEqual(licensePlateImage.imageUrl);
        expect(foundLicensePlate.licensePlatesInImage).toEqual(
            licensePlateImage.licensePlatesInImage
        );
    });
});
