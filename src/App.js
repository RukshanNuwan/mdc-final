import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./App.css";
import Login from "./pages/login/Login";
import Protected from "./routes/Protected";
import Home from "./pages/home/Home";
import Index from "./pages";
import WetSection from "./pages/wetSection/WetSection";
import WetDetails from "./pages/wetSection/WetDetails";
import NewWet from "./pages/wetSection/NewWet";
import CutterSection from "./pages/cutterSection/CutterSection";
import NewCutter from "./pages/cutterSection/NewCutter";
import CutterDetails from "./pages/cutterSection/CutterDetails";
import MixingSection from "./pages/mixingSection/MixingSection";
import MixingDetails from "./pages/mixingSection/MixingDetails";
import NewMixing from "./pages/mixingSection/NewMixing";
import SprayDryerSection from "./pages/sprayDryerSection/SprayDryerSection";
import SprayDryerDetails from "./pages/sprayDryerSection/SprayDryerDetails";
import NewSprayDryer from "./pages/sprayDryerSection/NewSprayDryer";
import LaboratorySection from "./pages/laboratory/LaboratorySection";
import LaboratoryDetails from "./pages/laboratory/LaboratoryDetails";
import NewLaboratory from "./pages/laboratory/NewLaboratory";
import Orders from "./pages/orders/Orders";
import UpdateWet from "./pages/wetSection/UpdateWet";
import UpdateCutter from "./pages/cutterSection/UpdateCutter";
import UpdateMixing from "./pages/mixingSection/UpdateMixing";
import UpdateLaboratory from "./pages/laboratory/UpdateLaboratory";
import UpdateSprayDryer from "./pages/sprayDryerSection/UpdateSprayDryer";
import Reports from "./pages/Reports";

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <div className="contentContainer">
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Protected />}>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Home />} />

            <Route path="wet-section">
              <Route index element={<WetSection />} />
              <Route path="view" element={<WetDetails />} />
              <Route path="new" element={<NewWet />} />
              <Route path="update" element={<UpdateWet />} />
            </Route>

            <Route path="cutter-section">
              <Route index element={<CutterSection />} />
              <Route path="view" element={<CutterDetails />} />
              <Route path="new" element={<NewCutter />} />
              <Route path="update" element={<UpdateCutter />} />
            </Route>

            <Route path="mixing-section">
              <Route index element={<Index />} />
              <Route path=":location" element={<MixingSection />} />
              <Route path=":location/view" element={<MixingDetails />} />
              <Route path=":location/new" element={<NewMixing />} />
              <Route path=":location/update" element={<UpdateMixing />} />
            </Route>

            <Route path="sd-section">
              <Route index element={<Index />} />
              <Route path=":location" element={<SprayDryerSection />} />
              <Route path=":location/view" element={<SprayDryerDetails />} />
              <Route path=":location/new" element={<NewSprayDryer />} />
              <Route path=":location/update" element={<UpdateSprayDryer />} />
            </Route>

            <Route path="lab-section">
              <Route index element={<Index />} />
              <Route path=":location" element={<LaboratorySection />} />
              <Route path=":location/:id" element={<LaboratoryDetails />} />
              <Route path=":location/new" element={<NewLaboratory />} />
              <Route path=":location/update" element={<UpdateLaboratory />} />
            </Route>

            <Route path="orders">
              <Route index element={<Orders />} />
            </Route>

            <Route path="reports">
              <Route index element={<Reports />} />
            </Route>
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

// developed by shanwijendra.dev | 2k24
