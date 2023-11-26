import { Outlet } from "react-router-dom";
import Chat from "../Chat/Chat";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Chat />
      <Footer />
    </>
  );
}

export default Layout;
