import React, { Component } from 'react';
import StaticBasic from './StaticBasic';
import StaticFootprint from './StaticFootprint';
import '../UserProfile.css';
import axios from 'axios';
import grid from '../grid.json';
import StaticBadge from './StaticBadge';
 
class UserPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      badges:[],
      userID: this.props.match.params,
      basicInfoObj: {

      },
      chartDataObj: {
        showChart: false,
        crbnScore: null,
        datasets: [
          {

            data: [10, 20, 30 , 0],
            backgroundColor: ['#FF0000', '#ff9933', '#ffff00', '#470000'],
            borderColor: ["#000000", "#000000", "#000000", "#000000"]
          },
        ],

    
         labels: [
            'Vehicle',
            'Home',
            'Waste'
          ]
      },
      userData: { }
    }
  }
    
  render() {

     return (
      <div className="container-fluid">
        <div className="row">

          <div className="col-sm-12 col-md-3 col-lg-3">

          <StaticBasic
            id={this.state.userData.id}
            loggedIn={this.props.loggedIn}
            basicInfo={this.state.basicInfoObj}
          />
          

          <StaticBadge badges={this.state.badges} userId={this.state.userID.id} />
          
         
          </div>
          <div className="col-sm-12 col-md-8 col-lg-5">
            <StaticFootprint
              crbnScore={this.state.chartDataObj.crbnScore}
              loggedIn={this.props.loggedIn}
              chartData={this.state.chartDataObj}
              rankInfo={this.state.rankInfo}
            />

          </div>


          </div>

          {/* <div className="row">
            <div className="links col-4">
              <a
                href={
                  "https://www.facebook.com/sharer/sharer.php?u=crbnapp.herokuapp.com/test/" +
                  this.state.userData.id
                }
                target="_blank"
              >
                <i className="fab fa-facebook-square fa-3x d-inline" />
              </a>
            </div>
          </div> */}
        </div>

    );
  }




  componentWillMount() {
    var id = this.props.match.params
    console.log(id)

    axios.get('/userinfo/' + id.id)

    .then((res) => {
      this.setState({ userData: res.data}); // set userData state with info from DB     
        let user = {...this.state.userData} // make a copy of user data

            this.setState( {
              basicInfoObj:  {
                name: user.data.username,
                city: user.data.city,
                displayname: user.data.displayname,
                state: user.data.state,
                joinedMonth: 'May',
                joinedYear: '2018',
                intro: user.data.intro,
                imgUrl: user.data.imgUrl,
                createdAt: user.data.createdAt
              }        
          });

        let chartDataComplete = () => {
          let itemsToCheck =  [ 'aluminum', 'electric_bill', 'glass', 'maintenance', 
            'miles_driven', 'mpg', 'natgas_bill', 'paper', 'plastic', 'zip']; 
          for (var key in user) {
            if (itemsToCheck.includes(key) && (user.key === null || user.key === "")) {
              return false;
            } else if (key === 'zip' && user.key === 0) {
              return false; 
            } else {
              return true;
            }
          }
      }
        let chartCheck = chartDataComplete();
        console.log(`chart check is ${chartCheck}`)
        if (chartCheck !== false) { 
          this.calculateScore(user)
        }
      
    });
}

  updateChart() {
    var id = this.props.match.params
    console.log('chart update initiated')

    axios.get('/userinfo/' +id.id)

    .then( res => {return res.data.data} )
    .then( userData => this.calculateScore(userData)); 
  }


    calculateScore(user) {
    var id = this.props.match.params
    /************************
     * CRBN Score Equation
     *************************/

    /* Set up variables for CRBN score equation */
    let maintenance = user.data.maintenance;
    let mpg = user.data.mpg;
    let milesDriven = user.data.miles_driven;
    let aluminum = user.data.aluminum;
    let plastic = user.data.plastic;
    let glass = user.data.glass;
    let paper = user.data.paper;
    let householdMembers = user.data.household_members;

    /*Individual variables that make up the CRBN score */
    let vehiclecO2;
    let wastecO2 = 700; // baseline is 700. reduces based on recycling habits
    let homecO2;
    let eventcO2;

    /* Vehicle cO2 calculations */
    if (maintenance === true) {
      vehiclecO2 = ((milesDriven / mpg) * 19.59) / 2204.62;
    } else {
      vehiclecO2 = (((milesDriven / mpg) * 19.59) / 2204.62) * 1.04;
    }
    console.log("vehicle cO2 is " + vehiclecO2);

    /*Waste cO2 calculations */
    let recyclingScores = {
      aluminum: 90,
      plastic: 35,
      glass: 25,
      paper: 125
    };

    for (var key in recyclingScores) {
      if (user.data[key] === true) {
        wastecO2 = wastecO2 - recyclingScores[key];
      } else {
        wastecO2 = wastecO2;
      }
    }

    wastecO2 = wastecO2 / 2204.62;

    console.log("waste cO2 is " + wastecO2);

    /* Get the output rate */

    let getOutputRate = zip => {
      let zipsAndRates = grid;
      let theEntry = zipsAndRates.find(entry => {
        return entry.zip == zip;
      });
      return theEntry.output_rate;
    };

    /* Home cO2 calculations */
    let outputRate = getOutputRate(user.data.zip);
    console.log("the output rate is " + outputRate);
    let natGasBill = user.data.natgas_bill;
    let electricBill = user.data.electric_bill;
    let natgascO2 = ((natGasBill / 10.68) * 119.58 * 12) / 2204.62;
    let electriccO2 = ((electricBill / 0.119) * outputRate * 12) / 2204.62;
    homecO2 = (natgascO2 + electriccO2) / householdMembers;

    console.log("home cO2 is " + homecO2);

    function round(num, places) {
      var multiplier = Math.pow(10, places);
      return Math.round(num * multiplier) / multiplier;
    }

    function eventOffsetter(){ 
      return axios.get('/userstatic/events/', {
            params: {
                user: id.id
            }
        })
      .then(res => {
           try{let offsetArray = res.data.data.map((el)=> {return el.offsetscore})
           let offsetSum = offsetArray.reduce((a, b)=>{return a+b})
           return(offsetSum)}
           catch(err){return 0}
          })
    }

    
eventOffsetter().then(res=>{eventcO2 = res;
    /* Final Score */
    let roundedScores = {
      vehicle: round(vehiclecO2, 2),
      waste: round(wastecO2, 2),

      home: round(homecO2, 2),
      event: round(eventcO2, 2),


    };


    let thecrbnScore = round(
      ((roundedScores.vehicle + roundedScores.waste + roundedScores.home - roundedScores.event) *
        100) /
        100,
      2
    );

    let thechartDataObj = {
      crbnScore: thecrbnScore,
      datasets: [
        {
          data: [
            roundedScores.vehicle,
            roundedScores.home,

            roundedScores.waste,
            roundedScores.event,
          ],
          backgroundColor: ['#FF0000', '#ff9933', '#ffff00', '#470000'],
        },
      ],

      labels: ['Vehicle', 'Home', 'Waste', 'Events'],

    };

    this.setState({ chartDataObj: thechartDataObj });

    return thechartDataObj;
    })
  }
}

export default UserPage;

