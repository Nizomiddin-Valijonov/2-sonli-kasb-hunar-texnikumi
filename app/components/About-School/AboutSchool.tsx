"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GraduationCap, Users2, Trophy } from "lucide-react";

const AboutSchool = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Users2 className="w-8 h-8 text-indigo-600" />,
      number: "800+",
      label: t("about.stats.students"),
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
      number: "35+",
      label: t("about.stats.teachers"),
    },
    {
      icon: <Trophy className="w-8 h-8 text-indigo-600" />,
      number: "90+",
      label: t("about.stats.achievements"),
    },
  ];

  return (
    <section
      className="relative py-28 bg-white overflow-hidden"
      id="about-school"
    >
      {/* subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-6 max-w-6xl">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-6">
            {t("about.title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            {t("about.description1")}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("about.description2")}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all p-8 flex flex-col items-center text-center"
            >
              <div className="mb-3">{stat.icon}</div>
              <h3 className="text-3xl font-semibold text-gray-900">
                {stat.number}
              </h3>
              <p className="text-gray-500 mt-1 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSchool;
