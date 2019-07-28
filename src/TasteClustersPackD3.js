import * as d3 from 'd3';

class TasteClustersPackD3 {

  containerEl;
  props;
  svg;

  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const {
      width,
      height
    } = props;
    this.svg = d3.select(containerEl)
      .append('svg')
      .style('background-color', 'white')
      .attr('width', width)
      .attr('height', height);
    this.updateDatapoints();
    

  }

  updateDatapoints = () => {
    const {
      svg,
      props: {
        data,
        width,
        height
      }
    } = this;

    const root = d3.hierarchy(data)
      .sum(d => d.size)
      .sort((a, b) => b.size - a.size);
    
    const packLayout = d3.pack()
      .size([width, height])
      .padding(5);
    
    packLayout(root);
    const nodes = root.descendants();

    svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
    // svg.selectAll('.node')
    //   .data(nodes)
    //   .join('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .style('fill-opacity', d => d.children ? 0.05 : 0.7);
      // .enter()
      // .append('circle')
      // .style('fill', 'red')
      // .attr('cx', () => Math.random() * width)
      // .attr('cy', () => Math.random() * height)
      // .attr('r', 10)
      // .on('mouseup', (d, i, nodes) => this.setActiveDatapoint(d, nodes[i]));
  }

  setActiveDatapoint = (d, node) => {
    d3.select(node).style('fill', 'yellow');
    this.props.onDatapointClick(d);
  }

  resize = (width, height) => {
    const {
      svg
    } = this;
    svg.attr('width', width)
      .attr('height', height);
    svg.selectAll('circle')
      .attr('cx', () => Math.random() * width)
      .attr('cy', () => Math.random() * height);
  }
}

export default TasteClustersPackD3;