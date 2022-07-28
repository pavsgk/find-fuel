import Header from "./components/Header/Header";
import styles from './App.module.scss';
import { Routes, Route } from 'react-router-dom';
import Main from "./pages/Main/Main";
import About from "./pages/About/About";
import { useState } from "react";

function App() {
  
  const [defaultPosition, setDefaultPosition] = useState({defaultCenter: [50.450001, 30.523333], defaultZoom: 14});
  const updatePosition = ({center, zoom}) => {
    setDefaultPosition({defaultCenter: center, defaultZoom: zoom})
  };

  return (
    <div className={styles.App}>
      <Header />
      <Routes>
        <Route path="/" element={<Main defaultPosition={defaultPosition} updatePosition={updatePosition}/>} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
