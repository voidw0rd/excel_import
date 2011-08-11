from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont





class makePDF(object):
    
    def __init__(self):
        self.height = defaultPageSize[1]
        self.width = defaultPageSize[0]
        self.orderName = None
        self.timestamp = None
        pdfmetrics.registerFont(TTFont('Junicode', '/home/void/workspace/extjs/gridtest/static/junicode.ttf'))
    
    
    def firstPage(self, c, doc):
        c.saveState()
        c.setFont('Junicode', 14)
        c.drawString(inch + 5, self.height - inch, u"Order name : %s" % unicode(self.orderName))
        c.setFont('Junicode', 14)
        c.drawString(self.width - inch * 3, self.height - inch, "created on: %s" % unicode(self.timestamp))
        c.restoreState()
        
        

    def generatePDF(self, orderName, data):
        self.orderName = data['name']
        self.timestamp = data['timestamp']
        doc = SimpleDocTemplate("/tmp/" + orderName)
        story = [Spacer(1, inch)]
        styles = getSampleStyleSheet()
        style = styles['Normal']
        style.fontName = "Junicode"
        style.fontSize = 13
        
        products = data['products']
        for product in products:
            try:             
                text = "Product name: %s  -  product code: %s  -  product quantity: %s" % (product['denumirePlic'], product['cod'], product['quantity'])
                p = Paragraph(text, style)
            except Exception, err:
                print err
            story.append(p)
            story.append(Spacer(1, 0.3 * inch))
        
        doc.build(story,  onFirstPage = self.firstPage)
        


