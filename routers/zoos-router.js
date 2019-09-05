const router = require('express').Router();
// or const router = express.Router();
const knex = require('knex');


const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename:'./data/lambda.sqlite3'
  }
}

const db =knex(knexConfig);

const UserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
}



// get database
router.get('/', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => {UserError(500, 'Zoo with that ID does not exist', err)}) //does it work?
});

// get by ID
router.get('/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
      if(zoo) {
        res.status(200).json(zoo)
      } else {
        res.status(404).json({ message: 'Zoo not found'})
      }
    }).catch(err => {UserError(500, 'Zoo with that ID does not exist', err)}) // how to check this?
});

// Post new Zoos
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {

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
router.delete('/:id', (req, res) => {
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

module.exports = router;