//reviews
const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const usersData = require("../data/users");
const validate = require("./validation");
const { ObjectId } = require("mongodb");

function calculateRating(restaurant) {
  let reviews = restaurant.reviews;
  let overallRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    overallRating += reviews[i].rating;

  }
  return Math.round(overallRating / reviews.length);
}
let exportedMethods = {

  async getReviewById(id) {
    if (!validate.validString(id)) throw "Review id must be a valid string.";
    let objId = ObjectId(id.trim());
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: objId });

    if (!review) throw `No Review found with id=${id}.`;

    // Convert _id field to string before returning
    return validate.convertObjId(review);
  },

  async getAllReviews() {

    const reviewCollection = await reviews();
    const allReviews = await reviewCollection.find({}).toArray();

    // Change all _id values to strings
    return allReviews.map(validate.convertObjId);
  },
  async getReviewsByField(productId, userId, userName, dateOfReview, title, likes) {
    var query = {};
    if (validate.validString(productId)) {
      query['productId'] = productId;
    }
    if (validate.validString(userId)) {
      query['userId'] = userId;
    }
    if (validate.validString(userName)) {
      query['userName'] = userName;
    }
    if (validate.validString(dateOfReview)) {
      query['dateOfReview'] = dateOfReview;
    }
    if (validate.validString(title)) {
      query['title'] = title;
    }
    if (validate.validString(likes)) {
      query['likes'] = likes;
    }

    const reviewCollection = await reviews();
    const allReviews = await reviewCollection.find(query).toArray();

    // Change all _id values to strings
    return allReviews.map(validate.convertObjId);
  },
  async createReview(productId, userId, userName, dateOfReview, title, reviewBody, rating, likes) {

    if (!validate.validString(productId)) throw 'productId must be strings and not empty';
    if (!validate.validString(userId)) throw 'userId must be strings and not empty';
    if (!validate.validString(userName)) throw 'userName must be strings and not empty';
    if (!validate.validString(dateOfReview)) throw 'dateOfReview must be strings and not empty';
    if (!validate.validString(title)) throw 'title must be strings and not empty';
    if (!validate.validString(reviewBody)) throw 'reviewBody must be strings and not empty';

    // if(!validate.validRating(rating))    throw "rating value is 0-5";
    if (!validate.validnum(likes)) throw "likes  must be number and not empty";



    const reviewCollection = await reviews();
    const newReview = {
      productId: productId.trim(),
      userId: userId.trim(),
      userName: userName.trim(),
      dateOfReview: dateOfReview.trim(),
      title: title.trim(),
      reviewBody: reviewBody.trim(),
      rating: rating,
      likes: likes,
      comments: [],
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (insertInfo.insertedCount === 0)
      throw "Could not add Review to database.";
    const id = insertInfo.insertedId.toString();
    return await this.getReviewById(id);
  },

  async remove(id) {
    if (!validate.validString(id)) throw "Review id must be a valid string.";

    const delreview = await getReviewById(id);
    if (delreview == null) throw "Review Not found";
    const reviewCollection = await reviews();
    id = ObjectId(id);
    const deletionInfo = await reviewCollection.deleteOne({ _id: id });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete Review with id of ${id}`;
    }

    return `${delreview._id}`;
  },
  async updateReview(//not use likes value
    id, dateOfReview, title, reviewBody, rating, likes
  ) {
    if (!validate.validString(id)) throw "Review id must be a valid string.";
    if (!validate.validString(dateOfReview))
      throw "dateOfReview  must be a valid string.";
    if (!validate.validString(title))
      throw "Title name must be a valid string.";
    if (!validate.validString(reviewBody))
      throw "Review Body must be a valid string.";
    if (!validate.validnum(rating)) throw "Enter valid rating value";
    if (!validate.validnum(likes)) throw "Enter valid likes value";

    const reviewCollection = await reviews();
    const review = await getReviewById(id);
    const updateReview = {
      dateOfReview: dateOfReview.trim(),
      title: title.trim(),
      reviewBody: reviewBody.trim(),
      rating: rating,
      likes: review.likes,
      comments: review.comments
    };

    id = ObjectId(id);

    const updatedInfo = await reviewCollection.updateOne(
      { _id: id },
      { $set: updateReview }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update Review";
    }

    return await getReviewById(id.toString());
  },
  async raiseReviewLike(id) {
    if (!validate.validString(id)) throw "Review id must be a valid string.";

    const reviewCollection = await reviews();

    id = ObjectId(id);

    const updatedInfo = await reviewCollection.updateOne(
      { _id: id },
      {"$inc":{"likes":1}}
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not inc likes";
    }

    return;
  },

  //Comments ops
  async createComment(reviewId, userId, userName, commentBody) {

    if (!validate.validString(reviewId)) throw 'productId must be strings and not empty';
    if (!validate.validString(userId)) throw 'userId must be strings and not empty';
    if (!validate.validString(userName)) throw 'userName must be strings and not empty';
    if (!validate.validString(commentBody)) throw 'commentBody must be strings and not empty';


    try {
      var parsedId = ObjectId(reviewId);
    } catch (e) {
      throw 'reviewId is not a valid ObjectId';
    }

    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: parsedId });
    if (review === null) throw 'No review with that id';
    const newComment = {
      userId: userId.trim(),
      userName: userName.trim(),
      commentBody: commentBody.trim(),
    };

    const result = await reviewCollection.updateOne(
      { _id: parsedId },
      { $addToSet: { comments: newComment } }
    );
    if (result.matchedCount === 0) throw 'the review does not exists with that reviewId';

    return this.getReviewById(reviewId);
  },
  async removeComment(commentId) {

    if (!validate.validString(commentId)) throw 'commentId must be strings and not empty';

    try {
      var parsedId = ObjectId(commentId);
    } catch (e) {
      throw 'commentId  is not a valid ObjectId';
    }


    const reviewCollection = await reviews();

    const review = await reviewCollection.findOne({ "comments": { $elemMatch: { "_id": parsedId } } });

    if (review == null) {
      throw `Could not find comment with id of ${commentId}`;
    }

    const reviewInfo = await reviewCollection.updateOne(
      { _id: review._id },
      { $pull: { comments: { _id: parsedId } } }

    );
    if (reviewInfo.modifiedCount === 0) {
      throw `Could not delete comment with id of ${commentId}`;
    }

    return `comment has been successfully deleted!`;

  },
  async getCommentById(commentId) {
    if (!validate.validString(commentId)) throw 'commentId must be strings and not empty';

    try {
      var parsedId = ObjectId(commentId);
    } catch (e) {
      throw 'reviewId  is not a valid ObjectId';
    }
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ "comments": { $elemMatch: { "_id": parsedId } } });
    if (review === null) throw 'No review with that commentId';
    for (let i = 0; i < review.comments.length; i++) {
      if (review.comments[i]._id.toString() == commentId) {
        review.comments[i]._id = review.comments[i]._id.toString();
        return review.comments[i];
      }
    }
    throw 'No comment with that commentId';
  },
  async getAllCommentsByRId(reviewId) {

    if (!validate.validString(reviewId)) throw 'reviewId must be strings and not empty';
    try {
      var parsedId = ObjectId(reviewId);
    } catch (e) {
      throw 'reviewId  is not a valid ObjectId';
    }
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({
      _id: parsedId
    });
    var commentList = review.comments;
    commentList.forEach(item => item._id = item._id.toString());
    return commentList;
  }

};

module.exports = exportedMethods;