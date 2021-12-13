//reviews
const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const validate = require("./validation");
const { ObjectId } = require("mongodb");

let exportedMethods = {

  
  async removeReview(reviewId) {

    if (!validate.validString(reviewId)) throw 'commentId must be strings and not empty';

    try {
      var parsedId = ObjectId(reviewId);
    } catch (e) {
      throw 'commentId  is not a valid ObjectId';
    }
    const prodCollection = await products();

    let prod = await prodCollection.findOne({ "reviews": { $elemMatch: { "_id": parsedId } } });

    if (prod == null) {
      throw `Could not find prod with id of ${reviewId}`;
    }

    const prodInfo = await prodCollection.updateOne(
      { _id: prod._id },
      { $pull: { reviews: { _id: parsedId } } }

    );
    if (prodInfo.modifiedCount === 0) {
      throw `Could not delete review with id of ${reviewId}`;
    }

    prod = await prodCollection.findOne({ _id: prod._id });
    let overallRating = 0;

    prod.reviews.forEach((review) => {
      overallRating = overallRating + review.rating;
    });
    if (prod.reviews.length != 0) {
      overallRating = overallRating / prod.reviews.length;
    }
    overallRating = overallRating.toFixed(2);
    const ratingUpdateInfo = await prodCollection.updateOne(
      { _id: prod._id },
      { $set: { overallRating: overallRating } }
    );

    if (ratingUpdateInfo.matchedCount === 0)
      throw "Could not update overall rating";

    return `review has been successfully deleted!`;

  }
  
  


};

module.exports = exportedMethods;