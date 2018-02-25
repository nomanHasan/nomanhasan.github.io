import React from 'react';
import ReactDOM from 'react-dom';
import {experiences} from '../data/experienceData';

export class Experience extends React.Component {
    constructor(props){
        super(props);
        var pros = experiences.map(d=>{
                        console.log(d);
                    return <div key={d.name} className="box">
                            <article className="media">
                                <div className="media-content">
                                <div className="content">
                                    <p>
                                    <strong className="lucon-big">{d.name}</strong>, {d["location"]} -  <i>{d["position"]}</i>
                                    <br/>
                                    {d["from"]} - {d["to"]}
                                    <br/>
                                    <strong>Development Tools :  </strong>
                                        {d["Development_Tools"]}
                                    </p>
                                </div>                              
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
