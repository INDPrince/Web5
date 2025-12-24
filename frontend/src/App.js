import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import Home from "@/pages/Home";
import GitPush from "@/pages/GitPush";
import Watch from "@/pages/Watch";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gitpush" element={<GitPush />} />
          <Route path="/watch" element={<Watch />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
