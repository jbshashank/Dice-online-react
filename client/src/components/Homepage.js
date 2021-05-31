import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import randomCodeGenerator from '../utils/randomCodeGenerator'

const Homepage = () => {
    const [roomCode, setRoomCode] = useState('')
    const [userName, setUserName] = useState('')

    return (
        <div className='Homepage'>
            <div className='homepage-menu'>
                <div className='homepage-form'>
                    <div className='homepage-join'>
                        <input type='text' placeholder='Game Code' onChange={(event) => setRoomCode(event.target.value)} />
                        <input type='text' placeholder='User Name' onChange={(event) => setUserName(event.target.value)} />
                        <Link to={`/play?roomCode=${roomCode}&user=${userName}`}><button className="game-button green">JOIN GAME</button></Link>
                    </div>
                    <h1>OR</h1>
                    <div className='homepage-create'>
                        <input type='text' placeholder='User Name' onChange={(event) => setUserName(event.target.value)} />
                        <Link to={`/play?roomCode=${randomCodeGenerator(5)}&user=${userName}`}><button className="game-button orange">CREATE GAME</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage
