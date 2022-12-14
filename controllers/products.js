const { json } = require("body-parser");
const e = require("express");
const database = require("../db");

// Get All Products
exports.getProducts = (req, res, next) => {
  const sub_cat_id = req.query.sub_cat_id;
  if (sub_cat_id) {
    database
      .execute(
        "SELECT * FROM products where p_subcategory=? order by onoma_product  ASC",
        [sub_cat_id]
      )
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
            image: products[0][i].p_image,
            otherImages: otherImages,
            description: products[0][i].p_desc,
            pdf: await this.getPdf(products[0][i].p_mtrl),
            video: products[0][i].p_yt_vid,
            data_sheet: products[0][i].p_data_sheet,
            data_sheet_eng: products[0][i].data_sheet_eng,
            product_name: products[0][i].onoma_product,
            product_name_eng: products[0][i].onoma_product_eng,
            kodikos_kataskeuasti: products[0][i].p_code_kataskeuasti,
            texnikos_kodikos: products[0][i].p_code_texniko,
            sintomi_per: products[0][i].sintomi_per,
            sintomi_per_eng: products[0][i].sintomi_per_eng,
            addedToFav: products[0][i].isFav,
            mm: products[0][i].p_monada_metrisis,
            anamenomena:products[0][i].anamenomena
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
  } else {
    database
      .execute("SELECT * FROM products order by onoma_product ASC")
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
            image: products[0][i].p_image,
            otherImages: otherImages,
            description: products[0][i].p_desc,
            pdf: await this.getPdf(products[0][i].p_mtrl),
            video: products[0][i].p_yt_vid,
            data_sheet: products[0][i].p_data_sheet,
            data_sheet_eng: products[0][i].data_sheet_eng,
            onoma: products[0][i].onoma_product,
            onoma_eng: products[0][i].onoma_product_eng,
            kodikos_kataskeuasti: products[0][i].p_code_kataskeuasti,
            texnikos_kodikos: products[0][i].p_code_texniko,
            sintomi_per: products[0][i].sintomi_per,
            sintomi_per_eng: products[0][i].sintomi_per_eng,
            addedToFav: products[0][i].isFav,
            mm: products[0][i].p_monada_metrisis,
            anamenomena:products[0][i].anamenomena
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
  }
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
        retail: prod[0][0].p_retail_price.toFixed(2),
        wholesale: prod[0][0].p_wholesale_price.toFixed(2),
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
        pdf: await this.getPdf(prod[0][0].p_mtrl),
        video: prod[0][0].p_yt_vid,
        data_sheet: prod[0][0].p_data_sheet,
        data_sheet_eng: prod[0][0].data_sheet_eng,
        onoma: prod[0][0].onoma_product,
        onoma_eng: prod[0][0].onoma_product_eng,
        kodikos_kataskeuasti: prod[0][0].p_code_kataskeuasti,
        texnikos_kodikos: prod[0][0].p_code_texniko,
        sintomi_per: prod[0][0].sintomi_per,
        sintomi_per_eng: prod[0][0].sintomi_per_eng,
        addedToFav: prod[0][0].isFav,
        mm: prod[0][0].p_monada_metrisis,
        anamenomena:prod[0][0].anamenomena
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
    retail: product[0][0].p_retail_price.toFixed(2),
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
    pdf: await this.getPdf(product[0][0].p_mtrl),
    video: product[0][0].p_yt_vid,
    data_sheet: product[0][0].p_data_sheet,
    data_sheet_eng: product[0][0].data_sheet_eng,
    product_name: product[0][0].onoma_product,
    product_name_eng: product[0][0].onoma_product_eng,
    kodikos_kataskeuasti: product[0][0].p_code_kataskeuasti,
    texnikos_kodikos: product[0][0].p_code_texniko,
    sintomi_per: product[0][0].sintomi_per,
    sintomi_per_eng: product[0][0].sintomi_per_eng,
    addedToFav: product[0][0].isFav,
    mm: product[0][0].p_monada_metrisis,
    anamenomena:product[0][0].anamenomena
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
        pdf: await this.getPdf(products[0][i].p_mtrl),
        video: products[0][i].p_yt_vid,
        data_sheet: products[0][i].p_data_sheet,
        data_sheet_eng: products[0][i].data_sheet_eng,
        product_name: products[0][i].onoma_product,
        product_name_eng: products[0][i].onoma_product_eng,
        kodikos_kataskeuasti: products[0][i].p_code_kataskeuasti,
        texnikos_kodikos: products[0][i].p_code_texniko,
        sintomi_per: products[0][i].sintomi_per,
        sintomi_per_eng: products[0][i].sintomi_per_eng,
        addedToFav: products[0][i].isFav,
        mm: products[0][i].p_monada_metrisis,
        anamenomena:products[0][i].anamenomena
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
    retail: product[0][0].p_retail_price.toFixed(2),
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
    pdf: await this.getPdf(product[0][0].p_mtrl),
    video: product[0][0].p_yt_vid,
    data_sheet: product[0][0].p_data_sheet,
    data_sheet_eng: product[0][0].data_sheet_eng,
    product_name: product[0][0].onoma_product,
    product_name_eng: product[0][0].onoma_product_eng,
    kodikos_kataskeuasti: product[0][0].p_code_kataskeuasti,
    texnikos_kodikos: product[0][0].p_code_texniko,
    qty: 1,
    sintomi_per: product[0][0].sintomi_per,
    sintomi_per_eng: product[0][0].sintomi_per_eng,
    addedToFav: product[0][0].isFav,
    mm: product[0][0].p_monada_metrisis,
    anamenomena:product[0][0].anamenomena
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
  wholesale = +wholesale;
  returnProd = {
    mtrl: product[0][0].p_mtrl,
    omada: product[0][0].p_omada,
    name: product[0][0].p_name,
    name1: product[0][0].p_name1,
    retail: product[0][0].p_retail_price.toFixed(2),
    wholesale: wholesale.toFixed(2),
    offer: product[0][0].p_offer.toFixed(2),
    hasOffer: hasOffer,
    homePageOffer: homeOffer,
    qty: +qty,
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
    pdf: await this.getPdf(product[0][0].p_mtrl),
    video: product[0][0].p_yt_vid,
    data_sheet: product[0][0].p_data_sheet,
    data_sheet_eng: product[0][0].data_sheet_eng,
    product_name: product[0][0].onoma_product,
    product_name_eng: product[0][0].onoma_product_eng,
    kodikos_kataskeuasti: product[0][0].p_code_kataskeuasti,
    texnikos_kodikos: product[0][0].p_code_texniko,
    sintomi_per: product[0][0].sintomi_per,
    sintomi_per: product[0][0].sintomi_per_eng,
    addedToFav: product[0][0].isFav,
    mm: product[0][0].p_monada_metrisis,
    anamenomena:product[0][0].anamenomena
  };

  // console.log(returnProd);
  return returnProd;
};
// get seen recently products
exports.seeEarlier = async (req, res, next) => {
  let bad = false;
  if (!req.query.trdr || !req.query.mtrl) {
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
      `SELECT * FROM products WHERE p_subcategory=${subcategory} AND color_fabric_id=${fabric} AND color_profile_id=${profile}  and (min_width <= ${width} and max_width >= ${width}) and (min_height <= ${height} and max_height>=${height})`
    );
    if (findProd[0].length == 0) {
      res.status(200).json({ message: "No Product Found" });
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
  console.log(req.body.stock);
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
            
                4 ??????????????
                ------------------------------------------------
                1. ???????? ?????? ???????????? ?????? ??????????
                    1) ????????????
                    2) ??????????
                    3) ????????
                2. ?????????????????? ?????? ???????????????????????? EXALCO
                    1) ????????????????????????
                    2) ??????????
                    3) ??????????????
                3. ???????? ?????? ???????????? ?????? ?????????? ????????????
                    1) ??????????????
                    2) ?????????? ????????????
                    3) ??????????????
                4. ?????????????????? ???????????? - ?????????? ???????????? - ???????????????????? ????????
                    1) ???????????????? ??????????????????
                    2) ???????????????????? ????????
                    3) ??????????
                    4) ??????????????
                5. -25% -35%
                    1) ????????????
                    2) ??????????????????
                    3) ??????????????

                2 ?????????????????????? 
                ------------------------------------------------
                1. ???? ?????????? ???????????? 
                   ???? ?????????? ?????? ???? ?????? ??????????
                2. ???? ?????? ?????????? ????????????
                    ???????????????????? ???? 2??.

               ???????????????? 
               ------------------------------------------------
                ???????? ???? ?????? ???? ???? 5 ???????? ???? ?????????????????????????? ???? ??????????
                ?????????????????????? ???? ????????????????.
                ???????????? ???? ?????????????? ?????? ???? ?????? ?????????? ?????????? ???? ??????????.
                
                
            */
        // ???????? ?????? ???????????? ?????? ??????????
        let timi_pelati_eidos = await database.execute(
          `select count(trdr) as count from timi_ana_pelati_eidos where trdr=${trdr} and mtrl=${mtrl} `
        );
        if (timi_pelati_eidos[0][0].count > 0) {
          if (offer == wholesale) {
            let new_price = await database.execute(
              `select price from timi_ana_pelati_eidos where trdr=${trdr} and mtrl = ${mtrl}`
            );
            wholesale = new_price[0][0].price;
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
        } else {
          if (trdr == "444") {
            // ?????????????????? ?????? ???????????????????????? EXALCO
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
            // ?????????????????? ?????? ???????????????????????? EXALCO
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
          `select * from products where (p_kod like '%${search}%'  or p_name like '%${search}%') and p_category!=116`
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
      .then(async (products) => {
        let returnProds = [];
        for (let i = 0; i < products[0].length; i++) {
          returnProds[i] = await this.getSingelProduct(products[0][i].p_mtrl);
        }
        res.status(200).json({
          message: returnProds.length + " Products Found",
          products: returnProds,
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
exports.offers = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const offer = req.body.offer;
  const discount = req.body.discount;
  if (!mtrl || !offer || !discount) {
    res.send(402).json({ message: "Fill The Required Fields" });
  } else {
    database
      .execute(
        `update products set p_offer=${offer} ,p_dicount=${discount} where p_mtrl=${mtrl}`
      )
      .then(async (results) => {
        await this.getProducts(req, res, next);
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
exports.homeOffer = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const discount = req.body.discount;
  if (!mtrl || !discount) {
    res.status(402).json({ message: "Fill The Require Fields" });
  } else {
    database
      .execute(`select * from products_offer`)
      .then((results) => {
        if (results[0].length == 0) {
          database
            .execute(
              `insert into product_offer(product_mtrl,p_offer_disc) values (${mtrl},${discount})`
            )
            .then(async (inserted) => {
              await this.getProducts(req, res, next);
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
              `update products_offer set product_mtrl=${mtrl},p_offer_disc=${discount}`
            )
            .then(async (updated) => {
              await this.getProducts(req, res, next);
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.getSugg = (req, res, next) => {
  const mtrl = req.body.mtrl;
  if (!mtrl) {
    res.status(402).json({ message: "Fill The Required Fields" });
  } else {
    database
      .execute(
        `select p_related_mtrl from product_page_related where p_mtrl=${mtrl}`
      )
      .then(async (relatedProd) => {
        let prods = [];
        for (let i = 0; i < relatedProd[0].length; i++) {
          console.log(relatedProd[0][i].p_related_mtrl);
          prods[i] = await this.getSingelProduct(
            relatedProd[0][i].p_related_mtrl
          );
        }
        res.status(200).json({
          message: "Related Products",
          products: prods,
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

exports.offersByCategory = (req, res, next) => {
  const category_id = req.body.category_id;
  if (!category_id) {
    res.status(402).json({ message: "Fill The require Fields" });
  } else {
    database
      .execute(
        `select * from products where p_category = ${category_id} and p_dicount!=0 and p_offer!=p_wholesale_price`
      )
      .then(async (offers) => {
        let returnProds = [];
        for (let i = 0; i < offers[0].length; i++) {
          returnProds[i] = await this.getSingelProduct(offers[0][i].p_mtrl);
        }
        res.status(200).json({
          message: "Offers By Category",
          products: returnProds,
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
exports.updateDataSheet = (req, res, next) => {
  const data_el = req.body.data_el;
  const data_en = req.body.data_en;
  const mtrl = req.body.mtrl;
  if (!data_el || !data_en || !mtrl) {
    res.status(402).json({ message: "Fill The required Fields" });
  } else {
    database
      .execute(
        "update products set p_data_sheet=? , data_sheet_eng=? where p_mtrl=?",
        [data_el, data_en, mtrl]
      )
      .then(async (update) => {
        res.status(200).json({
          message: "Datasheet  Updated",
          product: await this.getSingelProduct(mtrl),
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

exports.updateDescription = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const desc = req.body.desc;
  const desc_eng = req.body.desc_eng;

  if (!mtrl || !desc || !desc_eng) {
    res.status(402).json({ message: "Fill The Rquired Fields" });
  } else {
    database
      .execute("update products set  p_desc=? , p_desc_eng=? where p_mtrl=?", [
        desc,
        desc_eng,
        mtrl,
      ])
      .then(async (results) => {
        res.status(200).json({
          message: "Description Updated",
          product: await this.getSingelProduct(mtrl),
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

exports.updateSingleImage = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const image = req.body.image;

  if (!mtrl || !image) {
    res.status(402).json({ message: "fill the require fields" });
  } else {
    database
      .execute("update products set p_image=? where p_mtrl=?", [image, mtrl])
      .then((results) => {
        res.status(200).json({ message: "Photo Profile Updated" });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
      });
  }
};

exports.getColors = async (req, res, next) => {
  const fabric_color = await this.getFabric();
  const polydrox_color = await this.getPolydrox();
  const profile_color = await this.getProfile();
  const ral_color = await this.getRal();
  const wooden_color = await this.getWooden();

  res.status(200).json({
    message: "All Colors Fetched Successfully",
    fabric: fabric_color,
    polydrox: polydrox_color,
    profile: profile_color,
    ral: ral_color,
    wooden: wooden_color,
  });
};

exports.getWooden = async () => {
  let returnWooden = [];
  let wooden = await database.execute("select * from wooden_colors");
  for (let i = 0; i < wooden[0].length; i++) {
    returnWooden[i] = {
      id: wooden[0][i].wooden_id,
      name: wooden[0][i].wooden_name,
    };
  }
  return returnWooden;
};

exports.getRal = async () => {
  let returnRal = [];
  let ral = await database.execute("select * from ral_color");
  for (let i = 0; i < ral[0].length; i++) {
    returnRal[i] = {
      id: ral[0][i].ral_id,
      name: ral[0][i].ral_name,
    };
  }
  return returnRal;
};

exports.getProfile = async () => {
  let returnProfile = [];
  let profile = await database.execute("select * from profile_color");
  for (let i = 0; i < profile[0].length; i++) {
    returnProfile[i] = {
      id: profile[0][i].profile_id,
      name: profile[0][i].profile_name,
    };
  }
  return returnProfile;
};

exports.getPolydrox = async () => {
  let returnPolydrox = [];
  let polydrox = await database.execute("select * from polydrox_color");
  for (let i = 0; i < polydrox[0].length; i++) {
    returnPolydrox[i] = {
      id: polydrox[0][i].polydrox_id,
      name: polydrox[0][i].polydrox_name,
    };
  }
  return returnPolydrox;
};

exports.getFabric = async () => {
  let returnFabric = [];
  let fabric = await database.execute("select * from fabric_color");
  for (let i = 0; i < fabric[0].length; i++) {
    returnFabric[i] = {
      id: fabric[0][i].color_id,
      name: fabric[0][i].color_name,
    };
  }
  return returnFabric;
};

exports.uploadVideo = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const url = req.body.url;
  let host = url.split("/");

  if (!mtrl || !url) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    //console.log(url.host);
    if (req.body.method || host[2] != "www.youtube.com") {
      database
        .execute("update products set p_yt_vid=? where p_mtrl=?", [
          "empty",
          mtrl,
        ])
        .then(async (results) => {
          res.status(200).json({
            message: "Video Deleted",
            product: await this.getSingelProduct(mtrl),
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    } else {
      let validUrl = req.body.url.replace("watch?", "embed/");
      validUrl = validUrl.replace("v=", "");
      validUrl = validUrl.split("&");
      validUrl = validUrl[0];
      database
        .execute("update products set p_yt_vid=? where p_mtrl=?", [
          validUrl,
          mtrl,
        ])
        .then(async (results) => {
          res.status(200).json({
            message: "Video uploaded Successfully",
            product: await this.getSingelProduct(mtrl),
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
exports.uploadPdfToProduct = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const pdfName = req.body.pdfName;
  if (!mtrl || !pdfName) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    database
      .execute("select * from pdfs where mtrl=? and pdf=?", [mtrl, pdfName])
      .then(async (results) => {
        if (results[0].length == 0) {
          let update = await database.execute(
            "insert into pdfs (pdf,mtrl) VALUES(?,?)",
            [pdfName, mtrl]
          );
          await this.getProducts(req, res, next);
        } else {
          await this.getProducts(req, res, next);
        }
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.removeSinglePdf = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const pdf = req.body.pdf;
  if (!mtrl || !pdf) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    database
      .execute("delete from pdfs where pdf=? and mtrl=?", [pdf, mtrl])
      .then(async (results) => {
        await this.getProducts(req, res, next);
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
exports.secondaryImages = async (req, res, next) => {
  const mtrl = req.body.mtrl;
  const img = req.body.img;
  const mode = req.body.mode;
  if (!mtrl || !img || !mode)
    res.status(402).json({ message: "fill the require fields" });
  else {
    const imageArray = this.fromStringToArray(img);
    switch (mode) {
      case "insert":
        await this.insertImages(req, res, next, imageArray, mtrl);
        break;
      case "getimage":
        await this.getProducts(req, res, next);
        break;
      case "remove":
        await this.remove(req, res, next, mtrl, imageArray);
        break;
    }
  }
};
exports.remove = (req, res, next, mtrl, images) => {
  database
    .execute("delete from product_images where p_mtrl=? and p_image=?", [
      mtrl,
      images[0],
    ])
    .then(async (results) => {
      await this.getProducts(req, res, next);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.imageExists = async (mtrl, image) => {
  let find = await database.execute(
    "select * from product_images where p_mtrl=? and p_image=?",
    [mtrl, image]
  );
  if (find[0].length > 0) {
    return true;
  } else {
    return false;
  }
};
exports.insertImages = async (req, res, next, images, mtrl) => {
  let oneExists = false;
  for (let i = 0; i < images.length; i++) {
    if (!(await this.imageExists(mtrl, images[i]))) {
      try {
        let insert = await database.execute(
          "insert into product_images (p_mtrl,p_image) values (?,?)",
          [mtrl, images[i]]
        );
        await this.getProducts(req, res, next);
      } catch (err) {
        throw new Error(err);
      }
    } else {
      oneExists = true;
    }
  }
};
exports.fromStringToArray = (string) => {
  let arr = string.split(",");
  return arr;
};
exports.removeThumb = (req, res, next) => {
  const mtrl = req.body.mtrl;
  if (!mtrl) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    database
      .execute("update products set p_image=? where p_mtrl=?", [
        "https://perlarest.vinoitalia.gr/php-auth-api/images.png",
        mtrl,
      ])
      .then(async (results) => {
        await this.getProducts(req, res, next);
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};
exports.getSingle = async (req, res, next) => {
  const mtrl = req.body.mtrl;
  if (mtrl) {
    res.status(200).json({
      product: await this.getSingelProduct(mtrl),
    });
  } else {
    const id = req.body.id;
    const name = req.body.name;
    const category = req.body.category;
    if (!id || !name || !category) {
      res.status(402).json({ message: "fill the required fields" });
    } else {
      res.status(200).json({
        id: id,
        name: name,
        category: category,
      });
    }
  }
};

exports.isFavorite = (req, res, next) => {
  const mtrl = req.body.mtrl;
  const trdr = req.body.trdr;

  if (!mtrl || !trdr) {
    res.status(402).json({ message: "Fill The required fields" });
  } else {
    database
      .execute("select * from favorites where p_mtrl=? and c_trdr=?", [
        mtrl,
        trdr,
      ])
      .then((results) => {
        if (results[0].length > 0) {
          res.status(200).json({ message: "Products Exists", exists: true });
        } else {
          res
            .status(200)
            .json({ message: "Product Does not Exists", exists: false });
        }
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};

exports.getPdf = async (mtrl) => {
  let pdf = await database.execute("select * from pdfs where mtrl=?", [mtrl]);
  let returnPdfs = [];
  console.log(pdf[0]);
  for (let i = 0; i < pdf[0].length; i++) {
    returnPdfs.push(pdf[0][i].pdf);
  }
  return returnPdfs;
};
exports.editMosquiImage = (req, res, next) => {
  const image = req.body.image;
  const sub_cat_id = req.body.sub_cat_id;

  if (!image || !sub_cat_id) {
    res.status(200).json({ message: "fill the required fields" });
  } else {
    database
      .execute("select * from subcategories_data where sub_cat_id=?", [
        sub_cat_id,
      ])
      .then(async (results) => {
        if (results[0].length > 0) {
          let update = await database.execute(
            "update subcategories_data set image=? where sub_cat_id=?",
            [image, sub_cat_id]
          );
          res.status(200).json({
            message: "Image Updated",
            subcategory: await this.getSub(sub_cat_id),
          });
        } else {
          let insert = await database.execute(
            "insert into subcategories_data (sub_cat_id,image) VALUES (?,?)",
            [sub_cat_id, image]
          );
          res.status(200).json({
            message: "Image Inserted",
            subcategory: await this.getSub(sub_cat_id),
          });
        }
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.editMosquiUrl = (req, res, next) => {
  const url = req.body.url;
  const sub_cat_id = req.body.sub_cat_id;
  let host = url.split("/");
  if (!url || !sub_cat_id) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    if (req.body.method || host[2] != "www.youtube.com") {
      database
        .execute("update subcategories_data set url =? where sub_cat_id=?", [
          "empty",
          sub_cat_id,
        ])
        .then(async (results) => {
          res.status(200).json({
            message: "Video Deleted",
            subcategory: await this.getSub(sub_cat_id),
          });
        })
        .catch((err) => {
          if (!err.statusCode) err.statusCode = 500;
          next(err);
        });
    } else {
      let validUrl = req.body.url.replace("watch?", "embed/");
      validUrl = validUrl.replace("v=", "");
      validUrl = validUrl.split("&");
      validUrl = validUrl[0];

      database
        .execute("select * from subcategories_data where sub_cat_id=?", [
          sub_cat_id,
        ])
        .then(async (results) => {
          if (results[0].length > 0) {
            let update = await database.execute(
              "update subcategories_data set url=? where sub_cat_id=?",
              [validUrl, sub_cat_id]
            );
            res.status(200).json({
              message: "Video Updated",
              subcategory: await this.getSub(sub_cat_id),
            });
          } else {
            let insert = await database.execute(
              "isnert into subcategories_data (url,sub_cat_id) VALUES (?,?)",
              [validUrl, sub_cat_id]
            );
            res.status(200).json({
              message: "Video Inserted",
              subcategory: await this.getSub(sub_cat_id),
            });
          }
        });
    }
  }
};

exports.editMosquiDataSheet = (req, res, next) => {
  const data_sheet = req.body.data_sheet;
  const data_sheet_eng = req.body.data_sheet_eng;
  const sub_cat_id = req.body.sub_cat_id;

  if (!data_sheet || !data_sheet_eng || !sub_cat_id) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    database
      .execute("select * from subcategories_data where sub_cat_id = ?", [
        sub_cat_id,
      ])
      .then(async (results) => {
        if (results[0].length > 0) {
          let update = await database.execute(
            "update subcategories_data set data_sheet=?,data_sheet_eng=? where sub_cat_id=?",
            [data_sheet, data_sheet_eng, sub_cat_id]
          );
          res.status(200).json({
            message: "Data Sheet Updated",
            subcategory: await this.getSub(sub_cat_id),
          });
        } else {
          let insert = await database.execute(
            "insert into subcategories_data (data_sheet,data_sheet_eng,sub_cat_id) VALUES (?,?,?)",
            [data_sheet, data_sheet_eng, sub_cat_id]
          );
          res.status(200).json({
            message: "Data Sheet Inserted",
            subcategory: await this.getSub(sub_cat_id),
          });
        }
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.editMosquiOtherImages = async (req, res, next) => {
  const sub_cat_id = req.body.sub_cat_id;
  const images = req.body.images;

  if (!sub_cat_id || !images) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    let imagesArray = this.fromStringToArray(images);
    for (let i = 0; i < imagesArray.length; i++) {
      console.log(imagesArray[i]);
      let insert = await database.execute(
        "insert into subcategories_otherimages (sub_cat_id,image) VALUES(?,?)",
        [sub_cat_id, imagesArray[i]]
      );
    }
    res.status(200).json({
      message: "Images Inserted",
      subcategory: await this.getSub(sub_cat_id),
    });
  }
};
exports.editMosquiDesc = (req, res, next) => {
  const desc = req.body.desc;
  const desc_eng = req.body.desc_eng;
  const sub_cat_id = req.body.sub_cat_id;

  if (!desc || !desc_eng || !sub_cat_id) {
    res.status(200).json({ message: "fill the requried fields" });
  } else {
    database
      .execute("select * from subcategories_data where sub_cat_id = ?", [
        sub_cat_id,
      ])
      .then(async (results) => {
        if (results[0].length > 0) {
          // update
          let update = await database.execute(
            "update subcategories_data set description=?,description_eng=? where sub_cat_id=?",
            [desc, desc_eng, sub_cat_id]
          );
          console.log(await this.getSub(sub_cat_id));
          res.status(200).json({
            message: "Description Updated",
            subcategory: await this.getSub(sub_cat_id),
          });
        } else {
          // isnert
          let insert = await database.execute(
            "insert into subcategories_data(description,description_eng,sub_cat_id) VALUES(?,?,?)",
            [desc, desc_eng, sub_cat_id]
          );
          res.status(200).json({
            message: "Description Inserted",
            subcategory: await this.getSub(sub_cat_id),
          });
        }
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.getSub = async (sub) => {
  let subs = await database.execute(
    "select * from subcategories where sub_id = ?",
    [sub]
  );
  try {
    console.log(subs[0]);
    if (subs[0].length > 0) {
      return {
        sub_id: subs[0][0].sub_id,
        sub_name: subs[0][0].sub_name,
        sub_name_eng: subs[0][0].sub_name_eng,
        description: await this.getDescription(sub),
        description_eng: await this.getDescriptionEng(sub),
        image: await this.getImage(sub),
        data_sheet: await this.getDataSheet(sub),
        data_sheet_eng: await this.getDataSheetEng(sub),
        video: await this.getUrl(sub),
        otherImages: await this.getOtherMosquiImages(sub),
        pdf: await this.getPdfs(sub),
      };
    } else {
      return {
        sub_id: "",
        sub_name: "",
        sub_name_eng: "",
        description: "",
        description_eng: "",
        image: "",
        data_sheet: "",
        data_sheet_eng: "",
        video: "",
        otherImages: "",
        pdf:""
      };
    }
  } catch (err) {
    throw err;
  }
};
exports.removePdf = (req, res, next) => {
  const sub_cat_id = req.body.sub_cat_id;
  const pdf = req.body.pdf;

  if (!sub_cat_id || !pdf) {
    res.status(402).json({ message: "fill the requried fields" });
  } else {
    database
      .execute("delete from subcategories_pdf where sub_cat_id=? and pdf=?", [
        sub_cat_id,
        pdf,
      ])
      .then(async(results) => {
        res.status(200).json({
          message:'Pdf Removed',
          subcategory : await this.getSub(sub_cat_id)
        })
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.removeOtherImages = (req, res, next) => {
  const sub_cat_id = req.body.sub_cat_id;
  const image_name = req.body.image;

  if (!sub_cat_id || !image_name) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    database
      .execute(
        "delete from subcategories_otherimages where sub_cat_id=? and image=?",
        [sub_cat_id, image_name]
      )
      .then(async (results) => {
        res.status(200).json({
          message: "Image Removed",
          subcategory: await this.getSub(sub_cat_id),
        });
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.getPdfs = async (sub) => {
  let pdf = await database.execute(
    "select * from subcategories_pdf where sub_cat_id =?",
    [sub]
  );
  try {
    let pdfs = [];
    for (let i = 0; i < pdf[0].length; i++) {
      pdfs[i] = {
        name: pdf[0][i].pdf,
      };
    }
    return pdfs;
  } catch (err) {
    throw err;
  }
};
exports.getOtherMosquiImages = async (sub) => {
  let images = await database.execute(
    "select * from subcategories_otherimages where sub_cat_id=?",
    [sub]
  );
  try {
    let otherImages = [];
    for (let i = 0; i < images[0].length; i++) {
      otherImages[i] = {
        image: images[0][i].image,
      };
    }
    return otherImages;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getDescription = async (id) => {
  let desc = await database.execute(
    "select description from subcategories_data where sub_cat_id = ?",
    [id]
  );
  try {
    if (desc[0].length > 0) {
      return desc[0][0].description;
    } else {
      return "";
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getDescriptionEng = async (id) => {
  let desc = await database.execute(
    "select description_eng from subcategories_data where sub_cat_id = ?",
    [id]
  );
  try {
    if (desc[0].length > 0) {
      return desc[0][0].description_eng;
    } else {
      return "";
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getImage = async (id) => {
  let desc = await database.execute(
    "select image from subcategories_data where sub_cat_id = ?",
    [id]
  );
  try {
    if (desc[0].length > 0) {
      return desc[0][0].image;
    } else {
      return "";
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getDataSheet = async (id) => {
  let desc = await database.execute(
    "select data_sheet from subcategories_data where sub_cat_id = ?",
    [id]
  );
  try {
    if (desc[0].length > 0) {
      return desc[0][0].data_sheet;
    } else {
      return "";
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getDataSheetEng = async (id) => {
  let desc = await database.execute(
    "select data_sheet_eng from subcategories_data where sub_cat_id = ?",
    [id]
  );
  try {
    if (desc[0].length > 0) {
      return desc[0][0].data_sheet_eng;
    } else {
      return "";
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getUrl = async (id) => {
  let desc = await database.execute(
    "select url from subcategories_data where sub_cat_id = ?",
    [id]
  );
  try {
    if (desc[0].length > 0) {
      return desc[0][0].url;
    } else {
      return "";
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    throw err;
  }
};
exports.getSubcategory = async (req, res, next) => {
  const sub_cat_id = req.body.sub_cat_id;
  if (!sub_cat_id)
    res.status(402).json({ message: "fill the requried fields" });
  else {
    res.status(200).json({
      message: "subcategory",
      subcategory: await this.getSub(sub_cat_id),
    });
  }
};

exports.todb = (req, res, next) => {
  database
    .execute("select * from subcategories where cat_id=116")
    .then(async (results) => {
      for (let i = 0; i < results[0].length; i++) {
        let insert = await database.execute(
          "insert into subcategories_data (sub_cat_id) VALUES(?)",
          [results[0][i].sub_id]
        );
      }
      res.status(200).json({ message: "OK" });
    });
};

exports.editMosquiPdfs = async (req, res, next) => {
  const sub_cat_id = req.body.sub_cat_id;
  const pdf = req.body.pdf;

  if (!sub_cat_id || !pdf) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
   
      let insert = await database.execute(
        "insert into subcategories_pdf (sub_cat_id,pdf) VALUES(?,?)",
        [sub_cat_id, pdf]
      );
    
    res
      .status(200)
      .json({
        message: "pdf uploaded",
        subcategory: await this.getSub(sub_cat_id),
      });
  }
};

exports.getMosquiCat = (req,res,next) =>{
  database
  .execute("select * from subcategories where cat_id=116")
  .then(async (results) => {
    let returnSubCat = [];
    for(let i = 0 ; i < results[0].length ; i++){
      returnSubCat[i] = await this.getSub(results[0][i].sub_id);
    }
    res.status(200).json({message:"All Mosqui+",subcategories: returnSubCat});
  })
  .catch(err=>{
    if(!err.statusCode) err.statusCode =500;
    next(err);
  })
}

exports.removeThumbMosqui = (req,res,next) =>{

  const sub_cat_id = req.body.sub_cat_id;

  if(!sub_cat_id){
    res.status(402).json({message:"fill the required fields"});
  }else{
      database
      .execute('update subcategories_data set image=? where sub_cat_id=?',['https://perlarest.vinoitalia.gr/php-auth-api/images.png',sub_cat_id])
        .then(updateResults =>{
           this.getMosquiCat(req,res,next);
        })
        .catch(err=>{
          if(!err.statusCode) err.statusCode=500;
          next(err);
        })
  }

}
