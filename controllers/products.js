const database = require("../db");

// Get All Products
exports.getProducts = (req, res, next) => {
  database
    .execute("SELECT * FROM products")
    .then(async (products) => {
      hasOffer = false;
      let returnProds = [];
      let homeOffer = false;
      for (let i = 0; i < products[0].length; i++) {
        if (products[0][i].p_wholesale_price != products[0][i].p_offer)
          hasOffer = true;
        else hasOffer = false;
        let homePageOffer = await database.execute(
          `SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`
        );
        let images = await database.execute(
          `SELECT * FROM product_images WHERE p_mtrl=${products[0][i].p_mtrl}`
        );
        let otherImages = [];
        for (let i = 0; i < images[0].length; i++) {
          otherImages[i] = {
            img: images[0][i].p_image,
          };
        }
        if (homePageOffer[0].length != 0) homeOffer = true;
        else homeOffer = false;
        returnProds[i] = {
          mtrl: products[0][i].p_mtrl,
          omada: products[0][i].p_omada,
          name: products[0][i].p_name,
          name1: products[0][i].p_name1,
          retailPrice: products[0][i].p_retail_price.toFixed(2),
          wholesalePrice: products[0][i].p_wholesale_price.toFixed(2),
          offer: products[0][i].p_offer.toFixed(2),
          hasOffer: hasOffer,
          homePageOffer: homeOffer,
          discount: products[0][i].p_dicount,
          code: products[0][i].p_kod,
          description_eng: products[0][i].p_desc_eng,
          stock: products[0][i].p_stock,
          diathesima: products[0][i].p_diathesima,
          desmeumena: products[0][i].p_desmeumena,
          category: products[0][i].p_category,
          subcategory: products[0][i].p_subcategory,
          image: products[0][i].p_image,
          otherImages: otherImages,
          description: products[0][i].p_desc,
          pdf: products[0][i].p_pdf,
          video: products[0][i].p_yt_vid,
          data_sheet: products[0][i].p_data_sheet,
          data_sheet_eng: products[0][i].data_sheet_eng,
          onoma: products[0][i].onoma_product,
          onoma_eng: products[0][i].onoma_product_eng,
          kodikos_kataskeuasti: products[0][i].p_code_kataskeuasti,
          texnikos_kodikos: products[0][i].p_code_texniko,
        };
      }
      // // // database.end();
      res.status(200).json({
        message: "All Products",
        products: returnProds,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

// Get All Products Related
exports.getProductsRelated = async (req, res, next) => {
  let returnProds = [];
  let bad = false;
  if (!req.query.mtrl) {
    bad = true;
  } else {
    let mtrl = req.query.mtrl;
    // // console.log(
    //   `SELECT p_related_mtrl FROM product_page_related WHERE p_mtrl=${mtrl}`
    // );
    let related_mtrl = await database.execute(
      `SELECT p_related_mtrl FROM product_page_related WHERE p_mtrl= ${mtrl} `
    );

    for (let i = 0; i < related_mtrl[0].length; i++) {
      related_mtrl = related_mtrl[0][i].p_related_mtrl;
      let prod = await database.execute(
        `SELECT * FROM products where p_mtrl=${related_mtrl}`
      );
      if (prod[0][0].p_wholesale_price != prod[0][0].p_offer) hasOffer = true;
      else hasOffer = false;
      let homePageOffer = await database.execute(
        `SELECT * FROM products_offer WHERE product_mtrl= ${prod[0][0].p_mtrl}`
      );
      let images = await database.execute(
        `SELECT * FROM product_images WHERE p_mtrl=${prod[0][0].p_mtrl}`
      );
      let otherImages = [];
      for (let i = 0; i < images[0].length; i++) {
        otherImages[i] = {
          img: images[0][i].p_image,
        };
      }
      if (homePageOffer[0].length != 0) homeOffer = true;
      else homeOffer = false;
      returnProds[i] = {
        mtrl: prod[0][0].p_mtrl,
        omada: prod[0][0].p_omada,
        name: prod[0][0].p_name,
        name1: prod[0][0].p_name1,
        retailPrice: prod[0][0].p_retail_price.toFixed(2),
        wholesalePrice: prod[0][0].p_wholesale_price.toFixed(2),
        offer: prod[0][0].p_offer.toFixed(2),
        hasOffer: hasOffer,
        homePageOffer: homeOffer,
        discount: prod[0][0].p_dicount,
        code: prod[0][0].p_kod,
        description_eng: prod[0][0].p_desc_eng,
        stock: prod[0][0].p_stock,
        diathesima: prod[0][0].p_diathesima,
        desmeumena: prod[0][0].p_desmeumena,
        category: prod[0][0].p_category,
        subcategory: prod[0][0].p_subcategory,
        image: prod[0][0].p_image,
        otherImages: otherImages,
        description: prod[0][0].p_desc,
        pdf: prod[0][0].p_pdf,
        video: prod[0][0].p_yt_vid,
        data_sheet: prod[0][0].p_data_sheet,
        data_sheet_eng: prod[0][0].data_sheet_eng,
        onoma: prod[0][0].onoma_product,
        onoma_eng: prod[0][0].onoma_product_eng,
        kodikos_kataskeuasti: prod[0][0].p_code_kataskeuasti,
        texnikos_kodikos: prod[0][0].p_code_texniko,
      };
    }
  }
  // // database.end();
  if (bad) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    res
      .status(200)
      .json({ message: "Related Products", products: returnProds });
  }
};
// get home page offer
exports.getOffers = async (req, res, next) => {
  let offerMtrl = await database.execute("select * from products_offer");
  // console.log(offerMtrl[0]);
  let product = await database.execute(
    `select * from products where p_mtrl =${offerMtrl[0][0].product_mtrl}`
  );
  if (product[0][0].p_wholesale_price != product[0][0].p_offer) hasOffer = true;
  else hasOffer = false;
  let homePageOffer = await database.execute(
    `SELECT * FROM products_offer WHERE product_mtrl= ${product[0][0].p_mtrl}`
  );
  let images = await database.execute(
    `SELECT * FROM product_images WHERE p_mtrl=${product[0][0].p_mtrl}`
  );
  let otherImages = [];
  for (let i = 0; i < images[0].length; i++) {
    otherImages[i] = {
      img: images[0][i].p_image,
    };
  }
  if (homePageOffer[0].length != 0) homeOffer = true;
  else homeOffer = false;
  let returnProds = {
    mtrl: product[0][0].p_mtrl,
    omada: product[0][0].p_omada,
    name: product[0][0].p_name,
    name1: product[0][0].p_name1,
    retailPrice: product[0][0].p_retail_price.toFixed(2),
    wholesalePrice: product[0][0].p_wholesale_price.toFixed(2),
    offer: product[0][0].p_offer.toFixed(2),
    hasOffer: hasOffer,
    homePageOffer: homeOffer,
    discount: product[0][0].p_dicount,
    code: product[0][0].p_kod,
    description_eng: product[0][0].p_desc_eng,
    stock: product[0][0].p_stock,
    diathesima: product[0][0].p_diathesima,
    desmeumena: product[0][0].p_desmeumena,
    category: product[0][0].p_category,
    subcategory: product[0][0].p_subcategory,
    image: product[0][0].p_image,
    otherImages: otherImages,
    description: product[0][0].p_desc,
    pdf: product[0][0].p_pdf,
    video: product[0][0].p_yt_vid,
    data_sheet: product[0][0].p_data_sheet,
    data_sheet_eng: product[0][0].data_sheet_eng,
    onoma: product[0][0].onoma_product,
    onoma_eng: product[0][0].onoma_product_eng,
    kodikos_kataskeuasti: product[0][0].p_code_kataskeuasti,
    texnikos_kodikos: product[0][0].p_code_texniko,
  };
  res.status(200).json({
    message: "Offers",
    products: returnProds,
  });
};
//delete offer
exports.deleteOffer = async (req, res, next) => {
  let bad = false;
  let returnProds = [];
  if (!req.query.mtrl) {
    bad = true;
  } else {
    let mtrl = req.query.mtrl;

    let hasOffer = false;
    let homeOffer = false;
    let updateOffer = await database.execute(
      `UPDATE products SET p_offer = p_wholesale_price , p_dicount = 0 WHERE p_mtrl = ${mtrl} `
    );
    let products = await database.execute("SELECT * FROM products");
    for (let i = 0; i < products[0].length; i++) {
      if (products[0][i].p_wholesale_price != products[0][i].p_offer)
        hasOffer = true;
      else hasOffer = false;
      let homePageOffer = await database.execute(
        `SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`
      );
      let images = await database.execute(
        `SELECT * FROM product_images WHERE p_mtrl=${products[0][i].p_mtrl}`
      );
      let otherImages = [];
      for (let i = 0; i < images[0].length; i++) {
        otherImages[i] = {
          img: images[0][i].p_image,
        };
      }
      if (homePageOffer[0].length != 0) homeOffer = true;
      else homeOffer = false;
      returnProds[i] = {
        mtrl: products[0][i].p_mtrl,
        omada: products[0][i].p_omada,
        name: products[0][i].p_name,
        name1: products[0][i].p_name1,
        retail: products[0][i].p_retail_price.toFixed(2),
        wholesale: products[0][i].p_wholesale_price.toFixed(2),
        offer: products[0][i].p_offer.toFixed(2),
        hasOffer: hasOffer,
        homePageOffer: homeOffer,
        discount: products[0][i].p_dicount,
        code: products[0][i].p_kod,
        description_eng: products[0][i].p_desc_eng,
        stock: products[0][i].p_stock,
        diathesima: products[0][i].p_diathesima,
        desmeumena: products[0][i].p_desmeumena,
        category: products[0][i].p_category,
        subcategory: products[0][i].p_subcategory,
        img: products[0][i].p_image,
        otherImages: otherImages,
        description: products[0][i].p_desc,
        pdf: products[0][i].p_pdf,
        video: products[0][i].p_yt_vid,
        data_sheet: products[0][i].p_data_sheet,
        data_sheet_eng: products[0][i].data_sheet_eng,
        product_name: products[0][i].onoma_product,
        product_name_eng: products[0][i].onoma_product_eng,
        kodikos_kataskeuasti: products[0][i].p_code_kataskeuasti,
        texnikos_kodikos: products[0][i].p_code_texniko,
      };
    }
    // // database.end();
  }

  if (bad) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    res.status(200).json({
      message: "Offer Deleted",
      products: returnProds,
    });
  }
};
// hundle favorites
exports.favorites = async (req, res, next) => {
  let bad = false;
  if (!req.query.mtrl || !req.query.trdr || !req.query.mode) {
    bad = true;
  } else {
    let mtrl = req.query.mtrl;
    let trdr = req.query.trdr;
    let mode = req.query.mode;
    switch (mode) {
      case "insert":
        this.insertFavorite(req, res, next, mtrl, trdr);
        break;
      case "fetch":
        this.fetchFavorites(req, res, next, trdr);
        break;
      case "deleteOne":
        this.deleteOne(req, res, next, mtrl, trdr);
        break;
      case "delete":
        this.deleteAll(req, res, next, trdr);
        break;
    }
  }

  if (bad) {
    res.status(402).json({ message: "Fill The required Fields" });
  }
};
// delete one favorite
exports.deleteOne = async (req, res, next, mtrl, trdr) => {
  let deleteProd = await database.execute(
    `DELETE FROM favorites WHERE p_mtrl=${mtrl} AND c_trdr=${trdr}`
  );
  await this.fetchFavorites(req, res, next, trdr);
};
// delete all favorites
exports.deleteAll = (req, res, next, trdr) => {
  database
    .execute(`DELETE FROM favorites WHERE c_trdr=${trdr}`)
    .then((result) => {
      // console.log(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  res.status(200).json({ message: "Favorites Deleted", products: [] });
};
// insert favorite
exports.insertFavorite = async (req, res, next, mtrl, trdr) => {
  let findProd = await database.execute(
    `SELECT * FROM favorites WHERE p_mtrl=${mtrl} AND c_trdr=${trdr}`
  );
  if (findProd[0].length == 0) {
    let insertFav = await database.execute(
      `INSERT INTO favorites (c_trdr,p_mtrl) VALUES (${trdr},${mtrl})`
    );

    res.status(200).json({ message: "Product Added To Favorites" });
  } else {
    res.status(200).json({ message: "Product Already Exists" });
  }
};
// fetch favorites
exports.fetchFavorites = async (req, res, next, trdr) => {
  let returnProds = [];
  let favorites = await database.execute(
    `SELECT p_mtrl FROM favorites WHERE c_trdr=${trdr}`
  );
  for (let i = 0; i < favorites[0].length; i++) {
    returnProds[i] = await this.getSingelProduct(favorites[0][i].p_mtrl);
  }

  res.status(200).json({
    message: "Favorites",
    products: returnProds,
  });
};
// get single product
exports.getSingelProduct = async (mtrl) => {
  let product = await database.execute(
    `SELECT * FROM products WHERE p_mtrl=${mtrl}`
  );
  let hasOffer = false;
  let homeOffer = false;
  returnProd = {};
  let images = await database.execute(
    `SELECT * FROM product_images WHERE p_mtrl=${mtrl}`
  );
  let otherImages = [];
  for (let i = 0; i < images[0].length; i++) {
    otherImages[i] = {
      img: images[0][i].p_image,
    };
  }
  if (product[0][0].p_wholesale_price != product[0][0].p_offer) hasOffer = true;
  else hasOffer = false;
  let homePageOffer = await database.execute(
    `SELECT * FROM products_offer WHERE product_mtrl= ${product[0][0].p_mtrl}`
  );
  if (homePageOffer[0].length != 0) homeOffer = true;
  else homeOffer = false;
  returnProd = {
    mtrl: product[0][0].p_mtrl,
    omada: product[0][0].p_omada,
    name: product[0][0].p_name,
    name1: product[0][0].p_name1,
    retailPrice: product[0][0].p_retail_price.toFixed(2),
    wholesale: product[0][0].p_wholesale_price.toFixed(2),
    offer: product[0][0].p_offer.toFixed(2),
    hasOffer: hasOffer,
    homePageOffer: homeOffer,
    discount: product[0][0].p_dicount,
    code: product[0][0].p_kod,
    description_eng: product[0][0].p_desc_eng,
    stock: product[0][0].p_stock,
    diathesima: product[0][0].p_diathesima,
    desmeumena: product[0][0].p_desmeumena,
    category: product[0][0].p_category,
    subcategory: product[0][0].p_subcategory,
    image: product[0][0].p_image,
    otherImages: otherImages,
    description: product[0][0].p_desc,
    pdf: product[0][0].p_pdf,
    video: product[0][0].p_yt_vid,
    data_sheet: product[0][0].p_data_sheet,
    data_sheet_eng: product[0][0].data_sheet_eng,
    product_name: product[0][0].onoma_product,
    product_name_eng: product[0][0].onoma_product_eng,
    kodikos_kataskeuasti: product[0][0].p_code_kataskeuasti,
    texnikos_kodikos: product[0][0].p_code_texniko,
    qty:1
  };

  return returnProd;
};
// fetch cart products
exports.fetchCartItems = (req, res, next) => {
  console.log(req.body);
  let bad = false;
  let cartItem = [];
  if (!req.body.trdr) {
    bad = true;
  } else {
    let trdr = req.body.trdr;
    database
      .execute(
        `SELECT p_mtrl,p_qty,group_id,p_wholesale,p_disc FROM products_cart WHERE p_trdr=${trdr}`
      )
      .then(async (results) => {
        for (let i = 0; i < results[0].length; i++) {
          cartItem.push(
            await this.getSingelCartitem(
              results[0][i].p_mtrl,
              results[0][i].p_qty,
              results[0][i].group_id,
              results[0][i].p_wholesale,
              results[0][i].p_disc
            )
          );
        }
        res.status(200).json({
          message: "Cart Items",
          products: cartItem,
        });
      });
  }

  if (bad) {
    res.status(402).json({ message: "Fill The required Fields" });
  } else {
  }
};
// checks if product has offer
exports.hasOffer = (products, i) => {
  if (products[0][i].p_wholesale_price != products[0][i].p_offer) return true;
  else return false;
};
// set homepageoffer
exports.homaepageOffer = async (products, i) => {
  let homePageOffer = await database.execute(
    `SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`
  );
  if (homePageOffer[0].length != 0) return true;
  else return false;
};
// get other images from porduct
exports.getOtherImages = async (mtrl) => {
  let images = await database.execute(
    `SELECT * FROM product_images WHERE p_mtrl=${mtrl}`
  );
  let otherImages = [];
  for (let i = 0; i < images[0].length; i++) {
    otherImages[i] = {
      img: images[0][i].p_image,
    };
  }
  return otherImages;
};
// get single cart item
exports.getSingelCartitem = async (
  mtrl,
  qty,
  group_id,
  wholesale,
  discount
) => {
  // console.log("PEOS");
  let product = await database.execute(
    `SELECT * FROM products WHERE p_mtrl=${mtrl}`
  );
  let hasOffer = false;
  let homeOffer = false;
  returnProd = {};
  let images = await database.execute(
    `SELECT * FROM product_images WHERE p_mtrl=${mtrl}`
  );
  let otherImages = [];
  for (let i = 0; i < images[0].length; i++) {
    otherImages[i] = {
      img: images[0][i].p_image,
    };
  }
  if (product[0][0].p_dicount != 0) hasOffer = true;
  else hasOffer = false;
  let homePageOffer = await database.execute(
    `SELECT * FROM products_offer WHERE product_mtrl= ${mtrl}`
  );
  if (homePageOffer[0].length != 0) homeOffer = true;
  else homeOffer = false;
  returnProd = {
    mtrl: product[0][0].p_mtrl,
    omada: product[0][0].p_omada,
    name: product[0][0].p_name,
    name1: product[0][0].p_name1,
    retailPrice: product[0][0].p_retail_price.toFixed(2),
    wholesalePrice: wholesale,
    offer: product[0][0].p_offer.toFixed(2),
    hasOffer: hasOffer,
    homePageOffer: homeOffer,
    qty: qty,
    discount: discount,
    group_id: group_id,
    code: product[0][0].p_kod,
    description_eng: product[0][0].p_desc_eng,
    stock: product[0][0].p_stock,
    diathesima: product[0][0].p_diathesima,
    desmeumena: product[0][0].p_desmeumena,
    category: product[0][0].p_category,
    subcategory: product[0][0].p_subcategory,
    image: product[0][0].p_image,
    otherImages: otherImages,
    description: product[0][0].p_desc,
    pdf: product[0][0].p_pdf,
    video: product[0][0].p_yt_vid,
    data_sheet: product[0][0].p_data_sheet,
    data_sheet_eng: product[0][0].data_sheet_eng,
    onoma: product[0][0].onoma_product,
    onoma_eng: product[0][0].onoma_product_eng,
    kodikos_kataskeuasti: product[0][0].p_code_kataskeuasti,
    texnikos_kodikos: product[0][0].p_code_texniko,
  };

  // console.log(returnProd);
  return returnProd;
};
// get seen recently products
exports.seeEarlier = async (req, res, next) => {
  let bad = false;
  if (!req.query.trdr || !req.body.mtrl) {
    bad = true;
  } else {
    let mtrl = req.query.mtrl;
    let trdr = req.query.trdr;
    let time_stamp =
      new Date().getFullYear() +
      "" +
      new Date().getMonth() +
      "" +
      new Date().getDay() +
      "" +
      new Date().getHours() +
      "" +
      new Date().getMinutes() +
      "" +
      new Date().getSeconds();

    let findProd = await database.execute(
      `SELECT * FROM see_earlier WHERE c_trdr=${trdr}`
    );
    if (findProd[0].length >= 6) {
      let min = await database.execute(
        `SELECT min(time_stamp) from see_earlier WHERE c_trdr= ${trdr} `
      );
      min = min[0][0]["min(time_stamp)"];
      let deleteProd = await database.execute(
        `DELETE FROM see_earlier WHERE time_stamp=${min}`
      );
      if (!deleteProd[0].affectedRows) {
        const err = "An Error Occured";
        next(err);
      }
      let insert = await database.execute(
        `INSERT INTO see_earlier (c_trdr,p_mtrl,time_stamp) VALUES(${trdr},${mtrl},${time_stamp})`
      );
      if (!insert[0].affectedRows) {
        const err = "An Error Occured";
        next(err);
      }
    }
  }
  if (bad) {
    res.status(402).json({ message: "Fill The required Fields" });
  } else {
    res.status(200).json({ message: "Product Added" });
  }
};
// find mosqui product
exports.findMosquiProduct = async (req, res, next) => {
  let bad = false;
  if (
    !req.query.subcategory ||
    !req.query.fabric ||
    !req.query.profile ||
    !req.query.color ||
    !req.query.width ||
    !req.query.height
  ) {
    bad = true;
  } else {
    let subcategory = req.query.subcategory;
    let fabric = req.query.fabric;
    let profile = req.query.profile;
    let color = req.query.color;
    let width = req.query.width;
    let height = req.query.height;
    let findProd = await database.execute(
      `SELECT * FROM products WHERE p_subcategory=${subcategory} AND color_fabric_id=${fabric} AND color_profile_id=${profile}  and (min_width < ${width} and max_width > ${width}) and (min_height < ${height} and max_height>${height})`
    );
    if (findProd[0].length == 0) {
      res.status(402).json({ message: "No Product Found" });
    } else {
      // console.log(findProd[0]);
      res.status(200).json({
        message: "Product Found",
        product: await this.getSingelProduct(findProd[0][0].p_mtrl),
      });
    }
  }

  if (bad) {
    res.status(402).json({ message: "Fill The Required Fields" });
  }
};
// find related products
exports.findRelatedProducts = async (req, res, next) => {
  let bad = false;
  let related_mtrl;
  let returnProd = [];
  if (!req.query.product_mtrl) {
    bad = true;
  } else {
    let mtrl = req.query.product_mtrl;
    let scope1 = await database.execute(
      `select * from related_products where mtrl=${mtrl} and scope=1`
    );
    // console.log(scope1[0]);
    for (let i = 0; i < scope1[0].length; i++) {
      returnProd.push(await this.getSingelProduct(scope1[0][i].related_mtrl));
    }
  }
  if (bad) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    res
      .status(200)
      .json({ message: "Related Products Found", products: returnProd });
  }
};
// remove cart item
exports.removeCartItem = async (req, res, next) => {
  let bad = false;
  if (!req.body.mtrl || !req.body.trdr || !req.body.id || !req.body.group_id) {
    console.log("hello");
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    console.log("hello");
    let mtrl = req.body.mtrl;
    let trdr = req.body.trdr;
    let id = req.body.id;
    let group_id = req.body.group_id;
    console.log(id);
    let prods;
    switch (id) {
      case "2":
        await this.clearOne(req, res, next, trdr, group_id);
        break;
      default:
        await this.clearAll(req, res, next, trdr);
        // console.log("hello");

        break;
    }
  }
};
// clear all cart
exports.clearAll = async (req, res, next, trdr) => {
  database
    .execute(`delete from products_cart where p_trdr=${trdr}`)
    .then((results) => {
      console.log(results[0]);
      if (results[0].affectedRows) {
        res.status(200).json({ message: "Cart Cleared", products: [] });
      } else {
        this.fetchCartItems(req, res, next, trdr);
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.clearOne = async (req, res, next, trdr, group_id) => {
  database
    .execute(
      `delete from products_cart where p_trdr=${trdr} and group_id=${group_id}`
    )
    .then(async (results) => {
      this.fetchCartItems(req, res, next, trdr);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addToCart = async (req, res, next) => {
  let bad = false;
  if (
    !req.body.mtrl ||
    !req.body.trdr ||
    !req.body.code ||
    !req.body.name ||
    !req.body.name1 ||
    !req.body.img ||
    !req.body.category ||
    !req.body.qty ||
    !req.body.retail ||
    !req.body.wholesale ||
    !req.body.stock ||
    !req.body.group_id ||
    !req.body.p_page ||
    !req.body.dec ||
    !req.body.omada ||
    !req.body.offer ||
    !req.body.empor_katig ||
    !req.body.geo_zoni
  ) {
    bad = true;
  } else {
    let mtrl = req.body.mtrl;
    let trdr = req.body.trdr;
    let code = req.body.code;
    let name = req.body.name;
    let name1 = req.body.name1;
    let img = req.body.img;
    let category = req.body.category;
    let qty = req.body.qty;
    let retail = req.body.retail;
    let wholesale = req.body.wholesale;
    let stock = req.body.stock;
    let group_id = req.body.group_id;
    let p_page = req.body.p_page;
    let dec = req.body.dec;
    let omada = req.body.omada;
    let offer = req.body.offer;
    let empor_katig = req.body.empor_katig;
    let geo_zoni = req.body.geo_zoni;
    let discound;
    let ypokat;
    if (req.body.discound) discound = req.body.discound;
    else discound = 0;
    if (req.body.ypokat) ypokat = req.body.ypokat;

    if (group_id == mtrl) {
      let find = await database.execute(
        `select * from products_cart where p_mtrl=${mtrl} and p_trdr=${trdr}`
      );

      if (find[0].length > 0) {
        if (p_page == 2) {
          database
            .execute(
              `update products_cart set p_qty=p_qty+${qty} where p_mtrl=${mtrl} and p_trdr=${trdr}`
            )
            .then((results) => {
              res
                .status(200)
                .json({ message: "Product updated successfully 0" });
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        } else {
          if (dec == "2") {
            database
              .execute(
                `update products_cart set p_qty=p_qty-1 where p_mtrl=${mtrl} and p_trdr=${trdr}`
              )
              .then((results) => {
                res
                  .status(200)
                  .json({ message: "Product updated successfully 1" });
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
          } else {
            database
              .execute(
                `update products_cart set p_qty=p_qty+1 where p_mtrl=${mtrl} and p_trdr=${trdr}`
              )
              .then((results) => {
                res
                  .status(200)
                  .json({ message: "Product updated successfully 2" });
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
          }
        }
      } else {
        /* 
            
                4 Σεναρια
                ------------------------------------------------
                1. ΤΙΜΗ ΑΝΑ ΠΕΛΑΤΗ ΚΑΙ ΕΙΔΟΣ
                    1) πελατη
                    2) ειδος
                    3) τιμη
                2. ΕΚΠΤΩΣΕΙΣ ΑΝΑ ΥΠΟΚΑΤΑΣΤΗΜΑ EXALCO
                    1) Υποκαταστημα
                    2) Ειδος
                    3) Εκπτωση
                3. ΤΙΜΗ ΑΝΑ ΠΕΛΑΤΗ ΚΑΙ ΟΜΑΔΑ ΕΙΔΟΥΣ
                    1) Πελατης
                    2) Ομαδα Ειδους
                    3) Εκπτωση
                4. ΚΑΤΗΓΟΡΙΑ ΠΕΛΑΤΗ - ΟΜΑΔΑ ΕΙΔΟΥΣ - ΓΕΩΓΡΑΦΙΚΗ ΖΩΝΗ
                    1) Εμπορικη Κατηγορια
                    2) Γεωγραφικη Ζωνη
                    3) Ομαδα
                    4) Εκπτωση
                5. -25% -35%
                    1) Ειδοες
                    2) Ποσοστητα
                    3) Εκπτωση

                2 Περιπτωσεις 
                ------------------------------------------------
                1. Αν ειναι εξαλκο 
                   τα τρεχω ολα με την σερια
                2. Αν δεν ειναι εξαλκο
                    παραλειπτω το 2ο.

               Εκτελεση 
               ------------------------------------------------
                Οταν σε ενα απ τα 5 βρει να αντοιστοιχουν τα πεδια
                παραλειπτει τα υπολοιπα.
                αλλιως τα εκτελει ολα με την σειρα μεχρι το τελος.
                
                
            */
        // ΤΙΜΗ ΑΝΑ ΠΕΛΑΤΗ ΚΑΙ ΕΙΔΟΣ
        let timi_pelati_eidos = await database.execute(
          `select count(trdr) as count from timi_ana_pelati_eidos where trdr=${trdr} and mtrl=${mtrl} `
        );
        if (timi_pelati_eidos[0][0].count > 0) {
          if (offer == wholesale) {
            let new_price = await database.execute(
              `select price from timi_ana_pelati_eidos where trdr=${trdr} and mtrl = ${mtrl}`
            );
            wholesale = new_price[0][0].price;
          }
        } else {
          if (trdr == "444") {
            // ΕΚΠΤΩΣΕΙΣ ΑΝΑ ΥΠΟΚΑΤΑΣΤΗΜΑ EXALCO
            let ekptosis_ana_upokatastima_exalco = await database.execute(
              `select count(ypokat) as count from ekptoseis_ana_ypokat_exalco where ypokat=${ypokat} and omada=${omada}`
            );
            if (ekptosis_ana_upokatastima_exalco[0][0].count > 0) {
              if (offer == wholesale) {
                let new_price = await database.execute(
                  `select ekptosi from ekptoseis_ana_ypokat_exalco where ypokat=${ypokat} and omada=${omada}`
                );
                discound = new_price[0][0].ekptosi;
                wholesale = wholesale - (wholesale * discound) / 100;
              }
            } else {
              let timi_pelati_omada_eidous = await database.execute(
                `select count(trdr) as count from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
              );
              if (timi_pelati_omada_eidous[0][0].count > 0) {
                if (offer == wholesale) {
                  let new_price = await database.execute(
                    `select ekptosi from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
                  );
                  discound = new_price[0][0].ekptosi;
                  wholesale = wholesale - (wholesale * discound) / 100;
                }
              } else {
                let katigoria_pelati_omada_eidous_geo_zoni =
                  await database.execute(
                    `select count(omada) as count from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=`,
                    `'?'`,
                    ` and omada=${omada}`,
                    [geo_zoni]
                  );
                if (katigoria_pelati_omada_eidous_geo_zoni[0][0].count > 0) {
                  if (offer == wholesale) {
                    let new_price = await database.execute(
                      `select ekptosi from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                    );
                    discound = new_price[0][0].ekptosi;
                    wholesale = wholesale - (wholesale * discound) / 100;
                  }
                } else {
                  let ekptosi = await database.execute(
                    `select count(mtrl) as count from ekptosi where mtrl=${mtrl}`
                  );
                  if (ekptosi[0][0].count > 0) {
                    if (offer == wholesale) {
                      let new_price = await database.execute(
                        `select asc(posotita) as posotita from ekptosi where mtrl=${mtrl}`
                      );
                      let pososotita = [
                        new_price[0][0].posotita,
                        new_price[0][1].pososotita,
                      ];
                      if (qty > posotita[1]) {
                        new_preice = database.execute(
                          `select ekptosi from ekptosi where mtrl${mtrl} and posotita=${posotita[1]}`
                        );
                        discound = new_price[0][0].ekptosi;
                        wholesale = wholesale - (wholesale * discound) / 100;
                      } else {
                        new_price = database.execute(
                          `select ekptosi from ekptosi where mtrl=${mtrl} and posotita=${posotita[0]}`
                        );
                        discound = new_price[0][0].ekptosi;
                        wholesale = wholesale - (wholesale * discound) / 100;
                      }
                    }
                  }
                }
              }
            }
          } else {
            let timi_pelati_omada_eidous = await database.execute(
              `select count(trdr) as count from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
            );
            if (timi_pelati_omada_eidous[0][0].count > 0) {
              if (offer == wholesale) {
                let new_price = await database.execute(
                  `select ekptosi from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
                );
                discound = new_price[0][0].ekptosi;
                wholesale = wholesale - (wholesale * discound) / 100;
              }
            } else {
              let katigoria_pelati_omada_eidous_geo_zoni =
                await database.execute(
                  `select count(omada) as count from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                );
              if (katigoria_pelati_omada_eidous_geo_zoni[0][0].count > 0) {
                if (offer == wholesale) {
                  let new_price = await database.execute(
                    `select ekptosi from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                  );
                  discound = new_price[0][0].ekptosi;
                  wholesale = wholesale - (wholesale * discound) / 100;
                }
              } else {
                let ekptosi = await database.execute(
                  `select count(mtrl) as count from ekptosi where mtrl=${mtrl}`
                );
                if (ekptosi[0][0].count > 0) {
                  if (offer == wholesale) {
                    let new_price = await database.execute(
                      `select asc(posotita) as posotita from ekptosi where mtrl=${mtrl}`
                    );
                    let pososotita = [
                      new_price[0][0].posotita,
                      new_price[0][1].pososotita,
                    ];
                    if (qty > posotita[1]) {
                      new_preice = database.execute(
                        `select ekptosi from ekptosi where mtrl${mtrl} and posotita=${posotita[1]}`
                      );
                      discound = new_price[0][0].ekptosi;
                      wholesale = wholesale - (wholesale * discound) / 100;
                    } else {
                      new_price = database.execute(
                        `select ekptosi from ekptosi where mtrl=${mtrl} and posotita=${posotita[0]}`
                      );
                      discound = new_price[0][0].ekptosi;
                      wholesale = wholesale - (wholesale * discound) / 100;
                    }
                  }
                }
              }
            }
          }
          database
            .execute(
              `insert into products_cart(p_mtrl,p_trdr,p_code,p_name,p_name1,p_img,p_category,p_qty,p_retail,p_wholesale,p_stock,p_disc,group_id) values(${mtrl},${trdr},'${code}','${name}','${name1}','${img}',${category},${qty},${retail},${wholesale},${stock},${discound},${group_id})`
            )
            .then((results) => {
              res.status(200).json({
                message: "Product added successfully",
              });
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        }
      }
    } else {
      let select = await database.execute(
        `select * from products_cart where group_id=${group_id} and p_mtrl=${mtrl} and p_trdr=${trdr}`
      );
      if (select[0].length > 0) {
        if (p_page == 2) {
          database
            .execute(
              `update products_cart set p_qty=${qty}+p_qty where group_id=${group_id} and p_trdr=${trdr}`
            )
            .then((results) => {
              res.status(200).json({
                message: "Product updated successfully 0",
              });
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        } else {
          if (dec == "2") {
            database
              .execute(
                `update products_cart set p_qty=p_qty-1 where group_id=${group_id} and p_mtrl=${mtrl} and p_trdr=${trdr}`
              )
              .then((results) => {
                res.status(200).json({
                  message: "Product updated successfully 1",
                });
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
          } else {
            database
              .execute(
                `update products_cart set p_qty=p_qty+1 where group_id=${group_id} and p_mtrl=${mtrl} and p_trdr=${trdr}`
              )
              .then((results) => {
                res.status(200).json({
                  message: "Product updated successfully 1.2",
                });
              })
              .catch((err) => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
          }
        }
      } else {
        let timi_pelati_eidos = await database.execute(
          `select count(trdr) as count from timi_ana_pelati_eidos where trdr=${trdr} and mtrl=${mtrl} `
        );
        if (timi_pelati_eidos[0][0].count > 0) {
          if (offer == wholesale) {
            let new_price = await database.execute(
              `select price from timi_ana_pelati_eidos where trdr=${trdr} and mtrl = ${mtrl}`
            );
            wholesale = new_price[0][0].price;
          }
        } else {
          if (trdr == "444") {
            // ΕΚΠΤΩΣΕΙΣ ΑΝΑ ΥΠΟΚΑΤΑΣΤΗΜΑ EXALCO
            let ekptosis_ana_upokatastima_exalco = await database.execute(
              `select count(ypokat) as count from ekptoseis_ana_ypokat_exalco where ypokat=${ypokat} and omada=${omada}`
            );
            if (ekptosis_ana_upokatastima_exalco[0][0].count > 0) {
              if (offer == wholesale) {
                let new_price = await database.execute(
                  `select ekptosi from ekptoseis_ana_ypokat_exalco where ypokat=${ypokat} and omada=${omada}`
                );
                discound = new_price[0][0].ekptosi;
                wholesale = wholesale - (wholesale * discound) / 100;
              }
            } else {
              let timi_pelati_omada_eidous = await database.execute(
                `select count(trdr) as count from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
              );
              if (timi_pelati_omada_eidous[0][0].count > 0) {
                if (offer == wholesale) {
                  let new_price = await database.execute(
                    `select ekptosi from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
                  );
                  discound = new_price[0][0].ekptosi;
                  wholesale = wholesale - (wholesale * discound) / 100;
                }
              } else {
                let katigoria_pelati_omada_eidous_geo_zoni =
                  await database.execute(
                    `select count(omada) as count from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                  );
                if (katigoria_pelati_omada_eidous_geo_zoni[0][0].count > 0) {
                  if (offer == wholesale) {
                    let new_price = await database.execute(
                      `select ekptosi from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                    );
                    discound = new_price[0][0].ekptosi;
                    wholesale = wholesale - (wholesale * discound) / 100;
                  }
                } else {
                  let ekptosi = await database.execute(
                    `select count(mtrl) as count from ekptosi where mtrl=${mtrl}`
                  );
                  if (ekptosi[0][0].count > 0) {
                    if (offer == wholesale) {
                      let new_price = await database.execute(
                        `select asc(posotita) as posotita from ekptosi where mtrl=${mtrl}`
                      );
                      let pososotita = [
                        new_price[0][0].posotita,
                        new_price[0][1].pososotita,
                      ];
                      if (qty > posotita[1]) {
                        new_preice = database.execute(
                          `select ekptosi from ekptosi where mtrl${mtrl} and posotita=${posotita[1]}`
                        );
                        discound = new_price[0][0].ekptosi;
                        wholesale = wholesale - (wholesale * discound) / 100;
                      } else {
                        new_price = database.execute(
                          `select ekptosi from ekptosi where mtrl=${mtrl} and posotita=${posotita[0]}`
                        );
                        discound = new_price[0][0].ekptosi;
                        wholesale = wholesale - (wholesale * discound) / 100;
                      }
                    }
                  }
                }
              }
            }
          } else {
            let timi_pelati_omada_eidous = await database.execute(
              `select count(trdr) as count from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
            );
            if (timi_pelati_omada_eidous[0][0].count > 0) {
              if (offer == wholesale) {
                let new_price = await database.execute(
                  `select ekptosi from timi_ana_pelati_omada_eidous where trdr=${trdr} and omada_eidous=${omada}`
                );
                discound = new_price[0][0].ekptosi;
                wholesale = wholesale - (wholesale * discound) / 100;
              }
            } else {
              let katigoria_pelati_omada_eidous_geo_zoni =
                await database.execute(
                  `select count(omada) as count from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                );
              if (katigoria_pelati_omada_eidous_geo_zoni[0][0].count > 0) {
                if (offer == wholesale) {
                  let new_price = await database.execute(
                    `select ekptosi from katigoria_pelati_omada_eidous_geo_zoni where empor_katig=${empor_katig} and geo_zoni=${geo_zoni} and omada=${omada}`
                  );
                  discound = new_price[0][0].ekptosi;
                  wholesale = wholesale - (wholesale * discound) / 100;
                }
              } else {
                let ekptosi = await database.execute(
                  `select count(mtrl) as count from ekptosi where mtrl=${mtrl}`
                );
                if (ekptosi[0][0].count > 0) {
                  if (offer == wholesale) {
                    let new_price = await database.execute(
                      `select asc(posotita) as posotita from ekptosi where mtrl=${mtrl}`
                    );
                    let pososotita = [
                      new_price[0][0].posotita,
                      new_price[0][1].pososotita,
                    ];
                    if (qty > posotita[1]) {
                      new_preice = database.execute(
                        `select ekptosi from ekptosi where mtrl${mtrl} and posotita=${posotita[1]}`
                      );
                      discound = new_price[0][0].ekptosi;
                      wholesale = wholesale - (wholesale * discound) / 100;
                    } else {
                      new_price = database.execute(
                        `select ekptosi from ekptosi where mtrl=${mtrl} and posotita=${posotita[0]}`
                      );
                      discound = new_price[0][0].ekptosi;
                      wholesale = wholesale - (wholesale * discound) / 100;
                    }
                  }
                }
              }
            }
          }
        }
        database
          .execute(
            `insert into products_cart(p_mtrl,p_trdr,p_code,p_name,p_name1,p_img,p_category,p_qty,p_retail,p_wholesale,p_stock,p_disc,group_id) values(${mtrl},${trdr},'${code}','${name}','${name1}','${img}',${category},${qty},${retail},${wholesale},${stock},${discound},${group_id})`
          )
          .then((results) => {
            res.status(200).json({
              message: "Product added successfully",
            });
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      }
    }
  }
  if (bad) {
    res.status(402).json({ message: "Fill The Required Fields" });
  }
};
exports.addProductBasedOnGrouping = async (req, res, next) => {
  // let scope2 = [];
  // let scope3 = [];
  if (!req.body.product_mtrl || !req.body.grouping) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    let mtrl = req.body.product_mtrl;
    let grouping = req.body.grouping;
    scope2 = await this.getScope2(mtrl, grouping);
    scope3 = await this.getScope3(mtrl);
    res.status(200).json({
      message: "Crown And Adaptors",
      Scope2: scope2,
      Scope3: scope3,
    });
  }
};

exports.getScope2 = async (mtrl, grouping) => {
  let scope2 = [];
  try {
    let relatedProds = await database.execute(`
            select related_mtrl,quantity from related_products where mtrl=${mtrl} and scope=2 and grouping=${grouping}
            `);
    // console.log(relatedProds[0]);
    for (let i = 0; i < relatedProds[0].length; i++) {
      scope2[i] = await this.getSingelProduct(relatedProds[0][i].related_mtrl);
    }
    // console.log(scope2);
    return scope2;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};
exports.getScope3 = async (mtrl) => {
  let scope3 = [];
  try {
    let relatedProds = await database.execute(
      `select * from related_products where mtrl=${mtrl} and scope=3`
    );
    for (let i = 0; i < relatedProds[0].length; i++) {
      scope3[i] = await this.getSingelProduct(relatedProds[0][i].related_mtrl);
    }
    return scope3;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};

exports.search = async (req, res, next) => {
  let search = req.body.search;
  if (!search) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    if (search == "100") {
      await this.getProducts(req, res, next);
    } else {
      database
        .execute(
          `select * from products where p_kod like '%${search}%'  or p_name like '%${search}%'`
        )
        .then(async (results) => {
          let returnprod = [];
          for (let i = 0; i < results[0].length; i++) {
            returnprod[i] = await this.getSingelProduct(results[0][i].p_mtrl);
          }
          res.status(200).json({
            message: "Found " + results[0].length + " Products",
            products: returnprod,
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    }
  }
};
exports.getSeeEarlier = (req, res, next) => {
  let trdr = req.body.trdr;
  if (!trdr) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    database
      .execute(
        `
          select * from see_earlier where c_trdr=${trdr}
    `
      )
      .then(async products=> {
        let returnProds = [];
        for (let i = 0; i < products[0].length; i++) {
          returnProds[i] = await this.getSingelProduct(products[0][i].p_mtrl);
        }
        res.status(200).json({
          message: returnProds.length + " Products Found",
          products: returnProds
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
exports.offers = (req,res,next) =>{
  const mtrl = req.body.mtrl;
  const offer = req.body.offer;
  const discount = req.body.discount;
  if(!mtrl || !offer || !discount){
    res.send(402).json({message:"Fill The Required Fields"})
  }else{
    database
    .execute(
      `update products set p_offer=${offer} ,p_dicount=${discount} where p_mtrl=${mtrl}`
    )
    .then(async results=>{
        await this.getProducts(req,res,next);
    })
    .catch(err=>{
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
  }


}