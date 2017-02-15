import React from 'react';
import ReactDOM from 'react-dom';
import {resume} from '../data/resume.js';

export class Skills extends React.Component {
    constructor(props){
        super(props);
        var skills = Object.keys(resume["Programming Skill"]).map(d=>{
                        console.log(d);
                        return <nav key={d} className="level skill-level">
                            <div className="level-right">
                                <div className="level-item">
                                {d}
                                </div>
                            </div>
                            <div className="level-left lucon-medium bold has-text-centered">
                                {Object.keys(resume["Programming Skill"][d]).map(el=>{
                                    return <div key={el} className="level-item has-text-centered">
                                        {resume["Programming Skill"][d][el]+" | "}
                                    </div>
                                })}
                            </div>
                        </nav>
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
                    {this.state.skills}
                </div>
            </div>
        </div>;
    }
}
