import { useState, useEffect, useRef } from "react";

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:        "#0A0A0A",
  bgCard:    "#111111",
  bgOverlay: "#0E0E0E",
  border:    "#1C1C1C",
  borderHov: "#7EB8A4",
  cream:     "#F5F0E8",   // primary text
  creamDim:  "#B8B0A0",   // secondary text
  creamFaint:"#6A6460",   // muted / labels
  sage:      "#7EB8A4",   // accent
  sageDim:   "#4E8A78",   // dimmed accent
  sageFaint: "#2A4A42",   // very subtle accent bg tint
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About", "Services", "Impact", "Contact"];
// Nav is rendered as a visible bar , all links above are shown

const SERVICES = [
  {
    number: "01",
    title: "Ad Hoc Analysis",
    description:
      "You have a question your data should be able to answer but nobody has dug in yet. I conduct deep-dive analyses using the right tools for the job, write clear reports that cut through the noise, and build one-time dashboards that give you the view you need, when you need it.",
    deliverables: ["Exploratory data analysis", "Written insight reports", "One-time diagnostic dashboards", "Stakeholder-ready findings"],
  },
  {
    number: "02",
    title: "Reporting Automation",
    description:
      "If your team is still manually pulling data every week, that is time and accuracy being lost. I build self-serve analytics dashboards and define the metrics that actually drive decisions, so your team spends time on analysis rather than assembly.",
    deliverables: ["Self-serve BI dashboards", "Metric definition and governance", "Automated refresh pipelines", "KPI frameworks for decision-making"],
  },
  {
    number: "03",
    title: "End-to-End Data Pipelines",
    description:
      "From raw data to production-grade infrastructure. I design and build complete data pipelines covering ingestion, cleaning, transformation, analysis, visualization, and monitoring, so your data is always fresh, reliable, and ready to use.",
    deliverables: ["ETL / ELT pipeline architecture", "Data cleaning and transformation layers", "dbt modelling and testing", "Pipeline monitoring and alerting"],
  },
];

const SKILLS = [
  { category: "Analytics & BI",               items: ["SQL", "Python", "Power BI", "Tableau", "Looker", "Looker Studio", "MS Excel", "Data Visualization", "Dashboard Development", "A/B Testing"] },
  { category: "Data Engineering & Pipelines", items: ["dbt", "ETL Pipelines", "BigQuery", "Snowflake", "Data Warehousing", "KNIME Analytics", "Cloud Functions", "Cloud Scheduling", "Medallion Architecture"] },
  { category: "Data Quality & Modeling",      items: ["Data Quality", "Data Cleaning", "Anomaly Detection", "Data Modeling", "Automated Testing", "Data Governance", "Data Migration"] },
  { category: "Automation & Integration",     items: ["Power Automate", "Vertex AI", "Dynamics 365", "Odoo", "ServiceNow", "MySQL", "Google Cloud Platform", "Git"] },
];

const PROJECTS = [
  {
    id: 1,
    title: "P2P Payment Feature Analytics",
    client: "Fintech / Crypto App",
    tags: ["BigQuery", "Python", "Looker Studio", "SQL", "Medallion Architecture"],
    summary:
      "Built an end-to-end analytics pipeline for a newly launched P2P payment feature, covering data generation, data cleaning, anomaly detection, data quality checks, and dashboard development tracking $729K in transaction volume.",
    impact: [
      { value: "$729K", label: "USD volume tracked" },
      { value: "90.2%", label: "Transaction success rate" },
      { value: "4,929", label: "Transactions processed" },
    ],
    detail: `The brief: a P2P payment feature had just launched inside a fintech app. The goal was to build and validate the entire analytics pipeline, from raw noisy data through to trusted metrics and executive reporting.

The first step was generating realistic synthetic data using Python: approximately 1,000 users, 5,000 transactions, and 10,000 app events across one month. The data was intentionally imperfect, introducing real-world anomalies including transactions timestamped before user signup, duplicate transaction IDs caused by network retry logic, and NULL values in critical fields. This anomaly detection and data quality validation layer stress-tested the pipeline against the kinds of issues that appear in production environments.

The pipeline was built on BigQuery using a two-layer medallion architecture for data warehousing: a raw dataset ingesting the source data as-is, and a clean dataset populated through SQL transformation queries that performed data cleaning, documented each anomaly, and resolved them systematically. Data modeling was handled via CTEs rather than views, keeping the logic transparent and auditable. Automated testing was applied to validate row counts, null rates, and referential integrity before data was promoted to the clean layer. The clean data was then connected directly to Looker Studio for dashboard development and visualisation.

The final dashboard tracked total USD volume transacted, daily active users, average transactions per user, transaction status distribution, and feature adoption rates. Key findings included a 90.2% transaction success rate, an end-of-month volume spike indicating growing feature traction, and a 38.22% feature adoption rate among active app users, with a strategic recommendation on whether to scale the feature based on the data.`,
    images: ["/dashboard-p2p.png"],
  },
  {
    id: 2,
    title: "SaaS Marketing & Conversion Analytics",
    client: "SaaS Company",
    tags: ["Power BI", "dbt", "SQL", "Python"],
    summary:
      "Replaced a 2-day manual reporting process with a fully automated 4-hour pipeline, including dbt transformations, data quality checks, and a live Power BI dashboard tracking conversions and user behaviour.",
    impact: [
      { value: "96%",           label: "Reduction in reporting time" },
      { value: "2 days to 4 hrs", label: "Full turnaround" },
      { value: "3-layer",       label: "dbt pipeline architecture" },
    ],
    detail: `The client's analytics team was spending two full working days every week manually pulling, cleaning, and formatting data for executive reporting. The process was error-prone, undocumented, and impossible to scale. The core business need was to understand how users interacted with their website and social channels, and what behaviours were actually driving conversions.

I designed and built an end-to-end automated reporting pipeline using Python for ingestion and data cleaning, dbt for data modeling and transformation across a 3-layer architecture covering raw staging, business logic, and mart layers. Automated testing and data quality checks were built into every layer, flagging anomalies and schema drift before bad data could reach the dashboard.

The final output was a multi-page Power BI dashboard covering an Executive Overview, Social Media deep dive, and Website Analytics — delivering full dashboard development from raw source to executive-ready visualisation. Key results: 500 total users generating 8,822 social engagements and 27,302 conversion events at a 2.75% conversion rate. LinkedIn drove 48.84% of social engagement. Africa led user distribution across regions. Afternoon and evening were the highest-traffic windows by page views, with 18,221 and 18,198 respectively. Conversions showed consistent growth from July through September before plateauing, giving the client a clear signal on where to focus acquisition efforts. What took 2 days now runs in under 4 hours with zero manual intervention.`,
    images: ["/dashboard-saas.png"],
  },
  {
    id: 3,
    title: "Call Centre Staffing Optimisation",
    client: "Healthcare / Simulation Study",
    tags: ["Power BI", "Python", "Excel", "Scikit-learn"],
    summary:
      "Analysed 9 weeks of hourly chat support data across multiple international call centres to optimise agent scheduling and close an SLA gap, without increasing headcount.",
    impact: [
      { value: "13.21K", label: "Inbound chats analysed" },
      { value: "80%",    label: "SLA target within 30 seconds" },
      { value: "4-phase", label: "Rollout plan delivered" },
    ],
    detail: `This project simulates a real-world staffing challenge for a chat support team spread across multiple international call centres. The objective was to optimise agent schedules to meet a strict SLA target of responding to 80% of inbound chats within 30 seconds, without increasing headcount.

The analysis involved data cleaning and merging of multi-source datasets, anomaly detection across timestamp and volume fields, and evaluating staffing inefficiencies across time zones and days of the week. Predictive models were built using Python and Scikit-learn to identify optimal staffing levels per hour. Data visualization through heatmaps of response times against inbound volume revealed clear understaffing windows that were not visible in the raw data.

Power BI was used for dashboard development covering key metrics including average response time, agent distribution by day, and chat volume patterns through KPI cards, line charts, and a response time heatmap. A strategic investment memo and 4-phase rollout plan were developed alongside the dashboard to support leadership decision-making.`,
    images: ["/dashboard-callcenter.png"],
  },
  {
    id: 4,
    title: "ERP Data Migration & Integration",
    client: "Enterprise Client via Cathena",
    tags: ["Dynamics 365 HR", "Dynamics 365 F&O", "ServiceNow", "UAT"],
    showDashboard: false,
    summary:
      "Led field mapping, validation, and UAT for a 50K+ record migration from Microsoft Dynamics 365 HR to Finance & Operations, resolving systemic data mismatches before merge to achieve zero data loss in GDPR compliance.",
    impact: [
      { value: "50K+", label: "User records migrated" },
      { value: "70%",  label: "Of flagged incidents were avoidable" },
      { value: "0",    label: "Data loss incidents" },
    ],
    detail: `The engagement involved migrating over 50,000 user records from Microsoft Dynamics 365 HR to Microsoft Dynamics 365 Finance and Operations. My role covered end-to-end field mapping, data validation, and data quality checks between both systems, carried out in the UAT environment before any changes were pushed to production.

Before the migration could proceed, a pre-existing problem had to be addressed. There were recurring data mismatches in the Finance and Operations system that diverged from the gold standard held in the HR system. These mismatches were responsible for 70% of the workflow incidents being flagged in ServiceNow. The majority were entirely avoidable and were consuming significant IT team capacity that should have been directed elsewhere.

Fixing this before the merge was critical, both for data integrity and for GDPR compliance. To make the case to non-technical stakeholders, I used data visualization to present three months of incident data, isolating and highlighting the recurring mismatches in a business review. This gave leadership a clear picture of the volume, pattern, and timeline impact of the issue, and secured the alignment needed to resolve it before proceeding.

With the data quality issues addressed, I wrote UAT test scripts covering key functionalities in the production environment to ensure that end users of the affected areas would experience no disruption post-migration, and to surface any issues before they reached those users. The data migration completed with zero data loss incidents and in full compliance with GDPR.`,
    images: [],
  },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── CASE STUDY OVERLAY ───────────────────────────────────────────────────────
function CaseStudy({ project, onClose }) {
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") lightbox ? setLightbox(false) : onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, onClose]);

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(0,0,0,0.96)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "4vh 4vw", cursor: "zoom-out",
          }}
        >
          <img
            src={project.images[0]}
            alt="Dashboard full view"
            style={{ maxWidth: "100%", maxHeight: "90vh", border: `1px solid ${C.border}`, objectFit: "contain" }}
          />
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute", top: "2rem", right: "2rem",
              background: "none", border: `1px solid ${C.border}`,
              padding: "0.4rem 0.9rem", cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
              letterSpacing: "0.1em", color: C.sageDim,
            }}
          >Close ×</button>
        </div>
      )}

      {/* Case study panel */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "5vh 4vw", overflowY: "auto",
        }}
      >
        <div style={{
          background: C.bgOverlay, border: `1px solid ${C.border}`,
          maxWidth: "800px", width: "100%",
          padding: "clamp(2rem, 5vw, 4rem)",
          opacity: 0, animation: "slideUp 0.45s ease forwards",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
            <div>
              <p className="mono label">{project.client}</p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 400, color: C.cream, marginTop: "0.4rem" }}>{project.title}</h2>
            </div>
            <button onClick={onClose} className="close-btn">Close ×</button>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "2rem" }}>
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>

          {/* Impact strip */}
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${project.impact.length}, 1fr)`,
            gap: "1.5rem", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
            padding: "1.75rem 0", marginBottom: "2.5rem",
          }}>
            {project.impact.map(m => (
              <div key={m.label}>
                <p style={{ fontSize: "2rem", fontWeight: 300, color: C.sage, lineHeight: 1 }}>{m.value}</p>
                <p className="mono label" style={{ marginTop: "0.4rem" }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Detail text */}
          <div style={{ marginBottom: "2.5rem" }}>
            {project.detail.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: "1rem", fontWeight: 300, lineHeight: 1.9, color: C.creamDim, marginBottom: "1.25rem" }}>{para}</p>
            ))}
          </div>

          {/* Thumbnail */}
          {project.showDashboard !== false && (
            project.images.length > 0 ? (
              <div>
                <p className="mono label" style={{ marginBottom: "1rem" }}>Dashboard</p>
                <img
                  src={project.images[0]}
                  alt="Dashboard thumbnail"
                  onClick={() => setLightbox(true)}
                  style={{
                    width: "100%", maxHeight: "220px", objectFit: "cover",
                    objectPosition: "top", border: `1px solid ${C.border}`,
                    cursor: "zoom-in", transition: "opacity 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={e => e.target.style.opacity = "0.8"}
                  onMouseLeave={e => e.target.style.opacity = "1"}
                />
                <p className="mono label" style={{ marginTop: "0.6rem", color: C.sageDim }}>Click to expand</p>
              </div>
            ) : (
              <div style={{ border: `1px dashed ${C.border}`, padding: "3rem", textAlign: "center" }}>
                <p className="mono label">Dashboard screenshots coming soon</p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PreciousOben() {
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [contactOpen,    setContactOpen]    = useState(false);
  const [formData,       setFormData]       = useState({ email: "", subject: "", body: "" });
  const [sent,           setSent]           = useState(false);
  const [activeProject,  setActiveProject]  = useState(null);
  const [showAll,        setShowAll]        = useState(false);

  const visibleProjects = showAll ? PROJECTS : PROJECTS.slice(0, 4);

  const handleSend = async () => {
    if (!formData.email || !formData.subject || !formData.body) return;
    try {
      const res = await fetch("https://formspree.io/f/xreajazj", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          subject: formData.subject,
          message: formData.body,
          _replyto: formData.email,
        }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => { setSent(false); setFormData({ email: "", subject: "", body: "" }); setContactOpen(false); }, 3000);
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: C.bg, color: C.cream, minHeight: "100vh" }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0A; }

        ::selection        { background: #7EB8A4; color: #0A0A0A; }
        ::-webkit-scrollbar       { width: 3px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #7EB8A4; border-radius: 2px; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .mono { font-family: 'DM Mono', monospace; }

        /* utility label */
        .label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: #6A6460;
        }

        /* nav buttons */
        .nav-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 0.68rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #6A6460; transition: color 0.2s; padding: 0;
        }
        .nav-btn:hover { color: #7EB8A4; }

        /* main buttons */
        .btn-sage {
          border: 1px solid #7EB8A4; padding: 0.85rem 2.4rem;
          background: transparent; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 0.68rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #7EB8A4; transition: all 0.25s;
        }
        .btn-sage:hover { background: #7EB8A4; color: #0A0A0A; }

        .btn-ghost {
          border: 1px solid #2A2A2A; padding: 0.85rem 2.4rem;
          background: transparent; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 0.68rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #B8B0A0; transition: all 0.25s;
        }
        .btn-ghost:hover { border-color: #7EB8A4; color: #7EB8A4; }

        /* tags */
        .tag {
          display: inline-block; border: 1px solid #1E1E1E;
          padding: 0.22rem 0.75rem;
          font-family: 'DM Mono', monospace; font-size: 0.58rem;
          letter-spacing: 0.08em; color: #6A6460;
          margin: 0.2rem 0.15rem; transition: border-color 0.2s, color 0.2s;
        }
        .tag:hover { border-color: #4E8A78; color: #7EB8A4; }

        /* cards */
        .project-card {
          border: 1px solid #181818; padding: 2.5rem;
          background: #111111; transition: border-color 0.3s, background 0.3s;
        }
        .project-card:hover { border-color: #2A4A42; background: #121A18; }

        .service-card {
          border: 1px solid #181818; padding: 2.5rem;
          background: #111111; transition: border-color 0.3s;
          position: relative; overflow: hidden;
        }
        .service-card:hover { border-color: #2A4A42; }

        /* form */
        .contact-field {
          width: 100%; border: 1px solid #1C1C1C; background: #0C0C0C;
          padding: 0.9rem 1rem;
          font-family: 'Lora', serif; font-size: 0.95rem;
          color: #F5F0E8; outline: none; transition: border-color 0.2s; resize: none;
        }
        .contact-field:focus  { border-color: #7EB8A4; }
        .contact-field::placeholder { color: #2A2A2A; }

        /* misc */
        .read-more-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #4E8A78; padding: 0; transition: color 0.2s;
          text-decoration: underline; text-underline-offset: 4px;
        }
        .read-more-btn:hover { color: #7EB8A4; }

        .close-btn {
          background: none; border: 1px solid #1C1C1C; padding: 0.4rem 0.9rem;
          cursor: pointer; font-family: 'DM Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; color: #4E8A78; flex-shrink: 0; margin-left: 1rem;
          transition: border-color 0.2s, color 0.2s;
        }
        .close-btn:hover { border-color: #7EB8A4; color: #7EB8A4; }

        .social-link {
          font-family: 'DM Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.1em; color: #3A3A3A; text-decoration: none; transition: color 0.2s;
        }
        .social-link:hover { color: #7EB8A4; }

        .skill-group  { border-left: 1px solid #2A4A42; padding-left: 1.5rem; }
        .exp-item     { border-left: 1px solid #1E1E1E; padding-left: 1.5rem; }
        .divider      { height: 1px; background: #141414; }

        /* ── RESPONSIVE ── */

        /* Tablet: 481px to 900px */
        @media (max-width: 900px) {
          .grid-3      { grid-template-columns: 1fr 1fr !important; }
          .grid-skills { grid-template-columns: 1fr 1fr !important; }
          .hero-stats  { grid-template-columns: repeat(2,1fr) !important; gap: 2.5rem !important; }
        }

        /* Mobile: 480px and below */
        @media (max-width: 480px) {
          .grid-2      { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .grid-3      { grid-template-columns: 1fr !important; }
          .grid-skills { grid-template-columns: 1fr !important; }
          .hero-stats  { grid-template-columns: repeat(2,1fr) !important; gap: 1.5rem !important; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .project-card { padding: 1.5rem !important; }
          .service-card { padding: 1.5rem !important; }
          .btn-sage, .btn-ghost { padding: 0.75rem 1.5rem !important; font-size: 0.62rem !important; }
          .nav-btn { font-size: 0.6rem !important; }
        }

        /* All mobile nav */
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          button.show-mobile { display: flex !important; }
        }

        /* Impact grid on small screens */
        @media (max-width: 480px) {
          .impact-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {activeProject && <CaseStudy project={activeProject} onClose={() => setActiveProject(null)} />}

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "1.2rem 5vw",
        background: "rgba(10,10,10,0.98)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1A1A1A",
        width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="nav-btn" onClick={() => { scrollTo("hero"); setMenuOpen(false); }} style={{ color: C.sageDim, letterSpacing: "0.2em", fontWeight: 400 }}>
            Precious Oben
          </button>
          {/* Desktop links */}
          <div className="hide-mobile" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <button key={l} className="nav-btn" onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
            ))}
          </div>
          {/* Hamburger button */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: "none", background: "none", border: "none", cursor: "pointer",
              flexDirection: "column", gap: "5px", padding: "4px",
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: "22px", height: "1px",
                background: menuOpen ? C.sage : C.creamDim,
                transition: "all 0.25s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                  : i === 2 ? "rotate(-45deg) translate(4px, -4px)"
                  : "scaleX(0)"
                  : "none",
              }} />
            ))}
          </button>
        </div>
        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #1A1A1A", marginTop: "1.2rem", paddingTop: "0.5rem" }}>
            {NAV_LINKS.map(l => (
              <button
                key={l} className="nav-btn"
                onClick={() => { scrollTo(l.toLowerCase()); setMenuOpen(false); }}
                style={{ textAlign: "left", padding: "0.9rem 0", borderBottom: "1px solid #141414", fontSize: "0.78rem" }}
              >{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "92vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(3rem, 8vw, 6rem) 5vw", maxWidth: "1200px", margin: "0 auto", position: "relative", overflow: "hidden" }}>

        {/* Background - single line chart with natural fluctuation */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none", userSelect: "none" }}>
          <svg width="100%" height="100%" viewBox="0 0 1200 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Area fill */}
            <polyline
              points="0,320 120,200 240,280 360,260 480,160 600,340 720,180 840,240 960,120 1080,200 1200,100 1200,500 0,500"
              fill="#7EB8A4" fillOpacity="0.06"
            />
            {/* Main line */}
            <polyline
              points="0,320 120,200 240,280 360,260 480,160 600,340 720,180 840,240 960,120 1080,200 1200,100"
              stroke="#7EB8A4" strokeWidth="1.5" fill="none" strokeLinejoin="round"
            />
            {/* Data points */}
            {[[0,320],[120,200],[240,280],[360,260],[480,160],[600,340],[720,180],[840,240],[960,120],[1080,200],[1200,100]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#0A0A0A" stroke="#7EB8A4" strokeWidth="1.5" />
            ))}
          </svg>
        </div>

        <div style={{ opacity: 0, animation: "fadeUp 0.9s ease 0.1s forwards", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.025em", color: C.cream }}>
            Precious<br />
            <span style={{ fontStyle: "italic", color: C.sage }}>Oben</span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)", fontWeight: 300, color: C.creamDim, maxWidth: "560px", lineHeight: 1.8, marginTop: "2.5rem", marginBottom: "3.5rem" }}>
            Data Analyst and Engineer. I build end-to-end pipelines, automate reporting, and turn fragmented data into decisions that drive real business outcomes.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0" }}>
            <button className="btn-sage"  onClick={() => scrollTo("services")}>See What I Do</button>
            <button className="btn-ghost" onClick={() => scrollTo("impact")}>Impact</button>
            <button className="btn-ghost" onClick={() => { scrollTo("contact"); setTimeout(() => setContactOpen(true), 700); }}>Get In Touch</button>
          </div>
        </div>

        {/* Hero stats */}
        <div className="hero-stats" style={{
          marginTop: "6rem", display: "grid",
          gridTemplateColumns: "repeat(4, auto)", gap: "3.5rem",
          justifyContent: "start", opacity: 0, animation: "fadeUp 0.9s ease 0.5s forwards",
          position: "relative", zIndex: 1,
        }}>
          {[
            ["$729K",  "P2P volume tracked"],
            ["13.21K", "Support chats analysed"],
            ["3+",   "Years experience"],
            ["50K+",  "User records migrated"],
          ].map(([val, label]) => (
            <div key={label}>
              <p style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 300, color: C.cream, lineHeight: 1 }}>{val}</p>
              <p className="label" style={{ marginTop: "0.5rem", color: C.sageDim }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth: "1200px", margin: "0 auto" }} />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "clamp(3.5rem, 8vw, 7rem) 5vw", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "6rem", alignItems: "start" }} className="grid-2">
          <FadeIn>
            <p className="label" style={{ marginBottom: "1.5rem" }}>About</p>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, color: C.cream }}>
              Hi, I'm<br /><span style={{ fontStyle: "italic", color: C.sage }}>Precious</span>
            </h2>
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <a href="https://www.linkedin.com/in/preciousoben" target="_blank" rel="noreferrer" className="social-link">LinkedIn ↗</a>
              <a href="https://github.com/preciousoben" target="_blank" rel="noreferrer" className="social-link">GitHub ↗</a>
              <a href="https://twitter.com/PreTalksData" target="_blank" rel="noreferrer" className="social-link">Twitter ↗</a>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            {/* Stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2.75rem" }}>
              {[
                { val: "96%",  desc: "Reduction in manual reporting time, automated from 2 days to 4 hours" },
                { val: "13.21K", desc: "Inbound support chats analysed to optimise call centre staffing across international locations" },
                { val: "$729K", desc: "USD in P2P transaction volume tracked through a fully validated analytics pipeline" },
                { val: "70%",  desc: "Of ServiceNow workflow incidents were avoidable data mismatches, resolved before a 50K+ record ERP migration" },
              ].map(s => (
                <div key={s.val} style={{ borderLeft: `1px solid ${C.sage}`, paddingLeft: "1.25rem" }}>
                  <p style={{ fontSize: "1.9rem", fontWeight: 300, color: C.sage, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.65, color: C.creamFaint, marginTop: "0.45rem" }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.9, color: C.creamDim }}>
              I design and build data infrastructure: pipelines, transformations, and dashboards that businesses can actually rely on. Whether it's automating a broken reporting process, migrating data across enterprise systems, or modeling a clean analytics layer in dbt, I work across the full stack from ingestion to insight.
            </p>
            <p style={{ fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.9, color: C.creamDim, marginTop: "1rem" }}>
              Open to consulting projects, B2B contracts, and remote roles where data is taken seriously.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="divider" style={{ maxWidth: "1200px", margin: "0 auto" }} />

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "clamp(3.5rem, 8vw, 7rem) 5vw", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <p className="label" style={{ marginBottom: "1rem" }}>Services</p>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, color: C.cream, marginBottom: "0.75rem" }}>
            What I can do<br /><span style={{ fontStyle: "italic", color: C.sage }}>for your business</span>
          </h2>
          <p style={{ fontSize: "1rem", fontWeight: 300, color: C.creamFaint, maxWidth: "500px", lineHeight: 1.8, marginBottom: "4rem" }}>
            Three ways I work with companies. Each engagement is scoped to your specific situation.
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="grid-3">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.number} delay={i * 0.1}>
              <div className="service-card">
                <p className="label" style={{ color: C.sageDim, marginBottom: "1.5rem" }}>{s.number}</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 400, color: C.cream, marginBottom: "1.25rem", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "0.92rem", fontWeight: 300, lineHeight: 1.85, color: C.creamDim, marginBottom: "2rem" }}>{s.description}</p>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem" }}>
                  <p className="label" style={{ marginBottom: "0.75rem", color: C.sageDim }}>Includes</p>
                  {s.deliverables.map(d => (
                    <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.5rem" }}>
                      <span style={{ color: C.sage, fontSize: "0.7rem", marginTop: "0.15rem", flexShrink: 0 }}>+</span>
                      <p style={{ fontSize: "0.82rem", fontWeight: 300, color: C.creamFaint, lineHeight: 1.5 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div style={{ marginTop: "3rem", padding: "clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2.5rem)", border: `1px solid ${C.border}`, background: "#0E0E0E", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "1.05rem", fontWeight: 400, color: C.cream, marginBottom: "0.3rem" }}>Not sure which fits your situation?</p>
              <p style={{ fontSize: "0.9rem", fontWeight: 300, color: C.creamFaint }}>Reach out and describe what you're working with. I'll tell you what makes sense.</p>
            </div>
            <button className="btn-sage" onClick={() => { scrollTo("contact"); setTimeout(() => setContactOpen(true), 700); }}>
              Talk to me
            </button>
          </div>
        </FadeIn>
      </section>

      <div className="divider" style={{ maxWidth: "1200px", margin: "0 auto" }} />

      {/* ── STACK ── */}
      <section id="stack" style={{ padding: "clamp(3.5rem, 8vw, 7rem) 5vw", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <p className="label" style={{ marginBottom: "1rem" }}>Stack</p>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, color: C.cream, marginBottom: "4rem" }}>
            Tools I reach for
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "3.5rem" }} className="grid-skills">
          {SKILLS.map((group, i) => (
            <FadeIn key={group.category} delay={i * 0.08}>
              <div className="skill-group">
                <p className="label" style={{ color: C.sageDim, marginBottom: "1rem" }}>{group.category}</p>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {group.items.map(item => <span key={item} className="tag">{item}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth: "1200px", margin: "0 auto" }} />

      {/* ── IMPACT ── */}
      <section id="impact" style={{ padding: "clamp(3.5rem, 8vw, 7rem) 5vw", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <p className="label" style={{ marginBottom: "1rem" }}>Impact</p>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, color: C.cream, marginBottom: "0.75rem" }}>
            Work that moved<br />the needle
          </h2>
          <p style={{ fontSize: "1rem", fontWeight: 300, color: C.creamFaint, maxWidth: "480px", lineHeight: 1.8, marginBottom: "4rem" }}>
            Real engagements. Every number is earned.
          </p>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {visibleProjects.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.07}>
              <div className="project-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <p className="label" style={{ marginBottom: "0.4rem" }}>{p.client}</p>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 400, color: C.cream }}>{p.title}</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>

                <p style={{ fontSize: "0.93rem", fontWeight: 300, lineHeight: 1.8, color: C.creamDim, marginBottom: "1.75rem", maxWidth: "700px" }}>{p.summary}</p>

                <div className="impact-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${p.impact.length}, 1fr)`, gap: "1.25rem", borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
                  {p.impact.map(m => (
                    <div key={m.label}>
                      <p style={{ fontSize: "1.5rem", fontWeight: 300, color: C.sage, lineHeight: 1 }}>{m.value}</p>
                      <p className="label" style={{ marginTop: "0.35rem" }}>{m.label}</p>
                    </div>
                  ))}
                </div>

                <button className="read-more-btn" onClick={() => setActiveProject(p)}>Read full case study →</button>
              </div>
            </FadeIn>
          ))}
        </div>

        {!showAll && PROJECTS.length > 4 && (
          <FadeIn>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <button className="btn-ghost" onClick={() => setShowAll(true)}>See More Work</button>
            </div>
          </FadeIn>
        )}
      </section>

      <div className="divider" style={{ maxWidth: "1200px", margin: "0 auto" }} />

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "clamp(3.5rem, 8vw, 7rem) 5vw", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <p className="label" style={{ marginBottom: "1rem" }}>Experience</p>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, color: C.cream, marginBottom: "4rem" }}>
            Where I've been
          </h2>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", maxWidth: "760px" }}>
          {[
            {
              role:     "Data Analytics Instructor / Data Analyst",
              company:  "Landmark University",
              period:   "Present",
              location: "Cameroon",
              points: [
                "Teaching SQL, Python, and BI tools while running real analytical projects.",
                "Designing curriculum grounded in production-level data engineering practices.",
              ],
            },
            {
              role:     "Software Analyst",
              company:  "Cathena",
              period:   "Previous",
              location: "Remote",
              points: [
                "Led data migration from Dynamics 365 HR to Dynamics 365 Finance & Operations with zero data loss, in compliance with GDPR.",
                "Maintained workflows in the finance system through support handling via ServiceNow and Odoo.",
                "Built analytics workflows and maintained cross-system data integrity at scale.",
                "Worked with cross-functional teams to build self-serve analytics dashboards that cut operational costs by 30%.",
              ],
            },
          ].map((e, i) => (
            <FadeIn key={e.role} delay={i * 0.1}>
              <div className="exp-item">
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 400, color: C.cream, lineHeight: 1.3 }}>{e.role}</h3>
                    <p style={{ fontSize: "0.9rem", fontWeight: 300, color: C.sage, marginTop: "0.25rem" }}>{e.company}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="label">{e.period}</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.75, color: C.creamDim }}>
                  {e.points.join(" ")}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth: "1200px", margin: "0 auto" }} />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "clamp(3.5rem, 8vw, 7rem) 5vw", maxWidth: "1200px", margin: "0 auto" }}>
        <FadeIn>
          <p className="label" style={{ marginBottom: "1rem" }}>Get in touch</p>
          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 300, lineHeight: 1.15, color: C.cream, marginBottom: "1rem" }}>
            Let's make something<br /><span style={{ fontStyle: "italic", color: C.sage }}>that matters</span>
          </h2>
          <p style={{ fontSize: "1rem", fontWeight: 300, color: C.creamFaint, marginBottom: "3rem", maxWidth: "420px", lineHeight: 1.8 }}>
            A consulting project, a B2B contract, a remote role, or just a conversation. Reach out and let's see where it goes.
          </p>
          <button
            className={contactOpen ? "btn-sage" : "btn-ghost"}
            onClick={() => setContactOpen(v => !v)}
            style={{ marginBottom: contactOpen ? "2rem" : 0 }}
          >
            {contactOpen ? "Close" : "☕ Let's have a quick chat over coffee"}
          </button>
        </FadeIn>

        {contactOpen && (
          <FadeIn>
            <div style={{ maxWidth: "520px", border: "1px solid #1C1C1C", padding: "2.5rem", background: "#0C0C0C", marginTop: "2rem" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 300, color: C.cream, marginBottom: "0.5rem" }}>Message sent ✓</p>
                  <p className="label" style={{ color: C.sageDim }}>I'll be in touch soon.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {[
                    { key: "email",   label: "Your Email", placeholder: "you@company.com",      type: "email" },
                    { key: "subject", label: "Subject",    placeholder: "What's this about?",   type: "text"  },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="label" style={{ display: "block", marginBottom: "0.5rem", color: C.sageDim }}>{f.label}</label>
                      <input
                        type={f.type} className="contact-field"
                        placeholder={f.placeholder}
                        value={formData[f.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="label" style={{ display: "block", marginBottom: "0.5rem", color: C.sageDim }}>Message</label>
                    <textarea
                      rows={5} className="contact-field"
                      placeholder="Tell me about your project, role, or idea..."
                      value={formData.body}
                      onChange={e => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    />
                  </div>
                  <button className="btn-sage" onClick={handleSend} style={{ alignSelf: "flex-start" }}>Send</button>
                </div>
              )}
            </div>
          </FadeIn>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #141414", padding: "2.5rem 5vw", maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <span className="label">© {new Date().getFullYear()} Precious Oben</span>
        <div style={{ display: "flex", gap: "2rem" }}>
          <a href="https://www.linkedin.com/in/preciousoben" target="_blank" rel="noreferrer" className="social-link">LinkedIn</a>
          <a href="https://github.com/preciousoben" target="_blank" rel="noreferrer" className="social-link">GitHub</a>
          <a href="https://twitter.com/PreTalksData" target="_blank" rel="noreferrer" className="social-link">Twitter</a>
        </div>
      </footer>
    </div>
  );
}
