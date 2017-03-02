import React from 'react';
import ReactDOM from 'react-dom';

export class Profile extends React.Component {
    render() {
       return <div className="container has-text-centered">
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
                    <td>21</td>
                </tr>
                <tr>
                    <td className="has-text-right"><b>Sex</b></td>
                    <td>Male</td>
                </tr>
                <tr>
                    <td className="has-text-right"><b>Web Speciality</b></td>
                    <td>MEAN Stack 2.0</td>
                </tr>
                <tr>
                    <td className="has-text-right"><b>Nationality</b></td>
                    <td>Bangladeshi</td>
                </tr>
            </tbody>
        </table>
      </div>
        </div> ;
    }
}
