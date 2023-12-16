const express = require('express');
const userRoute = require('./routes/users');
const projectRoute = require('./routes/project');
const taskRoute = require('./routes/task');
const inviteRoute = require('./routes/invite');
const app = express();

const port = process.env.PORT || 8000;


app.use(express.json());


// Test middle ware
app.use('/project/:project_id/invitation', (req, res, next) => {
    console.log("params: ", req.params);
    console.log("body: ", req.body);
    console.log("body: ", req.headers);
    next();
});

app.use(userRoute);
app.use(projectRoute);
app.use(taskRoute);
app.use(inviteRoute);


app.get('/', (req, res) => {
    res.end('Hello, World');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});