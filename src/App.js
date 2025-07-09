import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import QuotationForm from "./Components/Old/QuotationForm";
import ReleasedOrderForm from "./Components/Old/ReleasedOrderForm";
import NavBar from "./Components/NavBar";
import LandingPage from "./Components/LandingPage";
import AddEditClients from "./Components/Old/AddEditClients";
import AddEditPublisher from "./Components/Old/AddEditPublisher";
import AllClients from "./Components/Old/AllClients";
import AllPublisher from "./Components/Old/AllPublisher";
import AllBills from "./Components/Old/AllBills";
import UserLogin from "./Components/AuthComponents/UserLogin";
import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ReleasedOrderView from "./Components/ReleasedOrderView/ReleasedOrderView";
import ReleasedOrderPDF from "./Components/ReleasedOrderView/ReleasedOrderView";
import axios from "axios";
import ROAndQFGeneration from "./Components/ROAndQGeneration/ROAndQFGeneration";
import AllReleasedOrders from "./Components/AllReleaseOrderNew";
import BillGeneration from "./Components/BillGeneration";
import AllBillsNew from "./Components/AllBillsNew";
import AllQuotationForm from "./Components/Old/AllQuotationsOld";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState("false");

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/admin`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status !== 200) {
          throw new Error("Authentication failed");
        }
        const data = response.data;
        console.log(data);
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthenticated(false);
      }
    };

    authenticate();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <div className="App bg-slate-200">
          {isAuthenticated && <NavBar />}
          <div className="flex w-screen">
            {isAuthenticated && (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            )}
            <div className="h-[90vh] transition ease-in-out duration-200 overflow-y-auto">
              <Routes>
                {isAuthenticated && (
                  <>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/quotation-form" element={<QuotationForm />} />
                    <Route
                      path="/released-order-form"
                      element={<ReleasedOrderForm />}
                    />
                    <Route
                      path="/add-edit-clients"
                      element={<AddEditClients />}
                    />
                    <Route
                      path="/add-edit-publishers"
                      element={<AddEditPublisher />}
                    />
                    <Route path="/all-clients" element={<AllClients />} />
                    <Route path="/all-publishers" element={<AllPublisher />} />
                    <Route path="/all-ro" element={<AllReleasedOrders />} />
                    <Route
                      path="/all-quotations"
                      element={<AllQuotationForm />}
                    />

                    <Route path="/all-bills" element={<AllBillsNew />} />
                    <Route
                      path="/ro-generation"
                      element={<ROAndQFGeneration />}
                    />
                    <Route
                      path="/bill-generation"
                      element={<BillGeneration />}
                    />

                    <Route path="/ro-view" element={<ReleasedOrderPDF />} />

                    <Route path="*" element={<Navigate replace to="/" />} />
                  </>
                )}

                <>
                  <Route
                    path="/signin"
                    element={
                      <UserLogin
                        isAuthenticated={isAuthenticated}
                        setIsAuthenticated={setIsAuthenticated}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate replace to="/signin" />} />
                </>
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
