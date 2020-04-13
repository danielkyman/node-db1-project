const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await db.select("*").from("accounts");
    res.status(200).json({ data: accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await db("accounts").where({ id: req.params.id });
    if (post.length) {
      res.status(200).json({ data: post });
    } else {
      res.status(404).json({ message: "account with the id doesnt exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const accountData = req.body;
    const ids = await db("accounts").insert(accountData, "id");
    const id = ids[0];
    const newPost = await db("accounts").where({ id });
    res.status(201).json({ data: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const changes = req.body;
    const { id } = req.params;
    const count = await db("accounts").where({ id }).update(changes);
    if (count > 0) {
      res.status(200).json({ message: "update successful" });
    } else {
      res.status(404).json({ message: "no posts by that id were found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const account = await db("accounts").where({ id }).del();
    res
      .status(200)
      .json({ message: `${account} acounts deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
