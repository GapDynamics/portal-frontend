import styles from "../page.module.css";
import Hero from "../components/Hero";
import GetTheApp from "../components/GetTheApp";
import Features from "../components/Features";
import NutriTeamWeb from "../components/NutriTeamWeb";
import MyOmnicheck from "../components/MyOmnicheck";
import OmnicheckPartner from "../components/OmnicheckPartner";
import AppPlatforms from "../components/AppPlatforms";
import Footer from "../components/Footer";
import NutriTeamWebNew from "../components/NutriTeamWebNew";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <GetTheApp />
      <MyOmnicheck />
      <OmnicheckPartner />
      <Features />
      <NutriTeamWeb />
      <NutriTeamWebNew />
      <AppPlatforms />
      <Footer />
    </div>
  );
}
