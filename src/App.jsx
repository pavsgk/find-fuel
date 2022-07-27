import Header from "./components/Header/Header";
import styles from './App.module.scss';
import { Routes, Route } from 'react-router-dom';
import Main from "./pages/Main/Main";
import About from "./pages/About/About";

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
