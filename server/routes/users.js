var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *      - users
 *     description: Gets the list of users.
 *     responses:
 *       200:
 *         description: Returns the users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 iduser:
 *                   type: integer
 *                 username:
 *                  type: string
 *                 password:
 *                  type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/* GET users listing. */
router.get('/', function (req, res, next) {
  const query = 'SELECT * FROM users';
  req.db.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

/**
 * @openapi
 * /users/{name}:
 *   get:
 *     tags:
 *      - users
 *     description: Gets the user id with the given username.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Returns the user id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 iduser:
 *                   type: integer
 *                 username:
 *                  type: string
 *                 password:
 *                  type: string
 *       400:
 *         description: Error caused by an inappropriate input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/:name', function (req, res, next) {
  const query = 'SELECT idUsers FROM users WHERE username = ?';
  if (!req.params.name) {
    res.status(400).json({ error: 'The request has missing information!' });
    return;
  }
  req.db.query(query, [req.params.name], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});


/**
 * @openapi
 * /users/addUser:
 *   post:
 *     tags:
 *      - users
 *     description: Add an user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: User added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Error caused by an inappropriate input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 * */

router.post('/addUser', function (req, res, next) {
  const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
  const checkUsername = 'SELECT COUNT(idUsers) AS count FROM users WHERE username = ?';

  if (!req.body.username || !req.body.password) {
    res.status(400).json({ success: false, error: 'The request must have an username and password!' });
    return;
  }
  if (req.body.username.length < 5) {
    res.status(400).json({ success: false, error: 'The username must have at least 5 characters!' });
    return;
  }
  if (req.body.password.length < 5) {
    res.status(400).json({ success: false, error: 'The password must have at least 5 characters!' });
    return;
  }
  if (req.body.username.length > 30) {
    res.status(400).json({ success: false, error: 'The username must have at most 30 characters!' });
    return;
  }
  if (req.body.password.length > 30) {
    res.status(400).json({ success: false, error: 'The password must have at most 30 characters!' });
    return;
  }

  const hasUpperCase = /[A-Z]/.test(req.body.password); // regex test for uppercase
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(req.body.password); // regex test for special char
  if (!hasUpperCase || !hasSpecialChar) {
    res.status(400).json({ error: 'The password must have at least one uppercase letter and one special character!' });
    return;
  }

  // Hash the password using MD5
  const hashedPassword = crypto.createHash('md5').update(req.body.password).digest('hex');

  req.db.beginTransaction((err) => {

    if (err) {
      res.status(500).json({ success: false, error: err.message });
      return;
    }

    req.db.query(checkUsername, [req.body.username], (err, result) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
        return;
      }
      if (result[0]['count'] > 0) {
        res.status(400).json({ success: false, error: 'The username already exists!' });
        return;
      }

      req.db.query(insertQuery, [req.body.username, hashedPassword], (err, result) => {
        if (err) {
          res.status(500).json({ success: false, error: err.message });
          return;
        }

        req.db.commit((err) => {
          if (err) {
            return req.db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          res.json({ success: true, message: 'User added successfully!' });
        });
      });
    });
  });
});

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *      - users
 *     description: Login an user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Incorrect password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  // Hash the password using MD5
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

  req.db.query(query, [username], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      if (user.password == hashedPassword) {
        const token = jwt.sign({ id: user.idUsers, username: username }, 'cashflow-key', { expiresIn: '24h' });
        res.json({ success: true, token: token });
      } else {
        res.status(401).json({ success: false, message: 'Incorrect login details' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Incorrect login details' });
    }
  });
});


module.exports = router;