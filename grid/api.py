import ho.pisa as pisa
import cStringIO as StringIO
from django.template import Context, Template
from django.template.loader import get_template
from django.forms import model_to_dict
from models import Products



class makePDF(object):
    
    def __init__(self):
        
        pass
        
    
    def generatePDF(self, order):

        try:
            t = get_template("printOrder.html")
            c = Context({"order": order})
            html = t.render(c)
            res = StringIO.StringIO()
            pdf = pisa.pisaDocument(StringIO.StringIO(html.encode("UTF-8")), res, encoding='UTF-8')
            if pdf.err:
                print pdf.err
                return None
            return res
        except Exception, err:
            print err
            return None



class makeCSV(object):
    
    def __init__(self):
        pass
        
    def generateCSV(self, products):
        excludes = ["product", "id", 'notes']
        try:
            data = []
            for product in products.all():
                tmpProduct = model_to_dict(product)
                obj = {}
                for key in tmpProduct.keys():
                    obj[key] = tmpProduct[key]
                
                product = model_to_dict(product.product)
                for key in product.keys():
                    obj[key] = product[key]
                
                for exclude in excludes:
                    obj.pop(exclude)
                
                data.append(obj)
                    
            t = get_template("downloadCSV.txt")
            c = Context({'data': data})
            csv = t.render(c)
            
            resp = StringIO.StringIO(csv)
            return resp
            
        except Exception, err:
            print err
            return None
