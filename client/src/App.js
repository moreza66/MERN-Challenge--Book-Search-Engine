import {Routes, Route } from "react-router-dom"
import Login from "./pages/Login";
import Footer from "./pages/Footer";
import Header from "./pages/Header";
import { MantineProvider } from '@mantine/core';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <Header />
        <Routes>
          <Route path="/" element={<Login/>} />
        </Routes>
        <Footer />
      </MantineProvider>
  )



}


export default App;
