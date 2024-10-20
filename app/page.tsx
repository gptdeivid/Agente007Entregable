"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Chat } from "@/components/custom/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateUUID } from "@/lib/utils";

import { Sidebar } from "../components/custom/sidebar";

const questions = [
  { key: "marca", label: "¿Cuál es el nombre de tu marca?", type: "input" },
  {
    key: "industria",
    label: "¿En qué industria opera tu empresa?",
    type: "input",
  },
  {
    key: "numEmpleados",
    label: "¿Cuántos empleados tiene tu empresa?",
    type: "input",
  },
  {
    key: "anosEnMercado",
    label: "¿Cuántos años lleva tu empresa en el mercado?",
    type: "input",
  },
  {
    key: "productoMasVendido",
    label: "¿Cuál es tu producto o servicio más vendido?",
    type: "input",
  },
  {
    key: "ingresosMensuales",
    label: "¿Cuáles son tus ingresos de ventas mensuales?",
    type: "input",
  },
  {
    key: "tamanoTicketPromedio",
    label: "¿Cuál es el tamaño de ticket promedio?",
    type: "input",
  },
];

export default function Page() {
  const [formData, setFormData] = useState({
    marca: "",
    industria: "",
    numEmpleados: "",
    anosEnMercado: "",
    productoMasVendido: "",
    ingresosMensuales: "",
    tamanoTicketPromedio: "",
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [chatId, setChatId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateField = (key: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [key]: "Este campo es requerido" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [key]: "" }));
    return true;
  };

  const handleNext = () => {
    const currentKey = questions[currentQuestion].key;
    if (
      validateField(currentKey, formData[currentKey as keyof typeof formData])
    ) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const newChatId = generateUUID();
        setChatId(newChatId);
        const queryParams = new URLSearchParams(formData).toString();
        router.push(`/chat/${newChatId}?${queryParams}`);
      }
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h1 className="text-3xl font-bold">LOGO</h1>
          <h2 className="text-xl font-semibold">Conocer usuario</h2>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 px-4 sm:px-16"
          >
            <h3 className="text-lg font-medium">{currentQ.label}</h3>
            <Input
              id={currentQ.key}
              name={currentQ.key}
              value={formData[currentQ.key as keyof typeof formData]}
              onChange={handleInputChange}
              required
              className={errors[currentQ.key] ? "border-red-500" : ""}
            />
            {errors[currentQ.key] && (
              <p className="text-red-500 text-sm">{errors[currentQ.key]}</p>
            )}
            <Button onClick={handleNext} className="mt-4">
              {currentQuestion < questions.length - 1
                ? "Siguiente"
                : "Iniciar Chat"}
            </Button>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentQuestion ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
