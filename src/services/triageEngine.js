/**
 * Explainable AI Geo-Triage Engine
 * Calculates deterministic, transparent priority urgency scores (0 - 100)
 * based on multi-factor clinical, spatial, and vulnerability telemetry.
 */

export function calculateUrgencyScore(incident) {
  let score = 40; // Base score
  const reasons = [];

  // 1. Emergency Category Severity
  switch (incident.category) {
    case 'TRAPPED_WATER':
      score += 35;
      reasons.push('Submerged entrapment risk (+35)');
      break;
    case 'STRUCTURAL_COLLAPSE':
      score += 32;
      reasons.push('Crush/entrapment hazard from structural collapse (+32)');
      break;
    case 'MEDICAL_TRAUMA':
      score += 30;
      reasons.push('Acute medical/trauma condition requiring immediate triage (+30)');
      break;
    case 'ELDERLY_ISOLATED':
      score += 18;
      reasons.push('Mobility impairment / isolated vulnerable adult (+18)');
      break;
    case 'FOOD_WATER_DEPLETED':
      score += 15;
      reasons.push('Potable water and food exhaustion (+15)');
      break;
    default:
      score += 10;
      reasons.push('General humanitarian distress report (+10)');
  }

  // 2. Vulnerability Multipliers (Infants, Children, Elderly)
  const headcount = incident.headcount || { adults: 1, children: 0, infants: 0 };
  
  if (headcount.infants > 0) {
    const infantPoints = Math.min(headcount.infants * 8, 16);
    score += infantPoints;
    reasons.push(`${headcount.infants} infant(s) present (+${infantPoints})`);
  }

  if (headcount.children > 0) {
    const childPoints = Math.min(headcount.children * 4, 12);
    score += childPoints;
    reasons.push(`${headcount.children} young child(ren) present (+${childPoints})`);
  }

  if (headcount.adults > 6) {
    score += 6;
    reasons.push(`High headcount cluster (${headcount.adults} adults) (+6)`);
  }

  // 3. Environmental Threat Assessment (Water Depth / Gas / Structural)
  const depthStr = String(incident.waterDepth || '').toLowerCase();
  if (depthStr.includes('2.') || depthStr.includes('3.') || depthStr.includes('rooftop')) {
    score += 12;
    reasons.push('Critical flood depth >2.0m requiring aerial/boat extraction (+12)');
  } else if (depthStr.includes('1.')) {
    score += 6;
    reasons.push('Moderate flood depth >1.0m (+6)');
  }

  // Cap score at 99 max
  const finalScore = Math.min(Math.max(score, 15), 99);

  // Derive Priority Level
  let priority = 'MODERATE';
  if (finalScore >= 85) priority = 'CRITICAL';
  else if (finalScore >= 70) priority = 'HIGH';
  else if (finalScore < 45) priority = 'LOW';

  const rationaleText = `${priority} Priority (${finalScore}/100): ${reasons.join(', ')}.`;

  return {
    urgencyScore: finalScore,
    priority,
    reasons,
    aiRationale: rationaleText
  };
}

/**
 * Ranks a list of incidents dynamically
 */
export function rankIncidentsByUrgency(incidents) {
  return [...incidents].sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
}
