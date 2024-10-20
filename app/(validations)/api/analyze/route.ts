import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCompanyInfo(companyInfo: any) {
  const prompt = `
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

async function getMarketSegmentation(companyInfo: any, steps: any[]) {
  const prompt = `
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

async function getSegmentationStrategies(companyInfo: any, steps: any[]) {
  const prompt = `
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

async function getMarketingBenefits(companyInfo: any, steps: any[]) {
  const prompt = `
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

async function getTechnologyInteraction(companyInfo: any, steps: any[]) {
  const prompt = `
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
  steps: any[]
) {
  const prompt = `
Analiza la siguiente información de la empresa y proporciona conclusiones y recomendaciones en formato Markdown:

${JSON.stringify(companyInfo)}

${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

### Conclusiones y recomendaciones aplicable para lograr un market fit
[Proporciona conclusiones clave y recomendaciones accionables basadas en el análisis anterior, dentro de él agrega recomendaciones como agencia de segmentación de mercado abarca las 7 ps de marketing: producto, precio, punto de venta, promoción, personas, proceso y presentación de la marca.]
`;

  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message?.content ?? "";
}

export async function POST(request: Request) {
  try {
    const { steps, companyInfo } = await request.json();

    const [
      companyInfoSection,
      marketSegmentationSection,
      segmentationStrategiesSection,
      marketingBenefitsSection,
      technologyInteractionSection,
      conclusionsAndRecommendationsSection,
    ] = await Promise.all([
      getCompanyInfo(companyInfo),
      getMarketSegmentation(companyInfo, steps),
      getSegmentationStrategies(companyInfo, steps),
      getMarketingBenefits(companyInfo, steps),
      getTechnologyInteraction(companyInfo, steps),
      getConclusionsAndRecommendations(companyInfo, steps),
    ]);

    const finalReport = `
${companyInfoSection}

${marketSegmentationSection}

${segmentationStrategiesSection}

${marketingBenefitsSection}

${technologyInteractionSection}

${conclusionsAndRecommendationsSection}
`;

    const markdownReport = `El reporte debe seguir estrictamente el siguiente formato:

    # Empresa: [nombre de la empresa]
    ## Industria: [industria de la empresa]
    ## Años en el mercado: [años de la empresa en el mercado]
    ## Ingresos mensuales: [ingresos mensuales de la empresa]
    ## Tamaño de ticket promedio: [tamaño de ticket promedio de la empresa]
    ## Valuación promedio por industria a la que pertenece: [ingresos mensuales de la empresa]


    ### Segmentación de mercado
    [Proporciona un análisis detallado de las bases para la segmentación de mercados aplicables a esta empresa especificando la generación de cliente que abarca por su edad y los principales comportamientos de consumidor característicos de ellos, las 3 industrias correlacionadas por el tipo de negocio que se presenta, tenden]

|            | Tamaño estimado de mercado en Millones de Pesos                        | Explicación de tamaño de mercado                                                              | Insights                                                                                     |
| ---------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Segmento 1 | Proporciona una estimación del tamaño de mercado en mdp del Segmento 1 | Explica de manera breve el razonamiento de la estimación del tamaño de mercado del Segmento 1 | Proporciona insights relevantes sobre el segmento de mercado y cómo atenderlo del Segmento 1 |
| Segmento 2 | Proporciona una estimación del tamaño de mercado en mdp del Segmento 2 | Explica de manera breve el razonamiento de la estimación del tamaño de mercado del Segmento 2 | Proporciona insights relevantes sobre el segmento de mercado y cómo atenderlo del Segmento 2 |
| Segmento 3 | Proporciona una estimación del tamaño de mercado en mdp del Segmento 3 | Explica de manera breve el razonamiento de la estimación del tamaño de mercado del Segmento 3 | Proporciona insights relevantes sobre el segmento de mercado y cómo atenderlo del Segmento 3 |

    ### Estrategias de segmentación
    [Describe y distingue las diferentes estrategias de segmentación que podrían ser efectivas para esta empresa]

    ### Beneficios de la mercadotecnia masiva y de la mercadotecnia personalizada
    [Compara los beneficios de la mercadotecnia masiva y personalizada en el contexto de esta empresa]

    ### Interacción con la tecnología: 
 [Adopción de innovación, uso de redes sociales o canales digitales]

    ### Conclusiones y recomendaciones aplicable para lograr un market fit
    [Proporciona conclusiones clave y recomendaciones accionables basadas en el análisis anterior ,dentro de él agrega recomendaciones como agencia de segmentacion de mercado abarca las 7 ps de marketing: producto, precio, punto de venta, promoción, personas, proceso y presentación de la marca.]`;

    return NextResponse.json({ analysis: finalReport, markdownReport });
  } catch (error) {
    console.error("Error analyzing data:", error);
    return NextResponse.json(
      { error: "Failed to analyze data" },
      { status: 500 }
    );
  }
}
