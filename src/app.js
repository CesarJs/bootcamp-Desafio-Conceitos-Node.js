const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs} = request.body;
	const respository = { id: uuid(), url, title, techs, likes: 0};
	repositories.push(respository);
	return response.json(respository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
	const { url, title, techs} = request.body;
	const repositoryIndex = repositories.findIndex(repository => repository.id == id);
	if(repositoryIndex < 0){
		return response.status(400).json({ error: 'Repository that does not exist' });
	}
	const likes = repositories[repositoryIndex].likes;
	const project = {
		id: id,
		url,
		title,
		techs,
		likes,
	};
	repositories[repositoryIndex] = project;

	return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
	const repositoryIndex = repositories.findIndex(repository => repository.id == id);
	if(repositoryIndex < 0){
		return response.status(400).json({ error: 'Repository not found' });
	}
	repositories.splice(repositoryIndex, 1);
	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;
	const { url, title, techs} = request.body;
	const repositoryIndex = repositories.findIndex(repository => repository.id == id);
	if(repositoryIndex < 0){
		return response.status(400).json({ error: 'Repository that does not exist' });
	}
	const project = repositories[repositoryIndex];
	project.likes += 1;
	repositories[repositoryIndex] = project;

	return response.json(project);
});

module.exports = app;
