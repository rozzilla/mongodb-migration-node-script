# mongodb-migration-node-script
##Example of a migration script made with Node.js that merge json files into MongoDB records 

To run it:

`git clone https://github.com/rozzilla/mongodb-migration-node-script.git && cd mongodb-migration-node-script && npm install`

To try it, execute the script with this command:
`node index.js 10`

Then you can see the collection on MongoDB through the CLI:
```
mongo
use exchange
db.customers.find().pretty()

```

If you don't yet have it, please install from here: https://docs.mongodb.com/manual/installation/
