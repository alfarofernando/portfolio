#!/usr/bin/env python3
"""Generate bilingual master CV sources and selectable-text PDFs from content/*.json."""

from __future__ import annotations

import json
from html import escape
from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DOCS = ROOT / "docs" / "cv"
FONT_PAIRS = [
    (Path("C:/Windows/Fonts/arial.ttf"), Path("C:/Windows/Fonts/arialbd.ttf")),
    (Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"), Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")),
    (Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"), Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf")),
    (Path("/System/Library/Fonts/Supplemental/Arial.ttf"), Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")),
]

profile: dict[str, Any] = json.loads((ROOT / "content/profile.json").read_text(encoding="utf-8"))
skills: list[dict[str, Any]] = json.loads((ROOT / "content/skills.json").read_text(encoding="utf-8"))
projects: list[dict[str, Any]] = json.loads((ROOT / "content/projects.json").read_text(encoding="utf-8"))
COPY = {
    "es": {
        "skills": "Competencias técnicas",
        "experience": "Experiencia profesional",
        "projects": "Proyectos y contribuciones seleccionadas",
        "practice": "Prácticas de ingeniería",
        "education": "Formación",
        "languages": "Idiomas",
        "professional": "Experiencia profesional",
        "applied": "Experiencia puntual",
        "complementary": "Formación y conocimientos complementarios",
        "engineering": [
            "Integraciones REST y SOAP/XML, sistemas financieros y ERP, AFIP/ARCA, logística, Firebase y mensajería WhatsApp.",
            "Debugging y soporte de producción, consultas SQL, N+1, paginación, idempotencia, autenticación JWT y manejo de errores externos.",
            "Pruebas y QA, code review, documentación técnica, Git, CI/CD, Linux, Docker, Nginx y despliegues.",
            "Uso de Codex/ChatGPT para explorar codebases, planificar, depurar, refactorizar y documentar, con revisión humana del código y validación del comportamiento.",
        ],
    },
    "en": {
        "skills": "Technical skills",
        "experience": "Professional experience",
        "projects": "Selected projects and contributions",
        "practice": "Engineering practice",
        "education": "Education",
        "languages": "Languages",
        "professional": "Professional experience",
        "applied": "Applied experience",
        "complementary": "Training and complementary knowledge",
        "engineering": [
            "REST and SOAP/XML integrations across financial and ERP systems, AFIP/ARCA, logistics, Firebase, and WhatsApp messaging.",
            "Production debugging and support, SQL queries, N+1 issues, pagination, idempotency, JWT authentication, and external error handling.",
            "Testing and QA, code reviews, technical documentation, Git, CI/CD, Linux, Docker, Nginx, and deployments.",
            "Use of Codex/ChatGPT to explore codebases, plan, debug, refactor, and document, with human code review and behavior validation.",
        ],
    },
}

SPANISH_TECHNOLOGY_LABELS = {
    "AI APIs": "APIs de IA",
    "Audit": "Auditoría",
    "Freelance": "Freelance",
    "Performance analysis": "Análisis de rendimiento",
    "Product design": "Diseño de producto",
    "Product exploration": "Exploración de producto",
    "Power BI exports": "Exportaciones Power BI",
    "Shared libraries": "Librerías compartidas",
}


def display_technologies(values: list[str], language: str) -> str:
    if language == "en":
        return ", ".join(values)
    return ", ".join(SPANISH_TECHNOLOGY_LABELS.get(value, value) for value in values)


def markdown(language: str) -> str:
    localized = profile["copy"][language]
    labels = COPY[language]
    lines = [
        f"# {profile['name']}",
        f"**{localized['role']}**",
        f"{profile['email']} · {profile['phone']} · [GitHub]({profile['links']['github']}) · [LinkedIn]({profile['links']['linkedin']})",
        "",
        "## Profile",
        localized["summary"],
        "",
        f"## {labels['skills']}",
    ]
    for group in skills:
        lines.extend([f"**{group['copy'][language]['label']}:** {display_technologies(group['technologies'], language)}", ""])

    employment = localized["employment"]
    lines.extend([
        f"## {labels['experience']}",
        f"### {employment['company']} — {employment['role']}",
        employment["period"],
        *[f"- {item}" for item in employment["responsibilities"]],
        "",
        f"## {labels['projects']}",
    ])
    for project in projects:
        if not project["cvInclude"]:
            continue
        copy = project["copy"][language]
        lines.extend([
            f"### {copy['title']} · {display_technologies(project['technologies'], language)}",
            f"{copy['summary']} {copy['contributions'][0]}",
            "",
        ])

    lines.extend([f"## {labels['practice']}", *[f"- {item}" for item in labels["engineering"]], ""])
    lines.append(f"## {labels['education']}")
    for education in localized["education"]:
        lines.append(f"- **{education['qualification']}** — {education['institution']} · {education['period']}")
    lines.extend(["", f"## {labels['languages']}", localized["english"], ""])
    return "\n".join(lines)


def register_fonts() -> tuple[str, str]:
    for regular_path, bold_path in FONT_PAIRS:
        if regular_path.exists() and bold_path.exists():
            pdfmetrics.registerFont(TTFont("CV-Regular", str(regular_path)))
            pdfmetrics.registerFont(TTFont("CV-Bold", str(bold_path)))
            return "CV-Regular", "CV-Bold"
    return "Helvetica", "Helvetica-Bold"


def draw_footer(canvas: Any, doc: Any, language: str) -> None:
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D9E1F2"))
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFillColor(colors.HexColor("#667085"))
    canvas.setFont("CV-Regular" if "CV-Regular" in pdfmetrics.getRegisteredFontNames() else "Helvetica", 8)
    footer = "Fernando Alfaro · Desarrollador Full Stack Junior" if language == "es" else "Fernando Alfaro · Junior Full Stack Developer"
    canvas.drawString(18 * mm, 9 * mm, footer)
    canvas.drawRightString(192 * mm, 9 * mm, str(doc.page))
    canvas.restoreState()


def build_pdf(language: str, path: Path) -> None:
    regular, bold = register_fonts()
    accent = colors.HexColor("#2447A8")
    ink = colors.HexColor("#182230")
    muted = colors.HexColor("#576579")
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Name", fontName=bold, fontSize=23, leading=27, textColor=ink, spaceAfter=2))
    styles.add(ParagraphStyle(name="Role", fontName=bold, fontSize=10.5, leading=14, textColor=accent, spaceAfter=4))
    styles.add(ParagraphStyle(name="Contact", fontName=regular, fontSize=9.3, leading=12, textColor=muted, spaceAfter=9))
    styles.add(ParagraphStyle(name="Section", fontName=bold, fontSize=12.5, leading=15, textColor=accent, spaceBefore=5, spaceAfter=3, borderColor=colors.HexColor("#D9E1F2"), borderWidth=0, borderPadding=0))
    styles.add(ParagraphStyle(name="BodyCV", fontName=regular, fontSize=10, leading=12, textColor=ink, spaceAfter=2.5, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="BulletCV", parent=styles["BodyCV"], leftIndent=11, firstLineIndent=-8, bulletIndent=0, spaceAfter=1.5))
    styles.add(ParagraphStyle(name="MetaCV", fontName=regular, fontSize=9, leading=10.5, textColor=muted, spaceAfter=2))
    styles.add(ParagraphStyle(name="CaseTitle", fontName=bold, fontSize=10.2, leading=11.5, textColor=ink, spaceBefore=2, spaceAfter=1))

    localized = profile["copy"][language]
    labels = COPY[language]
    employment = localized["employment"]
    story: list[Any] = [
        Paragraph(escape(profile["name"]), styles["Name"]),
        Paragraph(escape(localized["role"]), styles["Role"]),
        Paragraph(
            f"{escape(profile['email'])} &nbsp;·&nbsp; {escape(profile['phone'])} &nbsp;·&nbsp; "
            f"<link href=\"{escape(profile['links']['github'])}\" color=\"#2447A8\">GitHub</link> &nbsp;·&nbsp; "
            f"<link href=\"{escape(profile['links']['linkedin'])}\" color=\"#2447A8\">LinkedIn</link>",
            styles["Contact"],
        ),
        Paragraph("PROFILE" if language == "en" else "PERFIL", styles["Section"]),
        Paragraph(escape(localized["summary"]), styles["BodyCV"]),
        Paragraph(labels["skills"].upper(), styles["Section"]),
    ]
    for group in skills:
        label = group["copy"][language]["label"]
        technologies = escape(display_technologies(group["technologies"], language))
        story.append(Paragraph(f"<b>{escape(label)}:</b> {technologies}", styles["BodyCV"]))

    story.extend([
        Paragraph(labels["experience"].upper(), styles["Section"]),
        Paragraph(f"<b>{escape(employment['company'])}</b> &nbsp;·&nbsp; {escape(employment['role'])}", styles["BodyCV"]),
        Paragraph(escape(employment["period"]), styles["MetaCV"]),
    ])
    for item in employment["responsibilities"]:
        story.append(Paragraph(f"• {escape(item)}", styles["BulletCV"]))

    story.append(Paragraph(labels["projects"].upper(), styles["Section"]))
    for project in projects:
        if not project["cvInclude"]:
            continue
        copy = project["copy"][language]
        tech = escape(display_technologies(project["technologies"], language))
        description = escape(copy["summary"])
        contribution = escape(copy["contributions"][0])
        story.append(KeepTogether([
            Paragraph(escape(copy["title"]), styles["CaseTitle"]),
            Paragraph(f"<font color=\"#576579\">{tech}</font>", styles["MetaCV"]),
            Paragraph(f"{description} {contribution}", styles["BodyCV"]),
        ]))

    story.append(Paragraph(labels["practice"].upper(), styles["Section"]))
    for item in labels["engineering"]:
        story.append(Paragraph(f"• {escape(item)}", styles["BulletCV"]))

    story.append(Paragraph(labels["education"].upper(), styles["Section"]))
    for education in localized["education"]:
        story.append(Paragraph(
            f"<b>{escape(education['qualification'])}</b> — {escape(education['institution'])} · {escape(education['period'])}",
            styles["BodyCV"],
        ))
    story.extend([
        Paragraph(labels["languages"].upper(), styles["Section"]),
        Paragraph(escape(localized["english"]), styles["BodyCV"]),
    ])

    doc = SimpleDocTemplate(
        str(path), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
        topMargin=15 * mm, bottomMargin=20 * mm,
        title=f"Fernando Alfaro - {localized['role']}",
        author=profile["name"],
        subject=localized["summary"],
    )
    callback = lambda canvas, document: draw_footer(canvas, document, language)
    doc.build(story, onFirstPage=callback, onLaterPages=callback)


def main() -> None:
    DOCS.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    outputs = {
        "es": (DOCS / "cv-master-es.md", PUBLIC / "cv-AlfaroFernando-Esp.pdf"),
        "en": (DOCS / "cv-master-en.md", PUBLIC / "cv-AlfaroFernando-Eng.pdf"),
    }
    for language, (markdown_path, pdf_path) in outputs.items():
        markdown_path.write_text(markdown(language), encoding="utf-8")
        build_pdf(language, pdf_path)
        print(f"Generated {pdf_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
