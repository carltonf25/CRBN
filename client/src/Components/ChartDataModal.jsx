import React, { Component } from 'react';
import axios from 'axios';
import grid from '../grid.json';
// import { resolve } from 'url';


class ChartDataModal extends Component {
    constructor(props) {
        super(props);

        axios.get('/test').then(res => { return res.data.data }).then(data => this.setState({ user: data }));

        this.state = {
            chartData: this.props.chartData,
            user: {},
            hasErrors: false,
            errorMsg: "",
            isLoading: false
        }
        this.updateChart = this.props.updateChart; 
    }

    render() {

        let { zip, natgas_bill, electric_bill, mpg, miles_driven, household_members } = this.state.user;
   
        let modalJSX = (
            <div className="perspective-container">
                <div id="modal-overlay" className="modal-overlay closed"></div>
                <div id="modal" className="modal closed">
                    <div className={this.state.isLoading ? 'loader' : 'closed'}><img src='img/loader.gif' /></div>
                    <span className="closeLink" onClick={this.closeModal.bind(this)}>X</span>
                    <div className={this.state.isLoading ? 'modal-content container m-auto closed' : 'modal-content container m-auto'}>
                        
                        <div role="alert" className={this.state.errorMsg.length <= 0 ? "alert alert-danger" : "alert alert-danger show"}>{this.state.errorMsg}</div>
                        <form className="updateProfileForm m-auto">
                            <h4>Vehicle</h4>
                            <p>
                                <label>Miles Per Gallon: </label>
                                <input defaultValue={mpg} type="text" name="mpg" />
                                <br />
                                <small>
                                    <a href="https://www.fueleconomy.gov/feg/make.shtml" target="_blank">MPG Reference</a>
                                </small>
                            </p>
                            <p>
                                <label>Miles Driven Annually: </label>
                                <input defaultValue={miles_driven} type="text" name="milesDriven" />
                            </p>
                            <p>
                                <label>Regular Maintenance? </label>
                                <br />
                                <label>Yes</label>
                                <input type="radio" value="Yes" id="yes" name="maintenance"
                                />
                                <label>No</label>
                                <input type="radio" value="No" id="no" name="maintenance" />
                            </p>
                            <h4>Home</h4>
                            <p>
                                <label>Zip Code: </label>
                                <input defaultValue={zip} type="text" name="zip" />
                            </p>
                            <p>
                                <label>Gas Bill (monthly): </label>
                                <input defaultValue={natgas_bill} type="text" name="gasBill" />
                            </p>
                            <p>
                                <label>Electric Bill: </label>
                                <input defaultValue={electric_bill} type="text" name="electricBill" />
                            </p>
                            <p>
                                <label>Household Members:</label>

                                <input defaultValue={household_members} type="text" name="householdSize" />
                            </p>

                            <h4>Waste</h4>
                            <p>
                                <label>Recycling Habits</label>
                                <br />
                                <label>Paper</label>
                                <input type="checkbox" id="paper" value="paper" name="recycling" />
                                <label>Plastic</label>
                                <input type="checkbox" id="plastic" value="plastic" name="recycling" />
                                <br />
                                <label>Glass</label>
                                <input type="checkbox" id="glass" value="glass" name="recycling" />
                                <label>Aluminum</label>
                                <input type="checkbox" id="aluminum" value="aluminum" name="recycling" />
                            </p>
                            <button className="appBtn" type="submit" onClick={this.updateUser.bind(this)}>Update</button>
                        </form>
                    </div>
                </div>
            </div>);
        return (
            modalJSX
        );
    }

    componentDidMount() {
        let checkboxSelections = ["aluminum", "glass", "paper", "plastic"];

        axios.get('/test').then(res => { return res.data.data })
            .then(user => {
                checkboxSelections.forEach(box => {
                    let input = document.querySelector(`[value=${box}]`);
                    if (user[box] == true) { input.checked = true }
                })
                return user.maintenance;
            })
            .then(maintenance => {
                let input = document.querySelector(`[name=maintenance]`);
                maintenance ? input.checked = true : input.checked = false;
            });

    }


    validateFormFunc() {
        /* Validate Form Data */

        let userData = {
            mpg: document.getElementsByName('mpg')[0].value,
            milesDriven: document.getElementsByName('milesDriven')[0].value,
            zip: document.getElementsByName('zip')[0].value,
            gasBill: document.getElementsByName('gasBill')[0].value,
            electricBill: document.getElementsByName('electricBill')[0].value,
            householdSize: document.getElementsByName('householdSize')[0].value,
        }

        let zipArr = grid.map(entry => entry.zip);
        let checkArray = [];

        /* Check for blank values */
        Object.keys(userData).forEach(item => {
            if (userData[item].length < 1 || userData[item] == "") {
                document.getElementsByName(item)[0].classList.add('errorInput');
                checkArray.push(false);
            } else {
                document.getElementsByName(item)[0].classList.remove('errorInput');
                checkArray.push(true)
            }
        })

        if (checkArray.includes(false)) {
            this.setState({ errorMsg: `Cannot leave any entries blank` });
            this.setState({ hasErrors: true });
        } else if (!(checkArray.includes(false))) {
            this.setState({ errorMsg: "" });
            this.setState({ hasErrors: false });
        }

        /* Check for valid MPG */
        if (userData.mpg > 300 || userData.mpg < 1) {
            document.getElementsByName('mpg')[0].classList.add('errorInput');
            this.setState({ errorMsg: `Must enter a valid mpg` });
            return;
        }

        /* Check for valid zip code */
        if (!(zipArr.includes(userData.zip))) {
            this.setState({
                errorMsg: `Zip code not found. Try another.`,
                hasErrors: true
            });
            return;
        } else if (userData.zip == undefined) {
            this.setState({
                hasErrors: true,
                errorMsg: `Must include a zip code`
            })
            return;
        }
        else if (zipArr.includes(userData.zip)) {
            this.setState({
                hasErrors: false,
                errorMsg: ""
            })
            return;
        }

    }

    closeModal() {
        let theModal = document.querySelector('#modal');
        let modalOverlay = document.querySelector('#modal-overlay');
        theModal.classList.toggle("closed");
        modalOverlay.classList.toggle("closed");
    }


    updateUser(e) {
        e.preventDefault();

        /* Show loader while chart updates */
        this.setState({ isLoading: true });

        setTimeout(() => {
            /* Get radio button selection */
            let radioSelection;
            let regMaintenance;
            let radioBtns = document.getElementsByName('maintenance');
            for (let i = 0; i < radioBtns.length; i++) {
                if (radioBtns[i].checked) {
                    // console.log(radioBtns[i].value);
                    radioSelection = radioBtns[i].value;
                    break;
                }
            }
            if (radioSelection === "Yes") {
                regMaintenance = true;
            } else { regMaintenance = false }

            /* Get checkbox selections */
            let checkboxes = document.getElementsByName('recycling');
            let recyclingSelections = [];
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    // console.log(checkboxes[i].value);
                    recyclingSelections.push(checkboxes[i].value);
                }
            }

            let userData = {
                mpg: document.getElementsByName('mpg')[0].value,
                milesDriven: document.getElementsByName('milesDriven')[0].value,
                maintenance: regMaintenance,
                zip: document.getElementsByName('zip')[0].value,
                gasBill: document.getElementsByName('gasBill')[0].value,
                electricBill: document.getElementsByName('electricBill')[0].value,
                householdSize: document.getElementsByName('householdSize')[0].value,
                recycling: recyclingSelections
            }

            if (this.state.hasErrors == false) {
                axios({
                    url: '/updateInfo',
                    method: 'post',
                    data: { formData: userData }
                })
                .then(this.updateChart);
                this.validateFormFunc()
                this.closeModal();
                this.setState({isLoading: false})
             
                

            }
        }, 3000
        )
    }
}

export default ChartDataModal;
