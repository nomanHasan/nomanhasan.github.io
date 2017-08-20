import React from 'react';
import ReactDOM from 'react-dom';
import { resume } from '../data/resume.js';

export class Profile extends React.Component {

    constructor(){
        super()
        let dob = new Date(resume["Personal Information"]["DOB"])
        this.state = {dob:dob}
        window.state = this.state
    }

    render() {
        let dob = () => {
            return Math.floor((new Date() - this.state.dob) / (1000 * 60 * 60 * 24 * 365.25))
        }
       return (
           <div className="container has-text-centered">
           <div className="image-cropper"><img src="./public/images/prosquare.jpg" alt="Profile Photo"/></div>
            <h1 className="title">
                Noman Hasan
      </h1>
            <h2 className="subtitle">
                Software Engineer
      </h2>
      <p className="lucon-small">B. Sc. in Software Engineering</p>
      <div className="column">
          <table className="table lucon-small transparent is-fullwidth">
            <tbody>
                <tr>
                    <td className="has-text-right"><b>Age</b></td>
                    <td>{dob()}</td>
                </tr>
                <tr>
                    <td className="has-text-right"><b>Sex</b></td>
                    <td>Male</td>
                </tr>
                <tr>
                    <td className="has-text-right"><b>Web Speciality</b></td>
                    <td><strong>MEAN Stack 2.0</strong> and <strong>MERN Stack</strong></td>
                </tr>
                <tr>
                    <td className="has-text-right"><b>Nationality</b></td>
                    <td>Bangladeshi</td>
                </tr>
            </tbody>
        </table>
      </div>
        </div>
       ) ;
    }
}
