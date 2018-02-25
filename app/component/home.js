import React from 'react';
import ReactDOM from 'react-dom';
import { Profile } from './profile.js';
import { Networks } from './networks.js';
import { Contact } from './contact.js';

export class Home extends React.Component {
    render() {
        // style={{"margin-top": "80px"}}
        return <div className="is-large" >
            <div className="columns hero-body">
                <div className="column is-2"></div>
                <div className="column is-4">
                    <Profile />
                </div>
                <div className="column is-2"></div>
                <div className="column is-4">
                    <Networks />
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

                    <nav className="panel ">
                        <p class="panel-heading">
                            My NPM Packages
                            </p>
                        <div className="panel-block">
                            <a href="https://www.npmjs.com/package/ngx-window" className="button is-info is-outlined">
                                www.npmjs.com/package/ngx-window
                            </a>
                            <a href="/ng-window" className="button is-info is-outlined">
                                Ngx-Window Demo
                            </a>
                        </div>
                        <div className="panel-block">
                            <a href="https://www.npmjs.com/package/ngx-dragon" className="button is-info is-outlined">
                                www.npmjs.com/package/ngx-dragon
                            </a>
                            <a href="http://nomanhasan.com/ngx-dragon" className="button is-info is-outlined">
                                Ngx-Dragon Demo
                            </a>
                        </div>
                    </nav>
                    <Contact />
                </div>
            </div>
        </div>;
    }
}
