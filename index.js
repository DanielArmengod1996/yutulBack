//hellow world
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const mysql = require('mysql');

const wrapper = require('./module');

app.use(fileUpload());


const PORT = process.env.PORT || 8020;




// este método va a recoger todos los videos de la base de datos de mysql
app.get('/getVideos', (req, res) => {
    var fromA = req.query.fromA;
    var fromB = req.query.fromB;


});


  /* se va proceder a guardar el video */
  app.post('/uploadMedia', function(req, res){
    console.log(req.files.file);
    let sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`./videos/${sampleFile.name}`, function(err) {
        res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
        res.send('File uploaded!');
    });
  });

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

/*DATABASE MANAGMENT*/

/* credenciales para entrar en mysql */

/* conectamos a la base de datos y comprobamos que va todo correctamente*/
/*
connection.connect((err)=>{
    if (err)throw err;
    console.log('Connected');
});*/





// metodo que va a iniciar sesion
app.post('/joinSession', (req, res) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    const callout = new Promise( function(resolve, reject){

        var requestBody='';
        req.on('data', data=>{
            requestBody += data;
        });
        var finalResponse;
        
        req.on('end', ()=>{
            finalResponse = JSON.parse(requestBody);
            resolve(finalResponse);
        });
    });

    callout.then(function(finalResponse){
        const params = [finalResponse.email,finalResponse.password];
        const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
        doQuery(query, params).then((results)=>{
            console.log(results);
            var classResponse = results.length > 0  ? JSON.stringify( wrapper.instanceSessionResponse(results[0].id) ) : JSON.stringify( wrapper.instanceSessionResponse('ko') ) ;
            console.log(classResponse);
            res.send(classResponse);
        });
        
    });

});


    // metodo que va a registrar un usuario
    app.post('/registerSession', (req, res) => {
        res.set({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });

        const callout = new Promise( function(resolve, reject){

            var requestBody='';
            req.on('data', data=>{
                requestBody += data;
            });
            var finalResponse;
            
            req.on('end', ()=>{
                console.log(requestBody);
                finalResponse = JSON.parse(requestBody);
                resolve(finalResponse);
            });

        });
        

        callout.then(function(finalResponse){

            executeRegisterValidations(finalResponse).then(function(finalValidation){
                var bodyResponse = '';
                if(finalValidation.length>0){
                    bodyResponse = JSON.stringify( wrapper.instanceStatusRegistered('KO', finalValidation ) );
                    console.log(bodyResponse);
                    res.send(bodyResponse);

                }else{
                    const params = [finalResponse.name,finalResponse.lastname, finalResponse.nick, finalResponse.email, finalResponse.password, finalResponse.country] ;
                    const query = 'INSERT INTO usuarios (name, lastname, nick, email, password, country ) VALUES ( ?, ?, ?, ?, ?, ?)';
                    
                    doQuery(query, params).then((results)=>{
                        bodyResponse = JSON.stringify( wrapper.instanceStatusRegistered('OK', finalValidation) );
                        console.log(bodyResponse);
                        res.send(bodyResponse);
                    });
                }
                

            });
    
            
        });

    });

    async function executeRegisterValidations(finalResponse){
        /* vamos a comprobar que el nick séa único y no exista en la base de datos */
        const validationNick = await validateNick(finalResponse);

        /* vamos a comprobar que el email séa el único y no exista en la base de datos */
        const validationEmail = await validateEmail(finalResponse);

        var validacionFinal=[];
        if( validationNick )
            validacionFinal.push('nick');
        if( validationEmail )
            validacionFinal.push('email');

        return validacionFinal;
    }

    /* método que comprueba que el níck tenga un valor único */
    function validateNick(finalResponse){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT * FROM usuarios WHERE nick = ?';
            const params = [finalResponse.nick];
    
            doQuery(query, params).then((results) =>{
                // en caso de que la lista de resultados séa menor a 1, se dara por resuelto la validacion
                resolve(results.length > 0);
            });
        });

    }

    /* método que comprueba que el níck tenga un valor único */
    function validateEmail(finalResponse){
        return new Promise((resolve, reject) =>{
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            const params = [finalResponse.email];
    
            doQuery(query, params).then((results) =>{
                // en caso de que la lista de resultados séa menor a 1, se dara por resuelto la validacion
                resolve(results.length > 0);
            });
        });

    }

    /**
     * 
     * @param {*} query  Example: ('SELECT * FROM miTabla WHERE nombre1 = ? AND nombre2 = ?')
     * @param {*} params Example: ([value1, value2])
     */
    function doQuery(query, params){
        return new Promise((resolve, reject)=>{
            var connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'yutul'
            });
            var response;
            connection.connect();
            connection.query(query,params,function(error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });
    }


