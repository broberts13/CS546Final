//reviews
const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
const validate = require("./validation");
const { ObjectId } = require("mongodb");

let exportedMethods = {
    async getReviewById(reviewId) {
        if (!validate.validString(reviewId)) throw 'ReviewId must be strings and not empty';
    
        try {
          var parsedId = ObjectId(reviewId);
        } catch (e) {
          throw 'reviewId  is not a valid ObjectId';
        }
        const prodCollection = await products();
        const prod = await prodCollection.findOne({ "reviews": { $elemMatch: { "_id": parsedId } } });
        if (prod === null) throw 'No review with that reviewId';
        for (let i = 0; i < prod.reviews.length; i++) {
          if (prod.reviews[i]._id.toString() == reviewId) {
            prod.reviews[i]._id = prod.reviews[i]._id.toString();
            return prod.reviews[i];
          }
        }
        throw 'No review with that reviewId';
    },
  
  async removeReview(reviewId) {

    if (!validate.validString(reviewId)) throw 'commentId must be strings and not empty';

    try {
      var parsedId = ObjectId(reviewId);
    } catch (e) {
      throw 'commentId  is not a valid ObjectId';
    }
    const prodCollection = await products();

    const prod = await prodCollection.findOne({ "reviews": { $elemMatch: { "_id": parsedId } } });

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

    return `review has been successfully deleted!`;

  }


};

module.exports = exportedMethods;