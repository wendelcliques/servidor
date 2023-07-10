const express = require("express");
const bodyParser = require("body-parser");
const mercadopago = require('mercadopago');
const cors = require("cors");

const config = require('../config/index.json');



const server = express();

server.use(cors());
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());


mercadopago.configure({
    access_token: config.token
  });

async function metodos() {
  var response = await mercadopago.payment_methods.listAll();
  console.log('meios de pagamento', response.body);
}


//Routes
server.post('/', (req, res) => {

console.log('req.body', req.body.title);
console.log('req.body', req.body);


    let preference = {
        items: [
          {
            title: `Número escolhido: ${req.body.title}`,
            unit_price: parseFloat(req.body.price),
            quantity: 1,
          }
        ],
        back_urls: {
          failure: "http://www.webdesignemfoco.com/failure",
          pending: "http://www.webdesignemfoco.com/pending",
          success: "http://www.webdesignemfoco.com/success",

        },

        payment_methods: {
            installments: 1,

            excluded_payment_types: [
             // {"id": "ticket"},
              {"id": "debit_card"},
              {"id": "paypal"},

            ]
        },

       
      };
      
      mercadopago.preferences.create(preference)
      .then(function(data){

        res.send(JSON.stringify(data.response.init_point));
      // Este valor substituirá a string "<%= global.id %>" no seu HTML
       // global.id = data.response.body.id;
      }).catch(function(error){
        console.log(error);
      });
});





let port = process.env.PORT || 3000;
server.listen(port, (req, res) => {
 // metodos();
    console.log('Servidor rodando');
})


//"src": "api/index.js",
//use": "@vercel/node"