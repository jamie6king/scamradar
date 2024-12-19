const MapReview = require("../../models/mapReviews");
require("../mongodb_helper");
const mockMapFilteredJSON = require("../test-responses/mapReviewFiltered");

describe("MapReviews model", () => {
    beforeEach(async () => {
        await MapReview.deleteMany({});
    });
    it("correctly creates a map review", () => {
        const mapReview = new MapReview({
            query: "Charlie's fakestreet",
            businessName: "Charlie's Motors",
            businessAddress: "123 fakestreet",
            averageRating: 4.0,
            ratingSummary: [
                {
                    key: "value",
                },
            ],
            mostRelevantReviews: [
                {
                    key: "value",
                },
            ],
        });

        expect(mapReview.businessName).toEqual("Charlie's Motors");
        expect(mapReview.businessAddress).toEqual("123 fakestreet");
        expect(mapReview.averageRating).toEqual(4.0);
        expect(mapReview.ratingSummary).toEqual([{ key: "value" }]);
        expect(mapReview.mostRelevantReviews).toEqual([{ key: "value" }]);
    });
    it("Correctly returns an empty list when no mapreviews have been added", async () => {
        const mapReviews = await MapReview.find({});
        expect(mapReviews).toEqual([]);
    });
    it("Correctly lists all map reviews that have been added to the database", async () => {
        const mapReview = await new MapReview({
            query: "Charlie's fakestreet",
            businessName: "Charlie's Motors",
            businessAddress: "123 fakestreet",
            averageRating: 4.0,
            reviewsCount: 4909,
            ratingSummary: [
                {
                    key: "value",
                },
            ],
            mostRelevantReviews: [
                {
                    key: "value",
                },
            ],
        }).save();
        const mapReviews = await MapReview.find({});
        expect(mapReviews[0]._id).toEqual(mapReview._id);
    });
    it("adds mapreview to DB when the review is large", async () => {
        const mapReview = await new MapReview({
            query: mockMapFilteredJSON.query,
            businessName: mockMapFilteredJSON.businessName,
            businessAddress: mockMapFilteredJSON.businessAddress,
            averageRating: mockMapFilteredJSON.averageRating,
            reviewsCount: mockMapFilteredJSON.reviewsCount,
            ratingSummary: mockMapFilteredJSON.ratingSummary,
            mostRelevantReviews: mockMapFilteredJSON.mostRelevantReviews,
        }).save();
        const mapReviews = await MapReview.find({});
        expect(mapReviews[0]._id).toEqual(mapReview._id);
    });
});
