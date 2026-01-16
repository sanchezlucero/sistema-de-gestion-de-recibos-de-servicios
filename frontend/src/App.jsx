import "./App.css";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ¡No olvides los estilos!

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ borderRadius: "12px" }}
        theme="light"
      />
    </>
  );
}

export default App;
