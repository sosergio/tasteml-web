import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import D3CirclePacking from './D3CirclePacking';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root:{}
});

class ClustersChart extends Component {
  
  visWidth = 2000;
  visHeight = 2000;
  constructor(props) {
    super(props)
    this.state = {
        data: this.props.data,
        tastes: this.props.tastes,
        active: null
    };
    
  }

  componentDidMount() {
    //this.setSizeFromParent();
    this.initVis()
    //this.registerOnPageResizeEventHandler()
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    //console.log('ClustersChart componentDidUpdate') 
  }

  setSizeFromParent = () => {
    var parentNode =  ReactDOM.findDOMNode(this).parentElement;
    this.visWidth = (parentNode && parentNode.offsetWidth) || 100;
    this.visHeight = (parentNode && parentNode.offsetHeight) || 100;
  }

  registerOnPageResizeEventHandler = () => {
    let resizeTimer;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        var parentNode =  ReactDOM.findDOMNode(this).parentElement;
        this.visWidth = (parentNode && parentNode.offsetWidth) || 100;
        this.visHeight = (parentNode && parentNode.offsetHeight) || 100;
        this.updateVis();
      }, 300);
    };
    window.addEventListener('resize', this.handleResize);

    return () => {
      window.removeEventListener('resize', this.handleResize);
    };
  }

  initVis = () => {
    const {
      data,
      tastes,
      selectedName
    } = this.state;
    const width = this.visWidth;
    const height = this.visHeight;
    console.log(`initVis data:${data}, width:${width}, height:${height}`)
      if (data) {
        const d3Props = {
          data,
          tastes,
          width,
          height,
          selectedName : '2',
          onNodeSelect: this.onNodeSelect
        };
        console.log('d3Circle init')
        this.vis = new D3CirclePacking(this.refElement, d3Props);
      }
  }

  updateVis = () => {
    const {
      data
    } = this.state;
    const width = this.visWidth;
    const height = this.visHeight;
    console.log(`updateVisOnResize data:${data}, width:${width}, height:${height}`)
    this.vis && this.vis.resize(width, height);
  }

  onNodeSelect = (refData, i, nodes) => {
    const isCluster = refData.depth === 1;
    const d = isCluster ? refData.data : refData.parent.data;
    //let domNode = d3.select(nodes[i]);
    if(!isCluster) {
        //const parentIndex = domNode.attrs['data-index'];
    }
    // domNode.style('fill', 'yellow')
    if(d){
        if(this.vis) this.vis.setSelected(d.name);
        if(this.props.onClusterSelected)
            this.props.onClusterSelected(d.name);
    }
}


  render(){
    const { classes } = this.props;
    return ( 
    <div className={classes.root}>
     
     


      <div ref={node => this.refElement = node}/>
    </div>
  )}
}

export default withStyles(styles)(ClustersChart);