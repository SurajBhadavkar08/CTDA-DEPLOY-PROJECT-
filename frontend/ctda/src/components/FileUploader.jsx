import React, { useState } from "react";

const FileUploader = ({ onAnalyze , users,setUsers,selectedUser, setSelectedUser}) => {
  const [file, setFile] = useState(null);
  // const [users, setUsers] = useState([]);
  // const [selectedUser, setSelectedUser] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    const file = event.target.files[0];

    if (file) {
      setLoadingFile(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
        setLoadingFile(false);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setFileContent("");
    setFile(null);
    setUsers([]);
    setSelectedUser("");
    setLoadingFile(false);
    setLoadingUsers(false);
    setFeedback(""); // Clear feedback
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoadingUsers(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserSelection = async (event) => {
    const selected = event.target.value;
    setSelectedUser(selected);
    setFeedback(""); // Clear previous feedback

    if (selected) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/set-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: selected }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to set user");
        }

        setFeedback(data.message); // Display feedback from API
      } catch (error) {
        console.error("Error setting user:", error);
        setFeedback("Failed to set user. Try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full md:w-[700px] bg-[#fafafa] rounded-b-md p-4 border border-[#364C63]/10 shadow-lg">
      <div className="flex flex-col justify-center items-center text-gray-900 rounded-lg p-6 w-full max-w-md sm:max-w-lg md:max-w-3xl">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-gray-900">
          Upload Your Conversation
        </h2>

        {!fileContent && (
          <label className="inline-block cursor-pointer my-2 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#2a3b4e] transition duration-200 w-full sm:w-auto text-center border border-gray-900/20">
            Upload
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}

        <div className="mt-4 w-full">
          {loadingFile ? (
            <div className="flex justify-center items-center h-60 sm:h-72 md:h-80 lg:h-84 max-h-80 bg-[#fafafa] text-gray-900 p-4 rounded-md shadow-md">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            fileContent && (
              <>
                <pre className="h-60 sm:h-72 md:h-80 lg:h-84 max-h-80 bg-white text-gray-900 p-4 rounded-md shadow-md overflow-y-auto text-left border border-gray-900/10">
                  {fileContent}
                </pre>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-start mt-3">
                  <button
                    onClick={handleUpload}
                    disabled={loadingUsers}
                    className={`mt-2 sm:mt-0 px-5 py-2 rounded-lg cursor-pointer shadow-md transition duration-200 w-full sm:w-auto sm:mr-2 ${
                      loadingUsers
                        ? "bg-gray-400 text-gray-900 cursor-not-allowed"
                        : " bg-gray-900 text-white hover:bg-[#2a3b4e] border border-gray-900/20"
                    }`}
                  >
                    {loadingUsers ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                        Fetching Users...
                      </div>
                    ) : (
                      "Get Users"
                    )}
                  </button>

                  <button
                    onClick={handleRemoveFile}
                    className="mt-2 sm:mt-0 bg-gray-900 cursor-pointer text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#2a3b4e] transition duration-200 w-full sm:w-auto border border-gray-900/20"
                  >
                    Remove
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="mt-4 w-full flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  users.length > 0 && (
                    <div className="mt-4 w-full cursor-pointer">
                      <label className="block text-sm font-semibold">
                        Select a User:
                      </label>
                      <select
                        value={selectedUser}
                        onChange={handleUserSelection}
                        className="border p-2 rounded w-full mt-1 bg-white text-gray-900 border-gray-900/20"
                      >
                        <option value="">-- Choose a user --</option>
                        {users.map((user, index) => (
                          <option key={index} value={user}>
                            {user}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}

                {feedback && (
                  <div className="">
                    <p className="mt-2 text-lg text-indigo-600 font-semibold">{feedback}</p>
                    <div className="rounded-md">
                      <button
                        onClick={onAnalyze}
                        className="mt-4 bg-gray-900 cursor-pointer text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#2a3b4e] transition duration-200 w-full sm:w-auto border border-gray-900/20"
                      >
                        Analyze
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
