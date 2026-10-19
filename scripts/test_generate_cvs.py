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
