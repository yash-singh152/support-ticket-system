
import os
import json
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

def classify_ticket_description(description):
    """
    Classifies a ticket description using OpenAI to suggest category and priority.
    Returns a dict with suggested_category and suggested_priority.
    """
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        logger.warning("OPENAI_API_KEY not found. Returning default suggestions.")
        return {"suggested_category": "general", "suggested_priority": "medium"}

    client = OpenAI(api_key=api_key)

    prompt = f"""
    Analyze the following support ticket description and suggest a Category and Priority.
    
    Categories: billing, technical, account, general
    Priorities: low, medium, high, critical
    
    Description: "{description}"
    
    Return ONLY a JSON object with keys "category" and "priority".
    Example: {{"category": "technical", "priority": "high"}}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful support ticket assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=50
        )
        
        content = response.choices[0].message.content.strip()
        # Parse JSON from response
        data = json.loads(content)
        
        # Validate against choices (basic validation)
        valid_categories = ['billing', 'technical', 'account', 'general']
        valid_priorities = ['low', 'medium', 'high', 'critical']
        
        category = data.get('category', 'general').lower()
        priority = data.get('priority', 'medium').lower()
        
        if category not in valid_categories:
            category = 'general'
        if priority not in valid_priorities:
            priority = 'medium'
            
        return {
            "suggested_category": category,
            "suggested_priority": priority
        }

    except Exception as e:
        logger.error(f"Error calling LLM: {str(e)}")
        # Graceful fallback
        return {"suggested_category": "general", "suggested_priority": "medium"}
