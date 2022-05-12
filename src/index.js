import React from 'react';
import  ReactDOM  from 'react-dom';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { Provider, Theme } from './Store/Store.js';
import Home from './Pages/Home.js';
import Error from './Pages/Error.js';
import Table from './Pages/Table.js';
import './Assets/scss/app.scss';

function SideBar() {
    return (
      <div className="mr-3" style={{width:"30%"}}>
        <ListGroup>
            <ListGroup.Item>
                <Link to='/'>Home</Link>
            </ListGroup.Item>
            <ListGroup.Item>
                <Link to='/table'>Table</Link>
            </ListGroup.Item>
            <ListGroup.Item>
                <Link to='/error'>Error</Link>
            </ListGroup.Item>
        </ListGroup>
      </div>
    )
}

function MainContent() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Table />} />
                <Route exact path="/table" element={<Table />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    )
}

function RootApp(){
    return (
        <Provider>
            <Theme.Consumer>
                {({store,...value})=>
                    <Router>
                        <div className="container">
                            {/* <SideBar/> */}
                            <MainContent/>
                        </div>
                    </Router>
                }
            </Theme.Consumer>
        </Provider>
    )
}

ReactDOM.render(<RootApp/>,document.getElementById("root"));
