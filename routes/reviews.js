const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;


function CurentTimeStr() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var clock = "";
    if (month < 10)
        clock += "0";
    clock += month + "/";
    if (day < 10)
        clock += "0";
    clock += day + "/";
    clock += year;
    return (clock);
}
//get review by review id
router.get("/:id", async (req, res) => {
    try {
        const review = await reviewsData.getReviewById(req.params.id);
        res.render("single", { review: review, user: req.session.user });
    } catch (e) {
        res.status(404).json({ error: "Review not found" });
    }
});
//get review by fields
router.get("/", async (req, res) => {
    const { productId, dateOfReview, title, reviewBody, likes } =
        req.body;
    try {
        const reviews = await reviewsData.getReviewsByField(
            productId, dateOfReview, title, reviewBody, likes);
        res.json(reviews);
    } catch (e) {
        res.status(404).json({ error: "Review not found" });
    }
});
//click like review
router.put("/likes/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "You must provide review id" });
        return;
    }
    try {
        await reviewsData.raiseReviewLike(id);
        res.status(200).send();
    } catch (e) {
        res.status(404).send({ error: e });
    }
});
//create review
// router.post("/:productId", async (req, res) => {

//     const productId = req.params.productId;
//     const { title, reviewBody, rating } =
//         req.body;
//     if (!productId) {
//         res.status(400).json({ error: "You must provide productId" });
//         return;
//     }
//     if (!title) {
//         res.status(400).json({ error: "You must provide review title" });
//         return;
//     }
//     if (!reviewBody) {
//         res.status(400).json({ error: "You must provide review Body" });
//         return;
//     }
//     if (!rating) {
//         res.status(400).json({ error: "You must provide  rating" });
//         return;
//     }

//     try {
//         const review = await reviewsData.createReview(
//             //login module failure to work now
//             productId, req.session.user._id.toString(), req.session.user.userName,CurentTimeStr(), title, reviewBody, rating, 1
//         );
//         res.json(review);
//     } catch (e) {
//         console.log(e);
//         res.status(400).send({ error: e });
//     }
// });
//update review by review id
// router.put("/:id", async (req, res) => {
//     const { id, dateOfReview, title, reviewBody, rating, likes } =
//         req.body;
//     if (!id) {
//         res.status(400).json({ error: "You must provide review id" });
//         return;
//     }
//     if (!dateOfReview) {
//         res.status(400).json({ error: "You must provide dateOfReview" });
//         return;
//     }
//     if (!title) {
//         res.status(400).json({ error: "You must provide provide title" });
//         return;
//     }
//     if (!reviewBody) {
//         res.status(400).json({ error: "You must provide review body" });
//         return;
//     }
//     if (!rating) {
//         res.status(400).json({ error: "You must provide rating" });
//         return;
//     }
//     if (!likes) {
//         res.status(400).json({ error: "You must provide review likes" });
//         return;
//     }
//     try {
//         const review = await reviewsData.updateReview(
//             id,
//             dateOfReview,
//             title,
//             reviewBody,
//             rating,
//             likes
//         );
//         res.json(review);
//     } catch (e) {
//         res.status(404).send({ error: e });
//     }
// });
//delete review by review id
// router.delete("/:id", async (req, res) => {
//     try {
//         const reviewId = await reviewsData.remove(req.params.id);
//         res.json({ reviewId: reviewId, deleted: true });
//     } catch (e) {
//         res.status(404).send({ error: e });
//     }
// });

//comment ops  
//get comments by review id
router.get('/comment/:reviewId', async (req, res) => {

    const reviewId = req.params.reviewId;
    if (!reviewId) {
        res.status(400).json({ error: "You must provide review id" });
        return;
    }
    try {
        const commentList = await reviewsData.getAllCommentsByRId(reviewId);
        if (commentList.length === 0) {
            res.status(404).json({ error: 'No commentList for the reviewId are found' });
        }
        res.json(restList)
    } catch (e) {
        res.status(500).send()
    }

})
//create one comment for review
router.post('/comment/:reviewId', async (req, res) => {
    const { commentBody } = req.body;
    const reviewId = req.params.reviewId;
    if (!reviewId) {
        res.status(400).json({ error: "You must provide review id" });
        return;
    }
    if (!commentBody) {
        res.status(400).json({ error: "You must provide commentBody" });
        return;
    }
    try {

        const newReview = await reviewsData.createComment(
            reviewId, req.session.user._id.toString(), req.session.user.userName, commentBody);
        res.json(newReview);
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: e });
    }
})
//delete comment by comment id
router.delete('/comment/:commentId', async (req, res) => {
    const commentId = req.params.commentId;
    if (!commentId) {
        res.status(400).json({ error: "You must provide comment Id" });
        return;
    }
    try {
        await reviewsData.removeComment(commentId);
        res.json({ "commentId": commentId, "deleted": true });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;