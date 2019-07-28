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
        const node = this.node;
        const data = this.state.data;
        const formatNumber = d3.format(",d");
        
        // var parentNode =  ReactDOM.findDOMNode(this).parentElement;
        // var parentWidth = (parentNode && parentNode.offsetWidth) || 100;
        // var parentHeigth = (parentNode && parentNode.offsetHeight) || 100;
        // this.w = parentWidth;
        // this.h = parentHeigth;  
        // this.r = parentWidth

        // // Ranges
        // this.x = d3.scaleLinear().range([0, this.r]);
        // this.y = d3.scaleLinear().range([0, this.r]);
        const svg = d3.select(node)
            .attr("width", 2000)
            .attr("height", 2000)
            //.attr('transform', `translate(-${parentWidth/2},-${parentHeigth}) scale(0.5)`)
        
        //const color = d3.scaleOrdinal(d3.schemeCategory10);
        const color = name => this.state.tastes[name]? this.state.tastes[name][0] : '#000';

        const packLayout = d3.pack()
            .size([2000, 2000])
            .padding((d) => d.height === 0 ? 0 : (d.height === 1 ? 10 : 100)); //d.r / 0.35 : 3);

        const root = d3.hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => a.value - b.value);

        console.log(root)
        packLayout(root);
        const nodes = root.descendants();

        let getSelect = d3.select(node)
            .call(d3.zoom().on('zoom', (d,x,c) => {
                console.log('on zoom: ', d, x, c, d3.event, d3.event.transform, d3.event.scale)
                var transform = d3.event.transform;
                transform.x = Math.min(0, transform.x);
                transform.y = Math.min(0, transform.y);

                // getSelect.attr("transform", transform.toString());
                d3.select(node)
                    .attr("transform", transform.toString());
                    // .selectAll('circle')
                    // .attr("transform", function (d) {
                    //     return `translate(${d.x},${d.y}) scale(${transform.k}))`;
                    // });
            }))
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
            .style('fill-opacity', d => d.children ? 0.2 : 1)
            .style("fill", (d) => d.children ? color(this.getBiggestChild(d.children)): color(d.data.name))
            ;

        getSelect.append("text")
            .attr("dy", ".3em")
            .attr("font-size", "10px")
            .style("text-anchor", "middle")
            .text((d) => d.data.name);

        getSelect.append("title")
            .text((d) => d.data.name);
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
