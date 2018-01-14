const request = require('request-promise');
const _ = require("lodash");
var blockchainApi = {
    
    getLatestBlocks: function (req, res) {
        return request({
            "method": "GET",
            "uri": "https://blockchain.info/blocks?format=json",
            "json": true,
            "headers": {
                "User-Agent": ""
            }
        })
        .then(function(body) {
            return body.blocks.slice(0,5);
        })
        .catch((error)=>{
            res.status(500);
            res.send('Internal server error')
        });
    },

    getLatestBlockTransaction: function (height) {
        return request({
            "method": "GET",
            "uri": `https://blockchain.info/block-height/${height}?format=json`,
            "json": true,
            "headers": {
                "User-Agent": ""
            }
        })
        .then(function(body) {
            return body.blocks.slice(0,5);
        })
        .catch((error)=>{
            res.status(500);
            res.send('Internal server error')
        });
    }

    
}

module.exports = blockchainApi