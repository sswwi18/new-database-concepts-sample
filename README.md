# Example Project for "New Database Concepts"

This is an example project for the course "New Database Concepts" at [Baden-Wuerttemberg Cooperative State University (DHBW)](https://www.heidenheim.dhbw.de/).

## Requirements

Install the following requirements before using this project:

- Node.js v12 or higher
- Redis Server
- Angular CLI (optional, but recommended) `npm i -g @angular/cli`

## Setup / Start Project

### Server

To setup the server, open the directory `/server` and run `npm install`.

To start the server, run `npm start`.

The server should now be available at `http://localhost:3000/`

### Client

To setup the client, open the directory `/client` and run `npm install`.

To start the client, run `npm start` (without Angular CLI) or `ng serve` (with Angular CLI).

The client web app should now be available at `http://localhost:4200`.

### Database

#### Windows
For Windows users please follow to these instructions to set up the redis database: https://redislabs.com/blog/redis-on-windows-10/ .

#### Mac OS
- Make sure you have Homebrew installed on your Mac. You can donwload it at: `https://brew.sh`

- To install Redis run `brew install redis`
- To start Redis server run `brew services start redis`
- To stop redis server run `brew services stop redis`
- To restart Redis server run `brew services restart redis`

- To check if Redis is running connect to the Redis server using `redis-cli`
- You should see something like `127.0.0.1:6379>`
- Type `ping` and you should get the output `PONG`

- For further information visit: `https://tableplus.com/blog/2018/10/how-to-start-stop-restart-redis.html`


## Reading Class

- [Angular CLI](https://cli.angular.io/)
- [Socket.io](https://socket.io/get-started/chat/)
- [Redis Node.js Client](https://www.npmjs.com/package/redis)
- [Redis Commands](https://redis.io/commands)
