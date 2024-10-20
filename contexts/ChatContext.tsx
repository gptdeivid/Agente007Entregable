"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Step = {
  title: string;
  question: string;
  completed: boolean;
  response: string;
};

type ChatContextType = {
  steps: Step[];
  currentStepIndex: number;
  updateStep: (index: number, response: string) => Promise<boolean>;
  moveToNextStep: () => void;
  allStepsCompleted: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Function to make LLM call for validation
const validateResponse = async (
  question: string,
  response: string
): Promise<boolean> => {
  try {
    const result = await fetch("/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, response }),
    });

    if (!result.ok) {
      throw new Error("Failed to validate response");
    }

    const data = await result.json();
    return data.isValid;
  } catch (error) {
    console.error("Error validating response:", error);
    return false;
  }
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [steps, setSteps] = useState<Step[]>([
    {
      title: "A1- Problema abarcado",
      question:
        "¿Cuáles son los problemas más comunes que tus clientes buscan resolver con lo que ofreces? ¿De qué se tienen dudas /inquietudes en los últimos meses de tus servicios?",
      completed: false,
      response: "",
    },
    {
      title: "A2- Fuerzas de ventas",
      question:
        "¿Cómo contactas a tus clientes? ¿Tienes un equipo de ventas que los atiende directamente? ¿Para qué usan página web o redes sociales?",
      completed: false,
      response: "",
    },
    {
      title: "B1- Geográfico",
      question:
        "¿Dónde están ubicados la mayoría de tus clientes actuales? ¿De qué ciudades son tus mejores 3 clientes?",
      completed: false,
      response: "",
    },
    {
      title: "B2- Psicológico",
      question:
        "Conceptualizando a la persona encargada a quién vendes y toma decisión de compra contesta las siguientes secciones: ¿Qué edad tiene? ¿Cuál es su género? En 5 adjetivos ¿Cómo lo describirías?",
      completed: false,
      response: "",
    },
    {
      title: "B3- Económico",
      question:
        "¿Son personas o empresas con un nivel adquisitivo alto, medio o bajo? ¿Cuál es el precio promedio que tus clientes están dispuestos a pagar por tus productos/servicios? ¿Qué uso le dan a tu producto? Sitúa 2 casos",
      completed: false,
      response: "",
    },
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const updateStep = async (
    index: number,
    response: string
  ): Promise<boolean> => {
    const currentStep = steps[index];
    const isValid = await validateResponse(currentStep.question, response);

    if (isValid) {
      setSteps((prevSteps) =>
        prevSteps.map((step, i) =>
          i === index ? { ...step, completed: true, response } : step
        )
      );
      return true;
    } else {
      // Optionally, you could update the step to show it's invalid
      // or just leave it as is and return false
      return false;
    }
  };

  const moveToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1);
    }
  };

  const allStepsCompleted = steps.every((step) => step.completed);

  return (
    <ChatContext.Provider
      value={{
        steps,
        currentStepIndex,
        updateStep,
        moveToNextStep,
        allStepsCompleted,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
