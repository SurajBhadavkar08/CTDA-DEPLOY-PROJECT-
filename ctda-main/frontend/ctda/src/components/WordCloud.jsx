import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
const WordCloud = () => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/wordcloud`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setImageData(data.wordcloud_image);
      })
      .catch((err) => {
        console.error("Error fetching word cloud:", err);
        setError(err.message || "Failed to fetch word cloud.");
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

  return (
    <div className="flex justify-center">
      {imageData ? (
        <div className="bg-white px-2 py-1">
          <img
            src={`data:image/png;base64,${imageData}`}
            alt="Word Cloud"
            className="my-2 max-w-full h-auto"
            style={{ maxHeight: "600px", aspectRatio: "4/3" }}
          />
        </div>
      ) : (
        <div className="my-2 items-center text-center">
          No word cloud available.
        </div>
      )}
    </div>
  );
};

export default WordCloud;
