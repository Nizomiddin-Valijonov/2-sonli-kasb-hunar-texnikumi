"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { getEmployees, getImageUrl } from "../../services/api";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

interface Employee {
  id: number;
  name: string;
  role: string | { uz: string; en: string; ru: string };
  img: string;
  highlight?: boolean;
}

const Employees = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [staff, setStaff] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLang =
    pathname.split("/")[1] &&
    ["uz", "en", "ru"].includes(pathname.split("/")[1])
      ? pathname.split("/")[1]
      : "uz";

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEmployees(currentLang);

      const data =
        Array.isArray(response.data?.data) && response.data.data.length
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];

      if (!data.length) setError("empty");
      setStaff(data);
    } catch {
      setError("network");
    } finally {
      setLoading(false);
    }
  }, [currentLang]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (loading) {
    return (
      <LoadingState
        message={t("employees.loading")}
        skeletonCount={4}
        skeletonClassName="w-48 h-56 bg-gray-200 rounded-2xl animate-pulse"
      />
    );
  }

  if (error === "network" && !staff.length) {
    return (
      <ErrorState
        title={t("employees.errorTitle") || "Server ishlamayapti"}
        description={
          t("employees.errorDesc") ||
          "Kechirasiz, hozir server bilan aloqa o'rnatib bo'lmadi. Keyinroq urinib ko'ring."
        }
        retryText={t("employees.retry") || "Qayta urinib ko'rish"}
        onRetry={fetchEmployees}
      />
    );
  }

  if (!staff.length) {
    return (
      <EmptyState
        title={t("employees.empty") || "Xodimlar topilmadi"}
        description={
          t("employees.emptyDesc") ||
          "Hozircha bu bo'limda xodimlar mavjud emas."
        }
      />
    );
  }

  return (
    <section
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-gray-100"
      id="employees"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-16 tracking-tight">
          {t("employees.title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-[320px]">
          {staff.map((person) => {
            const role =
              typeof person.role === "object"
                ? person.role[currentLang as "uz" | "ru" | "en"] ||
                  person.role.uz
                : person.role;

            const imageUrl = getImageUrl(person.img, "employees");

            return (
              <div
                key={person.id}
                className={`
                  relative bg-white overflow-hidden rounded-2xl shadow-md
                  flex flex-col items-center justify-center text-center p-6
                  transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]
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
                    src={imageUrl || "/default-avatar.png"}
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
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent_70%)] pointer-events-none" />
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
