# 🧞 Genie Service

Genie Service is a huge mutex for distributed system transactions. It provides an isolation for microservices transactions using Lock Based Concurrency Control.

## Interface

Genie has a TCP interface on GENIE_HOST:GENIE_PORT, all the services talk through that channel. All the commands and responses sent through TCP must be JSON stringified objects with `command` and `payload` params.

## Locks

Every lock can be either `shared` or `exclusive`. Shared locks can take effect together, while no other lock may happen with `exclusive` lock taking space. Every lock has a name of the resource that it requests access to (e.g. `accounts/2` meaning that account with ID 2 should be locked).

## Commands

1. `request` with params of `resources`, `queueTimeout`, `transactionTimeout`, `transactionName` and `priority`

Used to request lock for specific list or resources. Please note that requesting lock does not set this lock up. Your request is only queued. Examples:

```
-> {"command":"request","payload":{"resources":["shared:accounts/13"]}}
-> {"command":"request","payload":{"resources":["shared:accounts:odd","exclusive:accounts:2"]}} # this should actually
-> {"command":"request","payload":{"resources":["shared:accounts/10"],"queueTimeout":20000}} # with queue timeout of 20s
-> {"command":"request","payload":{"resources":["shared:accounts/10"],"transactionName": "my-transaction"}} # see deadlocks section
```

Possible responses:

```
<- {"command":"queued","payload":{"id":101}} # meaning that our request is successfully queued with ID of 101
<- {"command":"locked","payload":{"id":101}} # meaning that our request (101) now is executed and the resource we requested are locked now. You should perform a transaction after it
<- {"command":"released","payload":{"id":101,"reason":"..."}} # meaning that request with id 101 is released (due to an error or not)
```

Default parameters to all timeouts are `10000` (10s)

2. `release` with params `id`

Used to tell the genie that transaction is now completed (successfully or not). Examples:

```
-> {"command":"release","payload":{"id":101}} # Now all the waiting lock requests in queue will be treated
```

Possible responses:

```
<- {"command":"released","payload":{"id":101,"reason":"..."}}
```

Releasing the request when it's released does not make any effect.

## Release Response

When the request is released, a `released` response is send to the client that has made this `request`. It has a `reason` parameter which may be one the following:

1. `queue-timeout` meaning that the request was waiting too long in the queue
2. `transaction-timeout` meaning that the lock was made but the transaction took to long to complete
3. `deadlock` meaning that the request is causing a deadlock
4. `success` meaning that the request was released by `release` command

In the 1st and the 3rd scenarios the response will be shared with the consumer before the transaction execution begins (at least it should be so). And it should not be hard to try again or skip the transaction. In order to fix the transaction timeout issues it's required to rerequest the locks and roll back the changes were made (see saga section).

## Deadlocks

[Deadlocks](https://en.wikipedia.org/wiki/Deadlock) are typical when you use 2PL approach. In order to prevent that you have to request all the locks with one call (that is a recommended way to use Genie for now). Anyway if you don't want to request everything at once (e.g. some resources may not be required to lock) or you want to optimize the amount of time exclusive locks take effect, you have to provide `transactionName` to every `request` command you send. Otherwise deadlocks detection mechanism won't work.

## Priorities

When `request` is made it's possible to send `priority` parameter. Higher priorities lead to the request to get queued before all the lower priorities requests.

## Queue

The queue manager is generally simple, it works by following this algorithm (starting for the first item in the queue):

1. Take the Nth request the queue and see if it's executable (all the locks this request has are now being unset). If so, perform the lock, start algorithm from the beginning.
2. If the Nth request was not executable by that point, we take the N+1th item and perform the same checks, but we treat the locks, requested by all the items above N+1th (N, N-1, ... 0)th as locked. By doing that we prevent a huge request being actually higher in the queue for waiting too much while smaller requests below it are getting executed.

## API

.. to be written ..

## Redis

Genie uses redis to store locks. The connection properties are being passed via GENIE_REDIS_HOST and GENIE_REDIS_PORT envs.

## Deployment

Genie is not designed to horizontally scale, but it's on the radar for future updates.