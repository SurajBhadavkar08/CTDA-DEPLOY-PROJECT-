import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Info } from "lucide-react";
const UserActivityHeatmap = () => {
  const [data, setData] = useState({ x: [], y: [], z: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSortHeatmapData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/heatmap`);
        const result = await response.json();

        let { x, y, z } = result;

        // Convert x labels to a sortable format
        let indexedX = x.map((label, index) => {
          let parts = label.split("-").map(Number);
          let start = parts[0] === 0 ? 24 : parts[0]; // Handle "00-1" case as 24
          return { label, index, sortValue: start };
        });

        // Sort x labels based on numeric order
        indexedX.sort((a, b) => a.sortValue - b.sortValue);

        // Get sorted x values and their new order
        let sortedX = indexedX.map((item) => item.label);
        let sortedIndices = indexedX.map((item) => item.index);

        // Reorder z values based on sorted x indices
        let sortedZ = z.map((row) => sortedIndices.map((idx) => row[idx]));

        // Update state with sorted data
        setData({ x: sortedX, y, z: sortedZ });
      } catch (err) {
        console.error("Error fetching temporal stats:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortHeatmapData();
  }, []);

  // Plotly heatmap data
  const plotData = [
    {
      z: data.z,
      x: data.x,
      y: data.y,
      type: "heatmap",
      colorscale: "Viridis",
      colorbar: { title: "Activity" },
    },
  ];

  // Layout settings
  const layout = {
    title: "User Activity Heatmap",
    xaxis: { title: "Time Period", type: "category" },
    yaxis: { title: "Days of the Week", type: "category" },
    autosize: true,
    responsive: true,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200 shadow-sm">
          <Info className="w-5 h-5 mr-2 text-blue-500" />
          <span>
            Insufficient data available to generate a plot at the moment.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default UserActivityHeatmap;
