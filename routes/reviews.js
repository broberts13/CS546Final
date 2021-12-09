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
    try{
        const review =  await reviewData.getReviewById(reviewId);
        if( review==null || req.session.user._id.toString() != review.userId){
        res.json({ "reviewId": reviewId, "deleted": false , "msg":"You can't delete other people's reviews!"});
        return;
        }
    }catch(e){
        console.log(e)
        res.status(500).json({ error: e });
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