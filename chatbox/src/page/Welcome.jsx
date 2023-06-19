import React,{useEffect, useRef} from 'react';
import S8 from '../data/welcome/slide1.jpg';
import S2 from '../data/welcome/slide2.jpg';
import S3 from '../data/welcome/slide3.jpg';
import S4 from '../data/welcome/slide4.jpg';
import S5 from '../data/welcome/slide5.jpg';
import S6 from '../data/welcome/slide6.jpg';
import S7 from '../data/welcome/slide7.jpg';
import S1 from '../data/welcome/slide8.jpg';

import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link, Outlet } from 'react-router-dom';


let textCount = 0
let imageCount = 7

function Welcome() {
    useEffect(()=>{
       const autoFlip=setInterval(()=> flip('down'),5000)

        return ()=>clearInterval(autoFlip);
    })
    const text = useRef()
    const image = useRef()
    const flip = (move)=>{
      if(imageCount===0 && move==="up"){
        textCount=0;
        imageCount=7
        const textTranslate = textCount*100
        const imageTranslate = imageCount*100
        text.current.style.transform=`translateY(${textTranslate}vh)`;
        image.current.style.transform=`translateY(-${imageTranslate}vh)`;
        
      }

      else if(imageCount===7 && move==="down"){
        textCount=7;
        imageCount=0
        const textTranslate = textCount*100
        const imageTranslate = imageCount*100
        text.current.style.transform=`translateY(-${textTranslate}vh)`;
        image.current.style.transform=`translateY(${imageTranslate}vh)`;
        
      }



      else{

      
        
   if(move==='up'){
    textCount++
    imageCount--
    const textTranslate = textCount*100
    const imageTranslate = imageCount*100

    text.current.style.transform=`translateY(-${textTranslate}vh)`;
    image.current.style.transform=`translateY(-${imageTranslate}vh)`;
    
   }
   if(move==='down'){
    textCount--
    imageCount++
    const textTranslate = textCount*100
    const imageTranslate = imageCount*100

    text.current.style.transform=`translateY(-${textTranslate}vh)`;
    image.current.style.transform=`translateY(-${imageTranslate}vh)`;
    
   }}
   
   


  };  
    const sliders = [S1,S2,S3,S4,S5,S6,S7,S8]
    const notes = [ {
        "background": "linear-gradient(to bottom, #febbbb 0%,#fe9090 66%,#fe9090 66%,#ff8989 100%)",
        "text":"Fight to Be Fit"
    },
    {
        "background": "linear-gradient(to bottom, #7d7e7d 0%,#0e0e0e 100%)",
        "text": "Don't Quit, Get Fit.",
     
    },
    {
        "background": "#004562",
        "text": "Get In, Get Fit",
      
    },
    {
        "background": "#c9cf88",
        "text": " Harder, Faster, Stronger",
    
    },
    {
        "background": "#bdb3b2",
        "text": "Stronger, Healthier, Happier",
        
    },
    {
        "background": "#021e21",
        "text": "Commit, Perform, Succeed.",

    },
    {
        "background": "#f1c0e2",
        "text": " If You Believe, You Will Achieve",

    },
    {
        "background": "#305699",
        "text": "Move Your Body, Shape Your Future.",

    }]
    return ( <>
    <div className='row g-0' id='welcome'>
    <div className= 'col float-start text-container' ref={text}>
    {notes.map((N,index)=>
                <div className='row'  style={{background:N.background,
       height:'100%'}} key={index} >
                    
                    <div className='col my-auto text'>
                    <span className='fs-2 fw-bold text-white'>{N.text}</span>
                    <div className='mt-4'>
                   <Link to='/login'>
                    <Button variant="contained" endIcon={<LoginIcon />}>
        Enroll
      </Button></Link>
                    </div>
    
                    </div>
         
                </div>

           
            )}
</div>

        <div className='col float-end  image-container' ref={image}>
            {sliders.map((S,index)=>
                <div key={index}>
                    <img src={S} alt="..."  />
                </div>

            
            )}
        </div>
        
    </div>
    <div className='position-fixed top-50 end-50 bg-info' onClick={()=>flip('up')}>
<ArrowUpwardIcon fontSize="large" sx={{color:'white',
width:'50px',cursor:'pointer'}}/>
    </div>
    <div className='position-fixed top-50 start-50 bg-danger' onClick={()=>flip('down')}>
<ArrowDownwardIcon fontSize="large" sx={{color:'white',
width:'50px',cursor:'pointer'}}/>
    </div>
    <Outlet/>
    </> );
}

export default Welcome;