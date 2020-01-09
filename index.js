const express = require("express");
const pg = require("pg");

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html

const pool = new pg.Pool();

const queryHandler = (req, res, next) => {
  pool
    .query(req.sqlQuery)
    .then(r => {
      return res.json(r.rows || []);
    })
    .catch(next);
};

//-----------------------

app.use(express.static("public"));
app.set("view engine", "ejs");

//-----------------------

app.get("/", (req, res) => {
  // res.send('Welcome to EQ Works 😎')
  const statement = { welcome: "Welcome to EQ Works 😎" };
  res.render("welcome", statement);
});

//-----------------------
//all calls to DB have poi_id but it only makes sense on
app.get(
  "/events/hourly",
  (req, res, next) => {
    //   req.sqlQuery = `
    //   SELECT date, hour, events
    //   FROM public.hourly_events
    //   ORDER BY date, hour
    //   LIMIT 168;
    // `;
    req.sqlQuery = `
    SELECT *
    FROM public.hourly_events
    INNER JOIN public.poi ON public.poi.poi_id=public.hourly_events.poi_id
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

//-----------------------

app.get(
  "/events/daily",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

//-----------------------

app.get(
  "/stats/hourly",
  (req, res, next) => {
    // req.sqlQuery = `
    //   SELECT date, hour, impressions, clicks, revenue
    //   FROM public.hourly_stats
    //   ORDER BY date, hour
    //   LIMIT 168;
    // `
    req.sqlQuery = `
    SELECT *
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

//-----------------------

app.get(
  "/stats/daily",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 31;
  `;
    return next();
  },
  queryHandler
);

//-----------------------

app.get("/poi", (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
  // new portion {
  pool
    .query(req.sqlQuery)
    .then(r => {
      const poi = { savedLocations: JSON.stringify(r.rows) };
      res.render("geolocation", poi);
    })
    .catch(next);
});
//}
//over old portion {
//   return next()
// }, queryHandler)
//}

//-----------------------

//original "/poi" route below
app.get(
  "/poi/api",
  (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
    return next();
  },
  queryHandler
);

//-----------------------

//join tables route
// app.get(
//   "/events/poi",
//   (req, res, next) => {
//     req.sqlQuery = `
//     SELECT *
//     FROM public.hourly_events
//     JOIN public.poi ON public.poi.poi_id=public.hourly_events.poi_id
//     ORDER BY date, hour
//     LIMIT 168;
//   `;
//     return next();
//   },
//   queryHandler
// );

//-----------------------

app.listen(process.env.PORT || 5555, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on("uncaughtException", err => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
