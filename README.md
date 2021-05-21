# elasticsearch-cryptocurrency

This project is a simple docker compose service that spins up Kibana and 3 Elasticsearch instances in a cluster for simulated desaster recovery. A multithreaded Node.js service connects to the Kraken and the Coinbase exchanges via websockets and loads live data to the Elasticsearch stores.
