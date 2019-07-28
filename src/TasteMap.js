import React, { useState, useEffect, useRef } from 'react';
import TasteClustersPackD3 from './TasteClustersPackD3';

let vis;

export default function TasteMap({ data }) {
  
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [active, setActive] = useState(null);
  const refElement = useRef(null);

  useEffect(handleResizeEvent, []);
  useEffect(initVis, [ data ]);
  useEffect(updateVisOnResize, [ width, height ]);


  function handleResizeEvent() {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }, 300);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  function initVis() {
    if(data) {
      const d3Props = {
        data,
        width,
        height,
        onDatapointClick: setActive
      };
      vis = new TasteClustersPackD3(refElement.current, d3Props);
    }
  }

  function updateVisOnResize() {
    vis && vis.resize(width, height);
  }

  return (
    <div className='react-world'>
      <div>{active}</div>
      <div ref={refElement}/>
    </div>
  );
}