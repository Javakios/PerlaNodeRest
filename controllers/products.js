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
          retailPrice: products[0][i].p_retail_price,
          wholesalePrice: products[0][i].p_wholesale_price,
          offer: products[0][i].p_offer,
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
    console.log(
      `SELECT p_related_mtrl FROM product_page_related WHERE p_mtrl=${mtrl}`
    );
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
        retailPrice: prod[0][0].p_retail_price,
        wholesalePrice: prod[0][0].p_wholesale_price,
        offer: prod[0][0].p_offer,
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
    res.status(404).json({ message: "Fill The Required Fields" });
  } else {
    res
      .status(200)
      .json({ message: "Related Products", products: returnProds });
  }
};
// get home page offer
exports.getOffers = async (req, res, next) => {
  let offerMtrl = await database.execute("select * from products_offer");
  console.log(offerMtrl[0]);
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
    retailPrice: product[0][0].p_retail_price,
    wholesalePrice: product[0][0].p_wholesale_price,
    offer: product[0][0].p_offer,
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
        retailPrice: products[0][i].p_retail_price,
        wholesalePrice: products[0][i].p_wholesale_price,
        offer: products[0][i].p_offer,
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
    // // database.end();
  }

  if (bad) {
    res.status(404).json({ message: "Fill The Required Fields" });
  } else {
    res.status(200).json({
      message: "Offer Deleted",
      products: returnProds,
    });
  }
};

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
    res.status(404).json({ message: "Fill The required Fields" });
  }
};

exports.deleteOne = async (req, res, next, mtrl, trdr) => {
  let deleteProd = await database.execute(
    `DELETE FROM favorites WHERE p_mtrl=${mtrl} AND c_trdr=${trdr}`
  );
  await this.fetchFavorites(req, res, next, trdr);
};
exports.deleteAll = (req, res, next, trdr) => {
  database
    .execute(`DELETE FROM favorites WHERE c_trdr=${trdr}`)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  res.status(200).json({ message: "Favorites Deleted", products: [] });
};

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
    retailPrice: product[0][0].p_retail_price,
    wholesalePrice: product[0][0].p_wholesale_price,
    offer: product[0][0].p_offer,
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
  };

  return returnProd;
};

exports.fetchCartItems = async (req, res, next) => {
  let bad = false;
  let cartItem = [];
  if (!req.query.trdr) {
    bad = true;
  } else {
    let trdr = req.query.trdr;
    let cartItems = await database.execute(
      `SELECT p_mtrl,p_qty,group_id,p_wholesale,p_disc FROM products_cart WHERE p_trdr=${trdr}`
    );
    for (let i = 0; i < cartItems[0].length; i++) {
      cartItem.push(
        await this.getSingelCartitem(
          cartItems[0][i].p_mtrl,
          cartItems[0][i].p_qty,
          cartItems[0][i].group_id,
          cartItems[0][i].p_wholesale,
          cartItems[0][i].p_disc
        )
      );
    }
  }

  if (bad) {
    res.status(404).json({ message: "Fill The required Fields" });
  } else {
    res.status(200).json({
      message: "Cart Items",
      products: cartItem,
    });
  }
};

exports.hasOffer = (products, i) => {
  if (products[0][i].p_wholesale_price != products[0][i].p_offer) return true;
  else return false;
};
exports.homaepageOffer = async (products, i) => {
  let homePageOffer = await database.execute(
    `SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`
  );
  if (homePageOffer[0].length != 0) return true;
  else return false;
};
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
exports.getSingelCartitem = async (
  mtrl,
  qty,
  group_id,
  wholesale,
  discount
) => {
  console.log("PEOS");
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
    retailPrice: product[0][0].p_retail_price,
    wholesalePrice: wholesale,
    offer: product[0][0].p_offer,
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

  console.log(returnProd);
  return returnProd;
};

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
    res.status(404).json({ message: "Fill The required Fields" });
  } else {
    res.status(200).json({ message: "Product Added" });
  }
};

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
      res.status(404).json({ message: "No Product Found" });
    } else {
      console.log(findProd[0]);
      res.status(200).json({
        message: "Product Found",
        product: await this.getSingelProduct(findProd[0][0].p_mtrl),
      });
    }
  }

  if (bad) {
    res.status(404).json({ message: "Fill The Required Fields" });
  }
};

exports.findRelatedProducts = async (req, res, next) => {
  let bad = false;
  let related_mtrl;
  let returnProd = [];
  if (!req.body.product_mtrl) {
    bad = true;
  } else {
    let mtrl = req.body.product_mtrl;
    let scope1 = await database.execute(
      `select * from related_products where mtrl=${mtrl} and scope=1`
    );
    console.log(scope1[0]);
    for (let i = 0; i < scope1[0].length; i++) {
      returnProd.push(await this.getSingelProduct(scope1[0][i].related_mtrl));
    }
  }
  if (bad) {
    res.status(404).json({ message: "Fill The Required Fields" });
  } else {
    res
      .status(200)
      .json({ message: "Related Products Found", products: returnProd });
  }
};

exports.removeCartItem = async (req, res, next) => {
  let bad = false;
  if (!req.body.mtrl || !req.body.trdr || !req.body.id || !req.body.group_id) {
    res.status(404).json({ message: "Fill The Required Fields" });
  } else {
    console.log("hello")
    let mtrl = req.body.mtrl;
    let trdr = req.body.trdr;
    let id = req.body.id;
    let group_id = req.body.group_id;
    console.log(id)
    switch (id) {
      case "1":
        this.clearAll(req,res,next,trdr);
        break;
      case "2":
        console.log("hello")
        this.clearOne(req,res,next,trdr);
        break;
    }
  }
};
exports.clearAll = (req, res, next, trdr) => {

    database.execute(`delete from products_cart where p_trdr=${trdr}`)
    .then(results=>{
        res.status(200).json({message:"Cart Cleared",products:[]});
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
};
exports.clearOne = async (req,res,next,trdr)=>{

    database.execute(`delete from products_cart where p_trdr=${trdr} and group_id=${req.body.group_id}`)
    .then(results=>{
        this.fetchCartItems(req, res, next)
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })    

}
