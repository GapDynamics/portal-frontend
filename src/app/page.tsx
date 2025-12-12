import Image from "next/image";
import styles from "./page.module.css";
import Hero from "./components/Hero";
import GetTheApp from "./components/GetTheApp";
import Features from "./components/Features";
// import FindDoctor from "./components/FindDoctor";
import NutriTeamWeb from "./components/NutriTeamWeb";
// import Mission from "./components/Mission";
import MyOmnicheck from "./components/MyOmnicheck";
// import Patients from "./components/Patients";
// import Professionals from "./components/Professionals";
import OmnicheckPartner from "./components/OmnicheckPartner";
// import MobileApp from "./components/MobileApp";
import AppPlatforms from "./components/AppPlatforms";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <GetTheApp />
      <MyOmnicheck />
      <OmnicheckPartner />
      <Features />
      {/* <FindDoctor /> */}
      <NutriTeamWeb />
      {/* <Mission /> */}
      {/* <Patients /> */}
      {/* <Professionals /> */}
      {/* <MobileApp /> */}
      <AppPlatforms />
      <Footer />
    </div>
  );
}

