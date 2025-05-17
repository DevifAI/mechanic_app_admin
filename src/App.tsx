import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ComponentChildren } from "preact";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Projects } from "./pages/Projects/Projects";
import { Employees } from "./pages/Employees/Employees";
import { Partners } from "./pages/Partners/Partners";
import { Equipments } from "./pages/Equipments/Equipments";
import { Revenue } from "./pages/Revenue/Revenue";
import { StoreLocation } from "./pages/StoreLocation/StoreLocation";
import { Consumable } from "./pages/Consumables/Consumable";
import { Shifts } from "./pages/Shifts/Shifts";
import { Roles } from "./pages/Roles/Roles";
import { CreateProjectPage } from "./pages/Projects/CreateProject";
import { CreateEmployeePage } from "./pages/Employees/CreateEmployeePage";

function ProtectedRoute({ children }: { children: ComponentChildren }) {
  const user = localStorage.getItem("user");
  return user ? <>{children}</> : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Protected Routes wrapped inside ProtectedRoute */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/" element={<Home />} />
          <Route index path="/dashboard" element={<Home />} />

          {/* Other Pages */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          <Route path="/projects/view" element={<Projects />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/employees/view" element={<Employees />} />
          <Route path="/employees/create" element={<CreateEmployeePage />} />
          <Route path="/partners/create" element={<Partners />} />
          <Route path="/equipments/create" element={<Equipments />} />
          <Route path="/revenues/create" element={<Revenue />} />
          <Route path="/store-locations/create" element={<StoreLocation />} />
          <Route path="/consumables/create" element={<Consumable />} />
          <Route path="/shifts/create" element={<Shifts />} />
          <Route path="/roles/create" element={<Roles />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* UI Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* Public Routes (Auth) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
