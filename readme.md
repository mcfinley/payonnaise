# Payonnaise

Hey everyone 👋. Welcome to my cemetary of side projects, this is the coolest one.

## Description

This is supposed to be a "classic" payments/orders platform that allows you to deposit your money, transfer or trade them and withdraw. Exactly like that. With one little exception, that

> the assets list is not locked. anyone can create their own assets and the platform will manage them 

This means that, registered as a provider, you'll add the ability for platform users to deposits assets you came up with (Crypto Currencies, Game stuff, Financial instruments etc.). Users will be able to create accounts with that asset and start transfering / trading. And it's up to provider to manage deposits and withdrawals.

## Architecture

This platform consists of few microservices running with docker.

### 🤓 Bookkeeper Service

This one manages users accounts and it's balances.

### 🤠 Merchant Service

This one stores all the trades and closes them when possible updating user's balances in bookkeeper service.

### 🧞 Genie Service

This one helps others to treat distributed systems transactions by doing locks and stuff.
