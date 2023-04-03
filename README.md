# Grasp (Web)

## Description
A Web Application that helps you create roadmaps for your goals.

## Features
- User Authentication.
- Roadmap Creation.
- Fork/Star Roadmaps.
- Set goals.
- Search Roadmaps by tag.
- Search Users by Username, Name and Goal.
- Create Connections.
- AES Encrypted Messaging.

## Technologies / Libraries Used
- [ReactJS](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [Socket IO](https://socket.io)

## Build From Source

### Prerequisite
- Node
- NPM
- Mongo

### Setup
- Clone this repository.
- Start your mongo server.
- Change the mongodb url in config/dbConfig.js
- In the repository's root directory, create a .env file that contains the following keys.
  - DB_PASS
  - SESSION_KEY
  - JWT_SECRET
  - DES_KEY
- In the client directory, build the React application.
  ```
  npm build
  ```
- In the root directory of this repository, run the Node application.
  ```
  npm start
  ```
- Go to [localhost:8080](http://localhost:8080/).

## Hosting
You can view the live project [here](https://grasp.onrender.com/)
 
