import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Client from './pages/Client';
import NewClient from './pages/NewClient';
import Home from './pages/Home';
import ProgramManagement from './pages/Program';
import MyPrograms from './pages/MyPrograms';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/clients" element={<Client />} />
            <Route path="/clients/new" element={<NewClient />} />
            <Route path="/programs" element={<ProgramManagement />} />
            <Route path="/my-programs" element={<MyPrograms />} />
            <Route path="/dashboard" element={<Dashboard />} />

            
            {/* Protected Routes */}
            {/* <Route path="/" element={<Dashboard />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;