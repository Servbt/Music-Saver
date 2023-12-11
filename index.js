import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/search", (req, res) => {
    let videoSrch = req.body;
    console.log(videoSrch);
    res.render("index.ejs", {video: videoSrch});
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});