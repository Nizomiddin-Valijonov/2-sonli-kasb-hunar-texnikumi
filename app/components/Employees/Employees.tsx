"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useTranslation } from "react-i18next";

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

        // 🔥 LocalStorage dan i18next tilini olish
        const lang = localStorage.getItem("i18nextLng") || "uz";

        // 🔥 API chaqiruvi til bilan
        const response = await axios.get(
          `http://localhost:5050/api/employees?lang=${lang}`
        );

        const data =
          Array.isArray(response.data?.data) && response.data.data.length
            ? response.data.data
            : Array.isArray(response.data)
            ? response.data
            : null;

        if (data) setStaff(data);
        else setError(t("employees.empty"));
      } catch (err) {
        setError(t("employees.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading)
    return (
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">
          {t("employees.loading")}
        </h2>
      </section>
    );

  if (error)
    return (
      <section className="py-20 bg-red-100 text-center">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </section>
    );

  if (!staff.length)
    return (
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-gray-600">
          {t("employees.empty")}
        </h2>
      </section>
    );

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
            // 🔥 role tilga qarab chiqsin (agar obyekt bo‘lsa)
            const lang = localStorage.getItem("i18nextLng") || "uz";
            const role =
              typeof person.role === "object"
                ? person.role[lang as "uz" | "ru" | "en"] || person.role.uz
                : person.role;

            return (
              <div
                key={person.id}
                className={`
                  relative bg-white overflow-hidden 
                  rounded-2xl shadow-md 
                  flex flex-col items-center justify-center 
                  text-center p-6 transition-all duration-500
                  hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
                  ${
                    person.highlight
                      ? "lg:col-span-2 bg-gradient-to-br from-indigo-600 via-primary to-secondary text-white"
                      : ""
                  }
                `}
              >
                <div
                  className={`relative ${
                    person.highlight ? "w-32 h-32" : "w-24 h-24"
                  } mb-4`}
                >
                  <Image
                    src={
                      person.img
                        ? `http://localhost:5050/api/employees${person.img}`
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
