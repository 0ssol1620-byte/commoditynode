// CommodityNode Impact Graph - D3.js
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('impact-graph');
  if (!container) return;
  
  const width = container.clientWidth;
  const height = 400;
  
  // Sample data structure
  const data = window.COMMODITY_DATA || {
    nodes: [
      { id: "oil", label: "Crude Oil ↑15%", type: "commodity" },
      { id: "airlines", label: "Airlines", type: "negative", impact: -12 },
      { id: "refiners", label: "Refiners", type: "positive", impact: +8 },
      { id: "logistics", label: "Logistics", type: "negative", impact: -6 },
      { id: "ev", label: "EV Makers", type: "positive", impact: +15 },
      { id: "plastics", label: "Plastics", type: "negative", impact: -4 },
      { id: "renewables", label: "Renewables", type: "positive", impact: +10 },
    ],
    links: [
      { source: "oil", target: "airlines" },
      { source: "oil", target: "refiners" },
      { source: "oil", target: "logistics" },
      { source: "oil", target: "ev" },
      { source: "oil", target: "plastics" },
      { source: "oil", target: "renewables" },
    ]
  };
  
  const svg = d3.select(container).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);
  
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40));
  
  // Links
  const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke", "#3f3f46")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", d => {
      const target = data.nodes.find(n => n.id === (d.target.id || d.target));
      return target && target.type === "negative" ? "5,5" : "none";
    });
  
  // Nodes
  const node = svg.append("g")
    .selectAll("g")
    .data(data.nodes)
    .join("g")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));
  
  node.append("circle")
    .attr("r", d => d.type === "commodity" ? 30 : 22)
    .attr("fill", d => {
      if (d.type === "commodity") return "#fbbf24";
      if (d.type === "positive") return "#22c55e";
      if (d.type === "negative") return "#ef4444";
      return "#22d3ee";
    })
    .attr("stroke", "#18181b")
    .attr("stroke-width", 2)
    .style("cursor", "pointer");
  
  node.append("text")
    .text(d => d.label)
    .attr("text-anchor", "middle")
    .attr("dy", d => d.type === "commodity" ? 45 : 35)
    .attr("fill", "#e4e4e7")
    .attr("font-size", d => d.type === "commodity" ? "13px" : "11px")
    .attr("font-weight", d => d.type === "commodity" ? "700" : "400");
  
  // Impact labels
  node.filter(d => d.impact)
    .append("text")
    .text(d => (d.impact > 0 ? "+" : "") + d.impact + "%")
    .attr("text-anchor", "middle")
    .attr("dy", 5)
    .attr("fill", "#18181b")
    .attr("font-size", "11px")
    .attr("font-weight", "700");
  
  simulation.on("tick", () => {
    link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });
  
  function dragstarted(event) { if (!event.active) simulation.alphaTarget(0.3).restart(); event.subject.fx = event.subject.x; event.subject.fy = event.subject.y; }
  function dragged(event) { event.subject.fx = event.x; event.subject.fy = event.y; }
  function dragended(event) { if (!event.active) simulation.alphaTarget(0); event.subject.fx = null; event.subject.fy = null; }
});
