import os
import re
import json
import io
import pdfplumber
import easyocr
import numpy as np
from flask import Blueprint, request, jsonify
from PIL import Image
from thefuzz import process, fuzz

report_bp = Blueprint('report', __name__)

# Initialize EasyOCR reader (cached)
reader = None

def get_ocr_reader():
    global reader
    if reader is None:
        reader = easyocr.Reader(['en'], gpu=False)
    return reader

# Master mapping of keywords to our internal form keys
# Score is used for fuzzy matching
MASTER_MAP = {
    'age': ['age', 'years', 'yrs', 'patient age'],
    'glucose': ['glucose', 'blood sugar', 'fasting sugar', 'glucose fasting', 'sugar', 'bgr', 'random glucose'],
    'bmi': ['bmi', 'body mass index'],
    'bp': ['blood pressure', 'bp', 'systolic', 'diastolic'],
    'chol': ['total cholesterol', 'cholesterol', 'chol', 'serum cholesterol'],
    'hemo': ['haemoglobin', 'hb', 'hemoglobin', 'hgb'],
    'sc': ['creatinine', 'serum creatinine', 'sc'],
    'bu': ['blood urea', 'urea', 'bu'],
    'pcv': ['packed cell volume', 'pcv', 'haematocrit', 'p.c.v'],
    'rbcc': ['rbc count', 'r.b.c', 'erythrocyte count', 'rbc'],
    'wbcc': ['wbc count', 'total leucocytic count', 'tlc', 'leucocytes', 'wbc'],
    'sg': ['specific gravity', 's.g', 'gravity'],
    'al': ['albumin', 'urine albumin', 'alb'],
    'su': ['urine sugar', 'sugar', 'su'],
    'pc': ['pus cells', 'pus'],
    'cat_score': ['cat score', 'cat'],
    'sex': ['sex', 'gender', 'biological sex']
}

def extract_from_pdf_tables(file_stream):
    """Advanced table extraction using pdfplumber."""
    extracted = {}
    try:
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                # 1. Try to extract structured tables
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        # Clean row data
                        row = [str(cell).lower().strip() if cell else "" for cell in row]
                        if not any(row): continue
                        
                        # Process each row: find a keyword in one cell and a number in another
                        find_matches_in_row(row, extracted)
                
                # 2. Also extract raw text for unstructured parts (like headers)
                text = page.extract_text()
                if text:
                    find_matches_in_text(text, extracted)
                    
    except Exception as e:
        print(f"PDF Extraction Error: {e}")
    return extracted

def find_matches_in_row(row, extracted):
    """Scans a table row for matches."""
    row_str = " ".join(row)
    for key, keywords in MASTER_MAP.items():
        if key in extracted and key != 'bp': continue
        
        # Check if any keyword matches any cell in the row
        for kw in keywords:
            for cell in row:
                if kw in cell:
                    # Found keyword! Look for the value in subsequent cells
                    # or in the same cell
                    nums = re.findall(r"[-+]?\d*\.\d+|\d+", row_str)
                    if nums:
                        try_assign_value(key, nums, extracted, row_str)
                        return

def find_matches_in_text(text, extracted):
    """Fuzzy text scanning for non-table data."""
    lines = text.split('\n')
    for line in lines:
        line_lower = line.lower()
        
        # Check for Thyrocare-style (18Y/M)
        demo_match = re.search(r'\((\d+)\s*y/([mf])\)', line_lower)
        if demo_match:
            extracted['age'] = float(demo_match.group(1))
            extracted['sex'] = 1 if demo_match.group(2) == 'm' else 0

        for key, keywords in MASTER_MAP.items():
            if key in extracted and key != 'bp': continue
            
            # Use fuzzy matching for the line
            best_match, score = process.extractOne(key, keywords, scorer=fuzz.partial_ratio)
            
            for kw in keywords:
                if kw in line_lower:
                    nums = re.findall(r"[-+]?\d*\.\d+|\d+", line_lower)
                    if nums:
                        try_assign_value(key, nums, extracted, line_lower)
                    elif any(w in line_lower for w in ['nil', 'absent', 'negative', 'normal']):
                        extracted[key] = 0 if key != 'pc' else 1
                    break

def try_assign_value(key, nums, extracted, context):
    """Intelligently assigns a numeric value to a key."""
    try:
        # Convert all strings to floats
        vals = [float(n) for n in nums]
        
        if key == 'bp' and len(vals) >= 2:
            extracted['bp'] = vals[1] # Diastolic
        elif key == 'age':
            # Age should be 1-120
            for v in vals:
                if 1 <= v <= 120:
                    extracted['age'] = v
                    break
        elif key == 'pc':
            extracted['pc'] = 1 if 'nil' in context or '0-1' in context else 0
        else:
            # For most fields, just grab the first plausible number
            extracted[key] = vals[0]
    except:
        pass

@report_bp.route('/extract-report', methods=['POST'])
def extract_report():
    file = request.files.get('file')
    if not file: return jsonify({'error': 'No file'}), 400

    try:
        if file.filename.lower().endswith('.pdf'):
            data = extract_from_pdf_tables(file)
        else:
            # For images, we still use OCR text but with fuzzy mapping
            text = extract_text_from_image(file)
            data = {}
            find_matches_in_text(text, data)
        
        return jsonify({'success': True, 'extractedData': data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_text_from_image(file_stream):
    try:
        img_bytes = file_stream.read()
        ocr = get_ocr_reader()
        results = ocr.readtext(img_bytes, detail=0)
        return " ".join(results)
    except: return ""
