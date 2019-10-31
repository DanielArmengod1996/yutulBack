//hellow world
const express = require('express');
const request = require('request');
const app = express();

const PORT = process.env.PORT || 8080;

app.get('/getVideos', (req, res) => {
    console.log('The server has been launched');
    console.log('----------------------------');
    console.log('---         JAI          ---');
    console.log('----------------------------');
    res.send('{mierda}');
});


app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`);
});