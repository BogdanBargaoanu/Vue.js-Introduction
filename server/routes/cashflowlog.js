var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * /cashflowlog:
 *   get:
 *     tags:
 *      - cashflowlog
 *     description: Gets the list of cashflow logs for a user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the cashflow logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idcashflowLog:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   type:
 *                     type: string
 *                   value:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   date:
 *                    type: string
 *       401:
 *         description: Unauthorized. No authorization header or invalid token.
 *       500:
 *         description: Server error.
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get('/', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'cashflow-key'); // verify the token
        userId = decoded.id; // get the user ID from the decoded token
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    const query = `SELECT log.idcashflowLog, log.idUserSelected, users.username, log.type, log.value, log.currency, DATE_FORMAT(log.date, '%Y-%m-%dT%T') as date FROM log
  INNER JOIN users ON log.idUserSelected = user.idUsers
  WHERE log.idUser = ? OR log.idUserSelected = ? ORDER BY log.date DESC;`;
    req.db.query(query, [userId,userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(result);
    });
});


/**
 * @openapi
 * /cashflowlog/insertLog:
 *   post:
 *     tags:
 *      - cashflowlog
 *     description: Inserts a new cashflow log for a user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUserSelected:
 *                 type: integer
 *               type:
 *                 type: string
 *               value:
 *                 type: number
 *               currency:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a success message.
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
 *         description: Bad request. Missing required fields or value is not greater than 0.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized. No authorization header or invalid token.
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
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */

router.post('/insertLog', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'cashflow-key'); // verify the token
        userId = decoded.id; // get the user ID from the decoded token
    } catch (err) {
        res.status(401).json({ success: false, error: 'Invalid token' });
        return;
    }
    const { idUserSelected, type, value, currency, date } = req.body;
    if (!idUserSelected || !type || !value || !currency /*|| !description*/ || !date) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
    }
    if (value <= 0) {
        res.status(400).json({ success: false, error: 'Value must be greater than 0' });
        return;
    }
    //console.log(userId," ", idEntity," ", type," ", value," ", currency," ", date);
    if (type != "Income" && type != "Expense") {
        res.status(400).json({ success: false, error: 'Invalid type' });
        return;
    }
    if (currency != "USD" && currency != "EUR" && currency != "RON") {
        res.status(400).json({ success: false, error: 'Invalid currency' });
        return;
    }
    const query = `INSERT INTO log (idUser, idUserSelected, type, value, currency, date) VALUES (?, ?, ?, ?, ?, ?)`;
    req.db.query(query, [userId, idUserSelected, type, value, currency, date], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        res.json({ success: true, message: 'Cashflow log inserted successfully' });
    });
});

/**
 * @openapi
 * /cashflowlog/updateLog/{idcashflowLog}:
 *   post:
 *     tags:
 *      - cashflowlog
 *     description: Updates a cashflow log for a user.
 *     parameters:
 *       - in: path
 *         name: idcashflowLog
 *         schema:
 *           type: integer
 *         required: true
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUserSelected:
 *                 type: integer
 *               type:
 *                 type: string
 *               value:
 *                 type: number
 *               currency:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a success message.
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
 *         description: Bad request. Missing required fields or value is not greater than 0.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized. No authorization header or invalid token.
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
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */

router.post('/updateLog/:idcashflowLog', function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header' });
        return;
    }

    if (!req.params.idcashflowLog) {
        res.status(400).json({ error: 'The request has missing information!' });
        return;
      }

    const token = authHeader.split(' ')[1]; // get the token from the Authorization header
    let userId;
    try {
        const decoded = jwt.verify(token, 'cashflow-key'); // verify the token
        userId = decoded.id; // get the user ID from the decoded token
    } catch (err) {
        res.status(401).json({ success: false, error: 'Invalid token' });
        return;
    }
    const idcashflowLog = req.params.idcashflowLog,
    idUserSelected = req.body.idUserSelected,
    type = req.body.type,
    value = req.body.value,
    currency = req.body.currency,
    date = req.body.date;
    console.log(`${idcashflowLog} ${idUserSelected} ${type} ${value} ${currency} ${date}`);
    if (!idcashflowLog || !idUserSelected || !type || !value || !currency || !date) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
    }
    if (value <= 0) {
        res.status(400).json({ success: false, error: 'Value must be greater than 0' });
        return;
    }
    if (type != "Income" && type != "Expense") {
        res.status(400).json({ success: false, error: 'Invalid type' });
        return;
    }
    if (currency != "USD" && currency != "EUR" && currency != "RON") {
        res.status(400).json({ success: false, error: 'Invalid currency' });
        return;
    }
    const query = `UPDATE cashflowlog SET idUser = ?, idUserSelected = ?, type = ?, value = ?, currency = ?, date = ? WHERE idcashflowLog = ?`;
    req.db.query(query, [userId, idUserSelected, type, value, currency, date, idcashflowLog], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        res.json({ success: true, message: 'Cashflow log inserted successfully' });
    });
});

module.exports = router;


/**
 * @openapi
 * /cashflowlog/deleteLog/{idcashflowLog}:
 *   delete:
 *     tags:
 *       - cashflowlog
 *     description: Delete a cashflow log.
 *     parameters:
 *       - in: path
 *         name: idcashflowLog
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Log deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 * */

router.delete('/deleteLog/:idcashflowLog', function (req, res, next) {
    const deleteQuery = 'DELETE FROM cashflowlog WHERE idcashflowLog = ?';
  
    if (!req.params.idcashflowLog) {
      res.status(400).json({ error: 'The request has missing information!' });
      return;
    }
  
    req.db.query(deleteQuery, [req.params.idcashflowLog], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
  
        if (result.affectedRows == 0) {
            res.status(400).json({ error: 'No cashflow log found with the provided id!' });
            return;
        }
  
        res.json({ message: 'Log deleted successfully!' });
    });
  });
  