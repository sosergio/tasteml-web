import React, { Component } from 'react'
//import './App.css'
import * as d3 from "d3";
import { select } from 'd3-selection';

class CirclePacking extends Component {
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
        const { data, width, height, zoomTransform } = props;
        const node = this.node;
        
        const color = name => this.state.tastes[name]? this.state.tastes[name][0] : '#000';

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(data, ([x, y]) => x)])
            .range([0, width]),
        this.yScale = d3.scaleLinear()
                .domain([0, d3.max(data, ([x, y]) => y)])
                .range([0, height]);

        let getSelect = d3.select(node)
            .selectAll('circle')
            .data(nodes.slice(1))
            .enter()
            .append("g")
            .attr("class", "node")
            .on('mouseup', this.onCircleSelect)
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

    onCircleSelect = ({...params}) => {
        if(this.props.onNodeSelect)
            this.props.onCircleSelect(params);
    }

    get transform() {
        const { x, y, zoomTransform } = this.props;
        let transform = "";
        if (zoomTransform) {
          transform = `translate(${x + zoomTransform.x}, ${y + zoomTransform.y}) scale(${zoomTransform.k})`;
        }
        return transform;
      }

    render() {
        return ( 
            <g transform={this.transform} ref="scatterplot">
                {data.map(([x, y]) => <circle cx={this.xScale(x)} cy={this.yScale(y)} r={4} />)}
            </g>
        );
    }
}
export default CirclePacking;
