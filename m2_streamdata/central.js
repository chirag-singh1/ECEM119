const http = require('http');

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
        console.log(JSON.parse(data));
      });

    }).on("error", (err) => {console.log(err)});

    // Repeat every 250 ms
    checkUpdate();
  }, 250);
}

// Start running
checkUpdate();