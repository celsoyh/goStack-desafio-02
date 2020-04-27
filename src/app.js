const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkValidUuid = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "UUID is invalid." })
  }

  next();
}

const checkIfRepoIsExistent = (request, response, next) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." })
  }

  next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});
// title, url e techs
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body; 
  const project = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", checkValidUuid, checkIfRepoIsExistent, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body; 
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const updatedProject = {
    id,
    title,
    url, 
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = updatedProject;

  return response.json(updatedProject);
});

app.delete("/repositories/:id", checkValidUuid, checkIfRepoIsExistent, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkValidUuid, checkIfRepoIsExistent, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex], 
    likes: repositories[repositoryIndex].likes + 1
  };

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
