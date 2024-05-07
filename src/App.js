import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Products from './peges/Product';
import ProductType from './peges/ProductType';
import Tax from './peges/Tax';
import Transaction from './peges/Transaction';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <ToastContainer/>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path='/product' element={<Products/>}/>
                </Routes>
                <Routes>
                    <Route path='/product-type' element={<ProductType/>}/>
                </Routes>
                <Routes>
                    <Route path='/tax' element={<Tax/>}/>
                </Routes>
                <Routes>
                    <Route path='/transaction' element={<Transaction/>}/>
                </Routes>
            </Router>
        </>
    );
}

export default App;
