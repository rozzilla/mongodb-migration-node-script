const async = require('async')
const mongodb = require('mongodb')
const customerData = require('./m3-customer-data.json')
const customerAddressData = require('./m3-customer-address-data.json')
const customerDataCount = customerData.length
const noOfQuery = parseInt(process.argv[2]) || customerDataCount

let tasks = []

if (customerDataCount % noOfQuery !== 0) {
  console.log(`Please insert a number of query different from ${noOfQuery}: it must be a divisor of ${customerDataCount}.`)
  return
}

mongodb.MongoClient.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((client) => {
  customerData.forEach((record, index) => {
    let startIndex = 0
    let endingIndex = 0
    customerData[index] = Object.assign(record, customerAddressData[index])
    
    if((index % noOfQuery) === 0) {
      startIndex = index
      endingIndex = startIndex + noOfQuery
      tasks.push((done) => {
        client.db('exchange').collection('customers').insertMany(customerData.slice(startIndex, endingIndex), (error, result) => {
          if(error) {
            console.log(`Error inserting record from ${startIndex} to ${endingIndex}: ${error}`)
            done(error, null)
          } else {
            console.log(`OK: inserted record from ${startIndex} to ${endingIndex}`)
            done(null, result)
          }
        })
      })
    }
  })

  console.log(`Launching ${tasks.length} parallel task(s)`)
  async.parallel(tasks, (error, result) => {
    if (error) {
      console.error(`Error on parallel task: ${error}`)
    } else {
      console.error(`Correctly inserted ${result.length} record`)
    }
    
    client.close()
  })
})
.catch((error) => {
  console.error(`Error on MongoDB connection: ${error}`)
  mongodb.MongoClient.close()
})