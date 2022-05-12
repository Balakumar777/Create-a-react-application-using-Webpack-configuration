import React, { useContext, useEffect, useState, Profiler, version as Version} from 'react';
import { Table, Form, Pagination, Spinner, Alert, FormControl  } from 'react-bootstrap';
import { Theme } from '../Store/Store.js';
import { sortBy } from 'lodash';
import { Link } from 'react-router-dom';

function Home() {
    const { store, dispatchAction} = useContext(Theme);
    const [total, totalData] = useState([]);
    const [data, setData] = useState([]);
    const [currentRow, setCurrentRow] = useState({page:1,size:10});
    const [country, setCountry] = useState('');
    const [countryData, setCountryData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState(1);
    const [sortByDrop, setSortByDrop] = useState('');
    const [sortNumber, setSortNumber] = useState('');

    const columns = [
        { label:"Row",key:""},
        { label:"Date",key:"date"},
        { label:"Deaths",key:"deaths"},
        { label:"Confirmed",key:"confirmed"},
        { label:"Recovered",key:"recovered"},
        { label: "New Confirmed", key:"new_confirmed"},
        { label: "New Recovered", key:"new_recovered"},
        { label: "New Deaths", key:"new_deaths"},
        { label: "Active", key:"active"},
    ];
    const style = store.themeColor;

    useEffect(() => {
        getCountry();
    }, []);

    useEffect(()=>{
        document.querySelector("body").style.backgroundColor = style.back
    }, [store])

    useEffect(()=>{
        let current = total.filter((data, index) => index <= currentRow.page * currentRow.size - 1 && index >= (currentRow.page - 1) * currentRow.size);
        if (sortByDrop != "") {
            sorter(current)
        }else{
            setData(current);
        }
    },[currentRow]);

    useEffect(()=>{
        if (country != "")
            getApi();
    }, [country])

    useEffect(()=>{
        if (sortByDrop != "") {
            sorter(data)
        }
    }, [sortByDrop,sortOrder])

    async function getApi() {
        setLoading(true);
        const res = await fetch("https://corona-api.com/countries/" + country);
        res.json().then((data)=>{
            if(data?.data?.timeline) {
                totalData(data?.data?.timeline);
                let array = data?.data?.timeline.filter((data, index) => index <= currentRow.size - 1);
                array = data?.data?.timeline;
                if(sortByDrop != "")
                    sorter(array)
                else
                    setData(array);
                    
            }
        }).catch((err)=>{}).finally(() => setLoading(false));
    }

    async function getCountry() {
        setLoading(true);
        const res = await fetch("https://api.first.org/data/v1/countries");
        res.json().then((data)=>{
            setCountryData(data?.data);
        }).catch((err)=>{}).finally(() => setLoading(false))
    }

    function renderCountry() {
        const Array = Object.entries(countryData).map((data, index) => {
            return (
                <option value={data[0]} key={index}>{data[1]?.country}({data[1]?.region})</option>
            )
        })
        return Array;
    }

    function Loading() {
        return(
            <Spinner animation="border" className='mb-3' variant={!style.isDarkMode ? 'dark' : 'light'}/>
        )
    }

    function renderSort() {
        return columns.filter((data)=> data.key != "").map((data, index) => {
            return (
                <option value={data.key} key={index}>{data.label}</option>
            )
        })
    }

    function sorter(array) {
        let sortData = sortBy(array, sortByDrop)
        if (sortOrder == -1)
            sortData.reverse();
        setData(sortData)
    }

    function gotoPage(event,value,type='keyup') {
        let flag = false;
        setSortNumber(value);
        if (value.trim() != "" && value <= Math.ceil(total.length / currentRow.size) && value > 0) {
            if (event.which == 13 || event.keyCode == 13 && type == 'keyup') {
                flag = true;
            }
            else if(type == 'change') {
                flag = true;
            }
        }
        if (flag) {
            setCurrentRow({ size: currentRow.size, page: value })
        }
    }

    function renderPagesCount(count) {
        let array = []
        for (let index = 1; index <= count; index++) {
            array.push(<option value={index}>{index}</option>)
        }
        return array;
    }

    function formatChange(value) {
        var val = Math.abs(value)
        if (val >= 10000000) {
            val = (val / 10000000).toFixed(2) + ' Cr';
        } else if (val >= 100000) {
            val = (val / 100000).toFixed(2) + ' Lac';
        } else if (val >= 1000) {
            val = (val / 1000).toFixed(2) + ' k';
        }
        return val;
    }

    return(
        <div className='pt-3'>
            {/* <Link to='/home' title='test'>Test</Link> */}
            {/* <Form.Check
                style={{ color: style.color }}
                type="checkbox"
                label={style.isDarkMode ? "Change light mode" : "Change dark mode"}
                onChange={(event) => {
                    if (event.currentTarget.checked) {
                        dispatchAction("changeBack", { back: "#000", color: "#fff", isDarkMode:true });
                    } else {
                        dispatchAction("changeBack", { back: "#fff", color: "#000", isDarkMode: false });
                    }
                }}
                checked={style.isDarkMode}
            /> */}
            <div>Powered by React <strong>{Version}</strong></div>
            <h2 className='text-center' style={{ color: style.color}}>Statistics Table React</h2>
            {
                loading ? <Loading/> :
                <React.Fragment>

                <div className='row mb-3'>
                    <div className="col-sm">
                        <Form.Control as="select" custom onChange={(event) => setCountry(event.currentTarget.value)} value={country}>
                            <option value="">Choose country</option>
                            {renderCountry()}
                        </Form.Control>
                    </div>
                </div>
                <div className='row mb-3'>
                    {
                        data.length ? 
                        <React.Fragment>
                            <div className="col-sm">
                                <Form.Control custom as="select" onChange={(event) => {
                                    setCurrentRow({ size: event.currentTarget.value, page: 1 });
                                    setSortNumber('')
                                }} >
                                    <option value="10">10 per page</option>
                                    <option value="25">25 per page</option>
                                    <option value="50">50 per page</option>
                                    <option value={total.length}>Show all</option>
                                </Form.Control>
                            </div>
                            <div className="col-sm">
                                <div className='d-flex'>
                                    <Form.Control custom as="select"  value={sortByDrop} onChange={(event) => setSortByDrop(event.currentTarget.value)}>
                                        <option value="">Sort by</option>
                                        {renderSort()}
                                    </Form.Control>
                                    {
                                        sortByDrop != "" ?
                                            <Form.Control custom as="select" className='ml-3' value={sortOrder} onChange={(event) => setSortOrder(event.currentTarget.value)}>
                                                <option value="1">Asc</option>
                                                <option value="-1">Desc</option>
                                            </Form.Control>
                                        :null
                                    }
                                </div>
                            </div>
                        </React.Fragment>
                    :null
                    }
                </div>
                </React.Fragment>
            }
            <div style={{overflow:"auto",height:'510px'}} className="mb-3">
                <Profiler onRender={
                    (id, phase, actualDuration,) => {
                        console.log({ id, phase, actualDuration})
                    }
                } id="TableRender">
                    <Table striped bordered hover variant={style.isDarkMode ? "dark" : "light"}>
                        <thead>
                            <tr>
                                {
                                    columns.map((data,index)=>{
                                        return(
                                            <th key={index} style={{zIndex:1, position: 'sticky', top: 0, background: !style.isDarkMode ? '#dee2e6' : "#343a40"}}>{data.label}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            !total.length ? 
                                <tr>
                                    <td colSpan={9} className="text-center">No records found</td>
                                </tr>
                            :
                            <React.Fragment>
                                    {
                                        data.map((data, index)=>{
                                            return (
                                                <tr key={index}>
                                                    <td>{Math.floor((currentRow.size* (currentRow.page-1)) + (index+1)) }</td>
                                                    <td>{data.date}</td>
                                                    <td>{formatChange(data.deaths)}</td>
                                                    <td>{formatChange(data.confirmed)}</td>
                                                    <td>{formatChange(data.recovered)}</td>
                                                    <td>{formatChange(data.new_confirmed)}</td>
                                                    <td>{formatChange(data.new_recovered)}</td>
                                                    <td>{formatChange(data.new_deaths)}</td>
                                                    <td>{formatChange(data.active)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                            </React.Fragment>
                        }
                        </tbody>
                    </Table>
                </Profiler>
                <div id="profiler">

                </div>
            </div>
            {
                total.length && !loading ?
                <div className='row align-items-baseline'>
                    <div className='col-sm'>
                        {
                            data.length ?
                                <Alert variant={style.isDarkMode ? 'light' : 'dark'}>
                                        Showing {(((currentRow.page * currentRow.size) - currentRow.size)) + 1}-{(currentRow.page * currentRow.size) >= total.length ? total.length : (currentRow.page * currentRow.size)} / {total.length} results
                                </Alert>
                                : ""
                        }
                    </div>
                    <div className='col-sm'>
                        <Pagination className='justify-content-end'>
                            <Pagination.First title='First page' onClick={() => setCurrentRow({ page: 1, size: currentRow.size })} disabled={currentRow.page <= 1} />
                            <Pagination.Prev title='Previous page' disabled={currentRow.page <= 1} onClick={() => setCurrentRow({ page: currentRow.page - 1, size: currentRow.size })} />
                            {/* <Form.Control type="number" value={sortNumber} placeholder={`Total ${Math.ceil(total.length / currentRow.size)} pages`} onKeyUp={(event) => gotoPage(event, event.currentTarget.value)} onChange={(event) => gotoPage(event, event.currentTarget.value, 'change')} className="mx-2" disabled={currentRow.page >= Math.ceil(total.length / currentRow.size)}/> */}
                            {/* <Form.Control as="select" value={sortNumber} custom onChange={(event) => gotoPage(event, event.currentTarget.value, 'change')} className="mx-2" disabled={currentRow.page >= Math.ceil(total.length / currentRow.size)}>
                                <option value="">Select page</option>
                                {renderPagesCount(Math.ceil(total.length / currentRow.size))}
                            </Form.Control> */}
                            <Pagination.Next title='Next page' disabled={currentRow.page >= Math.ceil(total.length / currentRow.size)} onClick={() => setCurrentRow({ page: currentRow.page + 1, size: currentRow.size })}/>
                            <Pagination.Last title='Last page' onClick={() => setCurrentRow({ page: Math.ceil(total.length / currentRow.size), size: currentRow.size })} disabled={currentRow.page >= Math.ceil(total.length / currentRow.size)}/>
                        </Pagination>
                    </div>
                </div>
                :null
            }
        </div>
    )
}

export default Home;