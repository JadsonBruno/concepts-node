const express = require("express");
const cors = require("cors");

const {v4: uuid} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Routes
 */
app.get("/repositories", (request, response) => {
   return response.json(repositories);
});


app.post("/repositories", (request, response) => {
  // get repository attributes from body
  const {title, url, techs} = request.body;

  // create repository object
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  // store repository into array
  repositories.push(repository);

  // return created repository
  return response.json(repository);
});


app.put("/repositories/:id", (request, response) => {
  // get repository id from params
  const {id} = request.params;

  // get new repository attributes from body
  const {title, url, techs} = request.body;

  // get index of repository
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  // repository does not exist: return bad request
  if (repoIndex < 0)
  {
    return response.status(400).send();
  }

  // get likes amount of repository
  const likes = repositories[repoIndex].likes;

  // create new repository object
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  // store updated repository
  repositories[repoIndex] = repository;

  // return updated repository
  return response.json(repository);
});


app.delete("/repositories/:id", (request, response) => {
  // get repository id from params
  const {id} = request.params;

  // get index of repository
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  // repository does not exist: return bad request
  if (repoIndex < 0)
  {
    return response.status(400).send();
  }

  // remove repository from store
  repositories.splice(repoIndex, 1);

  // return no content
  return response.status(204).send(undefined);
});


app.post("/repositories/:id/like", (request, response) => {
  // get repository id from params
  const {id} = request.params;

  // get index of repository
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  // repository does not exist: return bad request
  if (repoIndex < 0)
  {
    return response.status(400).send();
  }

  // increase the amount of repository likes
  repositories[repoIndex].likes++;

  // return repository with updated quantity of likes
  return response.json(repositories[repoIndex]);
});

module.exports = app;
