// src/pages/graph.jsx
'use client';
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import graphData from "@/data/graph.json";

export default function GraphPage() {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "black");

    svg.selectAll("*").remove(); // Clear previous render

    // Simulation with tighter spacing
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(30)) // Reduced from 50 to 30
      .force("charge", d3.forceManyBody().strength(-50)) // Less repulsion
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append("g")
      .attr("stroke", "#555")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", d => d.similarity * 2);

    // Draw nodes
    const node = svg.append("g")
      .attr("fill", "#00ffff")
      .selectAll("circle")
      .data(graphData.nodes)
      .join("circle")
      .attr("r", 8) // Increased size from 5 to 8
      .call(drag(simulation));

    // Tooltip with node ID
    node.append("title").text(d => `ID: ${d.id}`);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

    // Drag functions
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, []);

  return (
    <div style={{ padding: "20px", background: "#000", minHeight: "100vh" }}>
      <h2 style={{ color: "#fff" }}>Similarity Graph</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}
