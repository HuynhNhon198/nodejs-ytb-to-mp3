// const functions = require("firebase-functions");
// var admin = require("firebase-admin");
const fs = require("fs");
const ytdl = require("ytdl-core");

const express = require("express");
const cors = require("cors");

const api = express();

api.use(
  cors({
    origin: ["*"],
  })
);

var port = 1998

// var serviceAccount = require("./key.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://ytb-mp3-479fe.firebaseio.com"
// });

// const storage = admin.storage();

api.get("/convert", async (req, res) => {
  try {
    var videoUrl = req.query.link;  

    var videoReadableStream = ytdl(videoUrl, { filter: "audioonly" });
    ytdl
      .getInfo(videoUrl, function (err, info) {
        if (+info.length_seconds < 1800) {
            var videoName = info.title.replace("|", "").toString("ascii");
    
            var path = (new Date()).getTime() + ".mp3";
            var videoWritableStream = fs.createWriteStream(path);
    
            var stream = videoReadableStream.pipe(videoWritableStream);
            console.log('dd');
            stream.on("finish", function () {
              console.log("done");
              res.download(path, videoName+'.mp3', (err) => {
                if (err) {
                  console.log(err);
                }
                fs.unlink(path, (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
              });
            });
        } else {
            res.status(500);
            res.json({
                code: 'error',
                message: "Thời Lượng ViDeo không vượt quá 20phut"
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.json({
            code: 'error',
            message: "Có lỗi xảy ra, vui lòng kiểm tra lại link youtube"
        });
      });
  } catch (error) {
    res.json({
        code: 'error',
        message: "Có Lỗi Xảy Ra"
    });
  }
});
api.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))