from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
# coding=utf8





class makePDF(object):
    
    def __init__(self):
        self.height = defaultPageSize[1]
        self.width = defaultPageSize[0]
        self.orderName = None
        self.timestamp = None
        pdfmetrics.registerFont(TTFont('Junicode', '/home/void/workspace/extjs/gridtest/static/junicode.ttf'))
    
    
    def first(self, c, doc):
        c.saveState()
        c.setFont('Junicode', 14)
        c.drawString(inch + 5, self.height - inch, "Order name : %s" % unicode(self.orderName))
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
        
        products = data['products']
        for product in products:
            try: 
                name = product['denumirePlic']
                #name = unicode(name,'utf-8')
                code = product['cod']
                quantity = product['quantity']                
                text = "Product name: %s  -  product code: %s  -  product quantity: %s" % (name, code, quantity)
                p = Paragraph(text, style)
                
            except Exception, err:
                print err
            story.append(p)
            story.append(Spacer(1, 0.2 * inch))
        
        doc.build(story,  onFirstPage = self.first)
        


