// 1. setup
// Import the npm package express from the node_modules folder
import express from 'express';

// Import the custom function fetchJson from the ./helpers folder
import fetchJson from './helpers/fetch-json.js';

// Set the base endpoint
const apiUrl = "https://fdnd-agency.directus.app/items/";
const apiHouse = `${apiUrl}f_houses`;
const apiHouseIMG = `${apiUrl}f_houses?fields=*,poster_image.id,poster_image.height,poster_image.width`;
const apiList = `${apiUrl}f_list`;
const apiUsers = `${apiUrl}f_users`;
const apiFeedback = `${apiUrl}f_feedback`;

// Create a new express app
const app = express();

// Set ejs as the template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Use the 'public' folder for static resources, such as stylesheets, images, and client-side JavaScript
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 2. routes

app.get("/", async function (request, response) {
  try {
    const apiUsersData = await fetchJson(apiUsers);
    response.render("index", {
      apiUsers: apiUsersData.data
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});


app.get("/lijsten", async function (request, response) {
  const housesPromise = fetchJson(apiHouse);
  const listPromise = fetchJson(apiList);
  console.log(listPromise)

  const [houses, lists] = await Promise.all([housesPromise, listPromise]);
  console.log("Lists:", lists);


  response.render("lijsten", {
    houses: houses.data,
    lists: lists.data
  });
});

app.get("/lijsten/:id", async function (request, response) {
  const listId = request.params.id; 
  const housesPromise = fetchJson(apiHouse);
  const ListPromiseID = fetchJson(`${apiList}?filter[list][_eq]=${listId}`);
  // const housesPromise = fetchJson(`${apiHouse}?filter[list][_eq]=${listId}`);
  
  const [houseslist, Listnr] = await Promise.all([housesPromise, ListPromiseID]);

  response.render("lijst", {
    houses: houseslist.data,
    lists: Listnr.data
  });
});

// 3. Start the web server

// Set the port number for express to listen on
app.set('port', process.env.PORT || 8000);

// Start express, retrieve the port number
app.listen(app.get('port'), function () {
  // Display a message in the console and provide the port number
  console.log(`Application started on http://localhost:${app.get('port')}`);
});
