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
  
  //CHECK FOR EXISTING KEYS ON REDIS
  
  // redisClient.keys('*', function (err, keys) {
  //   if (err) return console.log(err);
  //   console.log("keys are >>>>>>>> ", keys)
  // });       
  
  

  //POSSIBLE UNIQUE KEYS
  //req.ip REFERS TO WIFI IP, NOT MACHINE IP
  
  // redisClient.exists(req.headers.user, (err, reply) => {
  // redisClient.exists("user1", (err, reply) => {
  redisClient.exists(req.ip, (err, reply) => {
    if (err) {
      console.log("Redis not working...")
      system.exit(0)
    }
    if (reply === 1) {
      // user exists
      // check time interval
      
      redisClient.get(req.ip, (err, reply) => {
        
        let data = JSON.parse(reply)
        // console.log(" ACCESSES >>>>>>>>>>>>>>", data)
        let currentTime = moment().unix()
        let difference = (currentTime - data.startTime) / 60
        
        if (difference >= 1) {
          // allow the request
          let body = {
            'count': 1,
            'startTime': moment().unix()
          }
          
          redisClient.set(req.ip, JSON.stringify(body))
          
          next()
        }
        
        if (difference < 1) {
          //block the request
          if (data.count > 15) {
            let countdown = (60 - ((moment().unix() - data.startTime)))

            let timeLeft = {"time": countdown} 

            //original code
            // return res.json({ "error": 1, "message": "throttled limit exceeded..." }) 

            //suggested status 426
            // return res.status(426).json({ "error": 1, "message": "throttled limit exceeded..." }) 

            //proper status 429
            // return res.status(429).json({ "error": 1, "retry in": `${countdown} seconds`, "message": "throttled limit exceeded..."})
            return res.status(429).render("rate_limit", timeLeft )
          }
          
          // update the count and allow the request
          data.count++
          redisClient.set(req.ip, JSON.stringify(data))
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
      redisClient.set(req.ip, JSON.stringify(body))
      // allow request
      next()
    }
  })
}