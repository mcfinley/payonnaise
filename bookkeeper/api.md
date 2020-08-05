# Bookkeeper Service API

Here you can find a description for all the endpoints in bookkeeper service.

## Profiles

POST `/profiles` - Create a new profile. No additional data is required.
GET `/profiles` - List all profiles. Sorting, Filtering and Pagination may be passed as query params. Learn more.
GET `/profiles/:id` - Get a specific profile.
DELETE `/profiles/:id` - Delete a specific profile

POST `/profiles/:id/accounts` - Create a new account for a specific profile. `asset` should be provided in body.
GET `/profiles/:id/accounts` - List all accounts that belong to a specific profile. Sorting, Filtering and Pagination may be passed as query params. Learn more.
GET `/profiles/:id/accounts/:id` - Get one specific account that belongs to a specific profile information.
GET `/profiles/:id/accounts/:id/balance` - Get one specific account that belongs to a specific profile balance.
GET `/profiles/:id/accounts/:id/transfers` - Get one specific account's transfers.
DELETE `/profiles/:id/accounts/:id` - Delete a specific account that belongs to a specific profile.

## Accounts

POST `/accounts` - Create a new account. `asset` and `profileId` should be provided in body.
GET `/accounts` - List all accounts. Sorting, Filtering and Pagination may be passed as query params. Learn more.
GET `/accounts/:id` - Get one specific account information.
GET `/accounts/:id/balance` - Get one specific account balance.
GET `/accounts/:id/transfers` - Get transfers for an account
DELETE `/accounts/:id` - Delete a specific account.

## Transfers

POST `/transfers` - Create a new transfer. `fromAccountId`, `toAccountId` and `amount` should be provided in body.
GET `/transfers` - List all transfers. Sorting, Filtering and Pagination may be passed as query params. Learn more.

## Sort, Filter, Paginate

Every list request supports `sort`, `paginate` and `filter` params. While `filter` value vary from a request to request, `sort` and `paginate` are fixed schemas. Use them as `GET /accounts?sort[column]=id&sort[direction]=asc` and `GET /transfers?paginate[page]=0&paginate[pageSize]=20`.

Possible filters for accounst are `asset` and `profileId`, possible filters for transfers are `accountId`, e.g. `GET /transfers?filters[accountId]=2` or `GET /accounts?filters[asset]=first-fiat/USD`