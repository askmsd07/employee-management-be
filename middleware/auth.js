const jwt = require('jsonwebtoken')
const db = require('../db/connection');

const checkTokenValidity = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
  ) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  } else {
    const token = req.headers.authorization.split(' ')[1];
    const decodedTokenMeta = await verifyJWT(token);

    if(decodedTokenMeta && decodedTokenMeta.hasOwnProperty('id')){
      let users = await getUserById(decodedTokenMeta.id);
      if(users.length > 0){
        next();
      }else{
        return res.status(401).json({
          message: "Not Authorized",
        });
      }
    }else{
      return res.status(401).json({
        message: "Not Authorized",
      });
    }
  }
};

const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'the-super-strong-secrect', (err, res)=>{
      if(err){
        resolve(null)
      }else{
        resolve(res);
      }
    });
  })
}

const getUserById = (id) => {
  let query = `select * from users where id='${id}'`
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if(err){
        reject(err)
      }
      resolve(result)
    })
  })
}

module.exports = checkTokenValidity;
