const express = require('express');

const app = express(); // create a new server 

// app is listening request and we added route("/test")
app.use("/test", (req, res) => {
    res.send('Hello from the server');
})

app.use("/hello", (req, res) => {
    res.send('Hello from the server');
})

app.listen(7777,
    () => console.log('server up on 3000')
); // listen to a port so app is listening 3000 port
