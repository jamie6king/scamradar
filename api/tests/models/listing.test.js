const Listing = require("../../models/listing");

require("../mongodb_helper");

describe("Listing model", () => {
    beforeEach(async () => {
        await Listing.deleteMany({});
    });
    it("correctly creates a listing", async () => {
        const listing = await new Listing({
            productId: "TEST123",
            title: "somecar",
            price: "£123",
            isAuction: false,
            customerName: "Fakeguy McGee",
            isBusiness: false,
            hasReviews: false,
        });
        expect(listing.productId).toEqual("TEST123");
        expect(listing.title).toEqual("somecar");
        expect(listing.price).toEqual("£123");
        expect(listing.isAuction).toBe(false);
        expect(listing.customerName).toEqual("Fakeguy McGee");
        expect(listing.isBusiness).toBe(false);
        expect(listing.hasReviews).toBe(false);
    });
    it("returns empty list when mno listings have been made", async () => {
        const listings = await Listing.find({});
        expect(listings).toEqual([]);
    });
    it("returns listings if listings have been added to the database", async () => {
        const listing = await new Listing({
            productId: "TEST123",
            title: "somecar",
            price: "£123",
            isAuction: false,
            customerName: "Fakeguy McGee",
            isBusiness: false,
            hasReviews: false,
        }).save();
        const listings = await Listing.find();
        expect(listings[0].productId).toEqual(listing.productId);
        expect(listings[0].title).toEqual(listing.title);
        expect(listings[0].customerName).toEqual(listing.customerName);
    });
});
