import React from 'react';
import ReactDOM from 'react-dom';

export class Title extends React.Component {
    render() {
       return <section className="hero glass" id={this.props.id}>
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title">
                            {this.props.title}
                        </h1>
                        <h2 className="subtitle">
                            {this.props.subtitle}
                        </h2>
                    </div>
                </div>
            </section>
            ;
    }
}
