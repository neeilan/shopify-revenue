'use strict';
var fetch = require('node-fetch');

module.exports.getOrders = getOrders;

/**
Returns the number of orders that exist for the shop at baseUrl.
@param baseUrl : shop url in the form 'https://FOO.myshopify.com'
@param token : the access token
@return total number of orders
**/ 
function getOrderCount (baseUrl, token)
{
  const url = `${baseUrl}/admin/orders/count.json?&access_token=${token}`;
  return fetchJson(url)
    .then(data => data.count);
}

/**
Returns an array containing all the orders for the shop specified by baseUrl
@param baseUrl : shop url in the form 'https://FOO.myshopify.com'
@param token : the access token
@return an array of Order objects
**/
function getOrders(baseUrl, token)
{
    const ordersPerPage = 250;
    return getOrderCount(baseUrl, token)
        .then(numOrders => Math.ceil(numOrders/ordersPerPage))
        .then(retrieveOrders);

    /**
    Returns an array containing all the orders in the first numPages pages at
    the /orders endpoint
    **/
    function retrieveOrders(numPages)
    {
        const apiCalls = [];
        for(let pg = 1; pg <= numPages; pg++)
        {
            let url = `${baseUrl}/admin/orders.json?page=${pg}&limit=${ordersPerPage}&access_token=${token}`;
            apiCalls.push(fetchJson(url));
        }
        
        return Promise.all(apiCalls)
            .then(results => results.map(data => data.orders)) // pluck orders
            .then(orders => orders.reduce((prev, curr) => prev.concat(curr)));
    }

}

/**
Performs a GET request to a JSON endpoint
@param url: the url to perform a GET request on
@return JSON result of request
**/ 
function fetchJson(url)
{
    return fetch(url)
        .then(res => res.json());
}
