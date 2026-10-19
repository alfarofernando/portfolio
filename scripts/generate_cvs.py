#!/usr/bin/env python3
"""Generate the bilingual master CV sources and tagged, selectable-text PDFs."""

from __future__ import annotations

import json
import hashlib
import os
import shutil
import tempfile
import unicodedata
from html import escape
from pathlib import Path
from typing import Any, Callable

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
REVIEWED_AT = "2026-10-19"
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
        "profile": "Perfil profesional",
        "skills": "Competencias técnicas",
        "experience": "Experiencia profesional",
        "projects": "Experiencia en proyectos",
        "practice": "Prácticas de ingeniería",
        "education": "Formación",
        "languages": "Idiomas",
        "professional": "Proyectos profesionales",
        "operations": "Operación e integraciones",
        "own": "Productos propios",
        "complementary": "Proyectos complementarios",
        "context": "Contexto",
        "role": "Participación",
        "contributions": "Contribuciones",
        "outcomes": "Resultados y alcance",
        "engineering": [
            "Integraciones REST y SOAP/XML, sistemas financieros y ERP, AFIP/ARCA, logística, Firebase y mensajería WhatsApp.",
            "Debugging y soporte de producción, consultas SQL, N+1, paginación, idempotencia, autenticación JWT y manejo de errores externos.",
            "Pruebas y QA, code review, documentación técnica, Git, CI/CD, Linux, Docker, Nginx y despliegues.",
            "Uso de Codex/ChatGPT para explorar codebases, planificar, depurar, refactorizar y documentar, con revisión humana del código y validación del comportamiento.",
        ],
        "whatsapp": "WhatsApp",
    },
    "en": {
        "profile": "Professional profile",
        "skills": "Technical skills",
        "experience": "Professional experience",
        "projects": "Project experience",
        "practice": "Engineering practice",
        "education": "Education",
        "languages": "Languages",
        "professional": "Professional projects",
        "operations": "Operations and integrations",
        "own": "Independent products",
        "complementary": "Complementary projects",
        "context": "Context",
        "role": "Contribution scope",
        "contributions": "Contributions",
        "outcomes": "Outcomes and scope",
        "engineering": [
            "REST and SOAP/XML integrations across financial and ERP systems, AFIP/ARCA, logistics, Firebase, and WhatsApp messaging.",
            "Production debugging and support, SQL queries, N+1 issues, pagination, idempotency, JWT authentication, and external error handling.",
            "Testing and QA, code reviews, technical documentation, Git, CI/CD, Linux, Docker, Nginx, and deployments.",
            "Use of Codex/ChatGPT to explore codebases, plan, debug, refactor, and document, with human code review and behavior validation.",
        ],
        "whatsapp": "WhatsApp",
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

PDF_DASH_TRANSLATION = str.maketrans({character: "-" for character in "\u2010\u2011\u2012\u2013\u2014\u2015\u2212\ufe58\ufe63\uff0d"})


def _pdf_escape(value: str, *, quote: bool = False) -> str:
    return escape(value.translate(PDF_DASH_TRANSLATION), quote=quote)


def display_technologies(values: list[str], language: str) -> str:
    if language == "en":
        return ", ".join(values)
    return ", ".join(SPANISH_TECHNOLOGY_LABELS.get(value, value) for value in values)


def validate_source_data(
    profile_data: dict[str, Any],
    skills_data: list[dict[str, Any]] | None,
    projects_data: list[dict[str, Any]],
) -> None:
    errors: list[str] = []
    for language in ("es", "en"):
        localized = profile_data.get("copy", {}).get(language)
        if not localized:
            errors.append(f"profile missing {language}")
            continue
        for key in ("role", "summary", "employment", "education", "english"):
            if not localized.get(key):
                errors.append(f"profile {language} missing {key}")
        employment = localized.get("employment", {})
        for key in ("company", "role", "period"):
            if not employment.get(key):
                errors.append(f"employment {language} missing {key}")
        if not employment.get("responsibilities"):
            errors.append(f"employment {language} missing responsibilities")
        for education in localized.get("education", []):
            for key in ("institution", "qualification", "period"):
                if not education.get(key):
                    errors.append(f"education {language} missing {key}")

    if len({project.get("id") for project in projects_data}) != len(projects_data):
        errors.append("project IDs must be unique")
    for project in projects_data:
        project_id = project.get("id", "unknown")
        if not project.get("cvInclude"):
            errors.append(f"{project_id} is not marked for the master CV")
        if not project.get("technologies"):
            errors.append(f"{project_id} missing technologies")
        for language in ("es", "en"):
            localized = project.get("copy", {}).get(language)
            if not localized:
                errors.append(f"{project_id} missing {language} translation")
                continue
            for key in ("title", "summary", "context", "role", "contributions", "outcomes"):
                if not localized.get(key):
                    errors.append(f"{project_id} {language} missing {key}")

    for group in skills_data or []:
        for language in ("es", "en"):
            if not group.get("copy", {}).get(language, {}).get("label"):
                errors.append(f"skill group {group.get('id')} missing {language} label")
        if not group.get("technologies"):
            errors.append(f"skill group {group.get('id')} missing technologies")

    if errors:
        raise ValueError("Invalid CV source data: " + "; ".join(errors))


def _required_facts(
    language: str,
    profile_data: dict[str, Any],
    skills_data: list[dict[str, Any]],
    projects_data: list[dict[str, Any]],
) -> list[tuple[str, str]]:
    localized = profile_data["copy"][language]
    employment = localized["employment"]
    facts: list[tuple[str, str]] = [
        (localized["role"], "professional role"),
        (localized["summary"], "professional summary"),
        (employment["company"], "employer"),
        (employment["role"], "historical job title"),
        (employment["period"], "employment period"),
        *[(item, "employment responsibility") for item in employment["responsibilities"]],
        (localized["english"], "language proficiency"),
    ]
    for group in skills_data:
        facts.append((group["copy"][language]["label"], f"skill category {group['id']}"))
        facts.append((display_technologies(group["technologies"], language), f"skill group {group['id']}"))
    for education in localized["education"]:
        facts.extend((education[key], "education") for key in ("institution", "qualification", "period"))
    for project in projects_data:
        copy = project["copy"][language]
        project_id = project["id"]
        facts.extend([
            (copy["title"], f"{project_id} title"),
            (copy["summary"], f"{project_id} summary"),
            (copy["context"], f"{project_id} context"),
            (copy["role"], f"{project_id} contribution scope"),
            *[(item, f"{project_id} contribution") for item in copy["contributions"]],
            *[(item, f"{project_id} outcome") for item in copy["outcomes"]],
            (display_technologies(project["technologies"], language), f"{project_id} technologies"),
        ])
    return facts


def _normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKC", value).translate(PDF_DASH_TRANSLATION)
    return " ".join(normalized.split())


def assert_output_coverage(
    language: str,
    text: str,
    profile_data: dict[str, Any] = profile,
    skills_data: list[dict[str, Any]] = skills,
    projects_data: list[dict[str, Any]] = projects,
) -> None:
    normalized_output = _normalize_text(text)
    missing = [
        context
        for fact, context in _required_facts(language, profile_data, skills_data, projects_data)
        if _normalize_text(fact) not in normalized_output
    ]
    if missing:
        raise ValueError(f"{language} CV output is missing source facts: {', '.join(missing)}")


def markdown(language: str) -> str:
    if language not in COPY:
        raise ValueError(f"Unsupported CV language: {language}")
    validate_source_data(profile, skills, projects)
    localized = profile["copy"][language]
    labels = COPY[language]
    employment = localized["employment"]
    lines = [
        f"# {profile['name']}",
        f"**{localized['role']}**",
        f"{profile['email']} · {profile['phone']} · [GitHub]({profile['links']['github']}) · "
        f"[LinkedIn]({profile['links']['linkedin']}) · [WhatsApp]({profile['links']['whatsapp']})",
        "",
        f"## {labels['profile']}",
        localized["summary"],
        "",
        f"## {labels['skills']}",
    ]
    for group in skills:
        lines.extend([
            f"**{group['copy'][language]['label']}:** {display_technologies(group['technologies'], language)}",
            "",
        ])

    lines.extend([
        f"## {labels['experience']}",
        f"### {employment['company']} — {employment['role']}",
        employment["period"],
        *[f"- {item}" for item in employment["responsibilities"]],
        "",
        f"## {labels['projects']}",
    ])
    category_order = ("professional", "operations", "own", "complementary")
    for category in category_order:
        category_projects = [project for project in projects if project.get("category") == category and project["cvInclude"]]
        if not category_projects:
            continue
        lines.extend([f"### {labels[category]}", ""])
        for project in category_projects:
            copy = project["copy"][language]
            lines.extend([
                f"#### {copy['title']} · {display_technologies(project['technologies'], language)}",
                f"**{labels['context']}:** {copy['context']}",
                f"**{labels['role']}:** {copy['role']}",
                copy["summary"],
                f"**{labels['contributions']}:**",
                *[f"- {item}" for item in copy["contributions"]],
                f"**{labels['outcomes']}:**",
                *[f"- {item}" for item in copy["outcomes"]],
                "",
            ])

    lines.extend([f"## {labels['practice']}", *[f"- {item}" for item in labels["engineering"]], ""])
    lines.append(f"## {labels['education']}")
    for education in localized["education"]:
        lines.append(f"- **{education['qualification']}** — {education['institution']} · {education['period']}")
    lines.extend(["", f"## {labels['languages']}", localized["english"], ""])
    rendered = "\n".join(lines)
    assert_output_coverage(language, rendered)
    return rendered


def register_fonts() -> tuple[str, str]:
    registered = set(pdfmetrics.getRegisteredFontNames())
    if "CV-Regular" in registered and "CV-Bold" in registered:
        return "CV-Regular", "CV-Bold"
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
    canvas.drawString(18 * mm, 9 * mm, f"Fernando Alfaro · Software Engineer")
    canvas.drawRightString(192 * mm, 9 * mm, str(doc.page))
    canvas.restoreState()


def _paragraph_styles() -> tuple[Any, dict[str, ParagraphStyle]]:
    regular, bold = register_fonts()
    accent = colors.HexColor("#2447A8")
    ink = colors.HexColor("#182230")
    muted = colors.HexColor("#576579")
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="CVName", fontName=bold, fontSize=23, leading=27, textColor=ink, spaceAfter=2))
    styles.add(ParagraphStyle(name="CVRole", fontName=bold, fontSize=10.5, leading=14, textColor=accent, spaceAfter=4))
    styles.add(ParagraphStyle(name="CVContact", fontName=regular, fontSize=8.5, leading=11, textColor=muted, spaceAfter=8))
    styles.add(ParagraphStyle(name="CVSection", fontName=bold, fontSize=12.5, leading=15, textColor=accent, spaceBefore=6, spaceAfter=3, keepWithNext=True))
    styles.add(ParagraphStyle(name="CVCategory", fontName=bold, fontSize=10.5, leading=13, textColor=muted, spaceBefore=5, spaceAfter=2, keepWithNext=True))
    styles.add(ParagraphStyle(name="CVBody", fontName=regular, fontSize=9.5, leading=11.6, textColor=ink, spaceAfter=2, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="CVBullet", parent=styles["CVBody"], leftIndent=11, firstLineIndent=-8, bulletIndent=0, spaceAfter=1.2))
    styles.add(ParagraphStyle(name="CVMeta", fontName=regular, fontSize=8.5, leading=10, textColor=muted, spaceAfter=2, keepWithNext=True))
    styles.add(ParagraphStyle(name="CVCaseTitle", fontName=bold, fontSize=10.2, leading=12, textColor=ink, spaceBefore=4, spaceAfter=1, keepWithNext=True))
    return (regular, bold), styles


def build_pdf(language: str, path: Path) -> None:
    if language not in COPY:
        raise ValueError(f"Unsupported CV language: {language}")
    validate_source_data(profile, skills, projects)
    fonts, styles = _paragraph_styles()
    localized = profile["copy"][language]
    labels = COPY[language]
    employment = localized["employment"]
    link = lambda url, label: f'<link href="{escape(url, quote=True)}" color="#2447A8">{_pdf_escape(label)}</link>'
    contact = (
        f"{_pdf_escape(profile['email'])} &nbsp;·&nbsp; {_pdf_escape(profile['phone'])} &nbsp;·&nbsp; "
        f"{link(profile['links']['github'], 'GitHub')} &nbsp;·&nbsp; "
        f"{link(profile['links']['linkedin'], 'LinkedIn')} &nbsp;·&nbsp; "
        f"{link(profile['links']['whatsapp'], labels['whatsapp'])}"
    )
    story: list[Any] = [
        Paragraph(_pdf_escape(profile["name"]), styles["CVName"]),
        Paragraph(_pdf_escape(localized["role"]), styles["CVRole"]),
        Paragraph(contact, styles["CVContact"]),
        Paragraph(labels["profile"].upper(), styles["CVSection"]),
        Paragraph(_pdf_escape(localized["summary"]), styles["CVBody"]),
        Paragraph(labels["skills"].upper(), styles["CVSection"]),
    ]
    for group in skills:
        label = group["copy"][language]["label"]
        technology_list = _pdf_escape(display_technologies(group["technologies"], language))
        story.append(Paragraph(f"<b>{_pdf_escape(label)}:</b> {technology_list}", styles["CVBody"]))

    story.extend([
        Paragraph(labels["experience"].upper(), styles["CVSection"]),
        Paragraph(f"<b>{_pdf_escape(employment['company'])}</b> &nbsp;·&nbsp; {_pdf_escape(employment['role'])}", styles["CVBody"]),
        Paragraph(_pdf_escape(employment["period"]), styles["CVMeta"]),
    ])
    story.extend(Paragraph(f"• {_pdf_escape(item)}", styles["CVBullet"]) for item in employment["responsibilities"])

    story.append(Paragraph(labels["projects"].upper(), styles["CVSection"]))
    for category in ("professional", "operations", "own", "complementary"):
        category_projects = [project for project in projects if project.get("category") == category and project["cvInclude"]]
        if not category_projects:
            continue
        for project_index, project in enumerate(category_projects):
            copy = project["copy"][language]
            tech = _pdf_escape(display_technologies(project["technologies"], language))
            details: list[Any] = [
                Paragraph(_pdf_escape(copy["title"]), styles["CVCaseTitle"]),
                Paragraph(f"<font color=\"#576579\">{tech}</font>", styles["CVMeta"]),
                Paragraph(f"<b>{_pdf_escape(labels['context'])}:</b> {_pdf_escape(copy['context'])}", styles["CVBody"]),
                Paragraph(f"<b>{_pdf_escape(labels['role'])}:</b> {_pdf_escape(copy['role'])}", styles["CVBody"]),
                Paragraph(_pdf_escape(copy["summary"]), styles["CVBody"]),
                Paragraph(f"<b>{_pdf_escape(labels['contributions'])}:</b>", styles["CVBody"]),
                *[Paragraph(f"• {_pdf_escape(item)}", styles["CVBullet"]) for item in copy["contributions"]],
                Paragraph(f"<b>{_pdf_escape(labels['outcomes'])}:</b>", styles["CVBody"]),
                *[Paragraph(f"• {_pdf_escape(item)}", styles["CVBullet"]) for item in copy["outcomes"]],
            ]
            if project_index == 0:
                details.insert(0, Paragraph(labels[category].upper(), styles["CVCategory"]))
            story.extend(details)

    story.append(Paragraph(labels["practice"].upper(), styles["CVSection"]))
    story.extend(Paragraph(f"• {_pdf_escape(item)}", styles["CVBullet"]) for item in labels["engineering"])
    story.append(Paragraph(labels["education"].upper(), styles["CVSection"]))
    for education in localized["education"]:
        story.append(Paragraph(
            f"<b>{_pdf_escape(education['qualification'])}</b> - {_pdf_escape(education['institution'])} · {_pdf_escape(education['period'])}",
            styles["CVBody"],
        ))
    story.extend([
        Paragraph(labels["languages"].upper(), styles["CVSection"]),
        Paragraph(_pdf_escape(localized["english"]), styles["CVBody"]),
    ])

    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
        topMargin=15 * mm, bottomMargin=20 * mm,
        title=f"Fernando Alfaro - {localized['role']}",
        author=profile["name"],
        subject=localized["summary"],
    )
    callback = lambda canvas, document: draw_footer(canvas, document, language)
    doc.build(story, onFirstPage=callback, onLaterPages=callback)


def _pdf_text_and_links(path: Path) -> tuple[str, set[str]]:
    with path.open("rb") as stream:
        reader = PdfReader(stream)
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        links = {
            str(action.get("/URI"))
            for page in reader.pages
            for annotation in page.get("/Annots", [])
            if (action := annotation.get_object().get("/A")) and action.get("/URI")
        }
        return text, links


def _output_paths(root: Path) -> dict[str, Path]:
    return {
        "es_md": root / "docs/cv/cv-master-es.md",
        "es_pdf": root / "public/cv-AlfaroFernando-Esp.pdf",
        "en_md": root / "docs/cv/cv-master-en.md",
        "en_pdf": root / "public/cv-AlfaroFernando-Eng.pdf",
        "coverage": root / "docs/cv/cv-coverage.md",
    }


def coverage_markdown() -> str:
    categories = {
        "professional": "professional",
        "operations": "operations",
        "own": "own",
        "complementary": "complementary",
    }
    lines = [
        "# CV master coverage matrix",
        "",
        "Coverage is checked against extracted text in both Markdown sources and both PDFs. Every project contributes its context, role, summary, technology list, all contributions, and all outcomes.",
        "",
        "## Profile and experience",
        "",
        "| Source area | Spanish Markdown | Spanish PDF | English Markdown | English PDF |",
        "|---|---:|---:|---:|---:|",
        "| Software Engineer profile and summary | ✓ | ✓ | ✓ | ✓ |",
        "| NetOne / BarloventoTech employment and responsibilities | ✓ | ✓ | ✓ | ✓ |",
        "| Three technical skill groups | ✓ | ✓ | ✓ | ✓ |",
        "| Education and English level | ✓ | ✓ | ✓ | ✓ |",
        "| WhatsApp, GitHub, and LinkedIn links | ✓ | ✓ | ✓ | ✓ |",
        "",
        "## Project coverage",
        "",
        "| Project ID | Category | Contributions | Outcomes | ES Markdown/PDF | EN Markdown/PDF |",
        "|---|---|---:|---:|---|---|",
    ]
    for project in projects:
        copy_es = project["copy"]["es"]
        category = categories.get(project.get("category"), project.get("category", "unclassified"))
        lines.append(
            f"| `{project['id']}` · {copy_es['title']} | {category} | "
            f"{len(copy_es['contributions'])} | {len(copy_es['outcomes'])} | ✓ / ✓ | ✓ / ✓ |"
        )
    source_records: list[tuple[str, str, Path | None]] = [
        ("content/profile.json", "Identity, career summary, employment, education, and language level.", None),
        ("content/skills.json", "Technical groups and experience distinctions.", None),
        (
            "content/projects.json",
            f"All {len(projects)} portfolio, professional, operations, and independent project records.",
            None,
        ),
    ]
    canonical_candidates = [
        Path.home() / "Downloads/Fernando_Alfaro_Experiencia_Tecnica_Completa_Actualizado_2026-10-19.md",
        Path.home() / "Downloads/Fernando_Alfaro_Experiencia_Tecnica_Completa.md",
    ]
    canonical_source = next((candidate for candidate in canonical_candidates if candidate.is_file()), None)
    if canonical_source:
        source_records.append((canonical_source.name, "Canonical technical inventory, reviewed for claim scope and positioning.", canonical_source))

    lines.extend([
        "",
        "## Source records",
        "",
        "| Source file | Purpose | Reviewed | SHA-256 |",
        "|---|---|---|---|",
    ])
    for file_name, purpose, source_path in source_records:
        path = source_path or ROOT / file_name
        digest = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else "Not available on this host"
        lines.append(f"| `{file_name}` | {purpose} | {REVIEWED_AT} | `{digest}` |")
    lines.extend([
        "",
        f"Projects covered: {len(projects)}. Each output is validated against all source facts before replacement.",
        "",
    ])
    return "\n".join(lines)


def _commit_staged_files(
    staged_to_final: dict[Path, Path],
    backup_dir: Path,
    replace_fn: Callable[[os.PathLike[str], os.PathLike[str]], Any],
) -> None:
    backups: dict[Path, Path | None] = {}
    for final in staged_to_final.values():
        if final.exists():
            backup = backup_dir / f"{len(backups)}-{final.name}"
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(final, backup)
            backups[final] = backup
        else:
            backups[final] = None

    committed: list[Path] = []
    try:
        for staged, final in staged_to_final.items():
            final.parent.mkdir(parents=True, exist_ok=True)
            replace_fn(staged, final)
            committed.append(final)
    except Exception:
        rollback_errors: list[str] = []
        for final in reversed(committed):
            backup = backups[final]
            try:
                if backup is None:
                    final.unlink(missing_ok=True)
                else:
                    restore = final.with_name(f".{final.name}.restore")
                    shutil.copy2(backup, restore)
                    os.replace(restore, final)
            except Exception as error:  # preserve all recoverable destinations
                rollback_errors.append(f"{final}: {error}")
        if rollback_errors:
            raise RuntimeError("CV output rollback was incomplete: " + "; ".join(rollback_errors))
        raise


def generate_all(
    root: Path = ROOT,
    replace_fn: Callable[[os.PathLike[str], os.PathLike[str]], Any] = os.replace,
    pdf_builder: Callable[[str, Path], None] = build_pdf,
) -> dict[str, Path]:
    root = Path(root).resolve()
    validate_source_data(profile, skills, projects)
    final_paths = _output_paths(root)
    staging_root = Path(tempfile.mkdtemp(prefix=".cv-generation-", dir=root))
    try:
        staged_paths = {
            key: staging_root / Path(path.relative_to(root))
            for key, path in final_paths.items()
        }
        for language in ("es", "en"):
            markdown_key = f"{language}_md"
            pdf_key = f"{language}_pdf"
            staged_paths[markdown_key].parent.mkdir(parents=True, exist_ok=True)
            staged_paths[pdf_key].parent.mkdir(parents=True, exist_ok=True)
            rendered_markdown = markdown(language)
            staged_paths[markdown_key].write_text(rendered_markdown, encoding="utf-8")
            assert_output_coverage(language, rendered_markdown)
            pdf_builder(language, staged_paths[pdf_key])
            pdf_text, pdf_links = _pdf_text_and_links(staged_paths[pdf_key])
            assert_output_coverage(language, pdf_text)
            for link_key in ("github", "linkedin", "whatsapp"):
                expected_link = profile["links"][link_key]
                if expected_link not in pdf_links:
                    raise ValueError(f"{language} PDF is missing the {link_key} link annotation")

        coverage_path = staged_paths["coverage"]
        coverage_path.parent.mkdir(parents=True, exist_ok=True)
        coverage_text = coverage_markdown()
        for project in projects:
            if f"`{project['id']}`" not in coverage_text:
                raise ValueError(f"Coverage matrix is missing project {project['id']}")
        coverage_path.write_text(coverage_text, encoding="utf-8")

        _commit_staged_files(
            {staged_paths[key]: final for key, final in final_paths.items()},
            staging_root / "backups",
            replace_fn,
        )
    finally:
        shutil.rmtree(staging_root, ignore_errors=True)
    return final_paths


def main() -> None:
    for path in generate_all().values():
        print(f"Generated {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
