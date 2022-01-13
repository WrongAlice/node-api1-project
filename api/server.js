console.log('Hello World from the server'); // eslint-disable-line no-console
const express = require('express') // require express(part of the express server)
const User = require('./users/model') // import the model

const server = express() // // creates an express application using the express module
server.use(express.json()) // express will automatically parse incoming json

server.get('/api/users', (req, res) => { // get all users
    User.find() // find all users from the database// find returns a promise
    .then(users => { // then once found, send them back
        res.status(200).json(users) // send back an array of  the users
    }) // end then
    .catch(err => { // if there is an error
        res.status(500).json({ // respond with HTTP status code 500.
            message: 'error getting users', // with a message
            error: err.message, // and the error
            stack: err.stack, // and the stack
         }) // end json
    }) //   end catch
}) // end get

server.get('/api/users/:id', (req, res) => { // get a single user
    User.findById(req.params.id) // find the user by id
     .then(user => { // if found // user refers to the user that was found
            if (!user) { // if not found
                res.status(404).json({ // send a 404 status
                    message: 'the user with the specified id does not exist', // and a message
                 }) // end the response
            }
            res.json(user) // if found, return the user object
            //user refers to the user that was found by the id entered in the url
        })
        .catch(err => { // if error
            res.status(500).json({ // respond with HTTP status code 500.
                message: "The user information could not be retrieved", // and a message
                error: err.message, // and the error
                stack: err.stack, // and the stack
             }) // end the response
        }) // end catch
    }) // end get

server.put ('/api/users/:id', async (req, res) => { // update a user
    try{
    const possibleUser = await User.findById(req.params.id) // find the user by id
    if(!possibleUser) { // if the user is not found
        return res.status(404).json({ // send a 404 status
            message: "The user with the specified ID does not exist",
        })
    } else { // if the user is found
        if (!req.body.name || !req.body.bio) { 
            res.status(400).json({ 
                message: "Please provide name and bio for the user",    
            })
        } else { 
            const updatedUser = await User.update( // update the user
                req.params.id, 
                req.body 
                )
            res.status(200).json(updatedUser) // return the newly updated user document.
        }
    }
} catch (err) {  // if there is an error updting the user
    return res.status(500).json({ 
        message: "The user information could not be modified", 
         err: err.message, 
        
    })

    }
})


server.delete('/api/users/:id', async (req, res) => { //delete a user
 const possibleUser = await User.findById(req.params.id) // find the user by id
 if (!possibleUser) { // if the user is not found
  res.status(404).json({ // send a 404 status
      message: 'The user with the specified ID does not exist', // and a message
    })
} else { // if the user is found
    const deletedUser = await User.remove(possibleUser.id) // delete the user
    res.status(200).json(deletedUser) //   return the newly updated user document.
}
})


server.post('/api/users', (req, res) => { // create a user
    const user = req.body; // get the user from the request body
    if (!user.name || !user.bio ) { // if the user does not have a name or bio
        res.status(400).json({ // send a 400 status
            message: "Please provide name and bio for the user" // and a message
        })
         
    } else { // if the user has a name and bio
        User.insert(user) // insert the user
        .then(createdUser => { // if successful
            res.status(201).json(createdUser) // return the newly updated user document.
})
.catch(err => { // if there is an error
    res.status(500).json({ // send back a 500 error
        message: "There was an error while saving the user to the database", // with a message
        error: err.message, //  and the error
        stack: err.stack, // and the stack
     })
})
    }
})



server.use('*', (req, res) => { // if the route is not found
    res.status(404).json({ // send a 404 status
        message: 'ut-uh'
    })
})

module.exports = server; //this piece of code does this: exports the server so that it can be used in other files
