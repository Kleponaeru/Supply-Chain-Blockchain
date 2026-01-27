import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Test 1: Tailwind utilities */}
      <div className="bg-red-500 text-white p-4 text-xl font-bold mb-4 rounded-lg shadow-lg">
        If you see this red box, Tailwind is working!
      </div>

      {/* Test 2: Different colors */}
      <div className="bg-blue-600 text-white p-4 mb-4">
        Blue background test
      </div>

      {/* Test 3: Flexbox */}
      <div className="flex gap-4 mb-4">
        <div className="bg-green-500 p-4 flex-1">Green</div>
        <div className="bg-yellow-500 p-4 flex-1">Yellow</div>
        <div className="bg-purple-500 p-4 flex-1">Purple</div>
      </div>

      {/* Test 4: Inline style to compare */}
      <div
        style={{ backgroundColor: "orange", padding: "16px", color: "white" }}
      >
        This uses inline styles (should always work)
      </div>

      {/* Test 5: Check if CSS is loading at all */}
      <div className="mt-4 p-4 border-2 border-black">
        If Tailwind base styles loaded, this should have some default styling
      </div>
    </div>
  );
}

export default App;
