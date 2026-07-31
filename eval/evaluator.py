"""
AI Quiz Generator - Automated Evaluation System
Chấm điểm tự động theo 3 chiều chất lượng + quality bar đã chốt trong spec.md
"""

import json
import re
import sys
import os
from typing import Dict, List, Tuple
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'codebase', 'quiz-app'))


def normalize_text(text: str) -> str:
    """Chuẩn hóa text để so khớp (lowercase, gộp whitespace)"""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    # Remove common noise
    text = re.sub(r'[\"\'""''()]', '', text)
    text = re.sub(r'trang\s*\d+', '', text, flags=re.IGNORECASE)
    return text.strip()


def check_grounding(source_snippet: str, pdf_content: str) -> Tuple[bool, str]:
    """
    Chiều 1: Kiểm tra source_snippet có trace được về PDF không
    Returns: (pass/fail, reason)
    """
    if not source_snippet or len(source_snippet.strip()) < 3:
        return False, "source_snippet quá ngắn hoặc rỗng"
    
    snippet_norm = normalize_text(source_snippet)
    pdf_norm = normalize_text(pdf_content)
    
    if not snippet_norm:
        return False, "source_snippet sau normalize bị rỗng"
    
    # 1. Khớp trực tiếp chuỗi con
    if snippet_norm in pdf_norm:
        return True, "Khớp trực tiếp chuỗi con"
    
    # 2. Khớp 50% prefix đầu
    prefix_len = max(10, int(len(snippet_norm) * 0.5))
    if snippet_norm[:prefix_len] in pdf_norm:
        return True, f"Khớp {prefix_len} ký tự đầu"
    
    # 3. Khớp từ khóa (≥40% từ có trong PDF)
    snippet_words = [w for w in snippet_norm.split() if len(w) >= 3]
    if len(snippet_words) < 2:
        return False, "Quá ít từ có nghĩa trong snippet"
    
    matches = sum(1 for word in snippet_words if word in pdf_norm)
    match_ratio = matches / len(snippet_words)
    
    if match_ratio >= 0.4:
        return True, f"Khớp {match_ratio:.1%} từ khóa ({matches}/{len(snippet_words)} từ)"
    
    return False, f"Chỉ khớp {match_ratio:.1%} từ khóa ({matches}/{len(snippet_words)} từ) - dưới ngưỡng 40%"


def check_application_level(question: str, scenario: str, options: List[str]) -> Tuple[int, str]:
    """
    Chiều 2: Đánh giá mức độ ứng dụng (1-5)
    1 = ghi nhớ thuần
    3 = có tình huống nhưng vẫn hỏi ghi nhớ
    5 = ứng dụng thật vào tình huống
    """
    q_lower = question.lower()
    scenario_lower = (scenario or "").lower()
    
    # Indicators của câu hỏi ghi nhớ (BAD)
    memorization_indicators = [
        "là gì", "what is", "define", "định nghĩa", 
        "bao gồm những gì", "includes", "consists of",
        "có bao nhiêu", "how many"
    ]
    
    # Indicators của câu hỏi ứng dụng (GOOD)
    application_indicators = [
        "nên chọn", "should choose", "phù hợp nhất",
        "trong tình huống", "in this situation", "trường hợp",
        "giải quyết", "solve", "xử lý", "handle",
        "phân tích", "analyze", "đánh giá", "evaluate",
        "so sánh", "compare", "khi nào", "when to"
    ]
    
    has_scenario = len(scenario_lower) > 20
    has_memorization = any(ind in q_lower for ind in memorization_indicators)
    has_application = any(ind in q_lower for ind in application_indicators)
    
    if has_memorization and not has_scenario:
        return 1, "Câu hỏi ghi nhớ thuần, không có tình huống"
    
    if has_memorization and has_scenario:
        return 3, "Có tình huống nhưng câu hỏi vẫn kiểm tra ghi nhớ"
    
    if has_scenario and has_application:
        return 5, "Có tình huống thực tế + yêu cầu áp dụng/phân tích"
    
    if has_scenario:
        return 4, "Có tình huống nhưng chưa rõ mức ứng dụng"
    
    if has_application:
        return 4, "Yêu cầu ứng dụng nhưng thiếu bối cảnh cụ thể"
    
    return 2, "Câu hỏi hiểu khái niệm, không phải ghi nhớ hoặc ứng dụng rõ ràng"


def check_correctness(quiz_data: Dict, pdf_content: str) -> Tuple[bool, str]:
    """
    Chiều 3: Kiểm tra tính đúng đắn
    - Đáp án có tồn tại trong options không
    - Explanation không mâu thuẫn với đáp án
    """
    try:
        options = quiz_data.get('options', [])
        correct_index = quiz_data.get('correct_index')
        explanation = quiz_data.get('explanation', '')
        
        if correct_index is None or correct_index < 0 or correct_index >= len(options):
            return False, f"correct_index={correct_index} không hợp lệ cho {len(options)} options"
        
        if not explanation or len(explanation.strip()) < 10:
            return False, "Explanation quá ngắn hoặc rỗng"
        
        # Kiểm tra explanation không chứa mâu thuẫn rõ ràng
        explanation_lower = explanation.lower()
        wrong_indicators = ["sai", "không đúng", "không phải", "incorrect", "wrong"]
        
        for indicator in wrong_indicators:
            if indicator in explanation_lower:
                return False, f"Explanation chứa từ phủ định '{indicator}' - có thể mâu thuẫn"
        
        return True, "Đáp án và explanation hợp lệ"
        
    except Exception as e:
        return False, f"Lỗi kiểm tra correctness: {str(e)}"


def evaluate_single_question(question_data: Dict, test_case: Dict) -> Dict:
    """Đánh giá 1 câu hỏi theo 3 chiều"""
    pdf_content = test_case['input']['pdf_content']
    
    # Chiều 1: Grounding
    source_snippet = question_data.get('source_snippet', '')
    grounding_pass, grounding_reason = check_grounding(source_snippet, pdf_content)
    
    # Chiều 2: Application Level
    question = question_data.get('question', '')
    scenario = question_data.get('scenario', '')
    options = question_data.get('options', [])
    app_level, app_reason = check_application_level(question, scenario, options)
    
    # Chiều 3: Correctness
    correctness_pass, correctness_reason = check_correctness(question_data, pdf_content)
    
    return {
        'grounding': {
            'pass': grounding_pass,
            'reason': grounding_reason,
            'source_snippet': source_snippet[:100] + '...' if len(source_snippet) > 100 else source_snippet
        },
        'application_level': {
            'score': app_level,
            'reason': app_reason
        },
        'correctness': {
            'pass': correctness_pass,
            'reason': correctness_reason
        }
    }


def evaluate_quiz_output(quiz_output: Dict, test_case: Dict) -> Dict:
    """Đánh giá toàn bộ output của 1 test case"""
    questions = quiz_output.get('questions', [])
    
    if not questions:
        return {
            'error': 'Không có câu hỏi nào được sinh ra',
            'scores': None
        }
    
    results = []
    for idx, q in enumerate(questions):
        result = evaluate_single_question(q, test_case)
        result['question_index'] = idx + 1
        result['difficulty'] = q.get('difficulty', 'unknown')
        results.append(result)
    
    # Tính tổng hợp
    total = len(results)
    grounding_passed = sum(1 for r in results if r['grounding']['pass'])
    app_level_4_or_above = sum(1 for r in results if r['application_level']['score'] >= 4)
    correctness_passed = sum(1 for r in results if r['correctness']['pass'])
    
    return {
        'test_case_id': test_case['id'],
        'total_questions': total,
        'per_question_results': results,
        'summary': {
            'grounding': {
                'passed': grounding_passed,
                'total': total,
                'percentage': round(grounding_passed / total * 100, 1) if total > 0 else 0
            },
            'application_level': {
                'level_4_or_above': app_level_4_or_above,
                'total': total,
                'percentage': round(app_level_4_or_above / total * 100, 1) if total > 0 else 0,
                'avg_score': round(sum(r['application_level']['score'] for r in results) / total, 2) if total > 0 else 0
            },
            'correctness': {
                'passed': correctness_passed,
                'total': total,
                'percentage': round(correctness_passed / total * 100, 1) if total > 0 else 0
            }
        }
    }


def run_evaluation(golden_set_path: str, output_path: str, results_output_path: str = None):
    """
    Chạy evaluation trên golden set
    Lưu ý: Hiện tại chỉ simulate vì chưa có API thật chạy
    """
    print("=" * 70)
    print("AI QUIZ GENERATOR - AUTOMATED EVALUATION")
    print("=" * 70)
    print()
    
    # Load golden set
    with open(golden_set_path, 'r', encoding='utf-8') as f:
        golden_set = json.load(f)
    
    test_cases = golden_set['test_cases']
    quality_bar = golden_set['meta']['quality_bar']
    
    print(f"📊 Loaded {len(test_cases)} test cases")
    print(f"🎯 Quality Bar:")
    print(f"   - Grounding: {quality_bar['grounding']}")
    print(f"   - Application: {quality_bar['application_level']}")
    print(f"   - Correctness: {quality_bar['correctness']}")
    print()
    print("=" * 70)
    print()
    
    # Simulate output (thực tế phải gọi API generate-quiz thật)
    print("⚠️  NOTE: Đang chạy ở chế độ SIMULATION")
    print("    Để chạy thật, cần:")
    print("    1. Start Flask server: cd codebase/quiz-app && python app.py")
    print("    2. Uncomment phần gọi API trong code")
    print()
    
    all_results = []
    
    for idx, test_case in enumerate(test_cases, 1):
        print(f"[{idx}/{len(test_cases)}] Testing {test_case['id']} ({test_case['category']})...")
        
        # TODO: Thay bằng gọi API thật
        # Ở đây chỉ simulate output để test evaluator
        simulated_output = simulate_quiz_generation(test_case)
        
        result = evaluate_quiz_output(simulated_output, test_case)
        all_results.append(result)
        
        # In summary ngắn
        summary = result.get('summary', {})
        if summary:
            print(f"  ✓ Grounding: {summary['grounding']['percentage']}%")
            print(f"  ✓ App Level: {summary['application_level']['percentage']}% (≥4), avg={summary['application_level']['avg_score']}")
            print(f"  ✓ Correctness: {summary['correctness']['percentage']}%")
        print()
    
    # Tính tổng hợp toàn bộ
    print("=" * 70)
    print("OVERALL RESULTS")
    print("=" * 70)
    
    total_questions = sum(r['total_questions'] for r in all_results)
    total_grounding_pass = sum(r['summary']['grounding']['passed'] for r in all_results)
    total_app_4_above = sum(r['summary']['application_level']['level_4_or_above'] for r in all_results)
    total_correctness_pass = sum(r['summary']['correctness']['passed'] for r in all_results)
    
    grounding_pct = round(total_grounding_pass / total_questions * 100, 1)
    app_pct = round(total_app_4_above / total_questions * 100, 1)
    correctness_pct = round(total_correctness_pass / total_questions * 100, 1)
    
    print(f"\n📊 Tổng số câu hỏi đánh giá: {total_questions}")
    print(f"\n1️⃣  Grounding (Bám nguồn):")
    print(f"   {total_grounding_pass}/{total_questions} pass ({grounding_pct}%)")
    print(f"   Quality Bar: ≥90% → {'✅ ĐẠT' if grounding_pct >= 90 else '❌ CHƯA ĐẠT'}")
    
    print(f"\n2️⃣  Application Level (Ứng dụng ≥4/5):")
    print(f"   {total_app_4_above}/{total_questions} pass ({app_pct}%)")
    print(f"   Quality Bar: ≥80% → {'✅ ĐẠT' if app_pct >= 80 else '❌ CHƯA ĐẠT'}")
    
    print(f"\n3️⃣  Correctness (Đáp án đúng):")
    print(f"   {total_correctness_pass}/{total_questions} pass ({correctness_pct}%)")
    print(f"   Quality Bar: 100% → {'✅ ĐẠT' if correctness_pct == 100 else '❌ CHƯA ĐẠT'}")
    
    # Overall pass/fail
    print(f"\n{'='*70}")
    overall_pass = grounding_pct >= 90 and app_pct >= 80 and correctness_pct == 100
    if overall_pass:
        print("🎉 OVERALL: ✅ ĐẠT QUALITY BAR")
    else:
        print("❌ OVERALL: CHƯA ĐẠT QUALITY BAR")
        print("\nNguyên nhân:")
        if grounding_pct < 90:
            print(f"  - Grounding: {grounding_pct}% < 90%")
        if app_pct < 80:
            print(f"  - Application: {app_pct}% < 80%")
        if correctness_pct < 100:
            print(f"  - Correctness: {correctness_pct}% < 100%")
    print("=" * 70)
    
    # Save detailed results
    if results_output_path:
        detailed_report = {
            'meta': {
                'evaluation_time': datetime.now().isoformat(),
                'total_test_cases': len(test_cases),
                'total_questions': total_questions,
                'quality_bar': quality_bar
            },
            'overall_scores': {
                'grounding': {
                    'passed': total_grounding_pass,
                    'total': total_questions,
                    'percentage': grounding_pct,
                    'quality_bar': 90,
                '達成': grounding_pct >= 90
                },
                'application_level': {
                    'level_4_or_above': total_app_4_above,
                    'total': total_questions,
                    'percentage': app_pct,
                    'quality_bar': 80,
                    '達成': app_pct >= 80
                },
                'correctness': {
                    'passed': total_correctness_pass,
                    'total': total_questions,
                    'percentage': correctness_pct,
                    'quality_bar': 100,
                    '達成': correctness_pct == 100
                }
            },
            'overall_pass': overall_pass,
            'per_test_case_results': all_results
        }
        
        with open(results_output_path, 'w', encoding='utf-8') as f:
            json.dump(detailed_report, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Detailed results saved to: {results_output_path}")


def simulate_quiz_generation(test_case: Dict) -> Dict:
    """
    Simulate quiz generation để test evaluator
    Thực tế phải gọi API POST /api/generate-quiz thật
    """
    input_data = test_case['input']
    pdf_content = input_data['pdf_content']
    
    # Simulate 1 câu hỏi đơn giản
    # Trong thực tế, đây là output từ API
    return {
        'questions': [
            {
                'question': f"Dựa vào kiến thức trong tài liệu, tình huống nào sau đây thể hiện đúng ứng dụng?",
                'scenario': "Một công ty đang xây dựng hệ thống AI.",
                'options': [
                    'A. Lựa chọn 1',
                    'B. Lựa chọn 2', 
                    'C. Lựa chọn 3',
                    'D. Lựa chọn 4'
                ],
                'correct_index': 1,
                'explanation': f"Lựa chọn B đúng vì khớp với khái niệm trong tài liệu.",
                'source_snippet': pdf_content[:50] + '...',  # Lấy 50 ký tự đầu để simulate
                'difficulty': input_data.get('difficulty_level', 'medium')
            }
        ]
    }


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Evaluate AI Quiz Generator')
    parser.add_argument('--golden-set', default='golden-set.json', help='Path to golden set JSON')
    parser.add_argument('--output', default='evaluation-results.json', help='Path to save results')
    
    args = parser.parse_args()
    
    # Run evaluation
    golden_set_path = os.path.join(os.path.dirname(__file__), args.golden_set)
    results_path = os.path.join(os.path.dirname(__file__), args.output)
    
    run_evaluation(golden_set_path, None, results_path)
