'use strict';
var shopify = require('./shopify-utils');
var config = require('./config');

shopify.getOrders(config.baseUrl, config.accessToken)
    .then(calculateRevenue)
    .then(revenue => console.log(revenue));
    
/**
Calculates total order revenue, including shipping and taxes
@param orders: an array of Order objects using the same currency
@return total revenue from orders, in the currency used for orders
**/    
function calculateRevenue(orders)
{
    return orders
        .filter(order => order.cancelled_at === null) // ignore cancelled orders
        .reduce((total, order) => total + parseFloat(order.total_price) + shippingCost(order), 0)
        .toFixed(2);
}

/**
Calculates total shipping cost of order
@param orders: an Order object
@return total shipping cost of this order, in currency used for this order
**/ 
function shippingCost(order)
{
    return order.shipping_lines.reduce((total, sl) => total + parseFloat(sl.price), 0);
}
    
