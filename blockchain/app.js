const _ = require("lodash");
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const blockchainApi = require('./blockchainApi');

const app = express();
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors());

//GET

app.get('/summary', (req, res) => {
	 let summary;
   blockchainApi.getLatestBlocks(req, res)
   .then((blockResults) => {
     return Promise.all(blockResults.map((block) => {
          return blockchainApi.getLatestBlockTransaction(block.height)
      }));
   })
   .then((blockTranactions) => {
    let model = blockTranactions.map((block) => {
      let transactionValuesFlattened = _(_.map(block[0].tx, function(transaction) {
              return _.map(transaction.out, 'value');
          })).flatten().sortBy().value();

          return { 
          'height': block[0].height,
          'time': block[0].time,
          'num_tx': block[0].tx.length,
          'tx': _.map(block[0].tx, function(tx) {
              return {
                'hash': tx.hash,
                'num_input': tx.inputs.length,
                'num_output': tx.out.length,
                'input_ratio': (tx.inputs.length/tx.out.length*100),
                'value': tx.out.reduce(function(sum, item) {return sum + item.value}, 0)
              }
          }),
          'total_tx': transactionValuesFlattened.reduce(function(sumTotal, item) {
                        return sumTotal + item
                      }, 0),
          'smallest': _.first(transactionValuesFlattened),
          'average': _.mean(transactionValuesFlattened),
          'largest': _.last(transactionValuesFlattened)
          }
        });
        return model;
   }).then((summary) => {
     res.send({summary});
   }).catch((err) => {
      res.status(400).send(err);
   });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};