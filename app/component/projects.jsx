import React from 'react';
import ReactDOM from 'react-dom';
import {projects} from '../data/projects';

export class Projects extends React.Component {
    constructor(props){
        super(props);
        var pros = projects.map(d=>{
                        console.log(d);
                    return <div className="box">
                            <article className="media">
                                <div className="media-left">
                                <figure className="image is-128x128">
                                    <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image"></img>
                                </figure>
                                </div>
                                <div className="media-content">
                                <div className="content">
                                    <p>
                                    <strong className="lucon-big">{d.title}</strong> <small>@johnsmith</small> <small>31m</small>
                                    <br/>
                                    {d.description}
                                    </p>
                                </div>
                                <nav className="level">
                                    <div className="level-left">
                                    <p className="level-item lucon-medium">
                                        <strong>Development Tools :  </strong>
                                        {d.dev_tools}
                                    </p>
                                    </div>
                                </nav>
                                <nav className="level">
                                    <div className="level-left"></div>
                                    <div className="level-right">
                                    <a className="level-item button is-success" href={d.github_repo}>
                                        <span className="fa fa-github"> Github Repository </span>
                                    </a>
                                    </div>
                                </nav>                                
                                </div>
                            </article>
                            </div>
                })
        this.state = {pros};
        console.log(pros);
    }
    render() {
        return <div className="transparent">
        <div className="columns">
            <div className="column is-2">
            
            </div>
            <div className="column is-8">
                {this.state.pros}
                </div>
            </div>
        </div>;
    }
}
