const express = require("express");
const router = express.Router();
const data = require("../data");
const productData = data.products;
const pendingData = require("../data/pending");
const xss = require('xss');

router.get("/add", async (req, res) => {
  //if not user redirect to login
  return res.render("product/add", {user: req.session.user }); 
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productData.getProductById(req.params.id);
    const progressbar = await productData.progressbar(req.params.id);
    let flag = false;
    let flag1 = false;
    if (req.session.user) {
      if (product.likes.includes(req.session.user._id)) {
        flag = true;
      }
      product.reviews.forEach((e) => {
        if (e.likes.includes(req.session.user._id)) {
          e.islike = true;
        } else {
          e.islike = false;
        }
      });
    }
    res.render("product/single", {
      product: product,
      status: progressbar,
      user: req.session.user,
      flag: flag,
      flag1: flag1,
    });
  } catch (e) {
   // res.status(404).json({ error: "Product not found" });
    res.status(404).render("landing/error", { error: e, user: req.session.user  });
  }
});

router.get("/", async (req, res) => {
  try {
    const productList = await productData.getAllProducts();
    res.render("product/products", {
      products: productList,
      user: req.session.user,
    });
  } catch (e) {
    res.status(404).render("landing/error", { error: e, user: req.session.user  });
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body;

    const productList = await productData.searchProducts(searchTerm);
    res.render("product/products", { products: productList, user: req.session.user });
  } catch (e) {
    res.status(404).render("landing/error", { error: e, user: req.session.user  });
  }
});

router.post("/", async (req, res) => {
  const productName = xss(req.body.productName);
  const productPicture = xss(req.body.productPicture);
  const productLinks = (req.body.productLinks);
  const brand = xss(req.body.brand);
  const price = xss(req.body.price);
  const category = xss(req.body.category);
  //console.log("productLinks ", productLinks, typeof productLinks);
  if (!productName) {
    res.status(400).json({ error: "You must provide product name" });
    return;
  }
  if (!productPicture) {
    res.status(400).json({ error: "You must provide picture" });
    return;
  }
  if (!productLinks) {
    res.status(400).json({ error: "You must provide provide links" });
    return;
  }
  if (!brand) {
    res.status(400).json({ error: "You must provide brand" });
    return;
  }
  if (!price) {
    res.status(400).json({ error: "You must provide product price" });
    return;
  }
  if (!category) {
    res.status(400).json({ error: "You must provide product category" });
    return;
  }

  try {
    const product = await productData.createProduct(
      productName,
      productPicture,
      productLinks,
      brand,
      price,
      category
    );
    res.json(product);
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.post("/add", async (req, res) => {
  let formBody = req.body;
  productName = xss(req.body.newProdName)
  productBrand = xss(req.body.newProdBrand)

  if (!productName) {
    res.status(400).render("product/add", { prod: formBody, error: "You must provide product name.",user: req.session.user });
    return;
  }
  if (!productBrand) {
    res.status(400).render("product/add",{ prod: formBody, error: "You must provide the brand of the product.",user: req.session.user });
    return;
  }

  let success = "You're request has been submitted for review successfully!"

  try {
    const pending = await pendingData.createPending(productName, productBrand);
    res.render("product/add", {success: success});
  } catch (e) {
    res.status(400).render("product/add", { error: e, prod: formBody});
  }
  
});


router.put("/:id", async (req, res) => {
  const productName = xss(req.body.productName);
  const productPicture = xss(req.body.productPicture);
  const productLinks = xss(req.body.productLinks);
  const brand = xss(req.body.brand);
  const price = xss(req.body.price);
  const category = xss(req.body.category);
  if (!productName) {
    res.status(400).json({ error: "You must provide product name" });
    return;
  }
  if (!productPicture) {
    res.status(400).json({ error: "You must provide picture" });
    return;
  }
  if (!productLinks) {
    res.status(400).json({ error: "You must provide provide links" });
    return;
  }
  if (!brand) {
    res.status(400).json({ error: "You must provide brand" });
    return;
  }
  if (!price) {
    res.status(400).json({ error: "You must provide product price" });
    return;
  }
  if (!category) {
    res.status(400).json({ error: "You must provide product category" });
    return;
  }
  try {
    const product = await productData.updateProduct(
      req.params.id,
      productName,
      productPicture,
      productLinks,
      brand,
      price,
      category
    );
    res.json(product);
  } catch (e) {
    res.status(404).send({ error: e });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const prodId = await productData.remove(req.params.id);
    res.json({ productId: prodId, deleted: true });
  } catch (e) {
    res.status(404).send({ error: e });
  }
});

router.post("/review/:prodId", async (req, res) => {
  const title = xss(req.body.title);
  const reviewBody = xss(req.body.reviewBody);
  const rating = xss(req.body.rating);
  if (!title) {
    res.status(400).json({ error: "You must provide review title" });
    return;
  }
  if (!reviewBody) {
    res.status(400).json({ error: "You must provide review before adding" });
    return;
  }
  if (!rating) {
    res.status(400).json({ error: "You must provide rating" });
    return;
  }
  try {
    if(!req.session.user){ throw "! Login to Add Review";}
    await productData.addToreviews(
      req.session.user._id.toString(),
      req.params.prodId,
      title,
      reviewBody,
      rating
    );
    let success = "Review Added Successfully";
    return res.json({success: success});
  } catch (e) {
    return res.status(404).send({ error: e });
  }
});

router.post("/likes/:prodId", async (req, res) => {
  try {
    await productData.addToLikes(
      req.session.user._id.toString(),
      req.params.prodId
    );
    return res.json("Success");
  } catch (e) {
    return res.status(404).send({ error: e });
  }
});

router.post("/reviews/likes/:revId", async (req, res) => {
  try {
    await productData.addToReviewLikes(
      req.session.user._id.toString(),
      req.params.revId
    );
    return res.json("Success");
  } catch (e) {
    return res.status(404).send({ error: e });
  }
});


router.post("/reviews/comment/:revId", async (req, res) => {
  const {commentBody} = req.body;
  if (!commentBody) {
    res.status(400).json({ error: "You must provide Comment before adding" });
    return;
  }

  try {
    await productData.postComment(
      req.session.user._id.toString(),
      req.params.revId,
      commentBody
    );
    return res.json("Success");
  } catch (e) {
    return res.status(404).send({ error: e });
  }
});


module.exports = router;
