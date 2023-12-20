import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const apiKey = 'AIzaSyDxZy9vQXRU43KQCCmR2MgJHrF9bsAvyUE';


// Gloval Variable made for session persistence
let videoTarget;
// Playlist initialization and Video Constructor
let clientPlaylist = [];
function myVideo(title, id, html, thumbnail) {
    this.title = title;
    this.id = id;
    this.html = html;
    this.thumbnail = thumbnail;
};

// default home page
app.get("/", (req, res) => {
    res.render("index.ejs");
})

// Actual route used to render a single video's data, the data itself comes from the /video post route below
app.get("/video", (req, res) => {
    res.render("index.ejs", { video: videoTarget })
})

// Route for viewing all items in users playlist, takes data from created playlist above
app.get("/playlist", (req, res) => {
    let playlistString = JSON.stringify(clientPlaylist);
    // console.log(playlistString);
    let countforID = 0;
    res.render("index.ejs", { playlist: clientPlaylist, playlistString: playlistString, count:countforID })
})

// Route that is responsible for getting whatever the user searches for using the srchForm.ejs file
app.post("/search", async (req, res) => {
    let videoSrch = req.body.video;
    try {
        const request = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(videoSrch)}&part=snippet&type=video&maxResults=5&key=${apiKey}`);
        res.render("index.ejs", { content: request.data.items })
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render("index.ejs", { content: JSON.stringify(error.response.data) })
    }
})

// Route from results.ejs file, once a video is clicked a API request for that singular videos info is made and used to render the page
app.post("/video", async (req, res) => {
    let videoId = req.body.video;
    try {
        const request = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,player`);
        videoTarget = request.data.items[0]
        res.render("index.ejs", { video: videoTarget });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render("index.ejs", { content: JSON.stringify(error.response.data) })
    }
})

// Route from video.ejs file for adding a video to the playlist array
app.post("/add-video", (req, res) => {
    let videoSent = req.body
    let video = new myVideo(videoSent.videoTitle, videoSent.videoID, videoSent.videoHtml, videoSent.videoThumbnail);
    clientPlaylist.push(video);
})

// route for sending over info from local storage to server for current playlist
app.post("/copy-local", (req,res)=>{
    let localPlaylist = req.body.jsonObject;
    console.log(localPlaylist);
    if (localPlaylist.length > 0) {
        clientPlaylist = [];
        localPlaylist.forEach(video => {
            clientPlaylist.push(video);
        });
    }
    // Same functionality as "/playlist" route to match saved playlist to current playlist 
    let playlistString = JSON.stringify(clientPlaylist);
    let countforID = 0;
    res.render("index.ejs", { playlist: clientPlaylist, playlistString: playlistString, count:countforID })

})

// route for deleting a single video on playlist.ejs
app.post("/remove", (req,res)=>{
    let videoRm = req.body.video;
    clientPlaylist.splice(videoRm, 1);
    // console.log(clientPlaylist);
})

// route that just empties playlist array server side
app.get("/delete-playlist", (req,res)=>{
    clientPlaylist = [];
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});