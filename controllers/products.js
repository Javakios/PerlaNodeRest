const database = require('../db');

// temporary functions
 async  function is_home_page_prod(mtrl){

    let homePageOffer =await  database.execute(`SELECT * FROM products_offer WHERE product_mtrl=${mtrl}`)
        console.log(homePageOffer[0].length)
        if(homePageOffer[0].length == 0) return false;
        else return true;
    
 }

 function otherImages(mtrl){

     database.execute(`SELECT * FROM product_images WHERE p_mtrl=${mtrl}`)
     .then(images =>{

       // console.log(images[0]);
        let otherImages = [];
        for(let i = 0 ; i < images[0].length;i++){

            otherImages[i] = {

                'img': images[0][i]

            }

        }
        return otherImages;


     });

}
// end of temporary functions


// Get All Products 
exports.getProducts = (req,res,next)=>{

    database.execute("SELECT * FROM products")
    .then(async products =>{
        hasOffer = false;
       // console.log(products[0][1]);
       // console.log(products[0].length)
        let returnProds = [];
        let homeOffer = false;
        for(let i = 0 ; i < products[0].length;i++){
            if(products[0][i].p_wholesale_price !=products[0][i].p_offer ) hasOffer = true;
            console.log(`SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`);
            let homePageOffer =await  database.execute(`SELECT * FROM products_offer WHERE product_mtrl= ${products[0][i].p_mtrl}`)
           // console.log(homePageOffer[0].length)
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
                'otherImages' : otherImages(products[0][i].p_mtrl) ,
                'description':products[0][i].p_desc,
                'pdf':products[0][i].p_pdf,
                'video':products[0][i].p_yt_vid,
                'data_sheet':products[0][i].p_data_sheet,
				'data_sheet_eng':products[0][i].data_sheet_eng,
                'onoma':products[0][i].onoma_product,
                'onoma_eng':products[0][i].onoma_product_eng,
                'kodikos_kataskeuasti':products[0][i].p_code_kataskeuasti,
                'texnikos_kodikos':products[0][i].p_code_texniko,


            }

        }
        
        res.status(200).json({
            message:"All Products",
            products: returnProds
        });

    }).catch(err=>{

        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);

    })
}