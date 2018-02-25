import React from 'react';
import ReactDOM from 'react-dom';
import {websites} from '../data/websitesData';

export class Websites extends React.Component {
    constructor(props){
        super(props);
        var pros = websites.map(d=>{
                        console.log(d);
                    return <div key={d.name} className="box">
                            <article className="media">
                                <div className="media-left">
                                <figure className="image is-128x128">
                                    {d.images ? 
                                    <img src={"./public/images/"+d.images[0]} alt="Image"></img> 
                                    :
                                    <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image"></img>
                                    }
                                </figure>
                                </div>
                                <div className="media-content">
                                <div className="content">
                                    <p>
                                    <strong className="lucon-big">{d.name}</strong>
                                    <br/>
                                    <strong>Development Tools :  </strong>
                                        {d["Development Tools"]}
                                    </p>
                                </div>
                                <nav className="level">
                                    <div className="level-left">
                                    <p className="level-item lucon-medium">
                                        
                                        <strong>Deployment :  </strong>
                                        {d["Deployment"]}
                                    </p>
                                    </div>
                                </nav>
                                <nav className="level">
                                    <div className="level-left"></div>
                                    <div className="level-right">
                                    <a className="level-item button is-success" href={d.url}>
                                        <span className="fa fa-external-link col-sm-4"> Visit Website </span>
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
