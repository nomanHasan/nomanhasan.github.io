import React from 'react';
import ReactDOM from 'react-dom';
import { networks } from '../data/networks.js';

export class Networks extends React.Component {
    
    render() {
        console.log(networks);
        var rows = networks.map(function(n){
            return <div className="panel-block" key={n.name}>
                <div className="panel-icon">
                    <span className={n.icon+' fa-2x'}></span>
                </div>
            <a href={n.url}>{n.name} <p className="lucon-small">{n.url.slice(8)}</p> </a> 
            </div>;
        });
        return <nav className="panel lucon-medium">
            <p className="panel-heading">
                Extenral Accounts
            </p>
            {rows}
        </nav> ;
    }
}
