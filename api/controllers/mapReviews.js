const getMapReviewJSON = require("../services/mapReview");
const MapReview = require("../models/mapReviews");

const findMapReview = async (req, res) => {
    const { companyName, postcode } = req.params;
    const query = `${companyName} ${postcode}`;

    const mapReview = await MapReview.findOne({ query: query });
    if (!mapReview) {
        const mapReviewsRaw = await getMapReviewJSON(query);
        if (
            !mapReviewsRaw ||
            !mapReviewsRaw.place_results ||
            !mapReviewsRaw.place_results.rating
        ) {
            return res.status(404).json({
                message:
                    "The company name and postcode did not find any valid reviews, exercise caution",
            });
        }
        const mapReviews = {
            query: query,
            businessName: mapReviewsRaw.place_results.title,
            businessAddress: mapReviewsRaw.place_results.address,
            averageRating: mapReviewsRaw.place_results.rating,
            reviewsCount: mapReviewsRaw.place_results.reviews,
            ratingSummary: mapReviewsRaw.place_results.rating_summary,
            mostRelevantReviews:
                mapReviewsRaw.place_results.user_reviews.most_relevant,
        };
        await saveMapReviewtoDB(mapReviews);
        res.status(201).json({ mapReviews: mapReviews });
    } else if (mapReview) {
        const mapReviews = {
            query: query,
            businessName: mapReview.businessName,
            businessAddress: mapReview.businessAddress,
            averageRating: mapReview.averageRating,
            reviewsCount: mapReview.reviewsCount,
            ratingSummary: mapReview.ratingSummary,
            mostRelevantReviews: mapReview.mostRelevantReviews,
        };
        res.status(200).json({ mapReviews: mapReviews });
    }
};

const saveMapReviewtoDB = async (jsonData) => {
    return await new MapReview({
        query: jsonData.query,
        businessName: jsonData.businessName,
        businessAddress: jsonData.businessAddress,
        averageRating: jsonData.averageRating,
        reviewsCount: jsonData.reviewsCount,
        ratingSummary: jsonData.ratingSummary,
        mostRelevantReviews: jsonData.mostRelevantReviews,
    }).save();
};

const mapReviewController = {
    findMapReview: findMapReview,
};

module.exports = { mapReviewController };
