import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// let vidArray = [];
const apiKey = 'AIzaSyDxZy9vQXRU43KQCCmR2MgJHrF9bsAvyUE';

app.get("/", (req, res) => {
    res.render("index.ejs");
})

// // route for displaying data parsed in the post request below
// app.get("/results", (req, res) => {
//     res.render("index.ejs", { videos: vidArray })
// })

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

    res.render("index.ejs", { video: videoSrch });
})

// // this post route is for preparing the data for the get request above
// app.post("/results", (req, res) => {
//     let videosList = req.body.videos;
//     // check if the array is empty, if not clears for new search
//     if (vidArray.length !== 0) {
//         vidArray = []
//     }
//     // pushing data from youtube API into our own server side array
//     videosList.forEach(video => {
//         vidArray.push(video);
//     });
//     console.log(videosList);
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});