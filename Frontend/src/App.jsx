import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/AdminRoutes';
import Homepage from './homepage/pages/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;