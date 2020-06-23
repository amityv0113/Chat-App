const users =[]

// addUser removeUser getUser getuserInroom

const addUser = ({id,username,room})=>{
    
    //clean the data

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data

    if (!username || !room)
    {
        return {
            error:'A user name or room is required'
        }
    }

    /// check for existing user ////
    const existingUser = users.find((user)=>{
        if ((user.room===room) && (user.username === username))
        {
            return true
        }
        else
        {
            return false
        }
    })

    ///check for validation ////

    if (existingUser)
    {
        return {
            error:'username is in use ! '
        }
    }

    //// store user //
    const user = {id,username,room}
    users.push(user)

    return { user }

}

///remove user ///////

const removeUser = (id)=>{

    const index = users.findIndex((user)=>{
        if (user.id === id)
        {
            return true
        }
    })

    if (index!==-1)
    {
        return users.splice(index,1)[0]
    }

}

/// getuser ////////

const getUser = (id)=>{

    return users.find((user)=>{
        if (user.id===id)
        {
            return true
        }
    })

}

const getuserInroom = (room) =>{

    return users.filter((user)=>{
        if (user.room === room)
        {
            return true
        }

    })

}

module.exports = {
    addUser ,
    removeUser,
    getUser,
    getuserInroom,

}