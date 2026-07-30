import unittest

from app.main import app


class AppStructureTests(unittest.TestCase):
    def test_required_routes_are_registered(self) -> None:
        # FastAPI may keep included routers lazy; OpenAPI is the stable public view.
        paths = set(app.openapi()["paths"])
        self.assertIn("/api/course/info", paths)
        self.assertIn("/api/v1/health", paths)
        self.assertIn("/api/v1/chat", paths)


if __name__ == "__main__":
    unittest.main()
