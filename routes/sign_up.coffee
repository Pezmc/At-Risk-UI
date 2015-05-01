express = require 'express'
router = express.Router()

braintree = require 'braintree'

gateway = braintree.connect({
  environment:  braintree.Environment.Sandbox
  merchantId:   'MERCHANT_ID'
  publicKey:    'PUBLIC_KEY'
  privateKey:   'PRIVATE_KEY'
})

# GET users listing.
router.get '/', (req, res) ->

  gateway.clientToken.generate({}, (err, response) ->
    res.render 'sign_up', { clientToken: response.clientToken }
  )

router.post '/checkout', (req, res) ->

  gateway.customer.create({
    firstName: req.body.first,
    lastName: req.body.last,
    phone: req.body.home_phome,
    fax: req.body.emergency_number,
    paymentMethodNonce: req.body.payment_method_nonce
  }, (err, result) ->
    if err? || !result.customer? || !result.customer.creditCards?
      res.send 'Something broke sorry!'

    customer = result.customer
    token = customer.creditCards[0].token

    gateway.subscription.create({
      planId: "basicPlan"
      paymentMethodToken: token
    }, (err, result) ->
      console.log customer

      req.session.customer = customer
      req.session.signup = true

      res.redirect('/')
    )
  )


module.exports = router
