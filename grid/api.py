import ho.pisa as pisa
import cStringIO as StringIO
from django.template import Context, Template
from django.template.loader import get_template
from django.forms import model_to_dict
from models import Products, OrderProduct, Orders
from gridtest.settings import STATIC_FILE_PATH
import csv


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
        
    def encodeRow(self, data):
		
		tmp = []
		for item in data:
			if isinstance(item, unicode):
				tmp.append(item.encode('UTF-8'))
			else:
				tmp.append(item)
		return tmp
				
    
    
    def generateCSV(self, products):        
        try:
			data = []
			_file = StringIO.StringIO()
			for product in products.all():
				writer = csv.writer(_file, delimiter='|', quotechar='|', dialect=csv.excel)
				#writer.writerow([product.id, product.product.denumirePlic, product.order.id])
				writer.writerow(self.encodeRow([product.order.id, product.order.name, product.product.id, product.product.cod, product.product.denumirePlic, product.quantity, product.note or '-', product.modified]))
			return _file
			
        except Exception, err:
            print err
            return None
	
	
	


class importCSV(object):
    
    def __init__(self):
        pass
        
        
    def handleCSV(self, _file):
        
        destination = open(STATIC_FILE_PATH + '/' + _file.name, 'wb')
        for chunk in _file.chunks():
            destination.write(chunk.replace('\x00', ''))
        destination.close()

        reader = csv.reader(open(STATIC_FILE_PATH + '/' + _file.name), delimiter='|', quotechar='|', dialect=csv.excel)
        data = {}
        for row in reader:
            if len(row) > 0:
                try:
                    data['order'] = Orders.objects.get(pk = row[0])
                    data['product'] = Products.objects.get(pk = row[2])
                    data['quantity'] = row[5]
                    data['note'] = row[6]
                    data['modified'] = row[7]
                    obj = OrderProduct.objects.create(**data)
                    
                except Exception, err:
                    print err
                    return None
        return True
        
        
###############################################################
# this is just for development                  ###############


from models import *


def generateCompany():
    
    test = Company.objects.all()
    if len(test) > 0:
        return True
        
    
    dataDict = {}

    dataDict['name'] = "SRL Example"
    dataDict['phone'] = "0743312234"
    dataDict['email'] = "Example@srlexample.com"
    dataDict['note'] = "This is SRL Example note ..."
    dataDict['type'] = "C"
    dataDict['address'] = Address.objects.create(str = "Test street", 
                                                 postalCode="002345", 
                                                 town = "Timisoara",
                                                 country = "Romania")
    
    obj = Company.objects.create(**dataDict)
    
    dataDict['name'] = "SRL Test"
    dataDict['phone'] = "0743312234"
    dataDict['email'] = "Test@srltest.com"
    dataDict['note'] = "This is SRL Test note ..."
    dataDict['type'] = "C"
    dataDict['address'] = Address.objects.create(str = "Blabla street", 
                                                 postalCode="00234534", 
                                                 town = "Timisoara",
                                                 country = "Romania")
    obj = Company.objects.create(**dataDict)
    
    return True
    
def generateOrders():
    
    order = Orders.objects.all()
    if len(order) > 0:
        return False
    
    orderDict = {}
    
    orderDict['note'] = "note for an order ... x"
    orderDict['name'] = "Comanda X"
    orderDict['company'] = Company.objects.get(pk = 1)
    orderDict['status'] = OrderStatuses.objects.create(status = "new") 
     
    obj = Orders.objects.create(**orderDict)

    return True
    
    
    

    
 
