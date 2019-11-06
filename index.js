//hellow world
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

const fs = require('fs'), 
    util = require('util');



const app = express();


const PORT = process.env.PORT || 8050;

const host = 'localhost';

//
app.get('/getVideos', (req, res) => {
    console.log('The server has been launched');
    console.log('----------------------------');
    console.log('---         JAI          ---');
    console.log('----------------------------');
    var fromA = req.query.fromA;
    var fromB = req.query.fromB;

    console.log(fromA);
    console.log('to');
    console.log(fromB);
    /* ejemplo de como estaríamos recogiendo los datos de la base de datos y lo mostrariamos al cliente montandolo en el json*/
    /* 
    var body = new infos('localhost/videos/asd.com', 'localhost/videos/asd.com', 'localhost/videos/asd.com', 'localhost/videos/asd.com', 'goya1', 'goya2', 'goya3', 'goya4');
    var varMineResponse = new GetVideosResponse(body);
    res.send(JSON.stringify(varMineResponse));
    /**/
});

const handleError = (err, res) => {
    res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "/path/to/temporary/directory/to/store/uploaded/files"
});


app.post(
    "/uploadVideo",
    upload.single("file"),
    (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./videos/video.mp4");
  
      if (path.extname(req.file.originalname).toLowerCase() === ".mp4") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .mp4 files are allowed!");
        });
      }
    }
  );


/* puerto para la escucha del funcionamiento de las peticiones con el servidor para recoger datos de cuentas, videos, y creacion de usuarios, cuentas, etc...*/
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`);
});




/* video streaming */
app.get('/getvideo', function(req, res) {
    const path = './videos/video.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
     
    if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
    ? parseInt(parts[1], 10)
    : fileSize-1
    
    console.log(start);
    console.log(end);
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})

    const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
    }
     
    res.writeHead(206, head)
    file.pipe(res)
    } else {
    const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
    }
})