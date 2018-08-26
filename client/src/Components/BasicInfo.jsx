import React, { Component } from "react";
import axios from "axios";

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      id: this.props.id,
      editMode: false
     };
     this.editButtonClicked = this.editButtonClicked.bind(this)
     this.saveButtonClicked = this.saveButtonClicked.bind(this)
  }

  render(props) {
    let basicInfo = this.props.basicInfo;
    let loggedIn = this.props.loggedIn;
    let defaultImgUrl = "https://eadb.org/wp-content/uploads/2015/08/profile-placeholder-300x300.jpg"; 
    return (
      <div className="basic-info-container ">
        <div className="profile-info basic-info-text">
          <img
            alt="profile-pic"
            className="profile-picture"
            src={ (basicInfo.imgUrl !== "" || null) ? basicInfo.imgUrl : defaultImgUrl }
          />
          <span className={this.state.editMode ? "show" : "invisible"}>
          <label>Image URL:</label>
          <br />
          <input className="profileImageUrl" defaultValue={basicInfo.imgUrl} type="text" name="profileImageUrl"></input>
          </span>
          <hr />
          <span onClick={this.editButtonClicked} className="edit-info-link">
            {" "}
            {loggedIn !== false ? "Edit Basic Info" : ""}
          </span>
          <button
            onClick={this.saveButtonClicked}
            className="saveButton appBtn hide"
          >
            Save
          </button>
          <p className="username">{basicInfo.displayname ? basicInfo.displayname : basicInfo.name}</p>
          <span>Intro:</span>
          <br />
          <p className="intro">{basicInfo.intro}</p>
          <hr />
          <small>
            Member since {basicInfo.joinedMonth}, {basicInfo.joinedYear}
          </small>
        </div>
      </div>
    );
  }

  editButtonClicked(e) {
    // let btnText = e.target.innerHTML;
    this.setState({editMode: true});
    let usernameElement = document.querySelector(".username");
    let introElement = document.querySelector(".intro");
    let imgUrlInput = document.querySelector(".profileImageUrl");
    let elementArray = [usernameElement, introElement, imgUrlInput];
    let editBtn = document.querySelector(".edit-info-link");

    /* Toggle to save button */
    let saveBtn = document.querySelector(".saveButton");

    editBtn.classList.toggle("hide");
    saveBtn.classList.toggle("hide");

    /* Make elements editable */
    elementArray.forEach(e => {
      e.setAttribute("contenteditable", "true");
      e.classList.toggle("editable");
    });
  }

  saveButtonClicked(e) {
    let imgToSave = document.querySelector(".profileImageUrl").value; 
    let imgElement = document.querySelector(".profile-picture"); 
    let nameToSave = document.querySelector(".username").textContent;
    let introToSave = document.querySelector(".intro").textContent;
    let usernameElement = document.querySelector(".username");
    let introElement = document.querySelector(".intro");
    let elementArray = [usernameElement, introElement];
    

    e.preventDefault();

    let btn = document.querySelector(".saveButton");

    let saveData = {
      img: imgToSave,
      name: nameToSave,
      intro: introToSave,
      id: 2
    };

    console.log(saveData);

    axios({
      url: "/updatebasicinfo",
      method: "post",
      data: saveData
    })
      .then(res => console.log("the response was: " + JSON.stringify(res.data)))
      .catch(err => console.error(err));

    imgElement.setAttribute('src', imgToSave);
    
    btn.classList.toggle("hide");
    this.setState({editMode: false});
    elementArray.forEach(e => {
      e.setAttribute("contenteditable", "false");
      e.classList.toggle("editable");
    });

    document.querySelector(".edit-info-link").classList.remove("hide");
  }
}

export default BasicInfo;
