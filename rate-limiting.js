const redis = require('redis')
const redisClient = redis.createClient()
const moment = require('moment')
//---------------------
const RedisServer = require('redis-server');

// Simply pass the port that you want a Redis server to listen on.
const server = new RedisServer(6379);

server.open((err) => {
  if (err === null) {
    // You may now connect a client to the Redis
    // server bound to port 6379.
  }
});

//---------------------
module.exports = (req, res, next) => {
  // redisClient.exists(req.headers.user, (err, reply) => {
  redisClient.exists("user1", (err, reply) => {
    if (err) {
      console.log("Redis not working...")
      system.exit(0)
    }
    if (reply === 1) {
      // user exists
      // check time interval
      // redisClient.get(req.headers.user, (err, reply) => {
      redisClient.get("user1", (err, reply) => {
        let data = JSON.parse(reply)
        // console. log(req.headers.user)
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>", data)
        let currentTime = moment().unix()
        let difference = (currentTime - data.startTime) / 60
        if (difference >= 1) {
          let body = {
            'count': 1,
            'startTime': moment().unix()
          }
          // redisClient.set(req.headers.user, JSON.stringify(body))
          redisClient.set("user1", JSON.stringify(body))
          // allow the request
          next()
        }
        if (difference < 1) {
          if (data.count > 15) {
            return res.json({ "error": 1, "message": "throttled limit exceeded..." })
          }
          // update the count and allow the request
          data.count++
          // redisClient.set(req.headers.user, JSON.stringify(data))
          redisClient.set("user1", JSON.stringify(data))
          // allow request
          next()
        }
      })
    } else {
      console.log("added new user")
      // add new user
      let body = {
        'count': 1,
        'startTime': moment().unix()
      }
      // redisClient.set(req.headers.user, JSON.stringify(body))
      redisClient.set("user1", JSON.stringify(body))
      // allow request
      next()
    }
  })
}