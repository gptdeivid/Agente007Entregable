<a href="https://chat.vercel.ai/">
  <img alt="Agente 007 " src="https://agente007.blob.core.windows.net/imagenes/sietelog.png">
  <h1 align="center">Agente007 Planeación de Negocios Para Todos</h1>
</a>

# 📊 Sistema de Análisis de Mercado 

Este proyecto implementa un sistema de análisis de mercado potenciado por IA que utiliza **prompt engineering  avanzado  usando el conocimiento exclusivo de los modelos lkama 3.1 y RAG** para generar análisis personalizados y detallados, dirigido a startups en México. 
[![ChatGPT vs Claude (and other AI's)](https://img.youtube.com/vi/pVzbocJNoco/0.jpg)](https://youtu.be/pVzbocJNoco)
---

## 🚀 Stack Tecnológico

### Frontend
- **React.js v18.x**: Biblioteca para construir interfaces de usuario.
- **Tailwind CSS v3.x**: Framework utility-first para estilizado.

### Backend
- **Next.js v14.x**: Framework full-stack basado en React.
- **TypeScript v5.x**: Superset tipado de JavaScript.

### Integraciones
- **OpenRouter AI**:
  - Acceso a modelos LLM (`meta-llama/llama-3.1-405b-instruct`).
  - Procesamiento avanzado de prompts para generación de texto.
- **Pinecone**:
  - Base de datos vectorial para almacenamiento de embeddings y búsqueda semántica.
  - Modelo `multilingual-e5-large` para generación de embeddings.

---

## 🛠 Arquitectura del Sistema

### Capa de Presentación
- Interfaz de usuario React con componentes funcionales y hooks personalizados.
- Estilizado con Tailwind CSS para interfaces modernas y responsivas.

### Capa de Negocio
- Lógica de aplicación centralizada en Context API.
- API Routes de Next.js para endpoints dinámicos.
- Servicios de IA para procesamiento de datos y generación de insights.

### Capa de Datos
- Integración con Pinecone para almacenamiento y búsqueda eficiente de embeddings.
- Cacheo de resultados para minimizar tiempos de respuesta.

---

## 🧠 Flujo de Prompt Engineering

### Estructura de Prompts

Los prompts están diseñados para ofrecer consistencia y precisión en los resultados, siguiendo estas características principales:

1. **Estructura Base**
   - **Contexto inicial**: Información relevante sobre la empresa, industria y requisitos.
   - **Instrucciones específicas**: Indicaciones claras sobre los pasos a seguir.
   - **Requisitos de formato**: Detalles sobre la estructura del resultado esperado.
   - **Ejemplos**: Salidas esperadas para guiar el modelo.

2. **Personalización**
   Cada prompt se adapta dinámicamente utilizando:
   - **Datos de la empresa**: Nombre, industria y requisitos.
   - **Contexto relevante**: Información obtenida mediante búsquedas en Pinecone.
   - **Formato de salida**: Resultados en Markdown o JSON, según los requisitos.

3. **Control de Salida**
   - Garantizar la coherencia y calidad del formato de respuesta.
   - Incorporar métricas cuantitativas y cualitativas según las necesidades.

```typescript
interface BasePrompt {
  context: string;          // Contexto relevante de Pinecone
  industryFocus: string;    // Industria específica
  companyName: string;      // Nombre de la empresa
  requirements: Array<string>; // Requisitos específicos
  format: string;           // Formato de salida esperado

```


# Cadena de Procesamiento
El flujo completo de procesamiento sigue una secuencia bien definida para garantizar resultados de alta calidad:

Contexto Inicial:


const relevantContext = await getRelevantContext(companyInfo);

Análisis Paralelo: Ejecutar múltiples análisis simultáneamente:

```javascript

const [
  basicDefinitions,
  marketStructure,
  startupCounts,
  populationAnalysis,
  // ...más análisis
] = await Promise.all([...]);

```
---

Consolidación y Reporte Final: Generar un reporte unificado:

javascript
Copy code
const finalReport = await generateFinalReport(
  analysisData, 
  companyInfo, 
  steps
);

---

# Optimización de Prompts
Contextualización:

Adaptar cada prompt con datos específicos de la empresa y su industria.
Incluir información relevante extraída mediante búsquedas vectoriales.
Estructuración Consistente:

Uso de un formato predefinido para asegurar claridad en los resultados.
Incorporar ejemplos que guíen al modelo en la generación de contenido.
Control de Formato y Salida:

Definir formatos esperados, como Markdown o JSON.
Especificar requisitos cualitativos y cuantitativos en los resultados.
```typescript

interface OutputControl {
  format: "markdown" | "json";
  sections: Array<string>;
  requirements: {
    quantitative: boolean;
    qualitative: boolean;
    examples: boolean;
  };
}
```
#Ejemplos de Prompts
Análisis TAM-SAM-SOM

Genera tres secciones detalladas sobre los mercados TAM, SAM y SOM para ${companyInfo.nombreEmpresa} en ${companyInfo.industria}:

1. **Mercado Total Direccionable (TAM)**:
   - Define el concepto.
   - Calcula el TAM para emprendedores y startups.
   - Explica la metodología y proporciona cifras específicas.

2. **Mercado Accesible (SAM)**:
   - Describe el segmento de mercado accesible para la empresa.
   - Ofrece datos clave y ejemplos relevantes.

3. **Mercado Objetivo (SOM)**:
   - Determina el mercado específico de enfoque.
   - Explica las oportunidades y desafíos asociados.

---
## Análisis de Infraestructura

Proporciona un análisis detallado de la infraestructura por estado. Para cada estado, incluye:

1. **Infraestructura Financiera**:
   - Disponibilidad de fondos.
   - Programas de financiamiento.
   - Instituciones financieras clave.

2. **Infraestructura Tecnológica**:
   - Cobertura de internet y conectividad.
   - Presencia de hubs tecnológicos y startups.

---
🔄 Flujo de Prompt Engineering Completo

```mermaid

    A[Entrada de Usuario] -->|Validación| B[Contexto Inicial]
    B -->|Embeddings| C[Búsqueda en Pinecone]
    C -->|Contexto Relevante| D[Análisis Paralelo]
    D -->|8 Análisis Simultáneos| E[Consolidación]
    E -->|Prompt Final| F[Reporte Generado]
```
----
📚 # Mejores Prácticas
Contextualización:

Incluir siempre el contexto más relevante.
Adaptar los prompts a las necesidades específicas de la industria.
Estructuración:

Seguir un formato claro y consistente.
Incorporar ejemplos específicos que guíen al modelo.
Validación:
---

🚀 #Próximos Pasos
Creación de prompts más especializados para industrias clave.
Implementación de mejoras en la contextualización automática.
Optimización de la cadena de procesamiento y tiempos de ejecución.
Desarrollar un feedback loop para la mejora continua de prompts y resultados.
