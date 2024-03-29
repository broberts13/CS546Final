const productsRoutes = require("./products.js");
const reviewsRoutes = require("./reviews.js");
const usersRoutes = require("./users.js");
const adminRoutes = require("./admin.js");
const usersData = require("../data").users;
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const splitted = file.originalname.split(".");
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + splitted[splitted.length - 1]
    );
  },
});
var uploadSingle = multer({ storage: storage }).single("image");

const constructorMethod = (app) => {
  app.use("/products", productsRoutes);
  app.use("/reviews", reviewsRoutes);
  app.use("/users", usersRoutes);
  app.use("/admin", adminRoutes);

  app.get("/", (req, res) => {
    return res.render("landing/landing", { user: req.session.user });
  });

  app.post("/uploadSingle", (req, res) => {
    uploadSingle(req, res, function (err) {
      if (err) {
        return res.status(500).json("Failed to upload image");
      }
      return res.json("/" + req.file.destination + "/" + req.file.filename);
    });
  });

  // app.get("/logout", (req, res) => {
  //   req.session.destroy();
  //   res.redirect("/");
  // });

  app.get("/logout", function (req, res) {
    if (!req.session.user) {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      res.redirect("/");
    }
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    req.session.destroy();
    res.redirect("/");
  });

  // app.use(function (req, res, next) {
  //   if (!req.user)
  //     res.header(
  //       "Cache-Control",
  //       "private, no-cache, no-store, must-revalidate"
  //     );
  //   next();
  // });

  app.get("/login", (req, res) => {
    return res.render("users/login", { error: req.query.error });
  });

  app.get("/signup", (req, res) => {
    return res.render("users/signup", { user: req.session.user });
  });

  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      return res.redirect("/login?error=Enter UserName");
    }

    if (!password) {
      return res.redirect("/login?error=Enter Password");
    }
    try {
      const user = await usersData.login(username, password);
      req.session.user = user;
      res.render("landing/landing", { user: req.session.user });
    } catch (e) {
      return res.redirect("/login?error=" + e);
    }
  });

  app.use("*", (req, res) => {
   res.status(404).render("landing/error", { error: "Not found" });
   // return res.redirect("/?error=Not Found");
  });
};

module.exports = constructorMethod;
