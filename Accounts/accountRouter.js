const express = require('express');
const router = express.Router();
const knex = require('../data/dbConfig.js');

router.get('/', (req, res) => {
    knex.select('*').from('accounts')
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Error getting the account'})
        })
})
router.get('/:id', (req, res) => {
    knex.select('*')
        .from('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: 'Error getting the account'})
        })
})

router.post('/', (req, res) => {
    const accountData = req.body;

    knex("accounts")
        .insert(accountData, "id")
        .then(ids => {
            const id = ids[0]
            return knex("accounts") // THIS MAKES SURE TO RETURN AN ENTIRE ARRAY OF YOU NEW INPUT
                .where({ id })
                .then(account => {
                    res.status(200).json(account)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: 'Error creating this account.'})
        })
})


module.exports = router;