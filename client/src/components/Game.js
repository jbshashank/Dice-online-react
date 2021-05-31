import React, { useEffect, useState } from 'react'

import io from 'socket.io-client'
import queryString from 'query-string'
import Die from './Die'
import 'bootstrap/dist/css/bootstrap.css';

import './RollDice.css'
import './Die.css'
import Countdown from "react-countdown";
import {Link} from 'react-router-dom'



//NUMBER CODES FOR ACTION CARDS
//SKIP - 404
//DRAW 2 - 252
//WILD - 300
//DRAW 4 WILD - 600

let socket
 const ENDPOINT = 'http://localhost:5000'


const Game = (props) => {

    
    const data = queryString.parse(props.location.search)

    //initialize socket state
    const [room, setRoom] = useState(data.roomCode)
    const [name, setName] = useState(data.user)
    const [die1,setDie1]= useState('one')
    const [roomFull, setRoomFull] = useState(false)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [scoreBoard,setScoreBoard] = useState([])
    const [gameStats,setGameStats] = useState()
    const [winnerBoard,setWinnerBoard] = useState([])

    useEffect(() => {
        const connectionOptions =  {
            "forceNew" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        }
        socket = io.connect(ENDPOINT, connectionOptions)
        socket.emit('join', {room,name}, (error) => {
            if(error)
                setRoomFull(true)
        })

        //cleanup on component unmount
        return function cleanup() {
            socket.emit('disconnect')
            //shut down connnection instance
            socket.off()
        }
    }, [])

    //initialize game state
    const [gameOver, setGameOver] = useState(true)
    const [winner, setWinner] = useState('')
    const [turn, setTurn] = useState('')
    const [rolling, setRolling] = useState(false)
    const [score,setScore] = useState(0)
    const [totalScore,setTotalScore] = useState(0)
 //runs once on component mount
    useEffect(() => {
        //send initial state to server
        socket.emit('initGameState', {
})
    }, [])

    useEffect(() => {
        socket.on('initGameState', ({ gameOver, turn}) => {
})
        socket.on('updateGameState', (gameData) => {
            console.log('data is'+scoreBoard)
            setScoreBoard(gameData.sortedLeaderboard)
            setGameStats(gameData.gameStats)
            setWinnerBoard(gameData.winnerBoard)
        })

        socket.on('currentUserData', ({ name }) => {
            setCurrentUser(name)
        })
    }, [])

    //some util functions
    const checkGameOver = (arr) => {
        return arr.length === 1
    }

    const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({seconds, completed }) => {
  if (completed) {
    socket.emit('updateGameState', {
        name,
        currentScore: 0
            })
            return <div></div>
  } else {
    // Render a countdown
    return <span>{seconds}</span>;
  }
};
    
    const roll = () => {
        console.log('called roll')
        const sides = ['one', 'two', 'three','four', 'five', 'six']
        const side = Math.floor(Math.random() * sides.length)
        setRolling(true)
        
        // Start timer of one sec when rolling start
        setTimeout(() => setRolling(false),500)
        setDie1(sides[side])
        socket.emit('updateGameState', {
            name,
            currentScore: side+1
                })

    }
        const handleBtn = ()  =>  {return (rolling) ?  'RollDice-rolling' : ''}

        useEffect(() => {


        }, [rolling])
        useEffect(() => {
            console.log({scoreBoard})

        }, [totalScore])


        useEffect(() => {
            console.log({scoreBoard})
        }, [scoreBoard])


    return (
        <div>
        <div>&nbsp;</div>
    <div class="d-flex justify-content-evenly">
        <div class="d-flex justify-content-evenly">
        {(scoreBoard.length > 0 && 
        <div class="scoreBoard">
            <table class="table table-dark">
            <thead>
                  <tr>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Player Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Score &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                              </tr>
                  </thead>
                  <tbody>
                  {scoreBoard.map((player,index,id) => (
            <tr>
               
              <td> {(gameStats && gameStats.nextPlayer === player.name)?<i class="fas fa-play"></i>:""}{" "+player.name}{(name === player.name)?"(me)":""}</td>
              <td>{player.totalScore}</td>
                </tr>))}
                </tbody>
                </table>
                </div>
                )}<div>&nbsp;&nbsp;&nbsp; </div>
                    {(winnerBoard.length > 0 && winnerBoard.find(winner=> winner.room === room) && 
        <div class="winnerBoard" style={{margin: '50px 10px 50px 10px;'}}>
            <table class="table table-success table-stripe">
            <thead>
                  <tr>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Winners&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                </tr>
                  </thead>
                  <tbody>
                  {winnerBoard.map((player,index,id) => (
            <tr>
               
               {player.room === room ? <td><i class="fas fa-trophy"></i>&nbsp;&nbsp;&nbsp;{player.name}</td> : ""}
                  
                </tr>))}
                </tbody>
                </table>
                </div>
                )}</div>
        <div className='RollDice'>
        <div className='RollDice-container' style={{margin: '50px 10px 50px 10px;'}}>
        <Die face={die1} rolling={rolling} score={score} totalScore={totalScore}/>
        {(scoreBoard.length > 0) ? (gameStats && gameStats.nextPlayer ===  name) ? <div><button className={handleBtn}
                disabled={rolling}
                onClick={roll}>
        {(rolling) ? 'Rolling' : 'Roll Dice in ' }<Countdown date={Date.now() + 20000} renderer={renderer}/> {'!'}
                  </button>
                    </div>: "" : (gameStats) && <Link to='/'>
      <button type="button" className={handleBtn}>GAME OVER,CLICK TO START NEW ONE</button>
      </Link>}  
                  {!(gameStats)?<button className={handleBtn}
                disabled={rolling}
                onClick={roll}>
        {(rolling) ? 'Rolling' : 'Roll Dice to Begin the game!'}
                  </button>:""}
        </div>
        </div>
    </div>
    </div>
    )
}

export default Game