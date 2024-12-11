const MapReview = require("../../models/mapReviews")
const mongoose = require("mongoose");
require("../mongodb_helper");
                                              
describe("MapReviews model", () => {
    beforeEach(async () => {
        await MapReview.deleteMany({});
    })
    it('correctly creates a map review', () => {
        const mapReview = new MapReview({
            businessNumber: 1,
            averageRating: 4.0,
            ratingSummary: {
                "key": "value"
            },
            mostRelevantReviews: {
                "key": "value"
            },
            address: "123 fakestreet",
            otherInfo: "stuff"
        });

        expect(mapReview.businessNumber).toBe(1)
        expect(mapReview.averageRating).toBe(4.0)
        expect(mapReview.ratingSummary).toEqual({"key": "value"})
        expect(mapReview.mostRelevantReviews).toEqual({"key": "value"})
        expect(mapReview.address).toEqual("123 fakestreet")
        expect(mapReview.otherInfo).toEqual("stuff")
    })
})