import React from 'react';
import { render } from 'react-dom';
import { Navbar } from './component/navbar.js';
import { Home } from './component/home.js';
import { Skills } from './component/skills.js';
import { Education } from './component/education.js';
import {Title } from './template/title.js';
import {Projects } from './component/projects.js';
import {Websites } from './component/websites.js';
import { Experience} from './component/experience.js'


class App extends React.Component {
  render() {
    return <div className="App cloud">
      <Navbar/>
      <Home/>
      <Title title="Experience" id="experience" />
      <Experience/>
      <Title title="Developed Websites" id="websites" />
      <Websites/>
      <Title title="Projects" id="projects" />
      <Projects/>
      <Title title="Skills" subtitle="Skills in Programming" id="skills"/>
      <Skills/>
      <Title title="Education" id="education" />
      <Education/>
    </div>;
  }
}

render(<App />, document.getElementById('app'));
