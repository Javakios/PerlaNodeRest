const database =  require('../db');

exports.getYpokat = (req,res,next) =>{
    const trdr = req.body.trdr;
    if(!trdr){
        res.status(402).json({message:"fill the require fields"})
    }else{

        database
        .execute(
            'select * from ypokatastimata where trdr=?',[trdr]
        )
        .then(getYpokat =>{
            let returnYpokat = [];
            for(let i = 0 ; i < getYpokat[0].length;i++){

                returnYpokat[i] = {
                    trdrbranch:getYpokat[0][i].trdbranch,
                    trdr:getYpokat[0][i].trdr,
                    code:getYpokat[0][i].code,
                    name:getYpokat[0][i].name,
                    address:getYpokat[0][i].dieuthinsi,
                    perioxi:getYpokat[0][i].perioxi,
                    phone1:getYpokat[0][i].tilephono,
                    yp_kat:getYpokat[0][i].yp_kat,
                    fax:getYpokat[0][i].fax,
                    city:getYpokat[0][i].poli,
                }

            }
            res.status(200).json({message:"Success",ypokat:returnYpokat})
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);
        })

    }

}

