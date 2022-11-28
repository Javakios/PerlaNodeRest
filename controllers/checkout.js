const axios = require('axios');

exports.checkout = (req, res, next) => {
  let amount = req.body.amount;
  let currency = req.body.currency;
  if (!amount || !currency) {
    res.status(402).json({
      message: "Fill The require Fields",
    });
  } else {
    axios.post(
        "https://merchant.revolut.com/api/1.0/orders",{
            amount:amount,
            currency:currency
        },
        {
            headers:{
                Accept:"application/json",
                Authorization:"Bearer sk_gUE7hEJn4W2ya1F1fhZ979TgzSMu9d2q3w6_7WjFRe2D-OxZBC0aHMEtLmgsLUnC"
            }
        }
    ).then(resData=>{
        res.status(200).json({data:resData.data})
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    })
}
};
