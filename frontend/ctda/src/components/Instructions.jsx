import React from 'react';
import instruction1 from "../assets/instruction1.png"
import instruction2 from "../assets/instruction2.png"
import instruction3 from "../assets/instruction3.png"
import instruction4 from "../assets/instruction4.png"
import instruction5 from "../assets/instruction5.png"

const steps = [
  {
    title: 'Step 1: Open Chat Options',
    description: 'Tap the 3 vertical dots at the top-right corner of your WhatsApp chat screen to open the menu.',
    image: instruction1, 
  },
  {
    title: 'Step 2: Select "More"',
    description: 'From the dropdown, tap on the "More" option to see additional chat actions.',
    image: instruction2,
  },
  {
    title: 'Step 3: Choose "Export Chat"',
    description: 'Tap on "Export Chat" to prepare your chat data for analysis.',
    image: instruction3,
  },
  {
    title: 'Step 4: Export Without Media',
    description: 'Choose the "Without Media" option to generate a clean .txt file of your conversation.',
    image: instruction4,
  },
  {
    title: 'Step 5: Upload on CTDA',
    description: 'Upload the exported .txt file on CTDA for analysis',
    image: instruction5,
  },
];

const Instructions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 lg:px-24">
      <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12">
        Step to follow before you can use CTDA
      </h1>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col lg:flex-row items-center gap-6"
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full lg:w-1/3 rounded-md border border-gray-200"
            />
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
                {step.title}
              </h2>
              <p className="text-gray-700 text-base">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructions;
