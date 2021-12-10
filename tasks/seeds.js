const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const reviews = data.reviews;
const products = data.products;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  // const first = await products.createProduct(
  //   "Highliner Liquid Gel Eyeliner",
  //   "/public/uploads/highliner.jpg",
  //   [
  //     "https://www.sephora.com/product/highliner-liquid-gel-eyeliner-P451610?skuId=2281087",
  //   ],
  //   "Marc Jacobs Beauty",
  //   14.0,
  //   "Eye-makeup"
  // );

  // await products.createProduct(
  //   "Dior BACKSTAGE Face & Body Foundation",
  //   "/public/uploads/f1.jpg",
  //   [
  //     "https://www.sephora.com/product/backstage-face-body-foundation-P432500?skuId=2070571",
  //   ],
  //   "Dior",
  //   40.0,
  //   "Foundation"
  // );

  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );

  // const second = await products.createProduct(
  //   "Highliner Liquid Gel Eyeliner",
  //   "/public/uploads/highliner.jpg",
  //   [
  //     "https://www.sephora.com/product/highliner-liquid-gel-eyeliner-P451610?skuId=2281087",
  //   ],
  //   "Marc Jacobs Beauty",
  //   14.0,
  //   "Eye-makeup"
  // );

  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );

  // // await products.updateProduct(
  // //   first._id,
  // //   "Highliner Liquid Gel Eyeliner",
  // //   "/public/uploads/highliner.jpg",
  // //   [
  // //     "https://www.sephora.com/product/highliner-liquid-gel-eyeliner-P451610?skuId=2281087",
  // //   ],
  // //   "Marc Jacobs Beauty",
  // //   14,
  // //   "Eye"
  // // );

  // // await products.remove(second._id);

  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );
  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );

  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );
  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );
  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );

  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );
  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );

  // await products.createProduct(
  //   "24/7 Glide-On Waterproof Eyeliner Pencil",
  //   "/public/uploads/24-7.jpg",
  //   [
  //     "https://www.sephora.com/product/24-7-glide-on-eye-pencil-P133707?skuId=1393693",
  //   ],
  //   "Urban Decay",
  //   22.0,
  //   "Eye-makeup"
  // );

  await products.createProduct(
    "BACKSTAGE Face & Body Foundation",
    "/public/uploads/f1.jpg",
    [
      "https://www.sephora.com/product/backstage-face-body-foundation-P432500?skuId=2070571",
    ],
    "Dior",
    40.0,
    "Foundation"
  );

  await products.createProduct(
    "Black Label Detox BB Beauty Balm SPF 30",
    "/public/uploads/fe1.jpg",
    [
      "https://www.sephora.com/product/black-label-detox-bb-beauty-balm-P374568?skuId=1422617",
    ],
    "Dr. Jart+",
    36.0,
    "BB Cream"
  );

  await products.createProduct(
    "Teint Idole Ultra Wear All Over Full Coverage Concealer",
    "/public/uploads/cc1.jpg",
    [
      "https://www.sephora.com/product/lancome-teint-idole-ultra-wear-all-over-full-coverage-concealer-P473717?skuId=2466837",
    ],
    "Lancôme",
    29.0,
    "Concealer"
  );

  await products.createProduct(
    "Diamond Bomb All-Over Diamond Veil",
    "/public/uploads/h1.jpg",
    [
      "https://www.sephora.com/product/diamond-bomb-all-over-diamond-veil-P85225585?skuId=2385169",
    ],
    "FENTY BEAUTY by Rihanna",
    29.25,
    "Concealer"
  );

  await products.createProduct(
    "Rose Quartz Eyeshadow Palette",
    "/public/uploads/p1.jpg",
    [
      "https://www.sephora.com/product/huda-beauty-rose-quartz-eyeshadow-palette-P477474?skuId=2492023",
    ],
    "HUDA BEAUTY",
    67.0,
    "Eye Shadow Palette"
  );

  await products.createProduct(
    "24/7 Moondust Eyeshadow",
    "/public/uploads/es1.jpg",
    [
      "https://www.sephora.com/product/moondust-eyeshadow-P378821?skuId=2418119",
    ],
    "Urban Decay",
    22.0,
    "Eye Shadow Palette"
  );

  await products.createProduct(
    "Matte Revolution Lipstick",
    "/public/uploads/l1.jpg",
    [
      "https://www.sephora.com/product/matte-revolution-lipstick-P433530?skuId=2116879",
    ],
    "Charlotte Tilbury",
    34.0,
    "Lipstick"
  );

  await products.createProduct(
    "Lip Liner To Go",
    "/public/uploads/ll1.jpg",
    ["https://www.sephora.com/product/lip-liner-to-go-P395532?skuId=1656032"],
    "SEPHORA COLLECTION",
    6.0,
    "Lip Liner"
  );

  await products.createProduct(
    "Ambient Lighting Blush Collection",
    "/public/uploads/lb1.jpg",
    [
      "https://www.sephora.com/product/ambient-lighting-blush-collection-P384963?skuId=2378586",
    ],
    "Hourglass",
    40.0,
    "Blush"
  );

  await products.createProduct(
    "Ultra Repair Hydra-Firm Night Cream",
    "/public/uploads/nc1.jpg",
    [
      "https://www.sephora.com/product/ultra-repair-hydra-firm-sleeping-cream-P393076?skuId=1670090",
    ],
    "First Aid Beauty",
    40.0,
    "Night Cream"
  );

  await products.createProduct(
    "Superfood Antioxidant Cleanser",
    "/public/uploads/fcw1.jpg",
    [
      "https://www.sephora.com/product/kale-spinach-green-tea-age-prevention-cleanser-P411387?skuId=1863588",
    ],
    "Youth To The People",
    36.0,
    "Face Wash & Cleanser"
  );

  await products.createProduct(
    "Green Clean Makeup Removing Cleansing Balm",
    "/public/uploads/mr1.jpg",
    [
      "https://www.sephora.com/product/green-clean-makeup-meltaway-cleansing-balm-P417238?skuId=1899103",
    ],
    "Farmacy",
    34.0,
    "Make Removers"
  );

  await products.createProduct(
    "Pore Clearing Clay Mask",
    "/public/uploads/fm1.jpg",
    [
      "https://www.sephora.com/product/innisfree-pore-clearing-clay-mask-P468658?skuId=2443240",
    ],
    "innisfree",
    15.0,
    "Face Mask"
  );

  await products.createProduct(
    "Don't Despair, Repair!™ Deep Conditioning Hair Mask",
    "/public/uploads/hm1.jpg",
    [
      "https://www.sephora.com/product/dont-despair-repair-deep-conditioning-hair-mask-P388628?skuId=1784636",
    ],
    "Briogeo",
    38.0,
    "Hair Mask"
  );

  await products.createProduct(
    "No. 7 Bonding Oil",
    "/public/uploads/ho1.jpg",
    ["https://www.sephora.com/product/no-7-bonding-oil-P447376?skuId=2266765"],
    "Olaplex",
    28.0,
    "Hair Oil"
  );

  await products.createProduct(
    "Donna Born In Roma Eau de Parfum",
    "/public/uploads/ps1.jpg",
    ["https://www.sephora.com/product/born-in-roma-P449116?skuId=2249688"],
    "Valentino",
    105.0,
    "Perfume"
  );

  await users.createUser(
    "rachshah2",
    "/public/uploads/a.jpg",
    "Rachna",
    "Shah",
    "shopping",
    "rachshah@gmail.com",
    "Intermediate"
  );

  await users.createUser(
    "megh123",
    "/public/uploads/b.jpg",
    "Nevil",
    "Ghelani",
    "shopping",
    "nghelani@gmail.com",
    "Basic"
  );
  await users.createUser(
    "riya123",
    "/public/uploads/c.jpg",
    "riya",
    "Andrew",
    "shopping",
    "l_andrew@gmail.com",
    "Advanced"
  );
  await users.createUser(
    "rachshah3",
    "/public/uploads/a.jpg",
    "Rachna",
    "Shah",
    "shopping",
    "rachshah@gmail.com",
    "Intermediate"
  );

  await users.createUser(
    "megh111",
    "/public/uploads/b.jpg",
    "Nevil",
    "Ghelani",
    "shopping",
    "nghelani@gmail.com",
    "Basic"
  );
  await users.createUser(
    "riya111",
    "/public/uploads/c.jpg",
    "riya",
    "Andrew",
    "shopping",
    "l_andrew@gmail.com",
    "Advanced"
  );

  console.log("Done seeding database");

  await db.serverConfig.close();
}
main();
