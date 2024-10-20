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
      title: "Preguntas iniciales",
      question: "¿Cuál es tu objetivo principal?",
      completed: false,
      response: "",
    },
    {
      title: "ANALISIS EXTERNO - PESTEL",
      question: "Describe los factores políticos que afectan tu negocio.",
      completed: false,
      response: "",
    },
    {
      title: "Type something",
      question: "¿Qué más quieres agregar?",
      completed: false,
      response: "",
    },
    {
      title: "OTRO",
      question: "¿Alguna otra consideración?",
      completed: false,
      response: "",
    },
    {
      title: "OTRO",
      question: "¿Algo más que quieras mencionar?",
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
