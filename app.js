const express = require('express');
const userRoute = require('./routes/users');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;


app.use(express.json());

app.use(userRoute);

app.get('/', (req, res) => {
    res.end('Hello, World');
});


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});