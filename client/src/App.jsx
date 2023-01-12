import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import "./App.css";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Login from "./pages/Login";
import SingUp from "./pages/SignUp";
import { MantineProvider } from '@mantine/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import FavoriteBooks from "./pages/FavoriteBooks";


function App() {

  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/singup" element={<SingUp />} />
          <Route path="/favorites" element={<FavoriteBooks />} />
        </Routes>
        <Footer />
      </MantineProvider>
    </>
  );
}

export default App;
