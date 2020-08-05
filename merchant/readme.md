# 🤠 Merchant Service

This service accepts orders and executes them. When the order is closed, according transfers are created in bookkeeper service.

## API

1. Create an order - post /orders
2. Get order information - get /orders/:id
3. Cancel an order - delete /orders/:id
