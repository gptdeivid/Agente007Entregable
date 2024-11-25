import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_VERSION = "meta-llama/llama-3.1-70b-instruct";
const INDEX_NAME = "hackathon-centro2";
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY ?? "" });

// Funciones de utilidad
async function callAI(prompt: string) {
    const completion = await openai.chat.completions.create({
        model: MODEL_VERSION,
        messages: [{ role: "user", content: prompt }],
    });
    return completion.choices[0].message?.content ?? "";
}

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

async function getRelevantContext(companyInfo: any) {
    const query = `${companyInfo.nombreEmpresa} ${companyInfo.industria} México emprendedores startups`;
    const embedding = await embedQuery(query);
    const matches = await queryIndex(INDEX_NAME, embedding);
    return matches.map((match: any) => match.metadata.text).join("\n\n");
}

// Funciones de análisis específicas
async function getBasicDefinitions(companyInfo: any, relevantContext: string) {
    const prompt = `
Proporciona definiciones detalladas y análisis de los siguientes conceptos fundamentales:

1. DENUE del INEGI en México
- ¿Qué es exactamente?
- ¿Cómo funciona?
- ¿Qué información proporciona?
- ¿Cómo se utiliza para análisis de mercado?

2. NSE de la AMAI
- Definición completa
- Metodología actual
- Niveles socioeconómicos
- Aplicación en análisis de mercado

3. Clasificación Generacional
- Detalle específico de cada generación y sus años de nacimiento:
  * Baby Boomers
  * Generación X
  * Millennials
  * Generación Z
  * Generación Alpha

4. Tipos de Segmentación
- Segmentación Geográfica: definición y ejemplos
- Segmentación Demográfica: definición y ejemplos
- Segmentación Psicográfica: definición y ejemplos
- Segmentación de Comportamiento: definición y ejemplos

Proporciona información precisa y actualizada para cada concepto.
Contextualiza la información para ${companyInfo.industria}.`;

    return await callAI(prompt);
}

async function getMarketStructure(companyInfo: any, relevantContext: string) {
    const prompt = `
Analiza detalladamente el tamaño y estructura del mercado de emprendedores y startups en México, 
específicamente relevante para ${companyInfo.industria}:

1. Según DENUE:
- Número total de unidades económicas
- Distribución por sector
- Tendencias de crecimiento

2. Según Censos Económicos:
- Datos históricos
- Comparativas temporales
- Indicadores clave

3. Según Registros Administrativos:
- Estadísticas oficiales
- Registros gubernamentales
- Datos de instituciones relevantes

4. Información específica por industria:
- Sectores principales
- Concentración de mercado
- Oportunidades identificadas

5. Estudios de mercado disponibles:
- Hallazgos clave
- Tendencias identificadas
- Proyecciones

Incluye números específicos y datos cuantitativos cuando estén disponibles.`;

    return await callAI(prompt);
}

async function getStartupCounts(companyInfo: any, relevantContext: string) {
    const prompt = `
Proporciona un análisis detallado del número de emprendedores y startups en México,
enfocándote en ${companyInfo.industria}, según:

1. INEGI:
- Número total de emprendedores registrados
- Distribución por sector
- Tendencias históricas

2. CANACINTRA:
- Estadísticas de afiliados
- Distribución por industria
- Datos de crecimiento

3. AMEXCAP:
- Número de startups registradas
- Inversiones realizadas
- Sectores principales

Incluye una tabla de distribución geográfica considerando que:
- En México hay 1.3 millones de emprendedores
- En la Ciudad de México se encuentra el 23.1% (300,300)
- Calcula y distribuye el resto por estados principales

Proporciona todos los datos numéricos disponibles y fuentes.`;

    return await callAI(prompt);
}

async function getPopulationAnalysis(companyInfo: any, relevantContext: string) {
    const prompt = `
Realiza un análisis poblacional detallado de México, considerando el impacto en ${companyInfo.industria}:

1. Población por año:
- 2018
- 2019
- 2020
- 2021
- 2022

2. Cálculos específicos:
- Tasa de crecimiento anual para cada año
- Crecimiento promedio del periodo
- Proyección para 2023 y 2024
- Identificación de patrones y tendencias

3. Análisis de factores de crecimiento:
Identifica y analiza los 3 factores más importantes que podrían influir en el crecimiento de emprendedores y startups en:
- Ciudad de México
- Estado de México
- Jalisco
- Nuevo León
- Guanajuato
- Querétaro
- Puebla

4. Análisis de factores culturales:
Para cada estado mencionado, identifica los 3 factores culturales más importantes que influyen en el crecimiento de emprendedores y startups.

Incluye tablas comparativas y datos cuantitativos cuando sea posible.`;

    return await callAI(prompt);
}

async function getAreasCrecimiento(companyInfo: any, relevantContext: string) {
    const prompt = `
Basado en el siguiente contexto y datos relevantes:
${relevantContext}

Analiza y lista las áreas con mayor potencial de crecimiento para emprendedores y startups en México,
específicamente relevantes para ${companyInfo.industria}:

1. Identifica los sectores con mayor potencial
2. Analiza las tendencias de crecimiento por sector
3. Evalúa las oportunidades específicas en cada área
4. Considera factores como:
   - Tendencias del mercado
   - Necesidades no cubiertas
   - Innovación tecnológica
   - Cambios demográficos`;

    return await callAI(prompt);
}

async function getInfraestructura(companyInfo: any, relevantContext: string) {
    const prompt = `
Basado en el siguiente contexto y datos relevantes:
${relevantContext}

Proporciona un análisis detallado de la infraestructura necesaria para ${companyInfo.industria} 
por estado (CDMX, EdoMex, Jalisco, Nuevo León, Guanajuato, Querétaro, Puebla), considerando:

Para cada estado, analiza:
1. Infraestructura financiera
   - Disponibilidad de fondos
   - Programas de financiamiento
   - Instituciones financieras

2. Infraestructura urbana
   - Calidad de vida
   - Conectividad
   - Servicios básicos

3. Infraestructura tecnológica
   - Velocidad de internet
   - Servicios tecnológicos
   - Hubs de innovación

4. Infraestructura educativa
   - Calidad educativa
   - Programas de capacitación
   - Instituciones académicas

Proporciona una evaluación cualitativa (alta/media/baja) para cada aspecto y justifica.`;

    return await callAI(prompt);
}

async function getFactoresCulturales(companyInfo: any, relevantContext: string) {
    const prompt = `
Basado en el siguiente contexto y datos relevantes:
${relevantContext}

Analiza los factores culturales que afectan a ${companyInfo.industria} 
por estado (CDMX, EdoMex, Jalisco, Nuevo León, Guanajuato, Querétaro, Puebla), incluyendo:

Para cada estado, evalúa:
1. Valoración del riesgo y la innovación (con porcentajes)
2. Nivel de apoyo familiar y social (con porcentajes)
3. Percepción del éxito y el fracaso
4. Mentalidad emprendedora local

Proporciona datos cuantitativos cuando sea posible y ejemplos específicos.`;

    return await callAI(prompt);
}

async function getMercadosTAMSAMSOM(companyInfo: any, relevantContext: string) {
    const prompt = `
Basado en el siguiente contexto y datos relevantes:
${relevantContext}

Genera tres secciones detalladas sobre los mercados TAM, SAM y SOM para ${companyInfo.nombreEmpresa} en ${companyInfo.industria}:

1. Mercado Total Direccionable (TAM)
   - Define el concepto
   - Calcula el TAM para emprendedores y startups
   - Explica la metodología
   - Proporciona cifras específicas

2. Mercado Disponible Servible (SAM)
   - Define el concepto
   - Calcula el SAM para emprendedores y startups
   - Explica los factores considerados
   - Proporciona cifras específicas

3. Mercado Obtenible Servible (SOM)
   - Define el concepto
   - Calcula el SOM para emprendedores y startups
   - Explica los factores limitantes
   - Proporciona cifras específicas

Incluye cálculos detallados y justificación para cada mercado.`;

    return await callAI(prompt);
}

async function generateFinalReport(analysisData: any, companyInfo: any, steps: any[]) {
    const prompt = `
Con base en toda la siguiente información detallada:

Definiciones Básicas:
${analysisData.basicDefinitions}

Estructura de Mercado:
${analysisData.marketStructure}

Conteo de Startups:
${analysisData.startupCounts}

Análisis Poblacional:
${analysisData.populationAnalysis}

Áreas de Crecimiento:
${analysisData.areasCrecimiento}

Infraestructura:
${analysisData.infraestructura}

Factores Culturales:
${analysisData.factoresCulturales}

Análisis TAM/SAM/SOM:
${analysisData.mercadosTAMSAMSOM}

Respuestas del usuario:
${steps.map((step: any) => `${step.title}: ${step.question}\nRespuesta: ${step.response}`).join("\n\n")}

Genera un informe ejecutivo completo con el siguiente formato exacto:

# 📊 Sondeo geográfico asistido por IA para mapear oportunidades de mercado
---------------------------------------------------------------------------------------------------
## 📋 Resumen ejecutivo
[Sintetiza toda la información anterior en un resumen ejecutivo conciso pero completo]
---------------------------------------------------------------------------------------------------
## 🗺️ 1. Tamaño del mercado por zonas
[Utiliza la información de marketStructure y startupCounts]
---------------------------------------------------------------------------------------------------
## 📈 2. Áreas con potencial de crecimiento
[Basado en areasCrecimiento y análisis poblacional]
---------------------------------------------------------------------------------------------------
## 🏗️ 3. Consideraciones detalladas sobre infraestructura
[Utiliza la información detallada del análisis de infraestructura]
---------------------------------------------------------------------------------------------------
## 👥 4. Factores Culturales
[Basado en el análisis cultural detallado]
---------------------------------------------------------------------------------------------------
## 🎯 5. Mercado Total Direccionable (TAM)
[Utiliza los cálculos y definiciones del análisis TAM]
---------------------------------------------------------------------------------------------------
## 🏙️ 6. Mercado Disponible Servible (SAM)
[Utiliza los cálculos y definiciones del análisis SAM]
---------------------------------------------------------------------------------------------------
## 🎯 7. Mercado Obtenible Servible (SOM)
[Utiliza los cálculos y definiciones del análisis SOM]
---------------------------------------------------------------------------------------------------
## 💡 Conclusión
[Sintetiza los hallazgos clave y proporciona recomendaciones específicas]

Asegúrate de:
1. Mantener el formato exacto con emojis y líneas divisorias
2. Integrar toda la información analizada de manera coherente
3. Personalizar específicamente para ${companyInfo.nombreEmpresa} en ${companyInfo.industria}
4. Incluir datos cuantitativos y cualitativos relevantes
5. Mantener consistencia en números y estadísticas`;

    return await callAI(prompt);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { steps, companyInfo } = body;

        // Validar datos requeridos
        if (!companyInfo || !companyInfo.nombreEmpresa || !companyInfo.industria) {
            return new NextResponse(JSON.stringify({
                success: false,
                error: "Se requieren datos de la empresa (nombreEmpresa e industria)",
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            // Obtener contexto relevante
            const relevantContext = await getRelevantContext(companyInfo);

            // Obtener todos los análisis
            const [
                basicDefinitions,
                marketStructure,
                startupCounts,
                populationAnalysis,
                areasCrecimiento,
                infraestructura,
                factoresCulturales,
                mercadosTAMSAMSOM,
            ] = await Promise.all([
                getBasicDefinitions(companyInfo, relevantContext),
                getMarketStructure(companyInfo, relevantContext),
                getStartupCounts(companyInfo, relevantContext),
                getPopulationAnalysis(companyInfo, relevantContext),
                getAreasCrecimiento(companyInfo, relevantContext),
                getInfraestructura(companyInfo, relevantContext),
                getFactoresCulturales(companyInfo, relevantContext),
                getMercadosTAMSAMSOM(companyInfo, relevantContext),
            ]);

            // Consolidar análisis

          const analysisData = {
                          basicDefinitions,
                          marketStructure,
                          startupCounts,
                          populationAnalysis,
                          areasCrecimiento,
                          infraestructura,
                          factoresCulturales,
                          mercadosTAMSAMSOM
                      };

                      // Generar reporte final
                      const finalReport = await generateFinalReport(analysisData, companyInfo, steps);

                      // Asegurar formato correcto
                      const formattedReport = finalReport
                          .replace(/\n{3,}/g, '\n\n')
                          .replace(/^(#+ [^#\n]+)$/gm, '$1\n---------------------------------------------------------------------------------------------------')
                          .replace(/\n\s*\n---------------------------------------------------------------------------------------------------/g, '\n---------------------------------------------------------------------------------------------------');

                      // Estructura de la respuesta
                      const response = {
                          success: true,
                          analysis: formattedReport,
                          markdownReport: formattedReport,
                          metadata: {
                              empresa: companyInfo.nombreEmpresa,
                              industria: companyInfo.industria,
                              fechaGeneracion: new Date().toISOString(),
                              modeloUtilizado: MODEL_VERSION,
                              analisesRealizados: [
                                  'basicDefinitions',
                                  'marketStructure',
                                  'startupCounts',
                                  'populationAnalysis',
                                  'areasCrecimiento',
                                  'infraestructura',
                                  'factoresCulturales',
                                  'mercadosTAMSAMSOM'
                              ],
                              datosAnalizados: {
                                  tieneContextoRelevante: !!relevantContext,
                                  tieneRespuestasUsuario: steps.length > 0,
                                  numeroDeAnalisisRealizados: 8
                              }
                          },
                          rawData: {
                              basicDefinitions,
                              marketStructure,
                              startupCounts,
                              populationAnalysis,
                              areasCrecimiento,
                              infraestructura,
                              factoresCulturales,
                              mercadosTAMSAMSOM
                          }
                      };

                      return new NextResponse(JSON.stringify(response), {
                          status: 200,
                          headers: {
                              'Content-Type': 'application/json',
                              'Cache-Control': 'no-store, must-revalidate',
                              'Pragma': 'no-cache'
                          }
                      });

                  } catch (analysisError) {
                      console.error("Error en el análisis:", analysisError);
                      return new NextResponse(JSON.stringify({
                          success: false,
                          error: "Error al generar el análisis",
                          details: analysisError.message,
                          errorType: analysisError.name,
                          timestamp: new Date().toISOString()
                      }), {
                          status: 500,
                          headers: {
                              'Content-Type': 'application/json'
                          }
                      });
                  }

              } catch (parseError) {
                  console.error("Error al procesar la solicitud:", parseError);
                  return new NextResponse(JSON.stringify({
                      success: false,
                      error: "Error al procesar la solicitud",
                      details: parseError.message,
                      errorType: parseError.name,
                      timestamp: new Date().toISOString()
                  }), {
                      status: 400,
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  });
              }
          }