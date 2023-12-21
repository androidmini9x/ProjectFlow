const express = require('express');
const userRoute = require('./routes/users');
const projectRoute = require('./routes/project');
const taskRoute = require('./routes/task');
const inviteRoute = require('./routes/invite');
const teamRoute = require('./routes/team');
const infoRoute = require('./routes/auth');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 8000;

app.use(cors({
    origin: '*'
}));
app.use(express.json());


// Test middle ware
app.use('/project/invitation', (req, res, next) => {
    console.log("params: ", req.params);
    console.log("body: ", req.body);
    console.log("body: ", req.headers);
    next();
});

app.use(userRoute);
app.use(projectRoute);
app.use(taskRoute);
app.use(inviteRoute);
app.use(teamRoute);
app.use(infoRoute);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});