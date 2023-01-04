import { Queue } from '@craigbuckler/queue-mongodb';
import express from 'express';
import promptSync from 'prompt-sync';

const app = express();
const prompt = promptSync()

const doughQueue = new Queue('dough');
const toppingsQueue = new Queue('toppings');
const ovenQueue = new Queue('oven');
const servingQueue = new Queue('serving');

let pizzaOrders = [
    { name : 'pizza1' , toppings : ['onion', 'tomato']},
    { name : 'pizza2' , toppings : ['cheese', 'tomato']},
    { name : 'pizza3' , toppings : ['capsicum', 'onion']}
]

const name = prompt('What is your name?');
console.log(`Hey there ${name} here is the order for you to manage: `, JSON.stringify(pizzaOrders));

// Empty queues
doughQueue.purge();
toppingsQueue.purge();
ovenQueue.purge();
servingQueue.purge();

var timer = 0;
setInterval(function () {
    timer = ++timer; // SET { 1-360 }
}, 1000);

sendTwoInitialPizzasForProcessing(pizzaOrders);
startOtherPizzasProcessing(pizzaOrders);

async function sendTwoInitialPizzasForProcessing(pizzaOrders) {
    for (var i=0; i < 2; i++) {
        let obj = {
            name: pizzaOrders[i].name,
            time: 0
        };
        await sendToDoughQueue(obj);
    }
}

async function startOtherPizzasProcessing(pizzaOrders) {
    var index = 2;
    var interval = setInterval(async function(){
        if(index >= pizzaOrders.length){
            clearInterval(interval);
        }
        else {
            let count = await doughQueue.count();
            if (count < 2) {
                var pizza = pizzaOrders[index];
                let obj = {
                    name: pizza.name,
                    time: timer
                };
                index++;
                await sendToDoughQueue(obj);
            }
        } 
    }, 1000)
}

var doughInterval = setInterval(async function(){
    let doughItem = await doughQueue.receive(); 
    setTimeout( async () => {
        if (doughItem) {
            let count = await toppingsQueue.count();
            if (count < 3) {
                doughItem.data.time = timer;
                await sendToToppingsQueue(doughItem.data)
            }
            else {
                await sendToDoughQueue(doughItem.data);
            }
        } 
    }, 7000)
}, 1000)

var toppingsInterval = setInterval(async function(){
    let toppingItem = await toppingsQueue.receive(); 
    setTimeout( async () => {
        if (toppingItem) {
            let count = await ovenQueue.count();
            if (count < 1) {
                toppingItem.data.time = timer;
                await sendToOvenQueue(toppingItem.data)
            }
            else {
                await sendToToppingsQueue(toppingItem.data);
            }
        } 
    }, 4000)
}, 1000)

var ovenInterval = setInterval(async function(){
    let ovenItem = await ovenQueue.receive(); 
    setTimeout( async () => {
        if (ovenItem) {
            let count = await ovenQueue.count();
            if (count < 2) {
                ovenItem.data.time = timer;
                await sendToServingQueue(ovenItem.data)
            }
            else {
                await sendToOvenQueue(ovenItem.data)
            }
        } 
    }, 10000)
}, 1000)

var servingInterval = setInterval(async function(){
    let servingItem = await servingQueue.receive(); 
    setTimeout( async () => {
        if (servingItem) {
            servingItem.data.time = timer;
            console.log('pizaa delivered to customer: ', servingItem.data);
        }
    }, 5000)
}, 1000)


async function sendToDoughQueue(obj) {
    const send = await doughQueue.send(obj);
    console.log('\nsend dough: ', send);
}

async function sendToToppingsQueue(obj) {
    const send = await toppingsQueue.send(obj);
    console.log('\nsend topping: ', send);
}

async function sendToOvenQueue(obj) {
    const send = await ovenQueue.send(obj);
    console.log('\nsend oven: ', send);
}

async function sendToServingQueue(obj) {
    const send = await servingQueue.send(obj);
    console.log('\nsend serving: ', send);
}