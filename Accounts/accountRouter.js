const express = require("express");
const router = express.Router();
const knex = require("../data/dbConfig.js");

router.get("/", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    .then(account => {
      res.status(200).json(account);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error getting the account" });
    });
});
router.get("/:id", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    .where({ id: req.params.id })
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error getting the account" });
    });
});

router.post("/", (req, res) => {
  const accountData = req.body;

  knex("accounts")
    .insert(accountData, "id")
    .then(ids => {
      const id = ids[0];
      return knex("accounts")
        .select("name", "budget") // THIS MAKES SURE TO RETURN AN ENTIRE ARRAY OF YOU NEW INPUT
        .where({ id })
        .then(account => {
          res.status(201).json(account);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error creating this account." });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  knex("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count > 0) {
        console.log(count);
        res.status(200).json({ message: `${count} record(s) updated.` });
      } else {
        res.status(404).json({ message: `Post not found.` });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error updating this account." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  knex("accounts")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) deleted.` });
      } else {
        res.status(404).json({ message: `Post not found.` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Error removing this account." });
    });
});

module.exports = router;
