import React from 'react';
import ReactDOM from 'react-dom';
import { resume } from '../data/resume.js';

export class Contact extends React.Component {
    
    render() {
        var rows = resume["Contact Information"].map(function(n){
            return <div className="panel-block" key={n.name}>
                <div className="panel-icon">
                    <span className={n.icon+' fa-2x'}></span>
                </div>
            <a href={n.url} >{n.name} <p className="lucon-medium">{n.value}</p> </a> 
            </div>;
        })
        return <nav className="panel lucon-medium">
            <p className="panel-heading">
                Contact Information
            </p>
            {rows}
        </nav> ;
    }
}
