const database = require("../db");
const jwt = require("jsonwebtoken");
exports.login = (req, res, next) => {
  if (!req.body.password || !req.body.name) {
    res.status(422).json({ message: "Fill The Required Fields" });
  } else {
    let name = req.body.name;
    let password = req.body.password;

    if (password.length < 8) {
      res
        .status(422)
        .json({ message: "Your Password Must Be 8 characters long" });
    } else {
      // the user is able to perform login action
      database
        .execute(`select * from customers where c_username=` + `'` + name + `'`)
        .then((results) => {
          let checkPassword = false;
          if (results[0].length != 0) {
            if (results[0][0].c_password == password) {
              checkPassword = true;
            } else {
              checkPassword = false;
            }
            if (checkPassword) {
              const token = jwt.sign(
                {
                  name: results[0][0].c_username,
                  id: results[0][0].c_id,
                },
                "somesupersecretsecret"
              );
              res.status(200).json({
                success:1,
                message: "You Have Successfully Logged In",
                token: token,
                name: results[0][0].c_eponimia,
                address: results[0][0].c_dieuthinsi,
                zip: results[0][0].c_tk,
                city: results[0][0].c_city,
                phone01: results[0][0].c_phone01,
                phone02: results[0][0].c_phone02,
                doy: results[0][0].c_doy,
                afm: results[0][0].c_afm,
                isAdmin: results[0][0].isAdmin,
                trdr: results[0][0].c_id,
                email: results[0][0].c_email,
                emporiki_katigoria: results[0][0].c_emporiki_katigoria,
                geografiki_zoni: results[0][0].c_biografiki_zoni,
                metaforiko_meso: results[0][0].c_metaforiko_meso,
                dromologio: results[0][0].c_dromologio,
                tropos_apostolis: results[0][0].c_tropos_apostolis,
                metaforeas: results[0][0].c_metaforeas,
                area_id : results[0][0].c_geografiki_zoni_id
              });
              console.log(token);
              // CORRECT PASSWORD SO GIVE TOKEN
            } else {
              res.status(422).json({ message: "Wrong Password" });
            }
          } else {
            res.status(422).json({ message: "Wrong Username" });
          }
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
