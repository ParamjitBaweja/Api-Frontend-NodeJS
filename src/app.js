const express = require('express')
const path = require('path')
const hbs = require('hbs')

//weather apps
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

///paths
const publicpath=path.join(__dirname, '../public')
const viewpath=path.join(__dirname,'../Temp/View')
const partialpath=path.join(__dirname,'../Temp/Partial')

const app = express()

//set up handle bars for express
app.set('view engine', 'hbs')
app.set('views', viewpath)
hbs.registerPartials(partialpath)

app.use(express.static(publicpath))

app.get('',(req,res)=>{
    res.render('index',{
        title:'Weater',
        name: 'param'
    })
})  

app.get('/help',(req,res)=>{
    res.send({
        name: 'abcd',
        age: 100
    })
})
app.get('/help/*',(req,res)=>{
    res.send('help article not found')
})

app.get('/about',(req,res)=>{
    res.send([{
        name: 'abcd',
        age: 100
    },{
        name: 'another name',
        age: 100000,
        height: 1
    }])
})

//
app.get('/products',(req,res)=>{
    if(!req.query.search)
    {
        return res.send({
            error: 'you need to provide a search'
        })
    }
    console.log(req.query)
    res.send({
        products:[]
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,  
                address: req.query.address
            })
        })
    })
})

app.get('*',(req,res)=>{
    res.send("404")
})
app.listen(3000,()=>{
    console.log('server is up')
})