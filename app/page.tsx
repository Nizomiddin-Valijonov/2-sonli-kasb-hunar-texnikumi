import AboutSchool from "./components/About-School/AboutSchool";
import Contact from "./components/Contact/Contact";
import Employees from "./components/Employees/Employees";
import Footer from "./components/Footer/Footer";
import HeroSection from "./components/Hero-Section/HeroSection";
import News from "./components/News/News";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSchool />
      <Employees />
      <News />
      <Contact />
      <Footer />
    </main>
  );
}
