import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // Routes ayrı dosyada

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
