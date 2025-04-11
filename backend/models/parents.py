from typing import Dict, List, Any
import json

def analyze_dyslexia_responses(child_name: str, child_age: int, responses: Dict[str, int]) -> Dict[str, Any]:
    """
    Analyze the responses from the dyslexia assessment quiz.
    
    Args:
        child_name: Name of the child
        child_age: Age of the child
        responses: Dictionary mapping question IDs to response values (0-100)
        
    Returns:
        Dictionary containing analysis results
    """
    # Load questions data
    with open("questions.json", "r") as f:
        questions_data = json.load(f)
    
    questions = questions_data["questions"]
    categories = questions_data["categories"]
    
    # Organize questions by category
    category_questions = {}
    for category in categories.keys():
        category_questions[category] = []
    
    for question in questions:
        category = question["category"]
        if category in category_questions:
            category_questions[category].append(question["id"])
    
    # Calculate category scores
    category_scores = {}
    total_score = 0
    question_count = 0
    
    for category, question_ids in category_questions.items():
        if not question_ids:
            category_scores[category] = 0
            continue
            
        category_score = 0
        for q_id in question_ids:
            if q_id in responses:
                # For questions where a high score indicates dyslexia tendency (most questions)
                # The higher the response value, the higher the dyslexia indicator
                category_score += responses[q_id]
                total_score += responses[q_id]
                question_count += 1
        
        if len(question_ids) > 0:
            category_scores[category] = category_score / len(question_ids)
        else:
            category_scores[category] = 0
    
    # Calculate overall score
    overall_score = total_score / question_count if question_count > 0 else 0
    
    # Determine severity level
    severity_level = determine_severity(overall_score)
    
    # Generate recommendations
    recommendations = generate_recommendations(category_scores)
    
    return {
        "overall_score": round(overall_score, 2),
        "category_scores": {categories[k]: round(v, 2) for k, v in category_scores.items()},
        "recommendations": recommendations,
        "severity_level": severity_level,
        "child_info": {
            "name": child_name,
            "age": child_age
        }
    }

def determine_severity(overall_score: float) -> str:
    """Determine the severity level based on the overall score."""
    if overall_score < 20:
        return "Minimal or No Indicators"
    elif overall_score < 40:
        return "Mild Indicators"
    elif overall_score < 60:
        return "Moderate Indicators"
    elif overall_score < 80:
        return "Significant Indicators"
    else:
        return "Strong Indicators"

def generate_recommendations(category_scores: Dict[str, float]) -> Dict[str, List[str]]:
    """Generate recommendations based on category scores."""
    recommendations = {}
    
    # Phonological Awareness
    if "phonological_awareness" in category_scores:
        score = category_scores["phonological_awareness"]
        recs = []
        if score >= 50:
            recs = [
                "Practice breaking words into individual sounds (phonemes)",
                "Play rhyming games and focus on word families",
                "Use letter tiles or cards to build and segment words",
                "Try the Orton-Gillingham approach for phonics instruction",
                "Use apps like 'Phonics Hero' or 'Phonics Monster'"
            ]
        elif score >= 25:
            recs = [
                "Read books with rhyming patterns",
                "Practice clapping syllables in words",
                "Play word games that focus on beginning sounds"
            ]
        recommendations["Phonological Awareness"] = recs
    
    # Visual Processing
    if "visual_processing" in category_scores:
        score = category_scores["visual_processing"]
        recs = []
        if score >= 50:
            recs = [
                "Use colored overlays when reading",
                "Try larger font sizes and increased spacing between lines",
                "Practice visual tracking exercises",
                "Use a ruler or reading guide to keep place when reading",
                "Consider vision therapy assessment"
            ]
        elif score >= 25:
            recs = [
                "Reduce visual clutter in reading materials",
                "Practice visual discrimination activities",
                "Try different font styles to find what works best"
            ]
        recommendations["Visual Processing"] = recs
    
    # Reading Fluency
    if "reading_fluency" in category_scores:
        score = category_scores["reading_fluency"]
        recs = []
        if score >= 50:
            recs = [
                "Practice repeated reading of the same passages",
                "Try paired reading with a parent or tutor",
                "Use audiobooks alongside printed text",
                "Practice sight word recognition daily",
                "Consider structured reading programs like 'Barton Reading'"
            ]
        elif score >= 25:
            recs = [
                "Read aloud daily for short periods",
                "Choose high-interest, lower-level texts",
                "Celebrate improvements in speed and accuracy"
            ]
        recommendations["Reading Fluency"] = recs
    
    # Working Memory
    if "working_memory" in category_scores:
        score = category_scores["working_memory"]
        recs = []
        if score >= 50:
            recs = [
                "Break instructions into smaller steps",
                "Use memory games and activities daily",
                "Create visual checklists and reminders",
                "Practice visualization techniques",
                "Try working memory apps like 'Cogmed' or 'Lumosity'"
            ]
        elif score >= 25:
            recs = [
                "Use mnemonic devices for remembering sequences",
                "Practice recall activities with increasing complexity",
                "Use visual and verbal cues together"
            ]
        recommendations["Working Memory"] = recs
    
    # Reading Comprehension
    if "reading_comprehension" in category_scores:
        score = category_scores["reading_comprehension"]
        recs = []
        if score >= 50:
            recs = [
                "Pre-teach vocabulary before reading new material",
                "Use graphic organizers to map out story elements",
                "Practice visualization while reading",
                "Implement the 'Question-Answer-Relationship' (QAR) strategy",
                "Try reciprocal teaching methods"
            ]
        elif score >= 25:
            recs = [
                "Discuss stories before and after reading",
                "Ask prediction questions while reading",
                "Create story maps for narrative texts"
            ]
        recommendations["Reading Comprehension"] = recs
    
    # Spelling & Writing
    if "spelling" in category_scores:
        score = category_scores["spelling"]
        recs = []
        if score >= 50:
            recs = [
                "Use multisensory spelling methods (see, say, cover, write, check)",
                "Focus on spelling patterns rather than memorization",
                "Try assistive technology like spell checkers or dictation software",
                "Practice word sorting by spelling patterns",
                "Consider structured spelling programs like 'All About Spelling'"
            ]
        elif score >= 25:
            recs = [
                "Create personalized spelling lists based on errors",
                "Use tactile methods like writing in sand or with textured materials",
                "Focus on high-frequency words first"
            ]
        recommendations["Spelling & Writing"] = recs
    
    return recommendations