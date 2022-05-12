import React, { useState, createRef, useEffect} from 'react';
import { Form } from 'react-bootstrap';

function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const myInput = createRef();

    
    return(
        <Form onSubmit={(event) => event.preventDefault()}>
            <h1 className="text-center">Form and Events</h1>
            <Form.Control type="text" placeholder="Enter your name" ref={myInput} required/>
            <Form.Control type="password" placeholder="Enter your Password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} className="mt-2" autoComplete="new-password" required/>
            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} className="mt-2" required/>
            <Form.Check type="checkbox" className="mt-2" label="Front End" inline value="1" checked={role == '1'} onChange={(event)=>setRole(event.currentTarget.value)}/>
            <Form.Check type="checkbox" label="Back End" inline value="2" checked={role == '2'} onChange={(event)=>setRole(event.currentTarget.value)}/>
            <Form.Check type="checkbox" label="DB admin" inline value="3" checked={role == '3'} onChange={(event)=>setRole(event.currentTarget.value)}/>
        </Form>
    )
}

export default Home;