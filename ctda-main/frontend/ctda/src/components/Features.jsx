import React from "react";
import {
  BarChart3,
  MessageSquare,
  Brain,
  Clock,
  Smile,
  Users,
} from "lucide-react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-indigo-500/20 transition duration-300 group cursor-pointer flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold group-hover:text-indigo-500 transition duration-200">
        {title}
      </h3>
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <>
      {/* Features Section */}
      <section className="min-h-screen w-full bg-white text-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            CTDA Feature Highlights
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-16">
            From chat exports to structured insights — discover what your
            conversations reveal.
          </p>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<MessageSquare className="w-10 h-10 text-indigo-600" />}
              title="Chat Analysis"
              description="Process and analyze exported chat data from WhatsApp and other platforms with ease."
            />
            <FeatureCard
              icon={<Brain className="w-10 h-10 text-indigo-600" />}
              title="Topic Modeling"
              description="Automatically identify key topics and themes from your conversations."
            />
            <FeatureCard
              icon={<BarChart3 className="w-10 h-10 text-indigo-600" />}
              title="Visual Insights"
              description="View beautiful, interactive visualizations of your conversation patterns."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10 text-indigo-600" />}
              title="Time-Based Trends"
              description="See who’s most active when and identify peak conversation windows."
            />
            <FeatureCard
              icon={<Smile className="w-10 h-10 text-indigo-600" />}
              title="Sentiment Analysis"
              description="Detect the tone of messages across the entire chat — positive, negative, or neutral."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-indigo-600" />}
              title="User-Level Breakdown"
              description="Get detailed insights for each participant — from message counts to personal sentiment trends and engagement timelines."
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
