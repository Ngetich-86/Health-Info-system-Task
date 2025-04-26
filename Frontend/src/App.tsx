import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/login" element={<Login />} /> */}
            
            {/* Protected Routes */}
            {/* <Route path="/" element={<Dashboard />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;