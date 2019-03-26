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

//GET PROJECT BY ID

server.get('/projects/:id', (req, res) => {
  const {id} = req.params;
  db('projects').where('id', id)
      .then(project => res.json(project))
      .catch(err => res.status(500).json({ message: "Could not fetch requested project" }))
});

// DELETE PROJECT BY ID
server.delete('/projects/:id', (req, res) =>{
  const {id} = req.params;
  db('projects').where('id', id).del()
      .then(rowsDeleted => {res.status(201).json(rowsDeleted)})
      .catch(err => {res.status(500).json({ message: "Unable to delete this project" })})
});

// UPDATE PROJECT BY ID

server.put('/projects/:id', (req, res) => {
  const {id} = req.params;
  const project = req.body;
  db('projects').where('id', id).update(project)
      .then(rowCount => {
          res.json(rowCount)
      })
      .catch(err => {res.status(500).json({ message: "Unable to update project" })})
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