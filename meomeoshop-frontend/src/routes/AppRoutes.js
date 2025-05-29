import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminCategories from "../components/admin/AdminCategories";


export default function AppRoute() {
  return (
    <Router>
      <Routes>
       <Route path="/admin/categories" element={<AdminCategories />}/>
        {/* Route 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}