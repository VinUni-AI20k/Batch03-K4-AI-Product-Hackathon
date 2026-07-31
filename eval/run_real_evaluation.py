"""
Chạy evaluation với API thật (Flask server phải đang chạy)
"""

import json
import requests
import time
import sys
import os
from evaluator import evaluate_quiz_output
from datetime import datetime

API_URL = "http://localhost:5000/api/generate-quiz"

def check_server_running():
    """Kiểm tra Flask server có chạy không"""
    try:
        response = requests.get("http://localhost:5000/", timeout=2)
        return response.status_code == 200
    except:
        return False

def call_real_api(test_case):
    """Gọi API thật để sinh quiz"""
    input_data = test_case['input']
    
    # Tạo temporary PDF file từ text
    # (Trong thực tế nên dùng PDF thật từ data/)
    from io import BytesIO
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    
    pdf_buffer = BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    
    # Add UTF-8 font for Vietnamese
    try:
        pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
        c.setFont('Arial', 12)
    except:
        c.setFont('Helvetica', 12)
    
    # Write content to PDF
    text = input_data['pdf_content']
    c.drawString(50, 750, text[:100])  # Simple PDF
    c.save()
    
    pdf_buffer.seek(0)
    
    # Call API
    files = {'pdf': ('test.pdf', pdf_buffer, 'application/pdf')}
    data = {
        'num_questions': input_data['num_questions'],
        'mode': input_data['mode'],
        'difficulty_level': input_data['difficulty_level']
    }
    
    try:
        response = requests.post(API_URL, files=files, data=data, timeout=120)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': f"API returned {response.status_code}: {response.text}"}
    except Exception as e:
        return {'error': f"API call failed: {str(e)}"}

def run_real_evaluation():
    """Chạy evaluation với API thật"""
    
    print("=" * 70)
    print("AI QUIZ GENERATOR - REAL API EVALUATION")
    print("=" * 70)
    print()
    
    # Check server
    print("🔍 Checking if Flask server is running...")
    if not check_server_running():
        print("❌ Flask server is NOT running!")
        print()
        print("Please start the server first:")
        print("  cd codebase/quiz-app")
        print("  python app.py")
        print()
        return
    
    print("✅ Flask server is running")
    print()
    
    # Load golden set
    golden_set_path = os.path.join(os.path.dirname(__file__), 'golden-set.json')
    with open(golden_set_path, 'r', encoding='utf-8') as f:
        golden_set = json.load(f)
    
    test_cases = golden_set['test_cases'][:5]  # Test first 5 cases only
    print(f"📊 Testing {len(test_cases)} cases (subset for quick test)")
    print()
    
    all_results = []
    
    for idx, test_case in enumerate(test_cases, 1):
        print(f"[{idx}/{len(test_cases)}] Testing {test_case['id']}...")
        
        # Call real API
        quiz_output = call_real_api(test_case)
        
        if 'error' in quiz_output:
            print(f"  ❌ API Error: {quiz_output['error']}")
            continue
        
        # Evaluate
        result = evaluate_quiz_output(quiz_output, test_case)
        all_results.append(result)
        
        # Print summary
        summary = result.get('summary', {})
        if summary:
            print(f"  ✓ Grounding: {summary['grounding']['percentage']}%")
            print(f"  ✓ App Level: {summary['application_level']['percentage']}%")
            print(f"  ✓ Correctness: {summary['correctness']['percentage']}%")
        
        time.sleep(1)  # Rate limiting
        print()
    
    # Overall summary
    if all_results:
        total_questions = sum(r['total_questions'] for r in all_results)
        total_grounding_pass = sum(r['summary']['grounding']['passed'] for r in all_results)
        total_app_4_above = sum(r['summary']['application_level']['level_4_or_above'] for r in all_results)
        total_correctness_pass = sum(r['summary']['correctness']['passed'] for r in all_results)
        
        grounding_pct = round(total_grounding_pass / total_questions * 100, 1)
        app_pct = round(total_app_4_above / total_questions * 100, 1)
        correctness_pct = round(total_correctness_pass / total_questions * 100, 1)
        
        print("=" * 70)
        print("RESULTS")
        print("=" * 70)
        print(f"Grounding:    {grounding_pct}% (bar: ≥90%)")
        print(f"Application:  {app_pct}% (bar: ≥80%)")
        print(f"Correctness:  {correctness_pct}% (bar: 100%)")
        print()
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        output_path = os.path.join(os.path.dirname(__file__), f'run-real-{timestamp}.json')
        
        report = {
            'meta': {
                'evaluation_time': datetime.now().isoformat(),
                'mode': 'real_api',
                'total_test_cases': len(test_cases),
                'total_questions': total_questions
            },
            'overall_scores': {
                'grounding': {'percentage': grounding_pct},
                'application_level': {'percentage': app_pct},
                'correctness': {'percentage': correctness_pct}
            },
            'per_test_case_results': all_results
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Results saved to: {output_path}")

if __name__ == '__main__':
    try:
        import reportlab
    except ImportError:
        print("❌ Missing reportlab library!")
        print("Install with: pip install reportlab")
        sys.exit(1)
    
    run_real_evaluation()
