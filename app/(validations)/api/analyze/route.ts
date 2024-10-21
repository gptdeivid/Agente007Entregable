import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const INDEX_NAME = "hackathon-centro2";
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY ?? "" });

async function queryIndex(indexName: string, query: Record<string, any>) {
  const index = pc.Index(indexName);
  const response = await index.query({
    vector: Object.values(query),
    topK: 10,
    includeMetadata: true,
  });
  return response.matches;
}

async function embedQuery(query: string) {
  const model = "multilingual-e5-large";

  const embedding = await pc.inference.embed(model, [query], {
    inputType: "query",
  });
  return embedding.data[0];
}

async function getCompanyInfo(companyInfo: any, relevantContext: string) {
  const prompt = `
Aquí hay contexto importante y relevante. Debes tomar esto antes que tu conocimiento general para hacer un reporte:
${relevantContext}

Proporciona la siguiente información de la empresa en formato Markdown:

# Empresa: ${companyInfo.marca}
## Industria: ${companyInfo.industria}
## Años en el mercado: ${companyInfo.anosEnMercado}
## Ingresos mensuales: ${companyInfo.ingresosMensuales}
## Tamaño de ticket promedio: ${companyInfo.tamanoTicketPromedio}
## Valuación promedio por industria a la que pertenece: ${companyInfo.ingresosMensuales}
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

async function getMarketSegmentation(
  companyInfo: any,
  steps: any[],
  relevantContext: string
) {
  const prompt = `
Aquí hay contexto importante y relevante. Debes tomar esto antes que tu conocimiento general para hacer un reporte:
${relevantContext}

Analiza la siguiente información de la empresa y proporciona un análisis detallado de la segmentación de mercado en formato Markdown:

${JSON.stringify(companyInfo)}

${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

### Segmentación de mercado
[Proporciona un análisis detallado de las bases para la segmentación de mercados aplicables a esta empresa especificando la generación de cliente que abarca por su edad y los principales comportamientos de consumidor característicos de ellos, las 3 industrias correlacionadas por el tipo de negocio que se presenta, tendencias]

| | Tamaño estimado de mercado en Millones de Pesos | Explicación de tamaño de mercado | Insights |
|----------|------------------------------------------|----------------------------------|----------|
| Segmento 1 | Proporciona una estimación del tamaño de mercado en mdp del Segmento 1 | Explica de manera breve el razonamiento de la estimación del tamaño de mercado del Segmento 1 | Proporciona insights relevantes sobre el segmento de mercado y cómo atenderlo del Segmento 1 |
| Segmento 2 | Proporciona una estimación del tamaño de mercado en mdp del Segmento 2 | Explica de manera breve el razonamiento de la estimación del tamaño de mercado del Segmento 2 | Proporciona insights relevantes sobre el segmento de mercado y cómo atenderlo del Segmento 2 |
| Segmento 3 | Proporciona una estimación del tamaño de mercado en mdp del Segmento 3 | Explica de manera breve el razonamiento de la estimación del tamaño de mercado del Segmento 3 | Proporciona insights relevantes sobre el segmento de mercado y cómo atenderlo del Segmento 3 |
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

async function getSegmentationStrategies(
  companyInfo: any,
  steps: any[],
  relevantContext: string
) {
  const prompt = `
Aquí hay contexto importante y relevante. Debes tomar esto antes que tu conocimiento general para hacer un reporte:
${relevantContext}

Analiza la siguiente información de la empresa y proporciona estrategias de segmentación en formato Markdown:

${JSON.stringify(companyInfo)}

${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

### Estrategias de segmentación
[Describe y distingue las diferentes estrategias de segmentación que podrían ser efectivas para esta empresa]
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

async function getMarketingBenefits(
  companyInfo: any,
  steps: any[],
  relevantContext: string
) {
  const prompt = `
Aquí hay contexto importante y relevante. Debes tomar esto antes que tu conocimiento general para hacer un reporte:
${relevantContext}

Analiza la siguiente información de la empresa y compara los beneficios de la mercadotecnia masiva y personalizada en formato Markdown:

${JSON.stringify(companyInfo)}

${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

### Beneficios de la mercadotecnia masiva y de la mercadotecnia personalizada
[Compara los beneficios de la mercadotecnia masiva y personalizada en el contexto de esta empresa]
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

async function getTechnologyInteraction(
  companyInfo: any,
  steps: any[],
  relevantContext: string
) {
  const prompt = `
Aquí hay contexto importante y relevante. Debes tomar esto antes que tu conocimiento general para hacer un reporte:
${relevantContext}

Analiza la siguiente información de la empresa y describe la interacción con la tecnología en formato Markdown:

${JSON.stringify(companyInfo)}

${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

### Interacción con la tecnología
[Adopción de innovación, uso de redes sociales o canales digitales]
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

async function getConclusionsAndRecommendations(
  companyInfo: any,
  steps: any[],
  relevantContext: string
) {
  const prompt = `
Aquí hay contexto importante y relevante. Debes tomar esto antes que tu conocimiento general para hacer un reporte:
${relevantContext}

Analiza la siguiente información de la empresa y proporciona conclusiones y recomendaciones en formato Markdown:

${JSON.stringify(companyInfo)}

${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

### Conclusiones y recomendaciones aplicable para lograr un market fit
[Proporciona conclusiones clave y recomendaciones accionables basadas en el análisis anterior, dentro de él agrega recomendaciones como agencia de segmentación de mercado abarca las 7 ps de marketing: producto, precio, punto de venta, promoción, personas, proceso y presentación de la marca.]
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-405b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

async function getRelevantContext(companyInfo: any) {
  const query = `${companyInfo.marca} ${companyInfo.industria}`;
  const embedding = await embedQuery(query);
  const matches = await queryIndex(INDEX_NAME, embedding);
  return matches.map((match: any) => match.metadata.text).join("\n\n");
}

export async function POST(request: Request) {
  try {
    const { steps, companyInfo } = await request.json();

    const relevantContext = await getRelevantContext(companyInfo);

    const [
      companyInfoSection,
      marketSegmentationSection,
      segmentationStrategiesSection,
      marketingBenefitsSection,
      technologyInteractionSection,
      conclusionsAndRecommendationsSection,
    ] = await Promise.all([
      getCompanyInfo(companyInfo, relevantContext),
      getMarketSegmentation(companyInfo, steps, relevantContext),
      getSegmentationStrategies(companyInfo, steps, relevantContext),
      getMarketingBenefits(companyInfo, steps, relevantContext),
      getTechnologyInteraction(companyInfo, steps, relevantContext),
      getConclusionsAndRecommendations(companyInfo, steps, relevantContext),
    ]);

    const conciseReportPrompt = `
Genera un reporte conciso pero no tan corto basado en la siguiente estructura. Utiliza viñetas y listas numeradas para mayor claridad. 

# ${companyInfo.marca}

## Perfil de la Empresa
- Industria: ${companyInfo.industria}
- Años en el mercado: ${companyInfo.anosEnMercado}
- Ingresos mensuales: ${companyInfo.ingresosMensuales}
- Ticket promedio: ${companyInfo.tamanoTicketPromedio}
- Valuación promedio en la industria: ${companyInfo.valuaionPromedioPorIndustria}

## Segmentación de Mercado
[Resumen conciso del análisis de segmentación]

| Segmento | Tamaño (MDP) | Explicación | Insights Clave |
|----------|--------------|-------------|----------------|
| 1 | [valor] | [breve] | [1-2 insights] |
| 2 | [valor] | [breve] | [1-2 insights] |
| 3 | [valor] | [breve] | [1-2 insights] |

## Estrategias de Segmentación
[Lista de 3-5 estrategias clave]

## Mercadotecnia Masiva vs. Personalizada
[Comparación concisa de beneficios]

## Interacción Tecnológica
[3-5 puntos clave sobre adopción de tecnología]

## Conclusiones y Recomendaciones
[3-5 conclusiones y recomendaciones clave]

Utiliza la información proporcionada en las siguientes secciones para generar el reporte conciso:

Información de la empresa:
${companyInfoSection}

Segmentación de mercado:
${marketSegmentationSection}

Estrategias de segmentación:
${segmentationStrategiesSection}

Beneficios de mercadotecnia:
${marketingBenefitsSection}

Interacción tecnológica:
${technologyInteractionSection}

Conclusiones y recomendaciones:
${conclusionsAndRecommendationsSection}

Asegúrate de que cada sección sea breve, directa y enfocada en los puntos más relevantes para ${companyInfo.marca}.
`;

    const conciseReportCompletion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-405b-instruct",
      messages: [{ role: "user", content: conciseReportPrompt }],
    });

    const conciseReport =
      conciseReportCompletion.choices[0].message?.content ?? "";

    return NextResponse.json({
      analysis: conciseReport,
      markdownReport: conciseReport,
    });
  } catch (error) {
    console.error("Error analyzing data:", error);
    return NextResponse.json(
      { error: "Failed to analyze data" },
      { status: 500 }
    );
  }
}
