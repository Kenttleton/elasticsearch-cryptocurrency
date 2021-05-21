const WebSocket = require('ws');
const {Client} = require('@elastic/elasticsearch');
const coinbase = new WebSocket('wss://ws-feed.pro.coinbase.com');
const elasticsearch = new Client({
    node: process.env.ELASTICSEARCH_URL
})

const bodyFactory = (pair, data) => {
    const date = new Date(data.time);
    return {
        index: `coinbase-${pair.toLowerCase()}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        id: date.getTime(),
        type: pair.replace('-', ''),
        body: {
            price: parseFloat(data.price),
            side: data.side,
            last_size: parseFloat(data.last_size),
            best_bid: parseFloat(data.best_bid),
            best_ask: parseFloat(data.best_ask),
            timestamp: date
        }
    }
}

const tickerSubscription = {
    type: "subscribe",
    product_ids: [
        "BTC-USD", 
        "ETH-USD", 
        "LTC-USD", 
        "ADA-USD", 
        "DOGE-USD", 
        "DOT-USD", 
        "USDT-USD", 
        "DAI-USD", 
        "UNI-USD", 
        "MATIC-USD"
    ],
    channels: [{
      name: "ticker",
    }]
}


coinbase.on('open', ()=>{
    coinbase.send(JSON.stringify(tickerSubscription));
});

coinbase.on('message', (data)=>{
    data = JSON.parse(data);
    console.info(JSON.stringify(data));
    if(data.type == 'ticker'){
        elasticsearch.index(bodyFactory(data.product_id, data),
        function(err, resp, status) {
            if(err) console.error(err);
            else console.info(resp);
        });  
    }
});

coinbase.on('close', ()=>{
    console.info(`Coinbase connection closed`);
    process.exit();
});