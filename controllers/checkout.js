const axios = require("axios");

exports.checkout = (req, res, next) => {
  let amount = req.body.amount;
  let currency = req.body.currency;
  if (!amount || !currency) {
    res.status(402).json({
      message: "Fill The require Fields",
    });
  }else{
   
    
  }
};
