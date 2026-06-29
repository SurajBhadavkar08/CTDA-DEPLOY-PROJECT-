import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { Info } from "lucide-react";
const MostFrequentEmojis = () => {
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/top-emojis`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const emojisList = Object.values(data[0]);
        const countsList = Object.values(data[1]);

        const emojisData = emojisList.map((emoji, index) => ({
          emoji,
          count: countsList[index],
        }));

        const sortedEmojis = emojisData.sort((a, b) => b.count - a.count);
        setEmojis(sortedEmojis);
      })
      .catch((err) => {
        console.error("Error fetching emojis:", err);
        setError(err.message || "Failed to fetch data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  // Stems (vertical sticks)
  const traceStems = emojis.map((emoji, index) => ({
    type: "scatter",
    mode: "lines",
    x: [index, index], // Each line is independent
    y: [0, emoji.count], // Vertical line
    line: { color: "#4F39F6", width: 3 }, // Lollipop stick color changed
    hoverinfo: "skip",
    showlegend: false, // Removes legend entry
  }));

  // Lollipop markers (tops)
  const traceMarkers = {
    type: "scatter",
    mode: "markers",
    x: emojis.map((_, index) => index),
    y: emojis.map((emoji) => emoji.count),
    text: emojis.map((emoji) => emoji.emoji),
    textposition: "top center",
    marker: {
      size: 16,
      color: "#FFB700",
      line: { color: "black", width: 2 },
    },
    showlegend: false, // Removes legend entry
  };

  const layout = {
    title: {
      text: "Most Frequent Emojis",
      font: { size: 20 },
      x: 0.5,
    },
    xaxis: {
      tickmode: "array",
      tickvals: emojis.map((_, index) => index),
      ticktext: emojis.map((emoji) => emoji.emoji),
      tickfont: { size: 20 },
    },
    yaxis: { title: "Frequency" },
    margin: { l: 50, r: 20, t: 50, b: 50 },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    showlegend: false, // Removes the legend
  };

  return (
    <div className="w-full p-4 shadow-md bg-white">
      <Plot
        data={[...traceStems, traceMarkers]}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default MostFrequentEmojis;
