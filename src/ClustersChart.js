import React, { Component } from 'react'
import * as d3 from "d3";
import { withStyles } from '@material-ui/core/styles';
import CirclePacking from './CirclePacking'

const styles = theme => ({
    root:{
        background:'radial-gradient(#f1f4f7, #091426)'
    }
  });

class ClustersChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            tastes: this.props.tastes,
            zoomTransform: null
        };
        
        this.zoom = d3.zoom()
                  .scaleExtent([-5, 5])
                  .translateExtent([[-100, -100], [props.width+100, props.height+100]])
                  .extent([[-100, -100], [props.width+100, props.height+100]])
                  .on("zoom", this.zoomed.bind(this));
    }

    packData(){
        const {width, height} = this.props;
        const packLayout = d3.pack()
            .size([width, height])
            .padding((d) => d.height === 0 ? 0 : (d.height === 1 ? 10 : 100)); //d.r / 0.35 : 3);

        const root = d3.hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => a.value - b.value);

        packLayout(root);
        const nodes = root.descendants().slice(1);
        this.setState({
            ...this.state,
            data: nodes
        });

        d3.select(this.refs.svg)
          .call(this.zoom)
    }

    componentDidMount() {
        this.packData();
    }
    componentDidUpdate() {
        this.packData();
    }

    zoomed() {
        this.setState({ 
            ...this.state,
            zoomTransform: d3.event.transform
        });
    }

    onNodeSelect = () => {
        const isCluster = refData.depth === 1;
        const d = isCluster ? refData.data : refData.parent.data;
        // let domNode = d3.select(nodes[i]);
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
        const { zoomTransform } = this.state,
            { classes, width, height } = this.props;
        return ( 
            <svg className={classes.root} width={width} height={height} ref="svg">
                <CirclePacking data={this.state.data}
                            x={0} y={0} 
                            width={width}
                            height={height}
                            zoomTransform={zoomTransform} />
            </svg>
        );
    }
}
export default withStyles(styles)(ClustersChart);
