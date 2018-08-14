var express = require('express');
var router = express.Router();
var models = require('../models');
const ensureAuthenticated = require('../auth').ensureAuthenticated;
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const stringify = require('../stringify.js');

router.use(bodyParser({urlencoded:true}))

/* GET home page. */
router.get('/test', function(req, res, next) {
     if(req.isAuthenticated()){
       models.user.findById(req.user,{
       }).then((data)=>{res.json({data, loggedIn: true})})
     }else{
        res.json({loggedIn: false})
     }
})


router.get('/test/:id', function(req, res, next) {
    const id = Number(req.params.id);
    models.user.findById(id,{})
    .then((data)=>{res.json({data, loggedIn: false})
    })
})

router.post('/updatebasicinfo', (req, res) => {
    let name = req.body.name; 
    let intro = req.body.intro; 

    if(req.isAuthenticated()){
        models.user.update({
        'username': name,
        'intro': intro
    },{
        where: {
            id: req.user,
        }
    }).then(user => {
        res.json({'success': true})
    })
}
}); 



router.post('/updateInfo', function(req, res, next){

    let mpg = Number(req.body.formData.mpg);
    let milesDriven = Number(req.body.formData.milesDriven);
    let maintenance = req.body.formData.maintenance;
    let zip = Number(req.body.formData.zip);
    let gasBill = Number(req.body.formData.gasBill);
    let electricBill = Number(req.body.formData.electricBill);
    let householdSize = Number(req.body.formData.householdSize);
    let recycling = req.body.formData.recycling;

    let recyclingObj = {aluminum: false, plastic: false, glass: false, paper: false};
    
    for (var key in recyclingObj) {
        if (recycling.includes(key)) {
            recyclingObj[key] = true; 
        }
    }
    console.log(recyclingObj)

    if(req.isAuthenticated()){
        models.user.update({
        'mpg': mpg,
        'miles_driven': milesDriven,
        'maintenance': maintenance,
        'zip': zip,
        'natgas_bill': gasBill,
        'electric_bill': electricBill,
        'household_members': householdSize,
        'aluminum': recyclingObj.aluminum,
        'plastic': recyclingObj.plastic,
        'glass': recyclingObj.glass,
        'paper': recyclingObj.paper
    },{
        where: {
            id: req.user,
        }
    }).then(user => {
        res.json({'success': true})
    })

    }else{
    res.send('You need to login!')
  }  
})

/* Event Routes */

/* Index all CRBN events */ 
router.get('/events', (req, res) => {
  axios.get(`https://www.eventbriteapi.com/v3/organizers/${process.env.ORGANIZER_ID}/events`)
  .then( events => {
    res.json(stringify(events))
  })
  .catch( err => res.send(err))
})



module.exports = router;
