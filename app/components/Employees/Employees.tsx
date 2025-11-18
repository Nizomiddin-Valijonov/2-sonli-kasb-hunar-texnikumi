"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { AlertCircle, WifiOff } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string | { uz: string; en: string; ru: string };
  img: string;
  highlight?: boolean;
}

const Employees = () => {
  const { t } = useTranslation();
  const [staff, setStaff] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const lang = localStorage.getItem("i18nextLng") || "uz";
        const response = await axios.get(
          `https://api.nam-school84.uz/api/employees?lang=${lang}`
        );

        const data =
          Array.isArray(response.data?.data) && response.data.data.length
            ? response.data.data
            : Array.isArray(response.data)
            ? response.data
            : [];

        if (!data.length) setError(t("employees.empty"));
        setStaff(data);
      } catch (err) {
        setError(t("employees.error") || "Server bilan aloqa yo‘q.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [t]);

  // ⏳ LOADING STATE
  if (loading)
    return (
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold text-gray-600 mb-6">
          {t("employees.loading")}
        </h2>
        <div className="flex justify-center gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-48 h-56 bg-gray-200 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );

  // ❌ ERROR STATE (Server ishlamagan yoki API xato)
  if (error && !staff.length)
    return (
      <section className="py-32 bg-gradient-to-b from-red-50 to-white text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-red-100 text-red-600 p-6 rounded-full">
            <WifiOff size={48} />
          </div>
          <h2 className="text-3xl font-bold text-red-700">
            {t("employees.errorTitle") || "Server ishlamayapti"}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t("employees.errorDesc") ||
              "Kechirasiz, hozir server bilan aloqa o‘rnatib bo‘lmadi. Keyinroq urinib ko‘ring."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {t("employees.retry") || "Qayta urinib ko‘rish"}
          </button>
        </div>
      </section>
    );

  // ⚠️ BO‘SH STATE
  if (!staff.length)
    return (
      <section className="py-32 bg-gray-100 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={48} className="text-gray-500" />
          <h2 className="text-2xl font-semibold text-gray-700">
            {t("employees.empty") || "Xodimlar topilmadi"}
          </h2>
          <p className="text-gray-500">
            {t("employees.emptyDesc") ||
              "Hozircha bu bo‘limda xodimlar mavjud emas."}
          </p>
        </div>
      </section>
    );

  // ✅ ASOSIY CONTENT
  return (
    <section
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-gray-100"
      id="employees"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-16 tracking-tight">
          {t("employees.title")}
        </h2>

        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-8 
            auto-rows-[320px]
          "
        >
          {staff.map((person) => {
            const lang = localStorage.getItem("i18nextLng") || "uz";
            const role =
              typeof person.role === "object"
                ? person.role[lang as "uz" | "ru" | "en"] || person.role.uz
                : person.role;

            return (
              <div
                key={person.id}
                className={`relative bg-white overflow-hidden rounded-2xl shadow-md 
                flex flex-col items-center justify-center text-center p-6 
                transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
                ${
                  person.highlight
                    ? "lg:col-span-2 bg-gradient-to-br from-indigo-600 via-primary to-secondary text-white"
                    : ""
                }`}
              >
                <div
                  className={`relative ${
                    person.highlight ? "w-32 h-32" : "w-24 h-24"
                  } mb-4`}
                >
                  <Image
                    src={
                      person.img
                        ? `https://api.nam-school84.uz/api/employees${person.img}`
                        : "/default-avatar.png"
                    }
                    alt={person.name}
                    fill
                    className={`object-cover rounded-full border-4 ${
                      person.highlight ? "border-white" : "border-gray-200"
                    } shadow-lg`}
                  />
                </div>

                <h3
                  className={`font-semibold ${
                    person.highlight ? "text-2xl" : "text-lg text-gray-800"
                  }`}
                >
                  {person.name}
                </h3>
                <p
                  className={`mt-1 ${
                    person.highlight ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {role}
                </p>

                {person.highlight && (
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent_70%)] pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Employees;
