import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Support from "./pages/Support";
import Tracking from "./pages/Tracking";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Exchanges from "./pages/Exchanges";
import Faq from "./pages/Faq";
import Account from "./pages/Account";
import ScrollToTop from "./components/ScrollToTop";


export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/suporte" element={<Support />} />
                  <Route path="/rastreamento" element={<Tracking />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/privacidade" element={<Privacy />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/trocas" element={<Exchanges />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/conta" element={<Account />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}