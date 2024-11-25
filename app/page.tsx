"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateUUID } from "@/lib/utils";
import { Building, Calendar, ShoppingCart } from "lucide-react";
import { Sidebar } from "@/components/custom/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { SidebarOnboarding } from "@/components/custom/sidebar-onboarding";

const questions = [
  { 
    key: "nombreEmpresa", 
    label: "¿Cómo se llama tu empresa?", 
    type: "input", 
    icon: <Building className="w-6 h-6 text-[#60A2B1]" /> 
  },
  { 
    key: "industria", 
      label: "A qué industria pertenece?", 
      type: "input", 
      icon: <ShoppingCart className="w-6 h-6 text-[#60A2B1]" /> 
    
  },
  { key: "anosEnMercado", 
      label: "¿Cuántos años ha estado en el mercado tu empresa?", 
      type: "input", 
      icon: <Calendar className="w-6 h-6 text-[#60A2B1]" /> 
    
  },
];

export default function Page() {
  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    anosEnMercado: "",
    industria: "",
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [chatId, setChatId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    if (validateField(currentKey, formData[currentKey as keyof typeof formData])) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const newChatId = generateUUID();
        console.log(formData);
        setChatId(newChatId);
        const queryParams = new URLSearchParams(formData).toString();
        router.push(`/chat/${newChatId}?${queryParams}`);
      }
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F5F5F5] p-8">
      <div className="flex flex-row w-full h-full">
        <SidebarOnboarding />
        <Card className="w-full shadow-lg p-16 items-center">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Image src="https://agente007.blob.core.windows.net/imagenes/sietelog.png" alt="Logo" width={480} height={480} />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-[#60A2B1] font-primary">Conocer usuario</CardTitle>
            <CardDescription className="text-center text-[#333333]">
              Ayúdanos a entender mejor tu negocio para ofrecerte la mejor asistencia
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center space-x-4">
                  {currentQ.icon}
                  <h3 className="text-xl font-medium text-[#333333]">{currentQ.label}</h3>
                </div>
                <Textarea
                  id={currentQ.key}
                  name={currentQ.key}
                  value={formData[currentQ.key as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                  className={`bg-white border-[#60A2B1] focus:ring-[#60A2B1] text-lg p-3 ${errors[currentQ.key] ? "border-[#D6541D]" : ""}`}
                />
                {errors[currentQ.key] && (
                  <p className="text-[#D6541D] text-sm">{errors[currentQ.key]}</p>
                )}
                <Button 
                  onClick={handleNext} 
                  className="mt-4 bg-[#60A2B1] text-white hover:bg-[#4A8291] transition-colors text-lg py-3"
                >
                  {currentQuestion < questions.length - 1 ? "Siguiente" : "Iniciar Chat"}
                </Button>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-8">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    index === currentQuestion ? "bg-[#60A2B1]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}