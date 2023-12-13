import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
let vidArray = [];

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/results", (req, res) => {
    res.render("index.ejs", { videos: vidArray })
})

app.post("/search", (req, res) => {
    // passing data into searchFunc.ejs to make API request
    let videoSrch = req.body;
    console.log(videoSrch);
    res.render("index.ejs", { video: videoSrch });
})

app.post("/results", (req, res) => {
    let videosList = req.body.videos;
    if (vidArray.length !== 0) {
        vidArray = []
    }
    videosList.forEach(video => {
        vidArray.push(video);
    });
    console.log(videosList);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});