import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = 'AIzaSyDxZy9vQXRU43KQCCmR2MgJHrF9bsAvyUE';

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/search", async (req, res) => {
    let videoSrch = req.body.video;
    console.log(videoSrch)
    try {
        const request = await axios.get(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(videoSrch)}&part=snippet&type=video&maxResults=5&key=${apiKey}`);
        res.render("index.ejs", { content: request.data.items })
        console.log(request.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render("index.ejs", { content: JSON.stringify(error.response.data) })
    }
})

app.post("/video", (req,res)=> {
    
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});