"use client";

import { User, CheckCircle, Circle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

import { useChatContext } from "@/contexts/ChatContext";

import { InfoIcon, UserIcon } from "./icons";

export const Sidebar = () => {
  const searchParams = useSearchParams();
  const { steps } = useChatContext(); // Consume the steps from context

  const formData = {
    marca: searchParams?.get("marca") || "",
    industria: searchParams?.get("industria") || "",
    numEmpleados: searchParams?.get("numEmpleados") || "",
    anosEnMercado: searchParams?.get("anosEnMercado") || "",
    productoMasVendido: searchParams?.get("productoMasVendido") || "",
    ingresosMensuales: searchParams?.get("ingresosMensuales") || "",
    tamanoTicketPromedio: searchParams?.get("tamanoTicketPromedio") || "",
  };

  const labelMap: Record<string, string> = {
    marca: "Marca",
    industria: "Industria",
    numEmpleados: "Número de Empleados",
    anosEnMercado: "Años en el Mercado",
    productoMasVendido: "Producto Más Vendido",
    ingresosMensuales: "Ingresos Mensuales",
    tamanoTicketPromedio: "Tamaño de Ticket Promedio",
  };

  const filteredEntries = Object.entries(formData).filter(
    ([key, value]) => value && key !== "marca" && key !== "industria"
  );

  return (
    <div className="w-80 bg-muted p-3 h-dvh overflow-y-auto pt-16">
      <div className="flex flex-row items-center justify-center gap-2 mb-6">
        <div className="rounded-full bg-white p-2">
          <User className="size-10 text-zinc-800" />
        </div>
        <div className="flex flex-col gap-1 ml-4">
          <div className="text-lg font-semibold">{formData.marca}</div>
          <div className="text-md text-muted-foreground">
            {formData.industria}
          </div>
        </div>
      </div>
      {filteredEntries.length === 0 ? (
        <div className="text-zinc-500 size-full flex flex-row justify-center items-center text-sm gap-2">
          <InfoIcon />
          <div>No user information available</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-6">
            {filteredEntries.map(([key, value], index) => (
              <div
                key={key}
                className={`flex flex-col ${
                  filteredEntries.length === 5 && index === 4
                    ? "col-span-2"
                    : ""
                }`}
              >
                <div className="font-medium text-muted-foreground">
                  {labelMap[key]}
                </div>
                <div>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">
              Segmentación del mercado
            </h3>
            <ul className="space-y-2">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`rounded-lg border p-3 flex items-center justify-between
                    ${step.completed ? "bg-black text-white" : "bg-gray-200 text-black"}`}
                >
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
