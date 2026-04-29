// app/[lng]/page.tsx
import AboutSchool from "../components/About-School/AboutSchool";
import CarouselLinks from "../components/Carousel-Links/CarouselLinks";
import Contact from "../components/Contact/Contact";
import Employees from "../components/Employees/Employees";
import Footer from "../components/Footer/Footer";
import HeroSection from "../components/Hero-Section/HeroSection";
import Navbar from "../components/Navbar/Navbar";
import News from "../components/News/News";
import Travel360 from "../components/Travel360/Travel360";

interface PageProps {
  params: {
    lng: string; // dynamic segment param
  };
}

export function generateStaticParams() {
  return [{ lng: "uz" }, { lng: "ru" }, { lng: "en" }];
}

export default function HomePage({ params }: PageProps) {
  // params.lng orqali tilni ishlatish mumkin
  console.log("Current language:", params.lng);

  return (
    <main>
      <Navbar lng={params.lng} />
      <HeroSection />
      <AboutSchool />
      <Employees />
      <CarouselLinks />
      <News />
      <Travel360 />
      <Contact />
      <Footer />
    </main>
  );
}
