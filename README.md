# WagerBot

## About

This discord bot contains a currency system that allows you to create custom bets and gain or lose "tokens" on the result of these bets. There are two types of bets, short bets which last 5 minutes and long bets which last 30 minutes.

## Getting Started

### Tech Stack

* Node.Js
* npm
* Discord.Js
* MongoDB
* Mongoose
* dotenv 
* Studio 3T to view database
* Heroku for persistant bot

---

### Prerequisites

Install Node.JS and npm

---

### Installing

Install discord.js
> npm install discord.js

Install MongoDB
> npm install mongodb

Install Mongoose
> npm install mongoose

Install dotenv
> npm install dotenv --save

Create a MongoDB account and download Studio 3T.


## ENV File Setup

DISCORD_TOKEN = [This is the Discord Token Bot ID]

PREFIX = [The prefix of the commands: [!]command -- the ! is the prefix you want]

MONGODB_SRV = [MongoDB server link]

ROLE_NAME = [The role you want your bot to assign as a name]

SERVER_ID = [The ID of the discord server]


## Commands

register - Allows the user to earn tokens and participate in events

balance - Displays the current balance of tokens for the user

deposit - Allows the user to deposit an amount into their bank

withdraw - Allows the user to withdraw an amount from their bank

leaderboard - Displays the users with the most tokens

beg - Daily cooldown the user can use to generate a random number of tokens

longbet - A bet that lasts around 30 minutes

shortbet - A bet that lasts around 5 minutes



## Backlog / Upcoming Features

Format output text(report card) of Top 2 and bottom 2 as well as a list of everyone else with total gold earned to PK channel

Make Embed more fancy

clean up code / provide documentation / comments

find a host for the bot so no local host






