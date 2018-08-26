import React, {Component} from 'react';
import axios from 'axios';
import AppHeader from "./AppHeader"
import AppFooter from "./AppFooter"
import "../App.css";


class LeaderBoard extends Component{
    constructor(){
        super()
        this.state ={res:{
            data:[]
        }}
    }

    componentWillMount(){
        axios.get('/all/scores').then(res => {
            this.setState({'res':res.data})
        })

    }

    render(){
        const imgStyle = {height: '100px'};
        const textStyle = {color: 'black'};
        const sorted = this.state.res.data.sort((a,b)=>{return a.score-b.score})
        const cards = sorted.map((el, i)=>{return <tr className="tabledata" key={i}>
                                                <th scope="row">{i+1}</th>
                                                <td><img className="LeaderImg" src={el.imgUrl} alt={el.displayname ? el.displayname  : el.username} style={imgStyle} />{el.displayname ? el.displayname  : el.username}</td> 
                                                <td className="tabledata">{el.score}</td></tr>})
        return(


            <div>
            <AppHeader />
            <div>
            <table className="table table-hover" style={textStyle} >
              <thead>
                <tr>
                  <th className="tabledata" scope="col">#</th>
                  <th className="tabledata" scope="col">User</th>
                  <th className="tabledata" scope="col">CRBN Score</th>
                </tr>
              </thead>
              <tbody>
                {cards}
              </tbody>
            </table>
            </div>
            <AppFooter />
            </div>
            )
    }
}

export default LeaderBoard;