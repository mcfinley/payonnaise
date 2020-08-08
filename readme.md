# Payonnaise

Hey everyone 👋. This is an "experience buster" project I've making by my own. It's not supposed to be a real life working piece of software (at least yet).

This is a "classic" payments/orders platform that allows you to deposit your money to the platform, transfer or trade them and withdraw. One little not is that this platform does not have "locked" list of supported assets (e.g. only cryptocurrencies and fiats), but it allows you to create a *Provider* for any kind of asset you want (e.g. game items, financial instruments, coupons etc). This way anybody can create any asset they want and this asset's transfer and orders will be managed by the platform.

## Architecture

This platform consists of microservices.

### 🤓 Bookkeeper Service

This one manages users accounts and it's balances.

### 🤠 Merchant Service

This one stores all the trades and closes them when possible updating user's balances in bookkeeper service.