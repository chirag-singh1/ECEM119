const http = require('http');

let sensorValue = {
  'id0': {},
  'id1': {},
}

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
        sensorValue.id0 = JSON.parse(data);
      });

    }).on("error", (err) => {console.log(err)});

    // Repeat every 250 ms
    checkUpdate();
  }, 75);
}

function checkUpdate2() {
  setTimeout(() => {
    // Connect to Arduino access point
    http.get('http://192.168.4.3', (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received, print
      resp.on('end', () => {
        sensorValue.id1 = JSON.parse(data);
      });

    }).on("error", (err) => {console.log(err)});

    // Repeat every 250 ms
    checkUpdate2();
  }, 75);
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
checkUpdate2();