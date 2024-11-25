"use client";

import { User, CheckCircle, Circle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export const SidebarOnboarding = () => {
  const searchParams = useSearchParams();

  const formData = {
    nombreEmpresa : searchParams?.get("nombreEmpresa ") || "",
    industria: searchParams?.get("industria") || "",
  };

  const importantFacts = [
    "El 52% de las startups en México no sobreviven más de 2 años.",
    "La falta de conocimiento del mercado es la causa del 34% de los fracasos.",
    "El tiempo promedio para validar un segmento de mercado es de 6 a 12 meses.",
  ];

  const agentBenefits = [
    "Accederás a herramientas de validación de ideas de negocio.",
    "Recibirás guía personalizada basada en IA.",
    "Optimizarás tu proceso de validación de mercado.",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="w-full bg-muted p-6 h-dvh overflow-y-auto pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-row items-center justify-center gap-2 mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="rounded-full bg-white p-2">
          <User className="size-10 text-zinc-800" />
        </div>
      </motion.div>
      <motion.div 
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-3 font-primary tracking-wide">¡Bienvenido a Agente007!</h2>
        <p className="text-lg text-muted-foreground">
          Estás a punto de comenzar una experiencia increíble para validar y potenciar tu idea de negocio.
        </p>
      </motion.div>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h3 className="text-2xl font-bold mb-4 font-primary">Datos importantes</h3>
          <motion.ul className="space-y-3" variants={containerVariants}>
            {importantFacts.map((fact, index) => (
              <motion.li
                key={index}
                className="rounded-lg border p-3 flex items-center justify-between bg-white text-black shadow-sm"
                variants={itemVariants}
              >
                <span className="text-lg font-bold">{fact}</span>
                <Circle className="h-5 w-5 text-[#60A2B1]" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4 font-primary">Con Agente007</h3>
          <motion.ul className="space-y-3" variants={containerVariants}>
            {agentBenefits.map((benefit, index) => (
              <motion.li
                key={index}
                className="rounded-lg border p-3 flex items-center justify-between bg-[#60A2B1] text-white shadow-sm"
                variants={itemVariants}
              >
                <span className="text-lg font-bold">{benefit}</span>
                <CheckCircle className="h-5 w-5" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-lg font-medium text-[#60A2B1]">
          ¡Comencemos a validar tu idea de negocio!
        </p>
      </motion.div>
    </motion.div>
  );
};
