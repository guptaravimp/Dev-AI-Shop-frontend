import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/config';

function TestConnection() {
  const [testText, setTestText] = useState('show me jeans');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pingResult, setPingResult] = useState(null);
  const [customUrl, setCustomUrl] = useState(API_ENDPOINTS.PREDICT_INTENT);

  const testPing = async () => {
    setPingResult(null);
    try {
      const baseUrl = customUrl.replace('/predict-intent', '');
      console.log("Testing ping to:", baseUrl);
      
      const response = await axios.get(baseUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'text/html,application/json'
        }
      });
      
      setPingResult({
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      setPingResult({
        success: false,
        error: error.message,
        status: error.response?.status
      });
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing connection to:", customUrl);
      
      const response = await axios.post(customUrl, {
        text: testText
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Success! Response:", response.data);
      setResult(response.data);
    } catch (error) {
      console.error("Connection failed:", error);
      setError({
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Python Backend Connection Test</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Python Backend URL:</label>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter your Render URL here"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current: {API_ENDPOINTS.PREDICT_INTENT}
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={testPing}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
          >
            Test Ping (Check if server is reachable)
          </button>
          
          {pingResult && (
            <div className={`mt-2 p-3 rounded ${pingResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-semibold ${pingResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {pingResult.success ? '✅ Server is reachable!' : '❌ Server not reachable'}
              </p>
              {pingResult.status && <p className="text-sm">Status: {pingResult.status}</p>}
              {pingResult.error && <p className="text-sm text-red-600">Error: {pingResult.error}</p>}
              {pingResult.data && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Response:</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(pingResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Test Text:</label>
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter text to test"
          />
        </div>

        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>

        {loading && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-blue-700">Testing connection...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded">
            <h3 className="font-semibold text-red-700 mb-2">Connection Failed</h3>
            <div className="text-sm text-red-600">
              <p><strong>Error:</strong> {error.message}</p>
              {error.status && <p><strong>Status:</strong> {error.status} {error.statusText}</p>}
              {error.url && <p><strong>URL:</strong> {error.url}</p>}
              {error.data && <p><strong>Response:</strong> {JSON.stringify(error.data, null, 2)}</p>}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 rounded">
            <h3 className="font-semibold text-green-700 mb-2">Connection Successful!</h3>
            <div className="text-sm text-green-600">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded">
          <h3 className="font-semibold text-yellow-700 mb-2">Troubleshooting Steps:</h3>
          <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
            <li>Go to your Render dashboard</li>
            <li>Find your Python service</li>
            <li>Copy the exact URL (should end with .onrender.com)</li>
            <li>Paste it in the URL field above</li>
            <li>Click "Test Ping" to check if server is reachable</li>
            <li>If ping works, click "Test API Connection"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TestConnection; 