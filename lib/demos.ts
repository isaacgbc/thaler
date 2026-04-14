export interface DemoPreset {
  id: string;
  label: string;
  subtitle: string;
  input: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "azos",
    label: "Azos — Insurtech Brasil",
    subtitle: "Series C · R$307M primas · 100K pólizas",
    input:
      "Azos: insurtech de seguros de vida individual en Brasil. Modelo MGA (sin licencia propia, partner con aseguradora Excelsior que asume el riesgo). 100K pólizas activas. R$307M en primas anualizadas. 1% de market share en un mercado de R$25B dominado por Bradesco y Prudential (64% combinado). 11,000 corredores partners. $21B en capital asegurado. 97 empleados. Acaba de levantar $25M Series C de Kaszek para expandir AI en underwriting y claims. Quieren ser el Nubank de los seguros de vida.",
  },
  {
    id: "tapi",
    label: "Tapi — Payments LATAM",
    subtitle: "Series B · $6B volumen · 250M tx/año",
    input:
      "Tapi: red de orquestación de pagos argentina operando en Argentina, Chile, Perú, Colombia y México. Procesa $6B+ en volumen con 250M+ transacciones anuales (~25M mensuales). Series B de $27M liderada por Kaszek (feb 2026), $60M total levantado desde 2022. Clientes: fintechs, bancos, retailers, aseguradoras y billers para pagos recurrentes, servicios, recargas y gift cards. Llegó a rentabilidad en 2025. En junio 2025 adquirió las operaciones de Arcus de Mastercard en México — agrega ~20,000 empresas de servicios y ~70,000 puntos físicos de cobranza. Lanzando tapipay: plataforma de automatización de cobranza para PyMEs, aseguradoras, escuelas e instituciones financieras regionales. Fundadores: Tomás Mindlin (CEO), Kevin Litvin (CBO), Nicolás Andriano (CTO, ex-Head of Revenue Management en Flybondi).",
  },
  {
    id: "lavanderia",
    label: "Lavandería Industrial BA",
    subtitle: "B2B hoteles · $40K/mes · 8 años",
    input:
      "Cadena de 3 lavanderías industriales en Buenos Aires, Argentina. Clientes B2B: hoteles boutique y restaurantes de alta gama. Facturación $40K USD/mes. 15 empleados. Operando hace 8 años. Buscando abrir una 4ta planta. Sin presencia digital. Todo el negocio se mueve por relaciones y WhatsApp.",
  },
  {
    id: "saas-restaurantes",
    label: "SaaS Restaurantes MX",
    subtitle: "$29/mo · 200 users · 8mo runway",
    input:
      "SaaS de gestión de inventario y facturación fiscal SAT para restaurantes en México. Pricing $29 USD/mo. 200 usuarios activos. Equipo de 3 personas. 8 meses de runway. Crecimiento 12% MoM. Churn actual 6%/mes.",
  },
];
