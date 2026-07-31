import sys
import os
from pathlib import Path
from typing import Optional, Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from api.llm_client import LLMClient
from tools.slide_parser import SlideParser
from tools.slide_formatter import SlideFormatter
from prompts import (
    SLIDE_AGENT_SYSTEM_PROMPT,
    SLIDE_SINGLE_PASS_PROMPT,
    SLIDE_MAP_PROMPT,
    SLIDE_REDUCE_PROMPT
)

class SlideSummaryAgent:
    def __init__(
        self,
        provider: str = "openai",
        model_name: Optional[str] = None,
        temperature: float = 0.2
    ):
        self.llm_client = LLMClient(provider=provider, model_name=model_name, temperature=temperature)
        self.system_prompt = SLIDE_AGENT_SYSTEM_PROMPT

    def summarize_slide_file(
        self,
        file_path: str,
        output_dir: Optional[str] = None,
        map_reduce_threshold: int = 20
    ) -> Dict[str, Any]:
        file_name = Path(file_path).name
        slides = SlideParser.extract_slides(file_path)
        total_slides = len(slides)

        if total_slides == 0:
            return {"error": "Slide không có nội dung văn bản."}

        if total_slides <= map_reduce_threshold:
            full_text = SlideParser.get_full_text(slides)
            prompt = SLIDE_SINGLE_PASS_PROMPT.format(
                total_slides=total_slides,
                full_text=full_text
            )
            final_report = self.llm_client.generate(
                prompt=prompt,
                system_instruction=self.system_prompt
            )
        else:
            map_results = []
            for item in slides:
                s_num = item["slide_number"]
                s_content = item["content"]
                if not s_content:
                    continue
                map_p = SLIDE_MAP_PROMPT.format(slide_number=s_num, content=s_content)
                res = self.llm_client.generate(prompt=map_p, system_instruction=self.system_prompt)
                map_results.append(f"### [Slide {s_num}]\n{res}")

            combined_maps = "\n\n".join(map_results)
            reduce_p = SLIDE_REDUCE_PROMPT.format(
                total_slides=total_slides,
                map_summaries=combined_maps
            )
            final_report = self.llm_client.generate(
                prompt=reduce_p,
                system_instruction=self.system_prompt
            )

        saved_file_path = None
        if output_dir:
            out_name = f"summary_{Path(file_name).stem}.md"
            out_full_path = str(Path(output_dir) / out_name)
            saved_file_path = SlideFormatter.save_markdown(final_report, out_full_path)

        return {
            "file_name": file_name,
            "total_slides": total_slides,
            "summary_md": final_report,
            "saved_file_path": saved_file_path
        }
