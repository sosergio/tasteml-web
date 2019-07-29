import * as d3 from 'd3';

class D3CirclePacking {

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
      // .call(d3.zoom().on("zoom", () => {
      //   this.svg.attr("transform", d3.event.transform)
      // }))
      .style('background', 'radial-gradient(#f1f4f7, #091426)')
      .attr('width', width)
      .attr('height', height);

    this.updateDatapoints();
  }

  getBiggestChild(children){
    let biggest = children[0];
    for(let c of children){
        if(c.data.size > biggest.data.size) biggest = c
    }
    return biggest.data.name
  }

  getColorFromTasteName = name => this.props.tastes[name] ? this.props.tastes[name][0] : '#000';

  getColorForNode = (d) => d.children ? this.getColorFromTasteName(this.getBiggestChild(d.children)) : this.getColorFromTasteName(d.data.name)

  updateDatapoints = () => {
    const {
      data,
      width,
      height
    } = this.props;
    
    const packLayout = d3.pack()
      .size([width, height])
      .padding((d) => d.height === 0 ? 0 : (d.height === 1 ? 10 : 100));

    const root = d3.hierarchy(data)
      .sum(d => d.size)
      .sort((a, b) => a.value - b.value);

    packLayout(root);
    const nodes = root.descendants();

    let getSelect = this.svg.selectAll('circle')
      .data(nodes.slice(1))
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("data-index", (d, i, j) => i)
      .on('mouseup', (d, i, nodes) => this.onNodeMouseUp(d, i, nodes[i]))
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    getSelect.append("circle")
      .attr('r', d => d.r)
      .style('padding', '0px')
      .style('fill-opacity', d => d.children ? 0.5 : 1)
      .style("fill", (d) => this.getColorForNode(d));

    getSelect.append("text")
      .attr("dy", ".3em")
      .attr("font-size", (d) => `${Math.max(d.data.size/35, 7)}px`)
      .style("text-anchor", "middle")
      .text(d => d.children ? null : d.data.name);
  }

  onNodeMouseUp = (d) => {
    //d3.select(node).style('fill', 'yellow');
    console.log(d)
    if(this.props.onNodeSelect) this.props.onNodeSelect(d);
  }

  resize = (width, height) => {
    const {
      svg
    } = this;
    svg.attr('width', width)
      .attr('height', height);
  }
}

export default D3CirclePacking;