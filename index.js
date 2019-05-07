const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());


const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename:'./data/lambda.sqlite3'
  }
}


const db =knex(knexConfig);

// const router = require('express').Router();//Dont need router yet
// endpoints here

// get database
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

// get by ID
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if(zoo) {
        res.status(200).json(zoo)
      } else {
        res.status(404).json({ message: 'Zoo not found'})
      }
    }).catch(err => {
      res.status(500).json(err)
    })
});

// Post new Zoos
server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert(req.body)
    .then(zoo => {
      const [id] = zoo;

      db('zoos')
        .where({ id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo)
        })
    }).catch(err => {
      res.status(500).json(err)
    })
});

// update zoos
server.put('/api/zoos/:id', (req, res) => {

  db('zoos')
    .where({id: req.params.id})
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db('zoos')
        .where({id: req.params.id})
        .first()
        .then(zoo => {
          res.status(200).json(zoo)
        })
      } else {
        res.status(404).json({message: 'zoo not found'})
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Delete a zoo
server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Zoo Id not found' });
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});



// Port???

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

// module.exports = router;//dont need router yet