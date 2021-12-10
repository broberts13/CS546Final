const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewData = data.reviews;

//delete review by reviewId
router.delete('/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;
    if (!reviewId) {
        res.status(400).json({ error: "You must provide review Id" });
        return;
    }
    try {
        await reviewData.removeReview(reviewId);
        res.json({ "reviewId": reviewId, "deleted": true });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e });
    }
});

module.exports = router;