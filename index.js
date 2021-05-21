const { Worker, isMainThread } = require('worker_threads');

let kraken = null;
let coinbase = null;

const createKraken = () => {
    kraken = new Worker('./kraken.js');
    kraken.on('error', (error) => {
        console.error(error);
    });
    kraken.on('exit', (code) => {
        console.log(`Kraken exited with status code ${code}`);
        console.log(`Restarting Kraken Service Thread`);
        createKraken();
    });
    console.log(`Kraken Service Thread Created`);
}

const createCoinbase = () => {
    coinbase = new Worker('./coinbase.js');
    coinbase.on('error', (error) => {
        console.error(error);
    });
    coinbase.on('exit', (code) => {
        console.log(`Coinbase exited with status code ${code}`);
        console.log(`Restarting Coinbase Service Thread`);
        createCoinbase();
    });
    console.log(`Coinbase Service Thread Created`);
}


if(isMainThread) {
    if(!kraken) createKraken();
    if(!coinbase) createCoinbase();
}