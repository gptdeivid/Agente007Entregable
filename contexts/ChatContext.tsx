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
  response: string,
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
      title: "A1- Giro de Negocio",
      question:
        "¿Qué giro(s) de negocio te interesa analizar? (puedes elegir hasta tres giros relacionados, como sandalias, zapatos y huaraches)",
      completed: false,
      response: "",
    },
    {
      title: "A2- Perfil de los Clientes",
      question:
        "¿Cuáles son los rangos de edad de tus clientes? (puedes elegir hasta dos rangos de edad) ",
      completed: false,
      response: "",
    },
    {
      title: "B1- Información Geografica",
      question: "En que Entidad Federativa se encuentran?",
      completed: false,
      response: "",
    },
    {
      title: "B2- Económico",
      question:
        "¿Cuál es el nivel socioeconómico de tus clientes?\n        a) Bajo\n        b) Medio-bajo\n        c) Medio\n        d) Medio-alto\n        e) Alto ",
      completed: false,
      response: "",
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const updateStep = async (
    index: number,
    response: string,
  ): Promise<boolean> => {
    const currentStep = steps[index];
    const isValid = await validateResponse(currentStep.question, response);
    if (isValid) {
      setSteps((prevSteps) =>
        prevSteps.map((step, i) =>
          i === index ? { ...step, completed: true, response } : step,
        ),
      );
      return true;
    } else {
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
