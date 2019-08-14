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
      height,
      selectedName,
      data
    } = props;

    const packLayout = d3.pack()
      .size([width, height])
      .padding((d) => d.height === 0 ? 0 : (d.height === 1 ? 10 : 100));

    const root = d3.hierarchy(data)
      .sum(d => d.size)
      .sort((a, b) => a.value - b.value);

    packLayout(root);
    this.descendants = root.descendants().slice(1);

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

  getBiggestChild(children) {
    let biggest = children[0];
    for (let c of children) {
      if (c.data.size > biggest.data.size) biggest = c
    }
    return biggest.data.name
  }

  getColorFromTasteName = name => this.props.tastes[name] ? this.props.tastes[name][0] : '#000';

  getColorForNode = (d) => d.children ? this.getColorFromTasteName(this.getBiggestChild(d.children)) : this.getColorFromTasteName(d.data.name)

  isNodeSelected = (d) => d && d.children && this.props.selectedName == d.data.name;

  updateDatapoints = () => {
    const {
      descendants,
    } = this;

    let getSelect = this.svg.selectAll('circle')
      .data(descendants)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("data-index", (d, i, j) => i)
      .on('mouseenter', function (d, i, nodes) {
        if (!d.children) return
        let node = d3.select(this);
        const tx = node.attr('transform') + " scale(1.1,1.1)";
        d3.select(this)
          .transition()
          //.ease(d3.easeBounce)           // control the speed of the transition
          .duration(200)
          .attr("transform", tx)
      })
      .on('mouseleave', function (d, i, nodes) {
        if (!d.children) return
        let node = d3.select(this);
        let tx = node.attr('transform');
        const ix = tx.indexOf('scale');
        if (ix == -1) return
        tx = tx.substring(0, ix);
        d3.select(this)
          .transition()
          //.ease(d3.easeBounce)           // control the speed of the transition
          .duration(200)
          .attr("transform", tx)
      })
      .on('mouseup', (d, i, nodes) => this.onNodeMouseUp(d, i, nodes[i]))
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    getSelect.append("circle")
      .attr('r', d => d.r)
      .style('padding', '0px')
      .style('fill-opacity', d => d.children ? 0.5 : 1)
      .style("fill", d => this.getColorForNode(d))
      .style('stroke', d => this.isNodeSelected(d) ? this.getColorForNode(d) : null)
      .style('stroke-width', d => this.isNodeSelected(d) ? '8' : null)
      .style('stroke-opacity', d => this.isNodeSelected(d) ? '0.7' : null)

    getSelect.append("text")
      .attr("dy", ".3em")
      .attr("font-size", (d) => `${Math.max(d.data.size/35, 7)}px`)
      .style("text-anchor", "middle")
      .text(d => d.children ? null : d.data.name);
  }

  onNodeMouseUp = (d) => {
    if (this.props.onNodeSelect) this.props.onNodeSelect(d);
  }

  resize = (width, height) => {
    const {
      svg
    } = this;
    svg.attr('width', width)
      .attr('height', height);
  }


  setSelected = (name) => {
    console.log('D3CirclePacking setSelected with name', name)
    this.props.selectedName = name;
    d3.selectAll("circle")
      .transition()
      .style('stroke', d => this.isNodeSelected(d) ? this.getColorForNode(d) : null)
      .style('stroke-width', d => this.isNodeSelected(d) ? '8' : null)
      .style('stroke-opacity', d => this.isNodeSelected(d) ? '0.7' : null)
  }
}

export default D3CirclePacking;