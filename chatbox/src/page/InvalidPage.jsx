import React from 'react';
import Invalid from "../data/404 Error-amico.svg"

function InvalidRoute() {
    return ( <>
    <div className='container' id='invalidroute'>
        <div className='row'>
        <div className='col-12'>
        <img src={Invalid}  alt="..." />
        </div>
        </div>

    </div>
    
    </> );
}

export default InvalidRoute;