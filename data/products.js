const mongoCollections = require("../config/mongoCollections");
const products = mongoCollections.products;
// const users = mongoCollections.users;
const usersData = require("../data/users");
const validate = require("./validation");
const { ObjectId } = require("mongodb");

async function getAllProducts() {
  const prodCollection = await products();
  //sorting Products by Number of Likes
  const allProducts = await prodCollection
    .find({})
    .sort({ likes: -1 })
    .toArray();

  // Change all _id values to strings
  return allProducts.map(validate.convertObjId);
}

findWishlistProd;

async function findWishlistProd(wishlistProd) {
  const prodCollection = await products();
  let wishprod = [];

  // wishlistProd.forEach(e => {
  //   e = ObjectId(e);
  // });
  //sorting Products by Number of Likes
  const allProducts = await prodCollection
    .find({})
    .sort({ likes: -1 })
    .toArray();
  let i = {};
  allProducts.forEach((e) => {
    i = e._id.toString();
    if (wishlistProd.includes(i)) {
      wishprod.push(e);
    }
  });

  // Change all _id values to strings
  return wishprod.map(validate.convertObjId);
}

async function progressbar(id) {
  let count5 = 0,
    count4 = 0,
    count3 = 0,
    count2 = 0,
    count1 = 0,
    bar5 = 0,
    bar4 = 0,
    bar3 = 0,
    bar2 = 0,
    bar1 = 0;

  if (!validate.validString(id)) throw "Product id must be a valid string.";
  let objId = ObjectId(id.trim());
  const prodCollection = await products();

  let prod = await prodCollection.findOne({ _id: objId });

  if (!prod) throw `No Product found with id=${id}.`;

  prod.reviews.sort(function (a, b) {
    return b.rating - a.rating;
  });
  prod.reviews.forEach((review) => {
    if (review.rating == 5) count5 += 1;
    if (review.rating == 4) count4 += 1;
    if (review.rating == 3) count3 += 1;
    if (review.rating == 2) count2 += 1;
    if (review.rating == 1) count1 += 1;
  });

  if (prod.reviews.length != 0) {
    bar5 = (count5 / prod.reviews.length) * 100;
    bar4 = (count4 / prod.reviews.length) * 100;
    bar3 = (count3 / prod.reviews.length) * 100;
    bar2 = (count2 / prod.reviews.length) * 100;
    bar1 = (count1 / prod.reviews.length) * 100;
  }

  // Convert _id field to string before returning

  progress = {
    a: count5,
    b: count4,
    c: count3,
    d: count2,
    e: count1,
    bar5: bar5,
    bar4: bar4,
    bar3: bar3,
    bar2: bar2,
    bar1: bar1,
  };
  return progress;
}
async function getProductById(id) {
  if (!validate.validString(id)) throw "Product id must be a valid string.";
  let objId = ObjectId(id.trim());
  const prodCollection = await products();

  let prod = await prodCollection.findOne({ _id: objId });

  if (!prod) throw `No Product found with id=${id}.`;

  //Sorting Reviews by Number of Likes
  prod.reviews.sort(function (a, b) {
    return b.likes.length - a.likes.length;
  });

  prod = validate.convertObjId(prod);
  return prod;
}

async function createProduct(
  productName,
  productPicture,
  productLinks,
  brand,
  price,
  category
) {
  if (!validate.validString(productName))
    throw "Product name must be a valid string.";
  if (!validate.validString(productPicture))
    throw "Product picture path Invalid";
  if (!validate.validString(brand))
    throw "Product Brand must be a valid string.";
  if (!validate.validString(category))
    throw "Product Category must be a valid string.";
  if (!validate.validnum(price)) throw "Enter valid Price value";
  if (!productLinks || !Array.isArray(productLinks))
    throw "You must provide an array of Product Links";

  if (productLinks.length === 0) {
    throw "You must provide at least one product Link.";
  } else {
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i].trim();
      if (!validate.validLink(link))
        throw "Product external link must be a valid link.";
    }
  }

  const prodCollection = await products();
  const newProd = {
    productName: productName.trim(),
    productPicture: productPicture,
    productLinks: productLinks,
    brand: brand.trim(),
    price: price,
    category: category.trim(),
    overallRating: 0,
    likes: [],
    reviews: [],
  };

  const insertInfo = await prodCollection.insertOne(newProd);
  if (insertInfo.insertedCount === 0)
    throw "Could not add Product to database.";
  const id = insertInfo.insertedId.toString();

  return await getProductById(id);
}

async function updateProduct(
  id,
  productName,
  productPicture,
  productLinks,
  brand,
  price,
  category
) {
  if (!validate.validString(id)) throw "Product id must be a valid string.";
  if (!validate.validString(productPicture))
    throw "Product picture path Invalid";
  if (!validate.validString(productName))
    throw "Product name must be a valid string.";
  if (!validate.validString(brand))
    throw "Product Brand must be a valid string.";
  if (!validate.validString(category))
    throw "Product Category must be a valid string.";
  if (!validate.validnum(price)) throw "Enter valid Price value";
  if (!productLinks || !Array.isArray(productLinks))
    throw "You must provide an array of Product Links";

  if (productLinks.length === 0) {
    throw "You must provide at least one product Link.";
  } else {
    for (let i = 0; i < productLinks.length; i++) {
      const link = productLinks[i].trim();
      if (!validate.validLink(link))
        throw "Product external link must be a valid link.";
    }
  }

  const prodCollection = await products();
  const prod = await getProductById(id);
  const updateProd = {
    productName: productName.trim(),
    productPicture: productPicture.trim(),
    productLinks: productLinks,
    brand: brand.trim(),
    price: price,
    category: category.trim(),
    overallRating: prod.overallRating,
    likes: prod.likes,
    reviews: prod.reviews,
  };

  id = ObjectId(id);

  const updatedInfo = await prodCollection.updateOne(
    { _id: id },
    { $set: updateProd }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update Product";
  }

  return await getProductById(id.toString());
}

async function remove(id) {
  if (!validate.validString(id)) throw "Product id must be a valid string.";

  const delprod = await getProductById(id);
  if (delprod == null) throw "Product Not found";
  const prodCollection = await products();
  id = ObjectId(id);
  const deletionInfo = await prodCollection.deleteOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete Product with id of ${id}`;
  }

  return `${delprod._id}`;
}

//REVIEWS

async function getReviewById(revId) {
  if (!validate.validString(revId)) throw "Id must be a valid string.";

  const prodCollection = await products();
  const allProducts = await prodCollection.find({}).toArray();
  let prodid = "";
  let flag = false;

  allProducts.forEach((e) => {
    if (e.reviews.length != 0) {
      e.reviews.forEach((e1) => {
        if (e1._id == revId) {
          prodid = e1.productId;
        }
      });
    }
  });

  let prod = await getProductById(prodid);
  let cnt = -1;
  let index = 0;
  prod.reviews.forEach((rev) => {
    cnt += 1;
    let id = rev._id.toString();
    if (id == revId) {
      index = cnt;
    }
  });
  reviewobj = { index: index, review: prod.reviews[index], product: prod };
  return reviewobj;
}

async function addToreviews(userId, prodId, title, reviewBody, rating) {
  const user = await usersData.getUserById(userId.toString());
  let date = new Date().toUTCString();
  if (!title) {
    throw "Add Review Title";
  }
  if (!reviewBody) {
    throw "Review Cannot be empty";
  }
  if (!rating) {
    throw "Add Rating";
  }
  if (!user) {
    throw "Login Before you add review";
  } else {
    if (!validate.validString(title)) throw "Title must be a valid string.";
    if (!validate.validString(reviewBody))
      throw "Reviews text must be a valid string.";
    if (!validate.validnum(rating) || rating > 5 || rating < 0)
      throw "rating should be between 0-5";
    rating = parseFloat(rating);
    const prodCollection = await products();
    // const prod = await getProductById(prodId);
    const addreview = {
      _id: ObjectId(),
      productId: prodId,
      userId: userId,
      userName: user.userName,
      userImage: user.userImage,
      date: date,
      title: title,
      reviewBody: reviewBody,
      rating: rating,
      likes: [],
      Comments: [],
    };
    prodId = ObjectId(prodId);
    const updatedInfo = await prodCollection.updateOne(
      { _id: prodId },
      { $push: { reviews: addreview } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not add review";
    }

    //new

    let product = await getProductById(prodId.toString());
    let overallRating = 0;

    product.reviews.forEach((review) => {
      overallRating = overallRating + review.rating;
    });
    if (product.reviews.length != 0) {
      overallRating = overallRating / product.reviews.length;
    }
    const ratingUpdateInfo = await prodCollection.updateOne(
      { _id: prodId },
      { $set: { overallRating: overallRating } }
    );
    if (ratingUpdateInfo.matchedCount === 0)
      throw "Could not update overall rating";

    product = await getProductById(prodId.toString());
    return product;
  }
}

//review like
async function addToReviewLikes(userId, revId) {
  const prodCollection = await products();

  let revobj = await getReviewById(revId);
  let flag = false;

  revobj.review.likes.forEach((e) => {
    if (e == userId) {
      flag = true;
    }
  });
  if (!flag) {
    revobj.product.reviews[revobj.index].likes.push(userId);

    const prodId = ObjectId(revobj.product._id);
    const updatedInfo = await prodCollection.updateOne(
      { _id: prodId },
      { $set: { reviews: revobj.product.reviews } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not modify review";
    }
  }
}

//Product like
async function addToLikes(userId, prodId) {
  const prodCollection = await products();
  const prod = await getProductById(prodId);
  let flag = false;
  prod.likes.forEach((e) => {
    if (e == userId) {
      flag = true;
    }
  });
  prodId = ObjectId(prodId);
  if (!flag) {
    const updatedInfo = await prodCollection.updateOne(
      { _id: prodId },
      { $push: { likes: userId } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Login to Like the product";
    }
  } else {
    const updatedInfo = await prodCollection.updateOne(
      { _id: prodId },
      { $pull: { likes: userId } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Login to Like the product";
    }
  }
}

//print review
async function getUserReviews(userId) {
 
  const productList = await getAllProducts();
  let userReviews = [];
  productList.forEach((e) => {
    e.reviews.forEach((e1) => {
      if (e1.userId == userId) {
        userReviews.push(e1);
      }
    });
  });

  return userReviews;
}

//Add Comments
async function postComment(userId,revId,commentBody) {
  const prodCollection = await products();
  const user = await usersData.getUserById(userId.toString());
  let date = new Date().toUTCString();
  let revobj = await getReviewById(revId);


  const comment = {
    _id: ObjectId(),
    userId: userId,
    userName: user.userName,
    userImage: user.userImage,
    commentBody: commentBody ,
    date: date,
  };

    revobj.product.reviews[revobj.index].Comments.push(comment);

    const prodId = ObjectId(revobj.product._id);
    const updatedInfo = await prodCollection.updateOne(
      { _id: prodId },
      { $set: { reviews: revobj.product.reviews } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not modify review";
    }
}
  

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  remove,
  addToreviews,
  progressbar,
  addToLikes,
  getReviewById,
  addToReviewLikes,
  findWishlistProd,
  getUserReviews,
  postComment,
};
