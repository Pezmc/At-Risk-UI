Client = require('node-rest-client').Client;

client = new Client();


express = require 'express'
router = express.Router()

# GET home page.

router.get '/', (req, res) ->

  client.get("http://atrisk.sammachin.com/history", (data, response) ->
    res.render 'index', { title: 'At Risk', history: data, logged_in: true }
  )

router.get '/test_welfare', (req, res) ->

  client.get("http://atriskalerter.herokuapp.com/check", (data, response) ->
    res.send 'API check done!'
  )

module.exports = router
