import React, { useState, useEffect } from "react";
import { Menu, X, Home, List, Info, Github } from "lucide-react";
import Results from "./components/Results";
import { motion, AnimatePresence } from "framer-motion";
import logo_no_bg from "./assets/Logo_no_bg.png";
import logo from "./assets/Logo.png";
import Instructions from "./components/Instructions";
import Features from "./components/Features";
import FileUploader from "./components/FileUploader";

function App() {
  const [showResults, setShowResults] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [display, setDisplay] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleDisplay = (page) => {
    setDisplay(page);
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen />
      ) : showResults ? (
        <motion.div
          key={selectedUser}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Results
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
              <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div
                  onClick={() => handleDisplay("Home")}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <img src={logo} alt="CTDA logo" className="w-8 h-8" />
                  <span className="font-bold text-xl text-gray-900">CTDA</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                  <span
                    onClick={() => handleDisplay("Home")}
                    className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 cursor-pointer"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </span>
                  <span
                    onClick={() => handleDisplay("Features")}
                    className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 cursor-pointer"
                  >
                    <List className="w-5 h-5" />
                    <span>Features</span>
                  </span>
                  <span
                    onClick={() => handleDisplay("Instructions")}
                    className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 cursor-pointer"
                  >
                    <Info className="w-5 h-5" />
                    <span>Instructions</span>
                  </span>
                  <a
                    href="https://github.com/SurajBhadavkar08/Time-Series-Driven-Conversational-Analytics-for-Understanding-Temporal-Chat-Dynamics.git"
                    className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                  >
                    {isOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </nav>

              {/* Mobile Menu */}
              {isOpen && (
                <div className="md:hidden px-4 pb-4 space-y-4">
                  <span
                    onClick={() => {
                      handleDisplay("Home");
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </span>
                  <span
                    onClick={() => {
                      handleDisplay("Features");
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <List className="w-5 h-5" />
                    <span>Features</span>
                  </span>
                  <span
                    onClick={() => {
                      handleDisplay("Instructions");
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                  >
                    <Info className="w-5 h-5" />
                    <span>Instructions</span>
                  </span>
                  <a
                    href="https://github.com/SurajBhadavkar08/Time-Series-Driven-Conversational-Analytics-for-Understanding-Temporal-Chat-Dynamics.git"
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                </div>
              )}
            </header>

            {/* Home Page */}
            {display === "Home" ? (
              <>
                {/* Hero Section */}
                <div className="container mx-auto px-6 py-16 md:py-24">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                      Transform Your Chat Data Into
                      <span className="text-indigo-600">
                        {" "}
                        Actionable Insights
                      </span>
                    </h1>
                    <p className="text-xl text-gray-900/80 mb-8">
                      CTDA analyzes your professional conversations to uncover
                      patterns, topics, and interaction dynamics, helping you
                      make data-driven decisions.
                    </p>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="flex justify-center mb-16">
                  <FileUploader
                    onAnalyze={handleShowResults}
                    users={users}
                    setUsers={setUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            {/* Features Page */}
            {display === "Features" ? <Features /> : <></>}

            {/* Instructions Page */}
            {display === "Instructions" ? <Instructions /> : <></>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
        }}
        className="flex flex-col items-center space-y-1"
      >
        <img
          src={logo_no_bg}
          width={160}
          height={160}
          alt="CTDA Logo"
          className="drop-shadow-lg animate-bounce"
        />
        <div className="text-[#FFD700] text-5xl font-medium">
          <hr></hr>
          CTDA
        </div>
      </motion.div>
    </motion.div>
  );
};

export default App;
