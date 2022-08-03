import Header from "./components/Header/Header";
import styles from './App.module.scss';
import { Routes, Route } from 'react-router-dom';
import Main from "./pages/Main/Main";
import About from "./pages/About/About";
import { Provider } from "react-redux"
import store from "./store/store";


function App() {  

  return (
    <div className={styles.App}>
      <Provider store={store}>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
