from __future__ import annotations

import copy
import hashlib
import os
import tempfile
import unittest
from pathlib import Path

from pypdf import PdfReader

from scripts.generate_cvs import (
    ROOT,
    assert_output_coverage,
    coverage_markdown,
    generate_all,
    markdown,
    projects,
    profile,
    validate_source_data,
)


class MasterCVTests(unittest.TestCase):
    def test_coverage_matrix_lists_every_project_and_all_four_outputs(self) -> None:
        matrix = coverage_markdown()
        self.assertIn("Spanish Markdown | Spanish PDF | English Markdown | English PDF", matrix)
        self.assertIn("Source file | Purpose | Reviewed | SHA-256", matrix)
        for source in ("content/profile.json", "content/skills.json", "content/projects.json"):
            digest = hashlib.sha256((ROOT / source).read_bytes()).hexdigest()
            self.assertIn(digest, matrix)
        for project in projects:
            self.assertIn(f"`{project['id']}`", matrix)
        self.assertIn(f"All {len(projects)} portfolio, professional, operations, and independent project records.", matrix)

    def test_sources_include_all_catalog_projects_and_all_contributions(self) -> None:
        for language in ("es", "en"):
            rendered = markdown(language)
            self.assertIn("Software Engineer", rendered)
            for project in projects:
                localized = project["copy"][language]
                self.assertIn(localized["title"], rendered)
                self.assertIn(localized["summary"], rendered)
                for fact in [*localized["contributions"], *localized["outcomes"]]:
                    self.assertIn(fact, rendered)

    def test_pdf_text_covers_every_project_fact_and_links_are_real_annotations(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for language, filename in (("es", "cv-es.pdf"), ("en", "cv-en.pdf")):
                pdf_path = root / filename
                from scripts.generate_cvs import build_pdf

                build_pdf(language, pdf_path)
                with pdf_path.open("rb") as stream:
                    reader = PdfReader(stream)
                    text = "\n".join(page.extract_text() or "" for page in reader.pages)
                    assert_output_coverage(language, text)
                    for non_ascii_dash in ("\u2010", "\u2011", "\u2012", "\u2013", "\u2014", "\u2212"):
                        self.assertNotIn(non_ascii_dash, text, "PDF text must use ASCII hyphens")
                    final_page_text = reader.pages[-1].extract_text() or ""
                    self.assertGreater(len(final_page_text.strip()), 250, "final page should not contain only a stranded closing section")
                    annotations = [
                        annotation.get_object()
                        for page in reader.pages
                        for annotation in page.get("/Annots", [])
                    ]
                    link_uris = {
                        annotation.get("/A", {}).get("/URI")
                        for annotation in annotations
                        if annotation.get("/A", {}).get("/URI")
                    }
                    self.assertIn(profile["links"]["github"], link_uris)
                    self.assertIn(profile["links"]["linkedin"], link_uris)
                    self.assertIn(profile["links"]["whatsapp"], link_uris)
                    self.assertGreater(len(reader.pages), 1)

    def test_coverage_rejects_a_missing_middle_contribution(self) -> None:
        rendered = markdown("es")
        omitted = projects[0]["copy"]["es"]["contributions"][1]
        self.assertIn(omitted, rendered)
        with self.assertRaisesRegex(ValueError, "wise-capital"):
            assert_output_coverage("es", rendered.replace(omitted, "", 1))

    def test_source_validation_rejects_a_missing_translation(self) -> None:
        broken_projects = copy.deepcopy(projects)
        del broken_projects[0]["copy"]["en"]["contributions"]
        with self.assertRaisesRegex(ValueError, "wise-capital.*en"):
            validate_source_data(profile, None, broken_projects)

    def test_2026_projects_are_in_both_master_cvs_with_conservative_status(self) -> None:
        by_id = {project["id"]: project for project in projects}
        expected = {"eimo", "chusmeando", "ateneos"}
        self.assertTrue(expected.issubset(by_id), f"missing projects: {sorted(expected - by_id.keys())}")

        eimo = by_id["eimo"]
        chusmeando = by_id["chusmeando"]
        ateneos = by_id["ateneos"]
        self.assertEqual(eimo["links"], [])
        self.assertEqual(chusmeando["links"], [])
        self.assertEqual(ateneos["links"], [])

        for language in ("es", "en"):
            rendered = markdown(language)
            for project in (eimo, chusmeando, ateneos):
                localized = project["copy"][language]
                self.assertIn(localized["title"], rendered)
                self.assertIn(localized["summary"], rendered)
                for fact in [*localized["contributions"], *localized["outcomes"]]:
                    self.assertIn(fact, rendered)

        self.assertIn("en curso", eimo["copy"]["es"]["context"].lower())
        self.assertIn("ongoing", eimo["copy"]["en"]["context"].lower())
        self.assertIn("no se presenta como desplegado", chusmeando["copy"]["es"]["outcomes"][0].lower())
        self.assertIn("not presented as deployed", chusmeando["copy"]["en"]["outcomes"][0].lower())
        self.assertIn("merge", ateneos["copy"]["es"]["outcomes"][0].lower())
        self.assertIn("merge", ateneos["copy"]["en"]["outcomes"][0].lower())

    def test_catalog_captures_verified_expansions_without_stale_dates_or_stack(self) -> None:
        by_id = {project["id"]: project for project in projects}
        self.assertIn("Ionic", by_id["wise-capital"]["technologies"])
        self.assertIn("Android e iOS", by_id["wise-capital"]["copy"]["es"]["role"])
        self.assertIn("Android", by_id["wise-capital"]["copy"]["en"]["role"])
        self.assertIn("iOS", by_id["wise-capital"]["copy"]["en"]["role"])
        self.assertIn("becario", by_id["barlogow-wareg"]["copy"]["es"]["role"].lower())
        self.assertIn("intern", by_id["barlogow-wareg"]["copy"]["en"]["role"].lower())
        for project_id in ("ms-gbp", "ms-logistics"):
            self.assertIn("desde cero", by_id[project_id]["copy"]["es"]["role"].lower())
            self.assertIn("from scratch", by_id[project_id]["copy"]["en"]["role"].lower())
            self.assertIn("desplieg", by_id[project_id]["copy"]["es"]["role"].lower())
            self.assertIn("deploy", by_id[project_id]["copy"]["en"]["role"].lower())
        cvgenio = by_id["cvgenio"]["copy"]
        self.assertIn("2024", cvgenio["es"]["context"])
        self.assertIn("junio de 2026", cvgenio["es"]["context"])
        self.assertIn("finalizado", cvgenio["es"]["context"].lower())
        self.assertIn("ended", cvgenio["en"]["context"].lower())
        self.assertTrue(any("Angular 21" in value for value in by_id["portal-sgu"]["technologies"]))
        self.assertTrue(any("Next.js" in value for value in by_id["portal-sgu"]["technologies"]))
        self.assertTrue(any("becarios" in item.lower() or "desarrolladores" in item.lower() for item in by_id["storepc"]["copy"]["es"]["contributions"]))

    def test_master_cv_summary_leads_with_software_engineering_and_the_full_stack(self) -> None:
        spanish = profile["copy"]["es"]["summary"]
        english = profile["copy"]["en"]["summary"]
        self.assertIn("Software Engineer Full Stack", spanish)
        self.assertIn("Java/Spring Boot", spanish)
        self.assertIn("React", spanish)
        self.assertIn("Node.js", spanish)
        self.assertIn("Full-stack Software Engineer", english)
        self.assertIn("Java/Spring Boot", english)
        self.assertIn("React", english)
        self.assertIn("Node.js", english)

    def test_second_pdf_failure_preserves_all_four_previous_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            destinations = [
                root / "docs/cv/cv-master-es.md",
                root / "public/cv-AlfaroFernando-Esp.pdf",
                root / "docs/cv/cv-master-en.md",
                root / "public/cv-AlfaroFernando-Eng.pdf",
                root / "docs/cv/cv-coverage.md",
            ]
            for index, path in enumerate(destinations):
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(f"previous-{index}".encode())
            before = [path.read_bytes() for path in destinations]

            def fail_on_english(language: str, path: Path) -> None:
                if language == "en":
                    raise RuntimeError("fixture: second PDF failed")
                from scripts.generate_cvs import build_pdf

                build_pdf(language, path)

            with self.assertRaisesRegex(RuntimeError, "second PDF"):
                generate_all(root=root, pdf_builder=fail_on_english)
            self.assertEqual([path.read_bytes() for path in destinations], before)

    def test_failed_fourth_replace_rolls_back_all_previous_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            destinations = [
                root / "docs/cv/cv-master-es.md",
                root / "public/cv-AlfaroFernando-Esp.pdf",
                root / "docs/cv/cv-master-en.md",
                root / "public/cv-AlfaroFernando-Eng.pdf",
                root / "docs/cv/cv-coverage.md",
            ]
            for index, path in enumerate(destinations):
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(f"previous-{index}".encode())
            before = [path.read_bytes() for path in destinations]
            calls = 0

            def fail_once(source: os.PathLike[str], destination: os.PathLike[str]) -> None:
                nonlocal calls
                calls += 1
                if calls == 4:
                    raise OSError("fixture: destination replacement failed")
                os.replace(source, destination)

            with self.assertRaisesRegex(OSError, "replacement failed"):
                generate_all(root=root, replace_fn=fail_once)
            self.assertEqual([path.read_bytes() for path in destinations], before)


if __name__ == "__main__":
    unittest.main()
