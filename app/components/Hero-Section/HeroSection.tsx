import Image from "next/image";
import logo from "../../assets/Logo/logo.svg";

function HeroSection() {
  return (
    <section
      className="relative bg-gradient-to-r from-primary to-purple-500 text-white py-24 md:py-32 "
      id="main"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10">
        {/* Left content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Bilim – Kelajak Kaliti <br />
            <span className="text-yellow-300">33-Maktabda</span>
          </h1>
          <p className="text-lg text-gray-100 mb-8 max-w-xl mx-auto md:mx-0">
            Bizning maktabimiz o‘quvchilarga zamonaviy ta’lim, ma’naviy tarbiya
            va yuksak maqsad sari intilish uchun kuchli poydevor yaratadi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-yellow-300 text-blue-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-yellow-400 transition">
              Yangiliklarni ko‘rish
            </button>
            <a
              href="#contact"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
            >
              Biz bilan bog‘lanish
            </a>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center">
          <Image
            src={logo}
            alt="Maktab illustration"
            className="w-72 md:w-96 drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
