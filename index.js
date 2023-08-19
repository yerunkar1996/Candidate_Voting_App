const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')
const app = express();
port = 3000

// BodyParser lib
app.use(express.json())
app.use(bodyParser.json())

// Template Engine
const ejs = require('ejs')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

// Express-session
const session = require('express-session')
app.use(
    session({
        secret:"my secret key",
        saveUninitialized:true,
        resave:false,
        cookie: { maxAge: 30000  }
    })
)



//MongoDB connection
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://root:root@cluster0.rjiuf.mongodb.net/Jforce?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database connected successfully")
}).catch((err)=>{
    console.log(err)
})


const regModel = require('./Schema/registerSchema')
const candModel = require('./Schema/cadidateSchema');
const userModel = require('./Schema/userSchema');


app.get('/',(req,res)=>{
    res.render('Home')
})


app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/loginPost', (req,res)=>{
    User = req.query.username
    Pass = req.query.password  
    regModel.find({Username: User}).then((Mongodata)=>{
        console.log(Mongodata)
        for(let data of Mongodata){
            if(data.Username == User){
                if(data.Password == Pass){

                    req.session.user = data;
                    // res.session.auth = true;

                    if(User == "admin"){
                        if(Pass == "admin"){
                            res.redirect('adminPage')
                        }
                        else{
                            res.send("<script>alert('Invalid Admin Password'); window.location.href = '/login';</script>")  
                        }
                    }
                    else{
                        userModel.updateOne({Role:"Voter"},{$set:{UserName:User}}).then(()=>{
                            console.log('user set')
                        })
                        const user = req.session.user;
                        console.log("user session", user)
                       if(user){
                        res.redirect('voting')
                       }
                       else{
                        res.redirect('/')
                       }
                    }
                }
                else{
                    res.send("<script>alert('Invalid Password'); window.location.href = '/login';</script>")
                }
            }
            else{
                    res.send("<script>alert('Invalid Username'); window.location.href = '/login';</script>")
            }
        }
    })
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.get('/registerPost', (req,res)=>{
    user = req.query.username
        pass = req.query.password    
        ema = req.query.email  
        mo = req.query.mobile
        console.log(user,pass,ema,mo)
    let regData = new regModel({
        _id: new mongoose.Types.ObjectId,
        Username: user,
        Password: pass,    
        Email: ema, 
        Mobile: mo,
        Status:0
    })

    regData.save().then(()=>{
        userModel.updateOne({Role:"Voter"},{$set:{UserName:user}}).then(()=>{
            console.log('user set')
        })
        res.redirect('/login')
        console.log("Data Added to database")
        res.send("<script>alert('Data Added to Database')</script>")
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/adminPage', (req,res)=>{
    candModel.find().then((Mdata)=>{
        console.log(Mdata)
        res.render('adminPage', {data:Mdata})
    })
})


app.get('/voting', (req,res)=>{
    res.render('votingPage')
})

app.get('/votingPage', (req,res)=>{
    cName=req.query.candidate
    console.log(cName)
    
    userModel.find({Role:"Voter"}).then((data)=>{
        data.forEach((i)=>{

            regModel.find({Username:i.UserName}).then((data)=>{
                data.forEach((i)=>{
                console.log(i)
                console.log(i.Username)
                    if(i.Status == 0){

                        candModel.find({Name: cName}).then((Mdata)=>{
                            Mdata.forEach((i)=>{
                                let count = i.voteCount
                                count += 1;
                                console.log(count)
                    
                    
                                candModel.updateOne({Name:cName},{$set:{voteCount:count}}).then(()=>{
                                    console.log("Data Updated!")
                                    res.send("<script>alert('Data Updated!'); window.location.href = '/login';</script>")
                                }).catch((err)=>{
                                    console.log(err)
                                })
                            })
                        })


                        regModel.updateOne({Username:i.Username},{$set:{Status:1}}).then(()=>{
                            console.log("Status Updated!")
                        })
                        
                    }
                    else{
                        res.send("<script>alert('You already voted!');  window.location.href = '/login';</script>")
                    }
                })
            })
        })
    })
})

app.listen(port, ()=>{
    console.log("Server is running on port", port)
})



