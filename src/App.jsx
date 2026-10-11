import RealtimeNotifications from "./components/RealtimeNotifications";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Events from "./components/Events";
import Registration from "./components/Registration";
import Admin from "./components/Admin";
import Categories from "./components/Categories";
import Features from "./components/Features";
import CTA from "./components/CTA";
import { EventProvider } from "./context/EventContext";


function App() {
  return (
    <EventProvider>
      <RealtimeNotifications />
      <Navbar />
      <Hero />
      <Events />
      <Registration />
      <Admin />
      <Categories />
      <Features />
      <CTA />
    </EventProvider>
  );
}

export default App;