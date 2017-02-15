import React from 'react';
import ReactDOM from 'react-dom';
import {Profile} from './profile.jsx';
import {Networks} from './networks.jsx';
import {Contact} from './contact.jsx';

export class Home extends React.Component {
    render() {
        // style={{"margin-top": "80px"}}
        return <div className="is-large" >
        <div className="columns hero-body">
            <div className="column is-2"></div>
            <div className="column is-4">
                <Profile/>
            </div>
            <div className="column is-2"></div>
        <div className="column is-4">
            <Networks/>
            <div className="panel ">
                <div className="panel-block">
                    <a href="./NomanHasan-Resume2017.pdf" className="button is-large is-success radius">
                        <span className="icon is-medium">
                        <i className="fa fa-download"></i>
                        </span>
                        <span>Resume as PDF</span>
                    </a>
                </div>
            </div>
            <Contact/>
        </div>
        </div>
        </div>;
    }
}
