 const users = []
 const winners = []
 const gameStats = {}
 const gameData = {gameStats,users}

 const addUser = ({id, name, room,currentScore,totalScore}) => {
    const numberOfUsersInRoom = users.filter(user => user.room === room).length
    if(numberOfUsersInRoom === 10)
    return { error: 'Room full' }
    const newUser = { id, name, room,currentScore:0,totalScore:0}
    users.push(newUser)
    return { newUser }
}

const updateUserData = (user,score) => {
    //console.log(user)
    const currentUserIndex = user ? users.findIndex(userD => userD.id === user.id) : -1
    let gameData ={}
    if(currentUserIndex>=0 && user){
    user.currentScore = score
    user.totalScore = user.totalScore + score
    const userArrayPerRoom = users.filter(userD => {
        console.log ('room is '+userD.room+','+ user.room)
        return userD.room === user.room
    })
    console.log('next player index'+currentUserIndex)
    const updatedCurrentUserIndex = userArrayPerRoom.findIndex(userD => userD.id === user.id)
    console.log("after filter:"+JSON.stringify(userArrayPerRoom))
    const nextUserIndex = (score === 6) ? updatedCurrentUserIndex : (updatedCurrentUserIndex + 1)%userArrayPerRoom.length
    console.log('next player index'+nextUserIndex)
    gameStats.nextPlayer = userArrayPerRoom[nextUserIndex].name
    if(user.totalScore > 10) {
        winners.push(user)
        users.splice(currentUserIndex, 1)[0]
        userArrayPerRoom.splice(currentUserIndex, 1)[0]
    }
    sortedLeaderboard = userArrayPerRoom.sort((a, b) => b.totalScore - a.totalScore)
    gameData = {gameStats:gameStats,sortedLeaderboard :[...sortedLeaderboard],winnerBoard: [...winners]}
}
    return gameData
}

const removeUser = id => {
    const removeIndex = users.findIndex(user => user.id === id)

    if(removeIndex!==-1)
        return users.splice(removeIndex, 1)[0]
}

const getUser = id => {
    return users.find(user => user.id === id)
}
const getUsersInRoom = room => {
    return users.filter(user => user.room === room)
}


module.exports = { addUser, removeUser, getUser, getUsersInRoom,updateUserData }