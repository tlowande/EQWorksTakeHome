# EQWorks Internship Challenges

##### developed by Tamires Lowande

Based on the detailed instructions below, this challenge is available at [https://habitual-license.glitch.me](https://habitual-license.glitch.me)   
<br/>
<br/>
<br/>
### Map with POI and Events Daily
!["Map with POI and Events Daily"](https://cdn.glitch.com/46f8b5bc-71f1-43d8-a418-9221e34822b5%2FEQWorks_map.gif?v=1579020483742)
<br/>
<br/>
### Events Hourly and details
!["Events Hourly and details"](https://cdn.glitch.com/46f8b5bc-71f1-43d8-a418-9221e34822b5%2FEQWorks_events.gif?v=1579020530085)
<br/>
<br/>
### Events Hourly and Stats
!["Events Hourly and Stats"](https://cdn.glitch.com/46f8b5bc-71f1-43d8-a418-9221e34822b5%2FEQWorks_eventsHourly.gif?v=1579020537353)
<br/>
<br/>
### Stats daily detail and first map developed
!["Stats daily detail and first map developed"](https://cdn.glitch.com/46f8b5bc-71f1-43d8-a418-9221e34822b5%2FEQWorks_stats.gif?v=1579020550221)
<br/>
<br/>
<br/>
<br/>

# Original Instructions
_____________________

## Problems

Complete 1, then pick either 2a or 2b that best represents your interest.

### 1. server-side rate-limiting

Implement rate-limiting on all of the API endpoints. Do not use an off-the-shelf solution such as https://pypi.org/project/Flask-Limiter/ or https://www.npmjs.com/package/express-rate-limit.

### 2a - Front-end Track

Build UI components that leverages the API server from problem 1 to solve problems below.

#### A. client-side general chart visualizations

Implement one or more types of charts that can be used to effectively visualize data supplied from the API endpoints. Users should be able to pick different metrics to visualize and compare with others.

#### B. client-side data table

Implement a functional data table that can be used to browse through data supplied from the API endpoints. The data table should allow users to fuzzy search on meaningful values (such as POI names), and matching rows should be highlighted.

#### C. client-side geo visualizations

Implement a functional map-based data visualization based on different POI-bound metrics. Users should be able to select different metrics and be able to distinguish each metrics' intensity of different POIs. The map should also allow a certain degree of flexibility for users to zoom in and out, and allow users to see a "clustered" indicator when more than one POIs are too close to each other at the given zoom level.

You will likely need to implement data join between the POIs and other datasets.

## Submission

For problem 1 and 2a, please demonstrate your solutions through one or more self-hosted services:
- [Glitch](https://glitch.com) - simplest way to have source code and demo in one place.
- [GitHub Pages](https://pages.github.com/) - also possible to have both source code and demo in one repository.
- [Netlify](https://www.netlify.com/)
- [Heroku](https://www.heroku.com/)
- Other choices of your own

If you choose not to host your solutions using [Glitch](https://glitch.com), please also share a link to your code repository.

## Notes

Keep in mind that both the amount and the dimension of the data we work with are much higher in reality, so try to demonstrate that your solutions are capable of handling beyond the sample scale.

Please do not include any credentials in public repo.

## Work Sample for Product Aspect, Node.js Variant

[What is this for?](https://github.com/EQWorks/work-samples#what-is-this)

### Setup and Run

The following are the recommended options, but you're free to use any means to get started.

#### Remote Option: Glitch.com

1. [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/EQWorks/ws-product-nodejs)
2. Populate `.env` file with the environment variables given in the problem set we send to you through email
3. Click on `Show Live` and you should see `Welcome to EQ Works 😎`

#### Local Option 1: Node.js 6.10+

1. Clone this repository
2. Install Node.js dependencies `$ npm install`
3. Set environment variables given in the problem set we send to you through email and run `$ npm run dev`
4. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

#### Local Option 2: Docker (`docker-compose` needed)

1. Clone this repository
2. Create and populate `.env` file with the environment variables given in the problem set we send to you through email
3. `$ docker-compose up` (or `$ docker-compose up -d` to run as a daemon)
4. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

### Notes on working through the problems

Make sure any additional Node.js level dependencies are properly added in `package.json`. We encourage a healthy mixture of your own implementations, and good choices of existing open-source libraries/tools. We will comment in the problems to indicate which ones cannot be solved purely through an off-the-shelf solution.
