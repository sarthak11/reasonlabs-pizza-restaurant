# reasonlabs-pizza-restaurant

The idea behind the problem is to take the pizza orders and process them from different queues.

Pizza cycle - Dough chef -> Topping chef -> Oven -> Serving

Following are the important variables used in index.js

```
pizzaOrders - all the orders
doughQueue - queue for dough processing
toppingsQueue - queue for toppings processing
ovenQueue - queue for ocen processing
servingQueue - queue for serving processing
```

## Getting Started

### Dependencies

* Node - 14+
* MongoDB - 6.2.0

In the root directory please create a .env file with the following content. Also create the db and collection as mentioned below

```
QUEUE_DB_HOST=localhost
QUEUE_DB_PORT=27017
QUEUE_DB_USER=
QUEUE_DB_PASS=
QUEUE_DB_NAME=queuedb
QUEUE_DB_COLL=queue
```

### Executing program

In the root directory of the project just do

```
npm start
```

It will ask for the manager name and as soon as name is entered it will start printing the logs for various steps and processes.

For changing any input data please modify pizzaOrders array in index.js file

### References

* https://www.npmjs.com/package/@craigbuckler/queue-mongodb

## Authors
* Sarthak Soni - sarthaksoni987@gmail.com