import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Logo & Short Text */}
        <div>
          <h2 className="text-xl font-bold text-white">Maktab N1</h2>
          <p className="mt-2 text-sm text-gray-400">
            Bizning maktab – kelajak avlod uchun bilim va tarbiya maskani.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Havolalar</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Bosh sahifa
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Yangiliklar
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Biz haqimizda
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Bog‘lanish
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Aloqa</h3>
          <p className="text-sm">📍 Toshkent, Chilonzor</p>
          <p className="text-sm">📞 +998 90 123 45 67</p>
          <p className="text-sm">✉️ info@maktab.uz</p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Maktab N1. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}

export default Footer;
