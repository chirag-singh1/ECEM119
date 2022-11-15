const http = require('http');

let sensorValue = {}

function checkUpdate() {
  setTimeout(() => {
    // Connect to Arduino access point
    http.get('http://192.168.4.1', (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received, print
      resp.on('end', () => {
        sensorValue = JSON.parse(data);
        console.log(sensorValue);
      });

    }).on("error", (err) => {console.log(err)});

    // Repeat every 250 ms
    checkUpdate();
  }, 25);
}


const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(sensorValue))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Start running
checkUpdate();