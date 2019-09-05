const router = require('express').Router();

const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename:'./data/lambda.sqlite3'
  }
}

const db =knex(knexConfig)

const UserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
}

// get database
router.get('/', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears)
    })
    .catch(err => {UserError(500, 'Bear with that ID does not exist', err)}) //does it work?
});

// get by ID
router.get('/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .first()
    .then(bear => {
      if(bear) {
        res.status(200).json(bear)
      } else {
        res.status(404).json({ message: 'Zoo not found'})
      }
    }).catch(err => {UserError(500, 'Zoo with that ID does not exist', err)}) // how to check this?
});

// Post new bears
router.post('/', (req, res) => {
  db('bears')
    .insert(req.body)
    .then(bear => {
      const [id] = bear;

      db('bears')
        .where({ id })
        .first()
        .then(bear => {
          res.status(200).json(bear)
        })
    }).catch(err => {
      res.status(500).json(err)
    })
});

// update bears
router.put('/:id', (req, res) => {

  db('bears')
    .where({id: req.params.id})
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db('bears')
        .where({id: req.params.id})
        .first()
        .then(bear => {
          res.status(200).json(bear)
        })
      } else {
        res.status(404).json({message: 'bear not found'})
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Delete a bear
router.delete('/:id', (req, res) => {
  db('bears')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'bear Id not found' });
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

module.exports = router;