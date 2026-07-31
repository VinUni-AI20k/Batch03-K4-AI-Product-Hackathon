import importlib.util
import sys
import unittest
from pathlib import Path


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SPEC = importlib.util.spec_from_file_location("spec_eval", HERE / "evaluate_output.py")
assert SPEC and SPEC.loader
spec_eval = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = spec_eval
SPEC.loader.exec_module(spec_eval)


class SpecEvalTests(unittest.TestCase):
    def test_program_rubric_manifest_matches_program(self):
        findings = spec_eval.program_rubric_findings()
        self.assertFalse([f for f in findings if f.level == "ERROR"], findings)

    def test_day3_source_contract(self):
        case = spec_eval.load_case("day3")
        findings = spec_eval.read_case_source(case, ROOT)
        self.assertFalse([f for f in findings if f.level == "ERROR"], findings)

    def test_day4_source_contract(self):
        case = spec_eval.load_case("day4")
        findings = spec_eval.read_case_source(case, ROOT)
        self.assertFalse([f for f in findings if f.level == "ERROR"], findings)

    def test_day3_output_fixture_passes(self):
        case = spec_eval.load_case("day3")
        content = " ".join(case["required_output_terms"] + case["required_paths"])
        content += " docs/hybrid_flowchart.mermaid FILE MỚI .env KHÔNG COMMIT"
        findings = spec_eval.output_findings_text(case, content)
        self.assertFalse([f for f in findings if f.level == "ERROR"], findings)

    def test_day4_output_fixture_passes(self):
        case = spec_eval.load_case("day4")
        content = " ".join(case["required_output_terms"] + case["required_paths"])
        content += " starter_v0/app.py FILE MỚI starter_v0/.env KHÔNG COMMIT"
        findings = spec_eval.output_findings_text(case, content)
        self.assertFalse([f for f in findings if f.level == "ERROR"], findings)

    def test_day4_output_rejects_unmarked_new_file(self):
        case = spec_eval.load_case("day4")
        content = "205 phút 240 phút data/eval_base.json data/eval_group.json " \
            "artifacts/system_prompt.md artifacts/tools.yaml app.py Coach inference " \
            "API key không có test tự động version log security check " \
            "starter_v0/data/eval_base.json starter_v0/data/eval_group.json " \
            "starter_v0/artifacts/system_prompt.md starter_v0/artifacts/tools.yaml " \
            "starter_v0/app.py starter_v0/artifacts/version_log.csv " \
            "starter_v0/artifacts/REPORT.md starter_v0/tools/__init__.py " \
            "starter_v0/.env DO NOT COMMIT Knowledge Instructions Expected outcome " \
            "Deliverables evidence impact non-goals automation golden set quality bar changelog"
        findings = spec_eval.output_findings_text(case, content)
        self.assertTrue(any("FILE MỚI" in f.message for f in findings if f.level == "ERROR"))


if __name__ == "__main__":
    unittest.main()
