const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    password
  } = req.body;

  const users = await getUserByEmail(email);
  const isUserExist = users.length > 0;

  if (!isUserExist) {
    const addUsersResponse = await addUser(email, firstName, lastName, password);
    res.status(200).send({
      message: 'User created successfully.',
      data: addUsersResponse
    })
  } else {
    res.status(409).send({
      message: 'User already exist.',
    })
  }
}

const login = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  const users = await getUserByEmail(email);
  const isUserExist = users.length > 0;

  if (isUserExist) {
    const isValidPassword = await bcrypt.compare(password, users[0].password);
    if (isValidPassword) {
      const token = jwt.sign({
        id: users[0].id
      }, 'the-super-strong-secrect', {
        expiresIn: '1h'
      });

      res.status(200).send({
        message: 'Login successful.',
        token
      });
    } else {
      res.status(401).send({
        message: 'Email or password is incorrect.'
      })
    }
  } else {
    res.status(500).send({
      message: 'Email or password is incorrect.'
    })
  }
}

const logout = (req, res, next) => {

}


//Helpers

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    let query = `select * from users where email='${email}'`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result);
    })
  })
}

const addUser = async (email, firstName, lastName, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO users (first_name, last_name, email, password) VALUES('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`;
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

//Export
module.exports = {
  signup,
  login,
  logout
}
