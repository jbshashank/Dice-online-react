<h1 align="center">DICE ONLINE</h1>
<h2 align="center">Two player online game of DICE</h2>



## 🧐 How to Play?

1. Once you're on the homepage of the game, you can either host a new game or join a friend's game.
2. To host a new game, click on CREATE GAME. A game code will be generated which you can share with your friend.
3. To join a friend's game, enter the game code given by them, and click on JOIN GAME.
4. That's it! Enjoy the game and remember, no toxicity!


## 🏁 Getting Started (to run game locally)

Follow the steps below, after cloning the repository:

### 🖐 Requirements

**For Installing:**

- Node

**For Running:**

- Change socket.IO endpoint on client side. To do this, go to `client/src/components/Game.js` and update as`const ENDPOINT = 'http://localhost:5000'`

### ⏳ Installation

- At the root of the project directory, use npm to install the server-side dependencies

```bash
npm install
```

This command installs all the server-side dependencies needed for the game to run locally.

- Use npm to run server

```bash
npm start
```

This command gets the server running on localhost port 5000.

- In a separate terminal, navigate into the client folder and use npm to install the client-side dependencies

```bash
cd client
npm install
```

This command installs all the client-side dependencies needed for the game to run locally.

- Finally, use npm to run client

```bash
npm start
```

This command gets the client running on localhost port 3000.

Head over to http://localhost:3000/ and enjoy the game! 🎉




****************** App screen shots are captured and stored under App-walkthorough file under screenshot****************************