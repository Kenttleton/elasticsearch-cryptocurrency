const WebSocket = require('ws');
const {Client} = require('@elastic/elasticsearch');
const kraken = new WebSocket('wss://ws.kraken.com');
const elasticsearch = new Client({
    node: process.env.ELASTICSEARCH_URL
});

const bodyFactory = (pair, data) => {
    const date = new Date();
    pair = pair.replace('/', '-');
    return {
        index: `kraken-${pair.toLowerCase()}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        id: date.getTime(),
        type: pair.replace('-', ''),
        body: {
            ask_price: parseFloat(data.a[0]),
            ask_whole_volume: parseInt(data.a[1]),
            ask_volume: parseFloat(data.a[2]),
            bid_price: parseFloat(data.b[0]),
            bid_whole_volume: parseInt(data.b[1]), 
            bid_volume: parseFloat(data.b[2]),
            close_price: parseFloat(data.c[0]), 
            close_volume: parseFloat(data.c[1]),
            volume_today: parseFloat(data.v[0]), 
            volume_last24hours: parseFloat(data.v[1]),
            price_today: parseFloat(data.p[0]), 
            price_last24hours: parseFloat(data.p[1]),
            trades_today: parseInt(data.t[0]), 
            trades_last24hours: parseInt(data.t[1]),
            low_price_today: parseFloat(data.l[0]), 
            low_price_last24hours: parseFloat(data.l[1]), 
            high_price_today: parseFloat(data.h[0]), 
            high_price_last24hours: parseFloat(data.h[1]),
            open_price_today: parseFloat(data.o[0]), 
            open_price_last24hours: parseFloat(data.o[1]),
            timestamp: date
        }
    }
}

const tickerSubscription = {
    event: "subscribe",
    pair: [
        "BTC/USD", 
        "ETH/USD", 
        "LTC/USD", 
        "ADA/USD", 
        "DOGE/USD", 
        "DOT/USD", 
        "USDT/USD", 
        "DAI/USD", 
        "UNI/USD", 
        "MATIC/USD"
    ],
    subscription: {
      name: "ticker"
    }
}

kraken.on('open', ()=>{
    kraken.send(JSON.stringify(tickerSubscription));
});

kraken.on('message', (data)=>{
    data = JSON.parse(data);
    console.info(JSON.stringify(data));
    if(data[1] && data[3]){
        elasticsearch.index(bodyFactory(data[3], data[1]),
        function(err, resp, status) {
            if(err) console.error(err);
            else console.info(resp);
        });  
    }
});

kraken.on('close', ()=>{
    console.info(`Kraken connection closed`);
    process.exit();
});