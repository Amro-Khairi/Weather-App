// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware, which let us parse the body of the request and access it, Now we can use express to do the same functionality
app.use(bodyParser.urlencoded({ extended: false })); //Or express.urlencoded({ extended: false})
app.use(bodyParser.json()); //Or express.json()

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is up and running at localhost:${port}`);
})

//GET request
app.get('/weather', (req, res) => {
    res.send(projectData);
})

//POST route
app.post('/weather', (req, res) => {
    const {temperature, date, userResponse} = req.body;
    projectData['temperature'] = temperature;
    projectData['date'] = date;
    projectData['user-response'] = userResponse;
    res.end();
})
