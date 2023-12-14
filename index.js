import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const apiKey = 'AIzaSyDxZy9vQXRU43KQCCmR2MgJHrF9bsAvyUE';
let videoTarget;

let clientPlaylist = [];
function myVideo(title, id, html, thumbnail) {
    this.title = title;
    this.id = id;
    this.html = html;
    this.thumbnail = thumbnail;
};

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/video", (req, res) => {
    // console.log(videoTarget.player.embedHtml);
    res.render("index.ejs", { video: videoTarget })
})

app.get("/playlist", (req,res)=>{
    res.render("index.ejs", { playlist: clientPlaylist })
})

app.post("/search", async (req, res) => {
    let videoSrch = req.body.video;
    // console.log(videoSrch)
    try {
        const request = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(videoSrch)}&part=snippet&type=video&maxResults=5&key=${apiKey}`);
        // console.log(request.data.items[0].id.videoId)
        // console.log(request.data);
        res.render("index.ejs", { content: request.data.items })
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render("index.ejs", { content: JSON.stringify(error.response.data) })
    }
})

app.post("/video", async (req, res) => {
    let videoId = req.body.video;
    // console.log(videoId)
    // res.render("index.ejs", { video: videoClick });
    try {
        const request = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}
        &part=snippet,player`);
        videoTarget = request.data.items[0]
        // console.log(videoTarget.player);
        res.render("index.ejs", { video: videoTarget });
        // console.log("player HTML: " + request.data.items[0].player);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render("index.ejs", { content: JSON.stringify(error.response.data) })
    }
})

app.post("/add-video", (req,res)=>{
    let videoSent = req.body
    // console.log(videoSent);
    let video = new myVideo(videoSent.videoTitle, videoSent.videoID, videoSent.videoHtml, videoSent.videoThumbnail);
    clientPlaylist.push(video);
    console.log(clientPlaylist);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});