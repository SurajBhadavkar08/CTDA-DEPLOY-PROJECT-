import React, { useState, useEffect } from "react";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Link,
  Image,
  MessageSquare,
  Text,
  ListIcon,
  Info,
} from "lucide-react";

const formatWeekRange = (dateRange) => {
  if (!dateRange) return "N/A";

  const dates = dateRange.split(" - ");
  if (dates.length !== 2) return dateRange;

  const [start, end] = dates;
  const [startDay, startMonth, startYear] = start.split("/");
  const [endDay, endMonth, endYear] = end.split("/");

  return startYear === endYear
    ? `${startDay}/${startMonth} - ${endDay}/${endMonth} (${startYear})`
    : `${startDay}/${startMonth} (${startYear}) - ${endDay}/${endMonth} (${endYear})`;
};

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [temporalStats, setTemporalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [topStatsResponse, temporalStatsResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/top-stats`),
        fetch(`${import.meta.env.VITE_API_URL}/temporal-stats`),
      ]);

      if (!topStatsResponse.ok || !temporalStatsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [topStatsData, temporalStatsData] = await Promise.all([
        topStatsResponse.json(),
        temporalStatsResponse.json(),
      ]);

      setStats(topStatsData);
      setTemporalStats(temporalStatsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-600 border-b-2"></div>
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
    <div className="bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center my-3">
          <ListIcon className="mr-2" /> Statistical Overview
        </h1>

        {/* Top Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-20 mb-8">
          <StatCard
            icon={<Text size={30} className="text-indigo-600" />}
            value={stats?.num_words || "0"}
            label="Words"
          />
          <StatCard
            icon={<MessageSquare size={30} className="text-indigo-600" />}
            value={stats?.num_messages || "0"}
            label="Messages"
          />
          <StatCard
            icon={<Link size={30} className="text-indigo-600" />}
            value={stats?.num_links || "0"}
            label="Links"
          />
          <StatCard
            icon={<Image size={30} className="text-indigo-600" />}
            value={stats?.num_media_messages || "0"}
            label="Media"
          />
        </div>

        {/* Temporal Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-20">
          <StatCard
            icon={<Calendar size={28} className="text-indigo-600" />}
            value={temporalStats?.busiest_day || "N/A"}
            label="Busiest Day"
            extra={`${
              temporalStats?.busiest_day_message_count || "0"
            } Messages`}
          />
          <StatCard
            icon={<CalendarRange size={28} className="text-indigo-600" />}
            value={formatWeekRange(temporalStats?.busiest_week)}
            label="Busiest Week"
            extra={`${
              temporalStats?.busiest_week_message_count || "0"
            } Messages`}
          />
          <StatCard
            icon={<CalendarDays size={28} className="text-indigo-600" />}
            value={temporalStats?.busiest_month || "N/A"}
            label="Busiest Month"
            extra={`${
              temporalStats?.busiest_month_message_count || "0"
            } Messages`}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, extra }) => {
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md border border-gray-300 transition-all hover:shadow-2xl cursor-pointer">
      <div className="p-2 rounded-full">{icon}</div>
      <h1 className="text-xl font-semibold text-gray-900 mt-2">{value}</h1>
      <p className="text-sm text-gray-600">{label}</p>
      {extra && <span className="text-xs text-gray-500 mt-1">{extra}</span>}
    </div>
  );
};

export default Stats;
