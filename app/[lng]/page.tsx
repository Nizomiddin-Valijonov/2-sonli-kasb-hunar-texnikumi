import AboutSchool from "../components/About-School/AboutSchool";
import CarouselLinks from "../components/Carousel-Links/CarouselLinks";
import Contact from "../components/Contact/Contact";
import Employees from "../components/Employees/Employees";
import Footer from "../components/Footer/Footer";
import HeroSection from "../components/Hero-Section/HeroSection";
import News from "../components/News/News";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSchool />
      <Employees />
      <CarouselLinks />
      <News />
      <Contact />
      <Footer />
    </main>
  );
}
