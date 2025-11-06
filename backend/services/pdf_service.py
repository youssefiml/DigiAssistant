"""
PDF Report Generation Service
Generates comprehensive diagnostic reports with advantages, disadvantages, and recommendations
"""
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime
from typing import Dict, List, Any
import io

def generate_diagnostic_pdf(
    company_name: str,
    global_score: float,
    maturity_level: str,
    dimension_scores: List[Dict[str, Any]],
    advantages: List[str],
    disadvantages: List[str],
    recommendations: List[str],
    session_id: str
) -> bytes:
    """Generate a comprehensive PDF report"""
    
    # Create PDF in memory
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for PDF elements
    story = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=13,
        textColor=colors.HexColor('#3b82f6'),
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    )
    
    # Title
    story.append(Paragraph("Rapport de Diagnostic Digital", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Company Info
    company_info = f"""
    <b>Entreprise:</b> {company_name}<br/>
    <b>Date du diagnostic:</b> {datetime.now().strftime('%d/%m/%Y')}<br/>
    <b>ID de session:</b> {session_id}
    """
    story.append(Paragraph(company_info, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Executive Summary Box
    story.append(Paragraph("Résumé Exécutif", heading_style))
    
    summary_data = [
        ['Score Global', f'{global_score:.1f}/3'],
        ['Niveau de Maturité', maturity_level],
        ['Pourcentage', f'{(global_score/3)*100:.0f}%']
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#eff6ff')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1e40af')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#3b82f6'))
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Dimension Scores
    story.append(Paragraph("Scores par Dimension", heading_style))
    
    dimension_data = [['Dimension', 'Score', 'Niveau']]
    for dim in dimension_scores:
        score = dim.get('score', dim.get('avg_score', 0))
        level = get_maturity_label(score)
        dimension_data.append([
            dim['dimension_name'],
            f"{score:.1f}/3",
            level
        ])
    
    dimension_table = Table(dimension_data, colWidths=[3*inch, 1*inch, 1.5*inch])
    dimension_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
    ]))
    story.append(dimension_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Detailed Diagnostic Table - Dimensions and Pillars
    story.append(Paragraph("Tableau Détaillé du Diagnostic", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    # Create comprehensive diagnostic table
    diagnostic_data = [['Dimension', 'Pilier', 'Score', 'Max', '%', 'Niveau']]
    
    for dim in dimension_scores:
        dim_name = dim['dimension_name']
        dim_code = dim.get('dimension_code', '')
        pillar_scores = dim.get('pillar_scores', [])
        
        if pillar_scores:
            # Add rows for each pillar
            for i, pillar in enumerate(pillar_scores):
                pillar_name = pillar.get('pillar_name', f"P{i+1}")
                pillar_score = pillar.get('score', 0)
                max_score = pillar.get('max_score', 9)
                percentage = pillar.get('percentage', 0)
                level = get_pillar_level(percentage)
                
                # Only show dimension name in first row, make it bold
                if i == 0:
                    dim_display = f"<b>{dim_name}</b>"
                else:
                    dim_display = ""
                diagnostic_data.append([
                    dim_display,
                    pillar_name,
                    f"{pillar_score:.1f}",
                    f"{max_score}",
                    f"{percentage:.0f}%",
                    level
                ])
        else:
            # Fallback if pillar_scores not available
            dim_score = dim.get('score', dim.get('avg_score', 0))
            dim_percentage = dim.get('percentage', (dim_score / 3) * 100)
            level = get_maturity_label(dim_score)
            diagnostic_data.append([
                dim_name,
                "N/A",
                f"{dim_score:.1f}",
                "3",
                f"{dim_percentage:.0f}%",
                level
            ])
    
    # Calculate column widths
    col_widths = [2.2*inch, 2*inch, 0.6*inch, 0.5*inch, 0.7*inch, 1*inch]
    
    diagnostic_table = Table(diagnostic_data, colWidths=col_widths, repeatRows=1)
    diagnostic_table.setStyle(TableStyle([
        # Header row
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        
        # Data rows
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),  # Dimension column - left align
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),  # Pillar column - left align
        ('ALIGN', (2, 1), (-1, -1), 'CENTER'),  # Score columns - center align
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 6),
        
        # Grid and colors
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d1d5db')),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
    ]))
    
    story.append(diagnostic_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Add legend for pillar levels
    legend_text = """
    <b>Légende des Niveaux:</b><br/>
    <b>Excellent (76-100%):</b> Niveau de maturité avancé<br/>
    <b>Très Bon (51-75%):</b> Bonne maîtrise avec potentiel d'optimisation<br/>
    <b>Bon (26-50%):</b> Bases solides en développement<br/>
    <b>Moyen (1-25%):</b> Démarrage avec opportunités d'amélioration<br/>
    <b>À Améliorer (0%):</b> Besoin d'action prioritaire
    """
    story.append(Paragraph(legend_text, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Page Break
    story.append(PageBreak())
    
    # Advantages Section
    story.append(Paragraph("✓ Points Forts", heading_style))
    if advantages:
        for i, advantage in enumerate(advantages, 1):
            story.append(Paragraph(f"<b>{i}.</b> {advantage}", body_style))
    else:
        story.append(Paragraph("Aucun point fort identifié pour le moment.", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Disadvantages Section
    story.append(Paragraph("⚠ Axes d'Amélioration", heading_style))
    if disadvantages:
        for i, disadvantage in enumerate(disadvantages, 1):
            story.append(Paragraph(f"<b>{i}.</b> {disadvantage}", body_style))
    else:
        story.append(Paragraph("Aucun axe d'amélioration identifié.", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Page Break
    story.append(PageBreak())
    
    # Recommendations Section
    story.append(Paragraph("💡 Recommandations Stratégiques", heading_style))
    if recommendations:
        for i, recommendation in enumerate(recommendations, 1):
            story.append(Paragraph(f"<b>{i}.</b> {recommendation}", body_style))
            story.append(Spacer(1, 0.1*inch))
    else:
        story.append(Paragraph("Aucune recommandation disponible.", body_style))
    
    # Footer
    story.append(Spacer(1, 0.5*inch))
    footer_text = f"""
    <i>Ce rapport a été généré automatiquement par DigiAssistant.<br/>
    Pour toute question, veuillez contacter notre équipe de support.</i>
    """
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER
    )
    story.append(Paragraph(footer_text, footer_style))
    
    # Build PDF
    doc.build(story)
    
    # Get PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes

def get_maturity_label(score: float) -> str:
    """Get maturity label based on score"""
    if score >= 2.5:
        return "Excellent"
    elif score >= 2.0:
        return "Très Bon"
    elif score >= 1.5:
        return "Bon"
    elif score >= 1.0:
        return "Moyen"
    else:
        return "À Améliorer"

def get_pillar_level(percentage: float) -> str:
    """Get maturity level based on percentage for pillars"""
    if percentage >= 76:
        return "Excellent"
    elif percentage >= 51:
        return "Très Bon"
    elif percentage >= 26:
        return "Bon"
    elif percentage >= 1:
        return "Moyen"
    else:
        return "À Améliorer"

def generate_advantages_disadvantages(dimension_scores: List[Dict[str, Any]]) -> tuple[List[str], List[str]]:
    """Generate advantages and disadvantages from dimension scores"""
    advantages = []
    disadvantages = []
    
    for dim in dimension_scores:
        score = dim.get('score', dim.get('avg_score', 0))
        dim_name = dim['dimension_name']
        
        if score >= 2.5:
            advantages.append(f"Excellence en {dim_name} avec un niveau de maturité avancé")
        elif score >= 2.0:
            advantages.append(f"Bonne maîtrise de {dim_name} avec des pratiques établies")
        elif score >= 1.5:
            advantages.append(f"Bases solides en {dim_name} avec un potentiel de développement")
        else:
            disadvantages.append(f"Opportunité d'amélioration significative en {dim_name}")
    
    return advantages, disadvantages

def generate_detailed_recommendations(dimension_scores: List[Dict[str, Any]], global_score: float) -> List[str]:
    """Generate detailed recommendations based on scores"""
    recommendations = []
    
    # Priority recommendations based on weakest dimensions
    weak_dimensions = [d for d in dimension_scores if d.get('score', d.get('avg_score', 0)) < 1.5]
    
    if weak_dimensions:
        recommendations.append(
            f"<b>Priorité Haute:</b> Renforcer les dimensions faibles : "
            f"{', '.join([d['dimension_name'] for d in weak_dimensions])}. "
            f"Cela aura un impact significatif sur votre maturité digitale globale."
        )
    
    # Dimension-specific recommendations
    for dim in dimension_scores:
        score = dim.get('score', dim.get('avg_score', 0))
        dim_name = dim['dimension_name']
        dim_code = dim.get('dimension_code', '')
        
        if score < 1.5:
            if dim_code == 'STRAT':
                recommendations.append(
                    f"<b>{dim_name}:</b> Définir une vision digitale claire alignée avec vos objectifs business. "
                    "Commencez par identifier 2-3 initiatives digitales prioritaires."
                )
            elif dim_code == 'CULTURE':
                recommendations.append(
                    f"<b>{dim_name}:</b> Investir dans la formation et l'accompagnement de vos équipes. "
                    "Organiser des ateliers de sensibilisation au digital."
                )
            elif dim_code == 'CLIENT':
                recommendations.append(
                    f"<b>{dim_name}:</b> Développer votre présence digitale et vos canaux de communication clients. "
                    "Mettre en place un système CRM simple pour suivre vos interactions."
                )
            elif dim_code == 'PROCESS':
                recommendations.append(
                    f"<b>{dim_name}:</b> Identifier et digitaliser vos processus clés. "
                    "Commencer par les processus les plus répétitifs pour gagner en efficacité."
                )
            elif dim_code == 'TECH':
                recommendations.append(
                    f"<b>{dim_name}:</b> Auditer votre infrastructure technique et identifier les outils prioritaires. "
                    "Investir dans des solutions cloud pour plus de flexibilité."
                )
            elif dim_code == 'SECURITE':
                recommendations.append(
                    f"<b>{dim_name}:</b> Mettre en place des mesures de sécurité de base : "
                    "sauvegardes régulières, mots de passe forts, formation aux risques cyber."
                )
    
    # General recommendations based on global score
    if global_score < 1.0:
        recommendations.append(
            "<b>Démarche Globale:</b> Vous êtes en phase de démarrage digital. "
            "Concentrez-vous sur les fondamentaux : présence en ligne, outils collaboratifs de base, "
            "et sensibilisation des équipes."
        )
    elif global_score < 2.0:
        recommendations.append(
            "<b>Démarche Globale:</b> Vous avez posé les bases. "
            "Passez à la structuration : définir une stratégie, standardiser les outils, "
            "et mesurer l'impact de vos actions digitales."
        )
    elif global_score < 2.5:
        recommendations.append(
            "<b>Démarche Globale:</b> Vous êtes bien avancé. "
            "Optimisez maintenant : automatisation des processus, personnalisation client, "
            "et innovation continue."
        )
    else:
        recommendations.append(
            "<b>Démarche Globale:</b> Vous êtes un leader digital. "
            "Maintenez votre avance : expérimentation de nouvelles technologies, "
            "partage de bonnes pratiques, et amélioration continue."
        )
    
    return recommendations
