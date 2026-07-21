from pathlib import Path
from shutil import copyfile
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

out = Path("output/pdf/cellular-beam-professional-phase15-report.pdf")
out.parent.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleBlue", parent=styles["Title"], textColor=colors.HexColor("#094cb2"), fontSize=25, leading=30))
styles.add(ParagraphStyle(name="BodySmall", parent=styles["BodyText"], fontSize=9, leading=13))
doc = SimpleDocTemplate(str(out), pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=18*mm, bottomMargin=18*mm)
story = [Paragraph("CELLULAR BEAM PROFESSIONAL", styles["TitleBlue"]), Spacer(1, 5*mm), Paragraph("Engineering Calculation Report - Draft / For Review", styles["Heading2"]), Spacer(1, 8*mm)]
meta = [["Project", "Demo benchmark project"], ["Report number", "CBP-P15-001"], ["Revision", "Phase 15.0"], ["Calculation engine", "Phase 1-14 calculation snapshot"], ["Status", "DRAFT - FOR ENGINEER REVIEW"]]
t = Table(meta, colWidths=[45*mm, 120*mm]); t.setStyle(TableStyle([("BACKGROUND", (0,0), (0,-1), colors.HexColor("#e7ebff")),("GRID",(0,0),(-1,-1),.35,colors.HexColor("#b7c1d2")),("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("PADDING",(0,0),(-1,-1),7)])); story += [t, Spacer(1,10*mm)]
story += [Paragraph("Executive Summary", styles["Heading2"]), Paragraph("This report records available calculation modules and their limitations. It does not certify a structural design or construction suitability.", styles["BodySmall"]), Spacer(1,5*mm)]
rows = [["Module", "Evidence", "Status"], ["Units & section properties", "SI canonical quantities and I-section benchmarks", "Verified foundation"], ["Straight / continuous beam", "Linear elastic FEM, reactions and diagrams", "Analysis action"], ["Cellular openings / web posts", "Action extraction only", "No resistance check"], ["Weld / stiffener", "Demand and review schedules", "No capacity check"], ["Arch / composite / optimization", "Elastic reference and candidate ranking", "Screening only"]]
t = Table(rows, colWidths=[50*mm, 85*mm, 30*mm]); t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#094cb2")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("GRID",(0,0),(-1,-1),.35,colors.HexColor("#b7c1d2")),("VALIGN",(0,0),(-1,-1),"TOP"),("PADDING",(0,0),(-1,-1),6)])); story += [t, PageBreak()]
story += [Paragraph("Warnings and Limitations", styles["Heading2"]), Paragraph("No standard-based strength, buckling, Vierendeel, web-post, weld, stiffener, connector, composite, or arch capacity conclusion is stated unless a governing standard, edition, clause, and applicability model are selected and verified.", styles["BodySmall"]), Spacer(1,8*mm), Paragraph("Professional Responsibility", styles["Heading2"]), Paragraph("This document is prepared by calculation-support software. Results must be checked and certified by a legally licensed engineer before use for construction.", styles["BodySmall"])]
def footer(canvas, doc):
    canvas.saveState(); canvas.setFont("Helvetica",8); canvas.setFillColor(colors.HexColor("#66707d")); canvas.drawString(20*mm,12*mm,"Cellular Beam Professional | Draft / For Review"); canvas.drawRightString(190*mm,12*mm,f"Page {doc.page}"); canvas.restoreState()
doc.build(story, onFirstPage=footer, onLaterPages=footer)
public = Path("public/reports/cellular-beam-professional-phase15-report.pdf")
public.parent.mkdir(parents=True, exist_ok=True)
copyfile(out, public)
