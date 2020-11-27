const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')
const askModel = require('./database/Ask')
const responseModel = require('./database/Response')

const app = express()

connection
    .authenticate()
    .then(()=>{
        console.log('Banco conectado com sucesso')
    }).catch((error)=>{
        console.log(error)
    })
    
//setando a view engine para ejs
app.set("view engine", 'ejs')
//utilizando arquivos estaticos
app.use(express.static("public"))
//fazendo a tradução dos dados enviados pelo html
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    askModel.findAll({ raw:true, order:[
        ['id','DESC'] 
    ]}).then(asks =>{
        res.render('index.ejs',{
            asksModel: asks
        })
    }).catch(error=>{console.log(error)})
})

app.get("/cadastroPergunta",(req,res)=>{

    res.render('cadastroPergunta.ejs',{})

})

app.get('/ask/:id',(req,res)=>{
    var id = req.params.id
    askModel.findOne({ 
        raw:true,
        where: {id: id}
    }).then((one)=>{
        if(one != undefined){

            responseModel.findAll(
                {raw:true, where:{askID: one.id}, order:[['id','DESC']]
            })
            .then((allOne)=>{
                res.render('ask', {one: one, allOne: allOne})
            })
        }else{
            res.redirect('/')
        }
        
    }).catch(error=>{console.log(error)})
})

app.post('/salvarPergunta',(req,res)=>{
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    askModel.create({
        title: titulo,
        description : descricao
    }).then(()=>{
        res.redirect('/')
    })
})

app.post('/salvarResposta', (req,res)=>{
    var resposta = req.body.response
    var id = req.body.ask
    responseModel.create({
        body: resposta,
        askID: id
    }).then(()=>{
        res.redirect(`ask/${id}`)
    })
})

app.listen(3000,()=>{
    console.log("App ON link abaixo ")
    console.log('http://localhost:3000')
})
