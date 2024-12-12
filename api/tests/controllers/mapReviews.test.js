const request = require("supertest");
const app = require("../../app");
const MapReview = require("../../models/mapReviews");

require("../mongodb_helper");
describe("/mapReviews", () => {
    beforeEach(async () => {
        await MapReview.deleteMany;
    });
});
