const express = require('express');
const server = express();

const knex = require('knex');
const dbConfig = require('./knexfile.js');

const db = knex(dbConfig.development);

const PORT = process.env.PORT || 5500;

server.use(express.json());

server.get('/', (req, res) => {
  res.send('I am responding to your GET request, Dave!');
});

// PROJECTS
// POST = INSERT INTO projects (id, name, description,flag) VALUES ('','','','')
server.post('/projects', (req, res) => {
  const project = req.body;
  console.log('project info', project)
  // if (project.name) {
    db('projects').insert(project)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(err => {
      res.status(500).json({err: 'Failed to insert projects'})
    })
});

//GET ALL = SELECT * FROM projects
server.get('/projects', (req, res) => {
  db('projects').then(rows => {
    res.json(rows);
  }).catch(err => {
    res.status(500).json({err: 'Failed to find projects'});
  });
});


// ACTIONS
// POST = INSERT INTO actions (id, description,notes, flag) VALUES ('','','','')
server.post('/actions', (req, res) => {
  const action = req.body;
  if (action.description) {
    db('actions').insert(action)
    .then(ids => {
      res.status(201).json(ids)
    })
    .catch(err => {
      res.status(500).json({err: 'Failed to insert action'})
    })
  }
});

//GET ALL = SELECT * FROM actions
server.get('/actions', (req, res) => {
  db('actions').then(rows => {
    res.json(rows);
  }).catch(err => {
    res.status(500).json({err: 'Failed to find actions'});
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});