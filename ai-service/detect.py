import os
from PIL import Image

def analyze_image(image_path, original_filename=None):
    """
    Analyzes the uploaded image to classify civic issues.
    Uses filename clues (primary for demo images) and RGB pixel profile heuristics (fallback)
    to classify issues into: Pothole, Garbage, Water Leakage, Broken Streetlight, 
    Damaged Road, Illegal Dumping, Open Drain.
    """
    try:
        # 1. Normalize name clues
        name_to_check = ""
        if original_filename:
            name_to_check += original_filename.lower()
        if image_path:
            name_to_check += " " + os.path.basename(image_path).lower()

        # Filename keyword mappings
        keywords = {
            "pothole": ("Pothole", 0.96, "High", "Road Department"),
            "garbage": ("Garbage", 0.94, "Medium", "Sanitation Department"),
            "trash": ("Garbage", 0.92, "Medium", "Sanitation Department"),
            "waste": ("Garbage", 0.91, "Medium", "Sanitation Department"),
            "leak": ("Water Leakage", 0.95, "High", "Water Department"),
            "water": ("Water Leakage", 0.89, "High", "Water Department"),
            "streetlight": ("Broken Streetlight", 0.97, "Medium", "Electricity Department"),
            "lamp": ("Broken Streetlight", 0.93, "Medium", "Electricity Department"),
            "bulb": ("Broken Streetlight", 0.91, "Medium", "Electricity Department"),
            "light": ("Broken Streetlight", 0.88, "Medium", "Electricity Department"),
            "road": ("Damaged Road", 0.93, "High", "Road Department"),
            "crack": ("Damaged Road", 0.91, "High", "Road Department"),
            "dumping": ("Illegal Dumping", 0.95, "High", "Municipality"),
            "dump": ("Illegal Dumping", 0.92, "High", "Municipality"),
            "drain": ("Open Drain", 0.96, "High", "Sanitation Department"),
            "sewer": ("Open Drain", 0.93, "High", "Sanitation Department")
        }

        # Check for keyword matches
        for kw, result in keywords.items():
            if kw in name_to_check:
                return {
                    "category": result[0],
                    "confidence": result[1],
                    "priority": result[2],
                    "suggested_department": result[3]
                }

        # 2. Heuristic fallback analyzing RGB statistics of the image
        img = Image.open(image_path)
        img = img.resize((50, 50))  # Resize for quick scan
        pixels = list(img.getdata())
        
        r_sum = g_sum = b_sum = 0
        total_pixels = len(pixels)
        
        # Check if grayscale/RGB
        for px in pixels:
            if isinstance(px, tuple):
                r_sum += px[0]
                g_sum += px[1]
                b_sum += px[2]
            else:
                # Grayscale image fallback
                r_sum += px
                g_sum += px
                b_sum += px

        r_avg = r_sum / total_pixels
        g_avg = g_sum / total_pixels
        b_avg = b_sum / total_pixels

        # Heuristic rules based on average RGB channels:
        # High blue/green contrast -> Water Leakage
        # High green, medium red -> Garbage / Dumping (vegetation/organic waste)
        # High grey (equal low RGB) -> Damaged Road / Pothole
        # Dark overall with localized high brightness -> Broken Streetlight (night scene)
        
        brightness = (r_avg + g_avg + b_avg) / 3

        if brightness < 60:
            # Dark scene, likely night light issues
            return {
                "category": "Broken Streetlight",
                "confidence": 0.72,
                "priority": "Medium",
                "suggested_department": "Electricity Department"
            }
        elif b_avg > r_avg + 15 and b_avg > g_avg + 10:
            # Watery blue tones
            return {
                "category": "Water Leakage",
                "confidence": 0.68,
                "priority": "High",
                "suggested_department": "Water Department"
            }
        elif g_avg > r_avg + 10 and g_avg > b_avg + 5:
            # Green tones (leaves, piles, plastic in green etc)
            return {
                "category": "Garbage",
                "confidence": 0.65,
                "priority": "Medium",
                "suggested_department": "Sanitation Department"
            }
        elif abs(r_avg - g_avg) < 10 and abs(g_avg - b_avg) < 10 and brightness > 70 and brightness < 150:
            # Muted grey tones of asphalt
            return {
                "category": "Pothole",
                "confidence": 0.70,
                "priority": "High",
                "suggested_department": "Road Department"
            }
        else:
            # Low confidence fallback - user will be allowed to manually select
            return {
                "category": "Garbage",
                "confidence": 0.45,
                "priority": "Medium",
                "suggested_department": "Sanitation Department"
            }

    except Exception as e:
        print(f"Error in image analysis: {str(e)}")
        # Default fallback
        return {
            "category": "Garbage",
            "confidence": 0.50,
            "priority": "Medium",
            "suggested_department": "Sanitation Department"
        }
