# Bookkeeper Service API

Here you can find a description for all the endpoints in bookkeeper service.

## Profiles

1. `POST` `/profiles` - Create a new profile. No additional data is required.
2. `GET` `/profiles` - List all profiles. Sorting, Filtering and Pagination may be passed as query params. Learn more.
3. `GET` `/profiles/:id` - Get a specific profile.
4. `DELETE` `/profiles/:id` - Delete a specific profile

1. `POST` `/profiles/:id/accounts` - Create a new account for a specific profile. `asset` should be provided in body.
2. `GET` `/profiles/:id/accounts` - List all accounts that belong to a specific profile. Sorting, Filtering and Pagination may be passed as query params. [Learn more](https://github.com/mcfinley/payonnaise/blob/master/bookkeeper/api.md#sort-filter-paginate)
3. `GET` `/profiles/:id/accounts/:id` - Get one specific account that belongs to a specific profile information.
4. `GET` `/profiles/:id/accounts/:id/balance` - Get one specific account that belongs to a specific profile balance.
5. `GET` `/profiles/:id/accounts/:id/transfers` - Get one specific account's transfers.
6. `DELETE` `/profiles/:id/accounts/:id` - Delete a specific account that belongs to a specific profile.

## Accounts

1. `POST` `/accounts` - Create a new account. `asset` and `profileId` should be provided in body.
2. `GET` `/accounts` - List all accounts. Sorting, Filtering and Pagination may be passed as query params. [Learn more](https://github.com/mcfinley/payonnaise/blob/master/bookkeeper/api.md#sort-filter-paginate)
3. `GET` `/accounts/:id` - Get one specific account information.
4. `GET` `/accounts/:id/balance` - Get one specific account balance.
5. `GET` `/accounts/:id/transfers` - Get transfers for an account
6. `DELETE` `/accounts/:id` - Delete a specific account.

## Transfers

1. `POST` `/transfers` - Create a new transfer. `fromAccountId`, `toAccountId` and `amount` should be provided in body.
2. `GET` `/transfers` - List all transfers. Sorting, Filtering and Pagination may be passed as query params. [Learn more](https://github.com/mcfinley/payonnaise/blob/master/bookkeeper/api.md#sort-filter-paginate)

## Sort, Filter, Paginate

Every list request supports `sort`, `paginate` and `filter` params. While `filter` value vary from a request to request, `sort` and `paginate` are fixed schemas. Use them as `GET /accounts?sort[column]=id&sort[direction]=asc` and `GET /transfers?paginate[page]=0&paginate[pageSize]=20`.

Possible filters for accounst are `asset` and `profileId`, possible filters for transfers are `accountId`, e.g. `GET /transfers?filters[accountId]=2` or `GET /accounts?filters[asset]=first-fiat/USD`