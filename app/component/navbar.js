import React from 'react';
import ReactDOM from 'react-dom';

export class Navbar extends React.Component {
    constructor(props){
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        var links = [
            {
                name: "Home",
                href:"#home"
            },
            {
                name: "Skills",
                href:"#skills"
            },
            {
                name: "Projects",
                href:"#projects"
            },
            {
                name: "Education",
                href:"#education"
            }
        ];
        var aList = links.map(link => {
            return <a className="nav-item is-tab is-hidden-mobile" ref={link.name} key={link.name} href={link.href} onClick={this.handleClick} >{link.name}</a>
        });
        this.state = {aList};
    }
    handleClick(e){
        
        this.state.aList.forEach(a=>{
            if(this.refs[a.key] != e.target.key){
                this.refs[a.key].className = "nav-item is-tab is-hidden-mobile";
            }
        });
        if(e.target.className.indexOf("is-active")<0){
            e.target.className += " is-active";
        }        
    }
    render() {
        
        return <div >
            <nav className="nav fixed-nav-bar lucon-huge is-Dark cloud">
                <div className="container">
                    <div className="nav-left">
                        <a className="nav-item">
                            <h3 className="lucon-huge">Noman Hasan</h3></a>
                            {this.state.aList}
                        </div>
                    <span className="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <div className="nav-right nav-menu">
                        <a className="nav-item is-tab is-hidden-tablet is-active">Home</a>
                        <a className="nav-item is-tab is-hidden-tablet">Features</a>
                        <a className="nav-item is-tab is-hidden-tablet">Pricing</a>
                        <a className="nav-item is-tab is-hidden-tablet">About</a>
                        <a className="nav-item is-tab" href="mailto:nomanbinhussein@gmail.com">
                            <span className="fa fa-envelope fa-2x"> EMail Me</span>
                        </a>
                        <a className="nav-item is-tab" href="tel:+8801676088718"><span className="fa fa-mobile fa-2x"> Call Me</span></a>
                    </div>
                </div>
            </nav>
        </div>;
    }
}
