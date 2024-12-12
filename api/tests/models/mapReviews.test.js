const MapReview = require("../../models/mapReviews");
const mongoose = require("mongoose");
require("../mongodb_helper");

describe("MapReviews model", () => {
    beforeEach(async () => {
        await MapReview.deleteMany({});
    });
    it("correctly creates a map review", () => {
        const mapReview = new MapReview({
            businessName: "Charlie's Motors",
            businessAddress: "123 fakestreet",
            averageRating: 4.0,
            ratingSummary: {
                key: "value",
            },
            mostRelevantReviews: {
                key: "value",
            },
            otherInfo: "stuff",
        });

        expect(mapReview.businessName).toEqual("Charlie's Motors");
        expect(mapReview.businessAddress).toEqual("123 fakestreet");
        expect(mapReview.averageRating).toEqual(4.0);
        expect(mapReview.ratingSummary).toEqual({ key: "value" });
        expect(mapReview.mostRelevantReviews).toEqual({ key: "value" });
        expect(mapReview.otherInfo).toEqual("stuff");
    });
    it("Correctly returns an empty list when no mapreviews have been added", async () => {
        const mapReviews = await MapReview.find({});
        expect(mapReviews).toEqual([]);
    });
    it("Correctly lists all map reviews that have been added to the database", async () => {
        const mapReview = await new MapReview({
            businessName: "Charlie's Motors",
            businessAddress: "123 fakestreet",
            averageRating: 4.0,
            ratingSummary: {
                key: "value",
            },
            mostRelevantReviews: {
                key: "value",
            },
            otherInfo: "stuff",
        }).save();
        const mapReviews = await MapReview.find({});
        expect(mapReviews[0]._id).toEqual(mapReview._id);
    });
});
