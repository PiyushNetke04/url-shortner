const express = require("express");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const router = express.Router();
router.get("/", async (req, res) => {

    const urls = await Url.find();

    res.render("index", {
        shortUrl: null,
        urls
    });

});

router.post("/shorten", async (req, res) => {
    const originalUrl = req.body.url;
    let shortId = req.body.customId;
    if(!shortId){
        shortId = nanoid(6);
    }
    const existing = await Url.findOne({ shortId });
    if(existing){
        return res.send("Custom ID already taken");
    }
    const newUrl = new Url({
        originalUrl,
        shortId
    });
    await newUrl.save();
    const urls = await Url.find();
    const shortUrl = `http://localhost:3000/${shortId}`;
    res.render("index", {
        shortUrl,
        urls
    });
});

router.get("/delete/:id", async (req, res) => {
    await Url.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

router.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const url = await Url.findOne({ shortId });
    if(url){
        url.clicks++;
        await url.save();
        res.redirect(url.originalUrl);
    } else {
        res.send("Link not found");
    }
});
module.exports = router;