import React from 'react';
import ReactDOM from 'react-dom';
import {resume} from '../data/resume.js';

export class Education extends React.Component {
    constructor(props){
        super(props);
        var educations = resume["Education"];
        var skills = educations.map(d=>{
                        console.log(d);
                        return <div className="card transparent">
                            <header className="card-header">
                                <p className="card-header-title lucon-medium">
                                    {d.Degree}
                                </p>
                                <a className="card-header-icon">
                                <span className="icon">
                                    <i className="fa fa-graduation-cap"></i>
                                </span>
                                </a>
                            </header>
                            <div className="card-content">
                                <div className="content has-text-centered lucon-medium">
                                     <div className="lucon-small">
                                        Institution
                                    </div>
                                    {d.Institution}
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="card-footer-item container">
                                    <div className="lucon-medium">
                                        <div className="lucon-small has-text-centered">
                                            Year
                                        </div>
                                        {d.Time}
                                    </div>
                                </div>
                                <div className="card-footer-item container">
                                    <div className="lucon-medium">
                                        <div className="lucon-small has-text-centered">
                                            Result
                                        </div>
                                        {d.Result}
                                    </div>
                                </div>
                                {d["Major Courses"] !=null &&
                                    <div className="card-footer-item container">
                                        <div className="lucon-medium">
                                            <div className="lucon-small has-text-centered">
                                                Major Courses
                                            </div>
                                            {d["Major Courses"].map(c=>{
                                                return <p>{c}, </p>
                                            })}
                                        </div>
                                    </div>
                                }                                
                            </div>
                        </div>
                    });
        this.state = {skills};
        console.log(skills);
    }
    render() {
        return <div className="transparent">
        <div className="columns">
            <div className="column is-2">
            
            </div>
            <div className="column is-8">
                {/*<table className="table transparent">
                    <thead>
                        <tr>
                            <td>Institution</td>
                            <td>Degree</td>
                            <td>Time</td>
                            <td>Result</td>
                            <td>Major Courses</td>
                        </tr>
                    </thead>
                    <tbody>*/}
                        {this.state.skills}
                    {/*</tbody>
                </table>*/}
                </div>
            </div>
        </div>;
    }
}
