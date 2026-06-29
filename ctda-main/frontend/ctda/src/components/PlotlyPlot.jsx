import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Info } from "lucide-react";
const PlotlyPlot = (props) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(props.url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {


        const updatedData = data.data.map((trace) => ({
          ...trace,
          type: "bar",
          marker: {
            color: props.sen || "#4f39f6",
          },
        }));

        const updatedLayout = {
          ...data.layout,
          title: {
            text: data.layout.title?.text,
          },
          xaxis: {
            ...data.layout.xaxis,
            title: { ...data.layout.xaxis.title },
          },
          yaxis: {
            ...data.layout.yaxis,
            title: { ...data.layout.yaxis.title },
          },
          autosize: true,
          responsive: true,
        };

        

        setChartData({ data: updatedData, layout: updatedLayout });
      })
      .catch((err) => {
        console.error("Error fetching plot data:", err);
        setError(err.message || "Failed to fetch plot data.");
      })
      .finally(() => {
        setLoading(false);
      });
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
    <div className="w-full">
      {chartData ? (
        <Plot
          data={chartData.data}
          layout={chartData.layout}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default PlotlyPlot;
