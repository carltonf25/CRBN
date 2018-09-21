var express = require('express');
var router = express.Router();
var models = require('../models');
const ensureAuthenticated = require('../auth').ensureAuthenticated;
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

router.use(bodyParser({ urlencoded: true }))

/* GET home page. */
router.get('/test', function (req, res, next) {
    if (req.isAuthenticated()) {
        models.user.findById(req.user, {
        }).then((data) => { res.json({ data, loggedIn: true }) })
    } else {
        res.json({ loggedIn: false })
    }
})

router.get('/userinfo/:id', function (req, res, next) {
    const id = Number(req.params.id);
    models.user.findById(id, {})
        .then((data) => {
            res.json({ data, loggedIn: false })
        })
})

router.post('/updatebasicinfo', (req, res) => {
    let img = req.body.img;
    let name = req.body.name;
    let intro = req.body.intro;

    if (req.isAuthenticated()) {
        models.user.update({
            'imgUrl': img,
            'displayname': name,
            'intro': intro
        }, {
                where: {
                    id: req.user,
                }
            }).then(user => {
                res.json({ success: true })
            })
    }
});

router.post('/updateInfo', function (req, res, next) {

    let mpg = Number(req.body.formData.mpg);
    let milesDriven = Number(req.body.formData.milesDriven);
    let maintenance = req.body.formData.maintenance;
    let zip = Number(req.body.formData.zip);
    let gasBill = Number(req.body.formData.gasBill);
    let electricBill = Number(req.body.formData.electricBill);
    let householdSize = Number(req.body.formData.householdSize);
    let recycling = req.body.formData.recycling;

    let recyclingObj = { aluminum: false, plastic: false, glass: false, paper: false };

    for (var key in recyclingObj) {
        if (recycling.includes(key)) {
            recyclingObj[key] = true;
        }
    }
    console.log(recyclingObj)

    if (req.isAuthenticated()) {
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
        }, {
                where: {
                    id: req.user,
                }
            }).then(user => {
                res.json({ 'success': true })
            })

    } else {
        res.send('You need to login!')
    }
})

router.post('/user/score', (req, res) => {
    let score = req.body.score;
    if (req.isAuthenticated()) {
        models.user.update({
            'score': score,
        }, { where: { id: req.user } })
            .then(user => {
                res.json({ 'success': true })
            })
    } else {
        res.send('You need to login')
    }
})

router.get('/all/scores', (req, res) => {
    if (req.isAuthenticated()) {
        models.user.findAll({
            attributes: ['id', 'username', 'displayname', 'imgUrl', 'score'],
            where:
            {
                score:
                    { $ne: null }
            }
        })
            .then(data => {
                res.json({ data: [...data], user: req.user })
            })
    } else {
        models.user.findAll({
            attributes: ['displayname', 'username', 'imgUrl', 'score'],
            where:
            {
                score:
                    { $ne: null }
            }
        })
            .then(data => {
                res.json({ data })
            })
    }
})


router.get('/eventfeed', (req, res) => {
    models.event.findAll({
    })
        .then(data => {
            res.json({ data })
        })
})

router.get('/user/events', (req, res) => {
    if (req.isAuthenticated()) {
        models.user.findById(req.user, {
            include: [{
                model: models.event,
                attributes: ['eventname', 'offsetscore', 'badgeimg', 'id']
            }]
        })
            .then(data => {
                res.json({ data: data.events })
            })
    }
})

router.get('/userstatic/events/', (req, res) => {
    const user = Number(req.query.user)
    console.log(user)
    models.user.findById(user, {
        include: [{
            model: models.event,
            attributes: ['eventname', 'offsetscore', 'badgeimg', 'id']
        }]
    })
        .then(data => {
            res.json({ data: data.events })
        })
})


router.post('/events/:id/attendees', (req, res) => {
    let eventId = req.params.id;
    if (req.isAuthenticated()) {
        models.event.findById(eventId)
            .then(event => {
                models.user.findById(req.user)
                    .then(user => {
                        event.addUser([user])
                            .then(response => res.json(response))
                    })
            })
    }
})

router.delete('/events/:id/attendees', (req, res) => {
    let eventId = req.params.id;
    let userId = req.query.user;
    if (req.isAuthenticated()) {
        models.event.findById(eventId)
            .then(event => {
                models.user.findById(userId)
                    .then(user => {
                        event.removeUser([user])
                            .then(response => res.json(response))
                    })
            })
    }
})

module.exports = router;
