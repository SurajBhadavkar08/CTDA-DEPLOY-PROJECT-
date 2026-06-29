import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Info } from "lucide-react";
const LollipopChart = ({ url, sen, color}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        const result = await response.json();

        // Extract and sort data
        const names = Object.values(result.percent);
        const values = Object.values(result.count);
        const sortedData = names
          .map((name, index) => ({ name, value: values[index] }))
          .sort((a, b) => b.value - a.value);

        setData(sortedData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

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

  // Assign numeric positions to Y-axis
  const yPositions = data.map((_, index) => index);

  // Adjust height dynamically
  const plotHeight = Math.max(400, data.length * 30);

  return (
    <Plot
      data={[
        // Stems (lines)
        {
          type: "scatter",
          mode: "lines",
          x: data.flatMap((d, i) => [0, d.value, null]),
          y: yPositions.flatMap((pos) => [pos, pos, null]),
          line: { color: color || "#4f39f6", width: 3 },
          hoverinfo: "none",
        },
        // Lollipop Heads (dots)
        {
          type: "scatter",
          mode: "markers",
          x: data.map((d) => d.value),
          y: yPositions,
          marker: {
            size: 10,
            color: "#ffd700",
            line: { width: 2, color: "#000" },
          },
          name: "Contributions",
        },
      ]}
      layout={{
        title: `Contributor Impact ${sen}`,
        xaxis: {
          title: "Contribution (%)",
          range: [0, Math.max(...data.map((d) => d.value)) + 5],
          showgrid: true,
          zeroline: true,
        },
        yaxis: {
          title: "",
          tickvals: yPositions,
          ticktext: data.map((d) => d.name),
          automargin: true,
        },
        showlegend: false,
        autosize: true,
        responsive: true,
        height: plotHeight,
        margin: { l: 120, r: 50, t: 50, b: 40 }, // More space for labels
      }}
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
};

export default LollipopChart;
