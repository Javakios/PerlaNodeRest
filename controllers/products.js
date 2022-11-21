const database = require('../db');



// Get All Products 
exports.getProducts = (req,res,next)=>{
    database.execute("SELECT * FROM products")
    .then(async products =>{
        hasOffer = false;
        let returnProds = [];
        let homeOffer = false;
        for(let i = 0 ; i < products[0].length;i++){
            if(products[0][i].p_wholesale_price !=products[0][i].p_offer ) hasOffer = true;
            else hasOffer = false;
            let homePageOffer =await  database.execute(`SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`)
            let images =await database.execute(`SELECT * FROM product_images WHERE p_mtrl=${products[0][i].p_mtrl}`)
            let otherImages = [];
            for(let i = 0 ; i < images[0].length;i++){
                otherImages[i] = {
                    'img': images[0][i].p_image
                }
            }
            if(homePageOffer[0].length != 0) homeOffer = true;
            else homeOffer = false;    
            returnProds[i] = {
                'mtrl' :products[0][i].p_mtrl,
                'omada':products[0][i].p_omada,
                'name' :products[0][i].p_name,
                'name1' :products[0][i].p_name1,
                'retailPrice' :products[0][i].p_retail_price,
                'wholesalePrice' :products[0][i].p_wholesale_price,
                'offer':products[0][i].p_offer,
                'hasOffer':hasOffer,
                'homePageOffer': homeOffer,
                'discount':products[0][i].p_dicount,
                'code' :products[0][i].p_kod,
                'description_eng':products[0][i].p_desc_eng,
                'stock' :products[0][i].p_stock,
                'diathesima':products[0][i].p_diathesima,
                'desmeumena':products[0][i].p_desmeumena,
                'category' :products[0][i].p_category,
                'subcategory' :products[0][i].p_subcategory,
                'image' :products[0][i].p_image,
                'otherImages' : otherImages ,
                'description':products[0][i].p_desc,
                'pdf':products[0][i].p_pdf,
                'video':products[0][i].p_yt_vid,
                'data_sheet':products[0][i].p_data_sheet,
				'data_sheet_eng':products[0][i].data_sheet_eng,
                'onoma':products[0][i].onoma_product,
                'onoma_eng':products[0][i].onoma_product_eng,
                'kodikos_kataskeuasti':products[0][i].p_code_kataskeuasti,
                'texnikos_kodikos':products[0][i].p_code_texniko,
        }} 
        database.end()
        res.status(200).json({
            message:"All Products",
            products: returnProds
        });
    }).catch(err=>{
        if(!err.statusCode) err.statusCode = 500
        next(err);
    })
}

// Get All Products Related
exports.getProductsRelated = async(req,res,next)=>{
    let returnProds = [];
    let bad = false;
    if(!req.body.mtrl){
        bad = true;
    }else{

        let mtrl = req.body.mtrl;
        console.log(`SELECT p_related_mtrl FROM product_page_related WHERE p_mtrl=${mtrl}`);
        let related_mtrl = await  database.execute(`SELECT p_related_mtrl FROM product_page_related WHERE p_mtrl= ${mtrl} `);
        console.log(related_mtrl[0][0].p_related_mtrl);
        
       
        for(let i = 0 ; i < related_mtrl[0].length;i++){
            related_mtrl = related_mtrl[0][i].p_related_mtrl
            let prod = await database.execute(`SELECT * FROM products where p_mtrl=${related_mtrl}`);
            if(prod[0][0].p_wholesale_price !=prod[0][0].p_offer ) hasOffer = true;
            else hasOffer = false;
            let homePageOffer =await  database.execute(`SELECT * FROM products_offer WHERE product_mtrl= ${prod[0][0].p_mtrl}`)
            let images =await database.execute(`SELECT * FROM product_images WHERE p_mtrl=${prod[0][0].p_mtrl}`)
            let otherImages = [];
            for(let i = 0 ; i < images[0].length;i++){
                otherImages[i] = {
                    'img': images[0][i].p_image
                }
            }
            if(homePageOffer[0].length != 0) homeOffer = true;
            else homeOffer = false;    
            returnProds[i] = {
                'mtrl' :prod[0][0].p_mtrl,
                'omada':prod[0][0].p_omada,
                'name' :prod[0][0].p_name,
                'name1' :prod[0][0].p_name1,
                'retailPrice' :prod[0][0].p_retail_price,
                'wholesalePrice' :prod[0][0].p_wholesale_price,
                'offer':prod[0][0].p_offer,
                'hasOffer':hasOffer,
                'homePageOffer': homeOffer,
                'discount':prod[0][0].p_dicount,
                'code' :prod[0][0].p_kod,
                'description_eng':prod[0][0].p_desc_eng,
                'stock' :prod[0][0].p_stock,
                'diathesima':prod[0][0].p_diathesima,
                'desmeumena':prod[0][0].p_desmeumena,
                'category' :prod[0][0].p_category,
                'subcategory' :prod[0][0].p_subcategory,
                'image' :prod[0][0].p_image,
                'otherImages' : otherImages ,
                'description':prod[0][0].p_desc,
                'pdf':prod[0][0].p_pdf,
                'video':prod[0][0].p_yt_vid,
                'data_sheet':prod[0][0].p_data_sheet,
				'data_sheet_eng':prod[0][0].data_sheet_eng,
                'onoma':prod[0][0].onoma_product,
                'onoma_eng':prod[0][0].onoma_product_eng,
                'kodikos_kataskeuasti':prod[0][0].p_code_kataskeuasti,
                'texnikos_kodikos':prod[0][0].p_code_texniko,
            }
        }
    }    
    if(bad) {
        res.status(404).json({message:"Fill The Required Fields"})
    }else{
        res.status(200).json({message:"Related Products",products:returnProds})
    }

}