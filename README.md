# Job Queue Project

Take home coding challenge

## Getting started ##
Before starting make sure you have ```Redis``` installed on your machine. You can learn how to install Redis [here](http://redis.io/topics/quickstart)
```
  > Clone or download repository
  > cd Node_Job_Queue
  > npm install
  > npm start
```
## Tech used ##
* Express.Js
* Kue
* Request-Promise
* Ejs

## API ##

### POST /job ###
Create a job and get back result on job completion.
```
(html for the url requested)
```
### GET /job/:id ###
Get job log
```
{ id: '169',
  type: 'url_worker',
  data: { title: 'url html', url: 'https://www.google.com/' },
  result: (HTML for url),
  priority: 0,
  progress: '100',
  state: 'complete',
  created_at: '1475890445716',
  promote_at: '1475890445716',
  updated_at: '1475890445863',
  started_at: '1475890445721',
  duration: '140',
  workerId: 'kue:MacBook-Pro.home:53493:url_worker:4',
  attempts: { made: 1, remaining: 0, max: 1 } }

```
### GET /job/:id/html ###
Get html for certain job

## KUE API ##
Kue is a priority job queue backed by redis, built for node.js.

Kue also has a small UI Express application which exposes the following JSON API endpoints.

* GET /job/search?q=
* GET /stats
* GET /job/:id
* GET /job/:id/log
* GET /jobs/:from..:to/:order?
* GET /jobs/:state/:from..:to/:order?
* GET /jobs/:type/:state/:from..:to/:order?
* DELETE /job/:id
* POST /job

You can find out more information about the KUE UI API [here] (https://github.com/Automattic/kue)