import React, { Component } from 'react'
import ReactDOM from 'react-dom';

//import './App.css'
import * as d3 from "d3";
import { select } from 'd3-selection';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
   
    },
    viz:{
        //radial-gradient(#091C33, #091426)
        background:'radial-gradient(#f1f4f7, #091426)'
    }
  });

class BubbleChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            tastes: this.props.tastes
        };
        
        this.createBubbleChart = this.createBubbleChart.bind(this)
    }

    componentDidMount() {
        this.createBubbleChart()
    }

    shouldComponentUpdate() {
        return false;
      }

    componentDidUpdate() {
        this.createBubbleChart()
    }

    getBiggestChild(children){
        console.log(children)
        let biggest = children[0];
        for(let c of children){
            if(c.data.size > biggest.data.size) biggest = c
        }
        return biggest.data.name
    }

    createBubbleChart() {
        console.log('createBubbleChart')
        const node = this.node;
        const data = this.state.data;
        const formatNumber = d3.format(",d");
        
        var parentNode =  ReactDOM.findDOMNode(this).parentElement;
        var parentWidth = (parentNode && parentNode.offsetWidth) || 100;
        var parentHeigth = (parentNode && parentNode.offsetHeight) || 100;
        const chartW = 2000, chartY = 2000;

        const svg = d3.select(node)
            .attr("width", chartW)
            .attr("height", chartY)
            //.attr('transform', `translate(-${parentWidth/2},-${parentHeigth}) scale(0.5)`)
        
        //const color = d3.scaleOrdinal(d3.schemeCategory10);
        const color = name => this.state.tastes[name]? this.state.tastes[name][0] : '#000';

        const packLayout = d3.pack()
            .size([chartW, chartY])
            .padding((d) => d.height === 0 ? 0 : (d.height === 1 ? 10 : 100)); //d.r / 0.35 : 3);

        const root = d3.hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => a.value - b.value);

        console.log(root)
        packLayout(root);
        const nodes = root.descendants();


        /*
        <defs id="mdef">
            <pattern id="image" x="0" y="0" height="40" width="40">
            <image x="0" y="0" width="40" height="40" xlink:href="spills/1.png"></image>
            </pattern>
        </defs>
        <defs>
            <pattern id="image" patternUnits="userSpaceOnUse" width="83.38" height="100" x="0" y="0">
                <image xlink:href="https://goo.gl/kVVuy1" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMinYMin slice"/>
            </pattern>
        </defs>
        */
        d3.select(node)
            .append('defs')
            .attr('id', 'mdef')
            .append('pattern')
            .attr('id', 'spill_1')
            .attr('patternUnits','userSpaceOnUse')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', '100%')
            .attr('width', '100%')
            .append('image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('preserveAspectRatio','xMinYMin slice')
            .attr('xlink:href', 'static/spills/1.png')
        

        let getSelect = d3.select(node)
        
            // .call(d3.zoom().on('zoom', (d,x,c) => {
            //     console.log('on zoom: ', d3.event)
            //     d3.select(node)
            //        .attr("transform", d3.event.transform)        
            // }))
            // .call(d3.zoom().on('zoom', (d,x,c) => {
            //     console.log('on zoom: ', d, x, c, d3.event, d3.event.transform, d3.event.scale)
            //     var transform = d3.event.transform;
            //     // transform.x = Math.min(0, transform.x);
            //     // transform.y = Math.min(0, transform.y);
            //     d3.select(node)
            //         .attr("transform", transform.toString());
            // }))
            .selectAll('circle')
            .data(nodes.slice(1))
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("data-index", (d, i, j) => i)
            .on('mouseup', (d, i, nodes) => this.onNodeSelect(d, i, nodes))
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        getSelect.append("circle")
            .attr('r', d => d.r)
            .style('padding', '0px')
            .style('fill-opacity', d => d.children ? 0.5 : 1)
            .style("fill", (d) => d.children ? color(this.getBiggestChild(d.children)): color(d.data.name))
            //.style("fill", (d) => d.children ? 'url(#spill_1)': color(d.data.name))
            ;
        
        // getSelect.append("image")
        //     .attr('xlink:href', d => (d.children || d.data.size < 100) ? null : `https://winefolly-wpengine.netdna-ssl.com/wp-content/uploads/wines/icons/flavors/${d.data.name}.svg`)
        //     .attr('x', d => -d.data.size/14)
        //     .attr('y', d => -d.data.size/14)
        //     .attr('width', d => d.data.size/7 )
        //     .attr('height', d => d.data.size/7)
        //     .attr('fill', '#000');

        getSelect.append("text")
            .attr("dy", ".3em")
            .attr("font-size", (d) => `${Math.max(d.data.size/35, 7)}px`)
            .style("text-anchor", "middle")
            //.text(d => d.children ? null : d.data.name.length > 10 ? d.data.name.substring(0,8) : d.data.name);
            .text(d => d.children ? null : d.data.name);
        
        // getSelect.append("text")
        //     .attr("dy", ".3em")
        //     .attr("font-size", (d) => `${d.data.size/35}px`)
        //     .style("text-anchor", "middle")
        //     .text(d => (d.children || d.data.name.length) < 10 ? null : d.data.name.substring(8, d.data.name.length));

        // getSelect.append("title")
        //     .text((d) => d.data.name);
    }

    onNodeSelect = (refData, i, nodes) => {
        const isCluster = refData.depth === 1;
        const d = isCluster ? refData.data : refData.parent.data;
        let domNode = d3.select(nodes[i]);
        if(!isCluster) {
            //const parentIndex = domNode.attrs['data-index'];
        }
        // domNode.style('fill', 'yellow')
        if(d){
            
            if(this.props.onClusterSelected)
                this.props.onClusterSelected(d.name);
        }
    }

    render() {
        const { classes } = this.props;
        return ( 
            <div className={classes.root}>
                <svg className={classes.viz} ref={node => this.node = node}></svg>
            </div>
        );
    }
}
export default withStyles(styles)(BubbleChart);
