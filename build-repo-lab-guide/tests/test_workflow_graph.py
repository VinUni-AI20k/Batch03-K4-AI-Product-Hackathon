import importlib.util
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, filename: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / filename)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


renderer = load_module("render_lab_guide", "render_lab_guide.py")
validator = load_module("validate_lab_guide", "validate_lab_guide.py")


def model(language="vi"):
    return {
        "meta": {
            "title": "Graph lab",
            "language": language,
            "audience": "Learners",
            "repository": "org/lab",
            "total_minutes": 30,
            "team_size": 2,
        },
        "setup": {
            "prerequisites": [],
            "conflict_prevention": [],
            "commands": {"windows": [], "macos": [], "linux": []},
        },
        "roles": [
            {"id": "writer", "title": "Writer", "ownership": "Input", "files": ["input.json"]},
            {"id": "integrator", "title": "Integrator", "ownership": "Integration", "files": ["app.py"]},
        ],
        "files": [
            {"path": "input.json", "status": "existing_edit", "purpose": "Input"},
            {"path": "app.py", "status": "existing_edit", "purpose": "App"},
        ],
        "phases": [
            {
                "id": "prepare",
                "title": "Prepare",
                "minutes": 10,
                "mode": "parallel",
                "entry_condition": "Setup ready",
                "checkpoint": "Input accepted",
                "tasks": [
                    {
                        "id": "input",
                        "title": "Create input",
                        "owner": "writer",
                        "knowledge": ["Contract"],
                        "guidance": ["Complete input.json"],
                        "paths": ["input.json"],
                        "validation": {"type": "contract_validation", "command": "check-input", "expected": "PASS"},
                        "expected_outcomes": ["Input is valid"],
                        "deliverables": ["input.json"],
                    },
                    {
                        "id": "integrate",
                        "title": "Integrate input",
                        "owner": "integrator",
                        "knowledge": ["Consumer"],
                        "guidance": ["Use input.json"],
                        "paths": ["app.py"],
                        "validation": {"type": "manual_check", "manual": ["Open app"], "expected": "Visible"},
                        "expected_outcomes": ["App accepts input"],
                        "deliverables": ["app.py"],
                    },
                ],
                "collaboration": {
                    "parallel_work": ["Create input"],
                    "shared_files": [],
                    "handoffs": [{"from": "writer", "to": "integrator", "output": "Validated input"}],
                    "integration_owner": "integrator",
                },
                "suggested_commits": [
                    {
                        "message": "feat: accept input",
                        "owner": "integrator",
                        "files": ["input.json", "app.py"],
                        "checkpoint": "Input accepted",
                    }
                ],
            }
        ],
        "validations": [],
        "definition_of_done": ["Input accepted", "Demo ready"],
    }


class WorkflowGraphTests(unittest.TestCase):
    def test_markdown_has_one_localized_mermaid_graph(self):
        rendered = renderer.render_markdown(model())
        self.assertIn("## Luồng làm việc nhóm đầu-cuối", rendered)
        self.assertEqual(rendered.count("```mermaid"), 1)
        self.assertIn('role_writer -->|"Validated input"| role_integrator', rendered)
        self.assertIn("checkpoint_prepare --> completion", rendered)

    def test_english_heading_and_escaped_label(self):
        graph_model = model("en")
        graph_model["phases"][0]["tasks"][0]["title"] = 'Create "input"\nfile'
        rendered = renderer.render_markdown(graph_model)
        self.assertIn("## End-to-end team workflow", rendered)
        self.assertIn('Create \\"input\\"<br/>file', rendered)

    def test_task_lanes_follow_phase_mode(self):
        sequential_model = model()
        sequential_model["phases"][0]["mode"] = "sequential"
        self.assertIn("task_input --> task_integrate", renderer.build_workflow_graph(sequential_model))

        mixed_model = model()
        mixed_model["phases"][0]["mode"] = "mixed"
        graph = renderer.build_workflow_graph(mixed_model)
        self.assertIn("entry_prepare --> task_input", graph)
        self.assertIn("entry_prepare --> task_integrate", graph)

    def test_task_node_identifies_its_owner_without_a_handoff(self):
        graph_model = model()
        graph_model["phases"][0]["collaboration"]["handoffs"] = []
        graph = renderer.build_workflow_graph(graph_model)
        self.assertIn('task_input["Writer: Create input"]', graph)

    def test_rendered_markdown_passes_artifact_validation(self):
        graph_model = model()
        with tempfile.TemporaryDirectory() as temp_dir:
            artifact = Path(temp_dir) / "lab-guide.md"
            artifact.write_text(renderer.render_markdown(graph_model), encoding="utf-8")
            self.assertEqual(validator.validate_artifact(graph_model, artifact), [])

    def test_validator_rejects_markdown_without_workflow_graph(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            artifact = Path(temp_dir) / "lab-guide.md"
            artifact.write_text("# Graph lab\n", encoding="utf-8")
            errors = validator.validate_artifact(model(), artifact)
        self.assertIn("Markdown needs exactly one end-to-end workflow heading", errors)
        self.assertIn("Markdown needs exactly one Mermaid workflow graph", errors)

    def test_validator_rejects_unresolved_handoff_role(self):
        graph_model = model()
        graph_model["phases"][0]["collaboration"]["handoffs"][0]["to"] = "missing"
        errors = validator.validate_model(graph_model)
        self.assertTrue(any("not a declared role" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
