import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { Info } from "lucide-react";
const PieChart = (props) => {
  const [plotData, setPlotData] = useState([]);
  const [layout, setLayout] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(props.url);
      const data = await response.json();

      const gradientColors = [
        "#0A0F64",
        "#1B258A",
        "#2C3BAE",
        "#3E51D2",
        "#5167F6",
        "#6580FF",
        "#7B94FF",
        "#91A8FF",
        "#A8BDFF",
        "#C0D2FF",
        "#D9E6FF",
        "#F0F7FF",
      ];

      const processedData = [
        {
          labels: data.data[0].labels,
          values: data.data[0].values,
          type: "pie",
          hovertemplate: "%{label}: %{value} (%{percent})<extra></extra>",
          name: data.data[0].name,
          showlegend: true,
          marker: {
            colors: gradientColors,
            line: { color: "white", width: 1.5 }, // Slightly thicker for contrast
          },
          textinfo: "label+percent",
          insidetextorientation: "radial",
        },
      ];

      const structure = {
        title: {
          text: data.layout.title?.text || "Pie Chart",
          font: { color: "#333", size: 20, family: "Inter, sans-serif" },
        },
        paper_bgcolor: "white",
        plot_bgcolor: "white",
        font: { color: "#444", size: 14, family: "Inter, sans-serif" },
        legend: {
          font: { color: "#333", size: 14 },
          bgcolor: "rgba(255,255,255,0.8)",
          borderwidth: 0,
        },
        margin: { l: 20, r: 20, t: 50, b: 20 },
        autosize: true,
        responsive: true,
      };

      setPlotData(processedData);
      setLayout(structure);
    } catch (err) {
      console.error("Error fetching temporal stats:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.url]);

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
    <div className="w-full h-auto md:h-[500px]">
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PieChart;
