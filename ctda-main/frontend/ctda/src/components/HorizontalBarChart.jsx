import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Info } from "lucide-react";
const HorizontalBarChart = ({ apiUrl }) => {
  const [data, setData] = useState(null);
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          throw new Error("No data available for plotting.");
        }

        const chartData = res.data[0]; // Extract the first dataset
        const xlabel = res.layout.yaxis.title.text;
        const ylabel = res.layout.xaxis.title.text;
        const title = res.layout.title.text;

        setLayout({
          xlabel: xlabel,
          ylabel: ylabel,
          title: title,
        });

        setData({
          labels: chartData.x.reverse(), // User names (reversed for better readability)
          values: chartData.y.reverse(), // Message counts
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

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
    <div className="w-full p-4 shadow-md bg-white">
      <Plot
        data={[
          {
            type: "bar",
            x: data.values, // Message counts (horizontal axis)
            y: data.labels, // User names (vertical axis)
            text: data.values.map((count) => `${count}`),
            textposition: "auto",
            orientation: "h", // Horizontal bar chart
            marker: {
              color: "#4f39f6",
            },
          },
        ]}
        layout={{
          title: layout.title,
          xaxis: { title: layout.xlabel },
          yaxis: { title: layout.ylabel, automargin: true },
          showlegend: false,
          bargap: 0, // Adds spacing between bars without reducing bar width
          bargroupgap: 0.5, // Increases vertical spacing between bars
          margin: { l: 50, r: 20, t: 50, b: 30 },
          paper_bgcolor: "white",
          plot_bgcolor: "white",
        }}
        style={{ width: "100%", height: "100%" }} // Adjust height to maintain spacing
      />
    </div>
  );
};

export default HorizontalBarChart;
