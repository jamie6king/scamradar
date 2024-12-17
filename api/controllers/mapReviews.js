const getMapReviewJSON = require("../services/mapReview");

const findMapReview = async (req, res) => {
    try {
        const { companyName, postcode } = req.params;
        const query = `${companyName} ${postcode}`;

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

        res.status(200).json({ mapReviews: mapReviews });
    } catch (error) {
        console.log(`\n${error.message}\n`);
        res.status(500).json({
            message: "An error occured, map reviews were not returned",
            error: error.message,
        });
    }
};

const mapReviewController = {
    findMapReview: findMapReview,
};

module.exports = { mapReviewController };
