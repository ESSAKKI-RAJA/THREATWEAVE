import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export function SupplyChainGraph({
  vendorId,
  dependencies,
}: {
  vendorId: string;
  dependencies: any[];
}) {
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [
      {
        id: vendorId,
        position: { x: 250, y: 50 },
        data: { label: "Root Vendor" },
        style: { background: "#1e1e2d", color: "#fff", border: "1px solid #333" },
      },
    ];

    const initialEdges: Edge[] = [];

    dependencies.forEach((dep, index) => {
      const risk = dep.vendors?.risk_score || 0;
      let bgColor = "#1e1e2d";
      if (risk >= 70)
        bgColor = "#ef4444"; // Red
      else if (risk >= 40)
        bgColor = "#f59e0b"; // Yellow
      else if (risk > 0) bgColor = "#10b981"; // Green

      const targetId = dep.target_vendor_id;

      initialNodes.push({
        id: targetId,
        position: { x: 100 + index * 200, y: 200 },
        data: { label: dep.vendors?.domain || targetId.slice(0, 8) },
        style: {
          background: bgColor,
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "5px",
          padding: "10px",
        },
      });

      initialEdges.push({
        id: `e-${vendorId}-${targetId}`,
        source: vendorId,
        target: targetId,
        animated: true,
        style: { stroke: "#888" },
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [vendorId, dependencies]);

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
