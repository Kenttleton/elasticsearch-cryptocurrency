# elasticsearch-cryptocurrency

This project is a simple docker compose service that spins up Kibana and 3 Elasticsearch instances in a cluster for simulated desaster recovery. A multithreaded Node.js service connects to the Kraken and the Coinbase exchanges via websockets and loads live data to the Elasticsearch stores.

For elasticsearch to work on Docker for Desktop, you will need to expand the virtual max memory setting on containers. The following link provides several answers to solve this problem. Choose the best one that fits your situation:

https://stackoverflow.com/questions/51445846/elasticsearch-max-virtual-memory-areas-vm-max-map-count-65530-is-too-low-inc
