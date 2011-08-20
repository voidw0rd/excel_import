# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.db.models.query import QuerySet
from django.utils import simplejson
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext, Template, Context
from django.template.loader import get_template
from django.core.mail import send_mail
from models import Products, Orders, OrderProduct, OrderStatuses, Company, Address, ProductCategory
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from settings import STATIC_FILE_PATH
import json
import csv
import datetime
from api import makePDF, makeCSV, importCSV
import cStringIO as StringIO
from forms import Login
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User




def getJsonFromModel(querySet, excludes):
    if not isinstance(querySet, QuerySet) and not isinstance(excludes, list):
        return Http404
    
    try:
        requestList = []
        requestDict = {}
        
        for obj in querySet:
            tmp = obj
            obj = model_to_dict(obj)
            data = {}
            for key in obj.keys():
                data[key] = obj[key]
                if hasattr(tmp, 'timestamp'): #this is for orders timestamp
                    data['timestamp'] = (str(tmp.timestamp)).split(".")[0]
                if hasattr(tmp, 'status'): # solve the status foreignKey
                    data['status'] = tmp.status.status
            requestList.append(data)
        
        requestDict['data'] = requestList
        requestDict['success'] = True
        #print json.dumps(requestDict, indent = 3)
        
        if len(excludes) > 0:
            for exclude in excludes:
                requestDict.pop(exclude)
        
        return requestDict
    except Exception, err:
        print err
        return Http404


def userLogin(request):
    
    
    if request.method == "POST":
        form = Login(request.POST)
        if form.is_valid():
            user = form.cleaned_data['username']
            pwd = form.cleaned_data['password']
            
            user = authenticate(username = user, password = pwd)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect("/")
                else:
                    pass
            else:
                pass
    else:
        form = Login()
    
    return render_to_response(  
                              'login.html', 
                              { "form": form }, 
                              context_instance=RequestContext(request)
                             )


@login_required(login_url=None, redirect_field_name=None)
def userLogout(request):
    logout(request)
    return HttpResponseRedirect("/login/")


@login_required
def index(request):    

    #send_mail('sendGrid - email', 'Greetz, this is just a test email ', 'admin@semluca.net', ['palin@info.uvt.ro', 'vladisac@gmail.com'], fail_silently=False)
    
    return render_to_response(
                              'index.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )

def importDataBase(request):
    
    import api
    api.generateCompany()
    api.generateOrders()
    api.genAdmins()
    api.genCategory()
    
    fileName = "excel_example.csv"
    filePath = STATIC_FILE_PATH + '/' + fileName
    try:
        _file = open(filePath, "rb")
    except Exception, err:
        print err
    
    reader = csv.reader(_file, delimiter='|', quotechar='|',dialect=csv.excel)
    
    for row in reader:
        data = {}
        
        data["cod"] = row[0]
        data['denumirePlic'] = row[1]
        data['denumireOferta'] = row[2]
        data["denumireLatina"] = row[3]
        data["soi"] = row[4]
        data["photoCode"] = row[5]
        data["namesLanguages"] = row[6]
        data["roDesc"] = row[7]
        data["enDesc"] = row[8]
        data["huDesc"] = row[9]
        data["sbDesc"] = row[10]
        data["ruDesc"] = row[11]
        data["stage1"] = row[12]
        data["stage2"] = row[13]
        data["stage3"] = row[14]
        data["stage4"] = row[15]
        data["stage5"] = row[16]
        data["category"] = ProductCategory.objects.get(pk=2)
        data['notes'] = "Product notes"
        data['barCode'] = "11134ABNCCA"
        data['modified'] = False
        
        x = Products.objects.create(**data)
        
    
    _file.close()
    
    return render_to_response(
                              'index3.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )
    
@login_required
@csrf_exempt
def fetchProducts(request):
    excludes = []
    products = Products.objects.all()
    response = getJsonFromModel(products, excludes)
    
    
#    jsonObj = simplejson.dumps(response, encoding="utf-8")
    jsonObj = '{"data": [{"roDesc": "Plant\u0103 aromatic\u0103 \u015fi medicinal\u0103 peren\u0103. Talie 40-60 cm.Se utilizeaz\u0103 at\u00e2t frunzele, c\u00e2t \u015fi inflorescen\u0163ele, \u00een stare proasp\u0103t\u0103 sau deshidratat\u0103. ", "soi": "Hyssop", "denumireLatina": "Hyssopus officinalis", "enDesc": "Plant for culinary and medicinal use. Height 40-60 cm. Both the leaves and the flowers are used, fresh or dehydrated. ", "photoCode": "40-1349", "id": 8, "huDesc": "\u00c9vel\u0151 arom\u00e1s \u00e9s gy\u00f3gyszern\u00f6v\u00e9ny. 40-60 cm-es termet. Haszn\u00e1lj\u00e1k \u00fagy leveleit mint vir\u00e1gzat\u00e1t, friss vagy sz\u00e1raz \u00e1llapotban.", "denumireOferta": "Isop", "stage1": "I-II", "stage2": "III-IV", "stage3": "IV-V", "stage4": "20x20", "stage5": "V-IX", "category_id": 2, "category": {"id": 2,"name": "CategoriaDoi"}, "namesLanguages": "HYSSOP - IZS\u00d3P - \u0418\u0417\u041e\u041f - \u0418\u0421\u0421\u041e\u041f", "ruDesc": "\u0410\u0440\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u043b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0435 \u043c\u043d\u043e\u0433\u043e\u043b\u0435\u0442\u043d\u0435\u0435 \u0440\u0430\u0441\u0442\u0435\u043d\u0438\u0435. \u0422\u0430\u043b\u0438\u044f 40-60 cm. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442\u0441\u044f \u043a\u0430\u043a \u043b\u0438\u0441\u0442\u044c\u044f \u0442\u0430\u043a \u0438 \u0446\u0432\u0435\u0442\u044b, \u0441\u0432\u0435\u0436\u0438\u0435 \u0438\u043b\u0438 \u0441\u0443\u0448\u0435\u043d\u044b\u0435.", "denumirePlic": "Isop", "notes": "Product notes", "barCode": "11134ABNCCA", "modified": false, "sbDesc": "Vi\u0161egodi\u0161nja aromati\u010dna i lekovita biljka. Visine 40-60 cm. Koriste se kako listovi, tako i cvast, u sve\u017eem stanju ili osu\u0161eno. ", "cod": "PS228"}, {"roDesc": "Plant\u0103 peren\u0103 cu frunze ovale, flori violete. Se cultiv\u0103 ca plant\u0103 medicinal\u0103 \u015fi aromatic\u0103.", "soi": "Broadleaved", "denumireLatina": "Salvia officinalis", "enDesc": "Perrenial plant with oblonged violet flowers. Grown for culinary and aromatic purposes.", "photoCode": "40-1324", "id": 9, "huDesc": "\u00c9vel\u0151 n\u00f6v\u00e9ny, ov\u00e1lis levelekkel, lila vir\u00e1gokkal. Gy\u00f3gyn\u00f6v\u00e9nyk\u00e9nt \u00e9s arom\u00e1j\u00e1\u00e9rt termesztik.", "denumireOferta": "Jale\u0219-Salvie medicinal\u0103", "stage1": "II-III", "stage2": "III-V", "stage3": "III-IV", "stage4": "20X20", "stage5": "VI-IX", "category_id": 3, "category": {"id": 3,"name": "CategoriaTrei"}, "namesLanguages": "SAGE - ORVOSI ZS\u00c1LYA - \u0416\u0410\u041b\u0424\u0418\u0408\u0410 - \u0428\u0410\u041b\u0424\u0415\u0419 \u041b\u0415\u041a\u0410\u0420\u0421\u0422\u0412\u0415\u041d", "ruDesc": "\u041c\u043d\u043e\u0433\u043e\u043b\u0435\u0442\u043d\u0435\u0435 \u0440\u0430\u0441\u0442\u0435\u043d\u0438\u0435 \u0441 \u043e\u0432\u0430\u043b\u044c\u043d\u044b\u043c\u0438 \u043b\u0438\u0441\u0442\u044c\u044f\u043c\u0438, \u0446\u0432\u0435\u0442\u044b \u0444\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430. \u041a\u0443\u043b\u044c\u0442\u0438\u0432\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u043a\u0430\u043a \u043b\u0435\u043a\u0430\u0440\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0435 \u0442\u0430\u043a \u0438 \u0430\u0440\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0440\u0430\u0441\u0442\u0435\u043d\u0438\u0435.", "denumirePlic": "Jale\u0219 / Salvie medicinal\u0103", "notes": "Product notes", "barCode": "11134ABNCCA", "modified": false, "sbDesc": "Biljka sa jajastim li\u0161\u0107em, ljubi\u010dastim cvetom. Gaji se kao medicinska biljka i kao za\u0107in.   ", "cod": "PS069"}], "success": true}'
    return HttpResponse(jsonObj, mimetype="application/json")
    
#-----------------------------------------------------------------------
#   Orders related view functions 


@login_required
@csrf_exempt
def fetchOrders(request):
    
    user = request.user
    if user.is_staff:
        orders = Orders.objects.all()
    
    else:
        try:
            company = Company.objects.get(email = request.user)
            orders = Orders.objects.filter(company = company)
        except Exception, err:
            print err
            return Http404
    
    excludes = []
    
    if request.is_ajax():
        try:
            response = getJsonFromModel(orders, excludes)
            jsonObj = simplejson.dumps(response, encoding="utf-8")
            return HttpResponse(jsonObj, mimetype="application/json")
            
        except Exception, err:
            jsonObj = simplejson.dumps({"success": False, "reason": err})
            return HttpResponse(jsonObj, mimetype="application/json")
    else:
        return Http404


@login_required
@csrf_exempt  
def updateOrders(request):
        
    try:
        postData = request.read()
        postData = json.loads(postData)
        #print postData
        if isinstance(postData, list):
            for item in postData:
                queryObj = Orders.objects.filter(pk=item["id"])
                item.pop("id")
                item.pop("timestamp")
                item['status'] = OrderStatuses.objects.create(status = "pending")
                
                if request.user.is_staff:
                    queryObj.update(**item)
                else:
                    queryObj.update(note = item['note'])
                
        elif isinstance(postData, dict) and postData.has_key("id"):
            queryObj = Orders.objects.filter(pk=postData['id'])
            postData.pop("id")
            postData.pop("timestamp")
            #postData.pop("status")
            postData['status'] = OrderStatuses.objects.create(status = "pending")
            
            if request.user.is_staff:
                queryObj.update(**postData)
            else:
                queryObj.update(note = item['note'])
        
        jsonObj = simplejson.dumps({"success": True})
        return HttpResponse(jsonObj, mimetype="application/json")
    
    except Exception, e:
        print e
        jsonObj = simplejson.dumps({"success": False})
        return HttpResponse(jsonObj, mimetype="application/json")


@login_required
@csrf_exempt    
def createOrder(request):
	
    if not request.user.is_staff:
        return Http404
    
    try: 
        postData = request.read()
        postData = json.loads(postData)
		#print postData
        if isinstance(postData, dict) and postData.has_key("status"):
            orderObj = Orders.objects.create(name="", note="", status=OrderStatuses.objects.create(status=postData['status']))
		
        jsonObj = simplejson.dumps({"success": True})
        return HttpResponse(jsonObj, mimetype="application/json")

    except Exception, err:
        print err
        return Http404


@csrf_exempt  
def deleteOrder(request):
    if not request.user.is_staff:
        return Http404
        
    postData = request.read()
    postData = json.loads(postData)
    
    if isinstance(postData, dict) and postData.has_key("id"):
        order = Orders.objects.filter(pk=postData['id'])
        order.delete()
    
    jsonObj = simplejson.dumps({"success": True})
    return HttpResponse(jsonObj, mimetype="application/json")


@csrf_exempt 
def printOrder(request):
    
    if isinstance(request.GET, dict) and request.GET.has_key("orderId"):
        orderId = request.GET['orderId']
    else:
        return Http404
    orderInfo = _prepPrint(orderId)
    
    return render_to_response(
                              'printOrder.html', 
                              {
                                "order": orderInfo
                              }, 
                              context_instance=RequestContext(request)
                             )
    

def _prepPrint(orderId):
    
    try:
        order = Orders.objects.get(pk=orderId)
        orderProducts = OrderProduct.objects.filter(order=order)
        printFileds = ['cod', 'quantity', 'denumirePlic', 'soi']
        total = 0
        orderInfo = {}
        orderInfo["name"] = order.name
        orderInfo['timestamp'] = str(order.timestamp).split('.')[0]
        orderInfo['products'] = []
        for product in orderProducts:
            obj = {}
            obj['quantity'] = product.quantity
            total += product.quantity
            prod = model_to_dict(product.product)
            print prod
            for key in prod.keys():
                if key in printFileds:
                    obj[key] = prod[key]
            orderInfo['products'].append(obj)
        
        orderInfo['total'] = total
        print json.dumps(orderInfo, indent = 4)
        return orderInfo
    except Exception, err:
        print err
        return None
    
    
    
    



@login_required
@csrf_exempt   
def downloadOrder(request):
    if not request.user.is_staff:
        return Http404
    
    try:
        orderId = request.path.split("=")[-1]
        order = _prepPrint(orderId)
        pdf = makePDF()
        resp = pdf.generatePDF(order)
        response = HttpResponse(resp.getvalue(), mimetype='application/pdf')
        name = order['name'].encode('ascii', 'ignore')
        
        response['Content-Disposition'] = 'attachment; filename=order-%s' % str(datetime.datetime.now()).split('.')[0]
        
        return response
    except Exception, err:
        print err
        return Http404


@login_required
@csrf_exempt
def sendMail(request):
    
    if not request.user.is_staff:
        return Http404
        
    orderId = request.read().split("=")[-1]
    order = Orders.objects.get(pk=orderId)
    
    tmpData = {"success": True, "email": order.company.email}
    jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
    return HttpResponse(jsonObj, mimetype="application/json")
    
    
    if _sendMail(order):
        tmpData = {"success": True, "email": order.company.email}
        jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")
        
    else:
        tmpData = {"success": False, "email": order.company.email}
        jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")
    

    

def _sendMail(order):
    #to do w8 for sendGrid to validate my account and integrate it with django
    try:
        t = get_template("order_notification_email_template.txt")
        c = Context({"orderName": order.name,
                     "orderUser": order.company.name})
        body = t.render(c)
        print body
        send_mail('Print Order notification - %s' % order.name, 
                  body, 
                  'info@sem-luca.ro', 
                  [order.company.email], 
                  fail_silently=False)
                  
        print "\n\n" + order.name + "\n\n"
        return True
    except Exception, err:
        print err
        return False



def _calculateOrderTotal(order):
    try:
        order = Orders.objects.get(pk=order)
        products = OrderProduct.objects.filter(order=order)
        if len(products) == 0:
            return False
        total = 0
        for product in products:
            total += product.quantity
        
        order.total = total
        order.save()
        return True
    except Exception, err:
        print err
        return False


@login_required
@csrf_exempt    
def fetchOrderProducts(request):
    
    if request.is_ajax():
        get = request.GET
        if isinstance(get, dict) and get.has_key("orderId"):
            try:
                orderId  = get['orderId']
                order    = Orders.objects.get(pk=orderId)
                products = OrderProduct.objects.filter(order=order)
                if len(products) == 0:
                    jsonObj = simplejson.dumps({"success": True, 'total': 0}, encoding="utf-8")
                    return HttpResponse(jsonObj, mimetype="application/json")
                
                tmpList = []
                tmpData = {}
                
                for product in products.all():
                    data = {}
                    data['product_id'] = product.product.id
                    data['order_id']   = product.order.id
                    data['quantity']   = product.quantity
                    data['note']       = product.note
                    data['modified']   = product.modified
                    data['id']         = product.id
                    product = model_to_dict(product.product)
                    product.pop("id")
                    product.pop("modified")
                    for key in product.keys():
                        if key == "denumirePlic": 
                            data['name'] = product[key]
                        data[key] = product[key]
                    tmpList.append(data)
                tmpData["data"] = tmpList
                tmpData["success"] = True
                
                #print json.dumps(tmpData, indent = 4)
                jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
                return HttpResponse(jsonObj, mimetype="application/json")
            except Exception, err:
                print err 
                return Http404
    else:
        return Http404
    

@login_required
@csrf_exempt 
def createOrderProduct(request):
    if not request.user.is_staff:
        return Http404

    if request.is_ajax():
        excludes = ['id', 'order_id', 'name', 'product_id', 'cod']
        try:
            postData = request.read()
            postData = json.loads(postData)
            #print postData
            
            if isinstance(postData, dict) and postData.has_key("order_id") and postData.has_key("product_id"):
                product = Products.objects.get(pk=postData['product_id'])
                order = Orders.objects.get(pk=postData['order_id'])
                for exclude in excludes:
                    postData.pop(exclude)
                
                if product.modified == True:
                    postData['modified'] = True
                    product.modified = False
                    product.save()
                
                postData['order'] = order
                postData['product'] = product
                
                
                obj = OrderProduct.objects.create(**postData)
                _calculateOrderTotal(order.id)
                jsonObj = simplejson.dumps({"success": True})
                return HttpResponse(jsonObj, mimetype="application/json")
            
            elif isinstance(postData, list) and len(postData) > 0:
                for obj in postData:
                    if isinstance(obj, dict) and obj.has_key("order_id") and obj.has_key("product_id"):
                        try:
                            product = Products.objects.get(pk=obj['product_id'])
                            order = Orders.objects.get(pk=obj['order_id'])
                            for exclude in excludes:
                                obj.pop(exclude)
                            
                            if product.modified == True:
                                obj['modified'] = True
                                product.modified = False
                                product.save()
                            
                            obj['order'] = order
                            obj['product'] = product
                            obj = OrderProduct.objects.create(**obj)
                            _calculateOrderTotal(order.id)
                            jsonObj = simplejson.dumps({"success": True})
                            return HttpResponse(jsonObj, mimetype="application/json")
                        except Exception, err:
                            print err
                            return Http404
                    else:
                        return Http404
            else:
                return Http404
        except Exception, err:
            print err
            return Http404
    else:
        return Http404
    



@login_required
@csrf_exempt   
def updateOrderProducts(request):
    
    if not request.user.is_staff:
        return Http404
    
    postData = request.read()
    postData = json.loads(postData)
    print postData
    
    if isinstance(postData, dict) and postData.has_key("id"):
        try:
            product = OrderProduct.objects.get(pk=postData['id'])
            product.quantity = postData['quantity']
            product.note     = postData['note']
            product.modified = postData['modified']
            product.save()
            
            _calculateOrderTotal(postData['order_id'])
            jsonObj = simplejson.dumps({"success": True})
            #return HttpResponse(jsonObj, mimetype="application/json")
            return HttpResponse(jsonObj)
            
        except Exception, err:
            print err
            return Http404

    elif isinstance(postData, list):
        for obj in postData:
            if isinstance(obj, dict) and obj.has_key("id"):
                product = OrderProduct.objects.get(pk=obj['id'])
                product.quantity = obj['quantity']
                product.note = obj['note']
                product.modified = obj['modified']
                product.save()
                
                _calculateOrderTotal(obj['order_id'])
        jsonObj = simplejson.dumps({"success": True})
        #return HttpResponse(jsonObj, mimetype="application/json")
        return HttpResponse(jsonObj)
    else:
        return Http404
        


@login_required
@csrf_exempt    
def deleteOrderProduct(request):
    
    if not request.user.is_staff:
        return Http404
    
    if request.is_ajax():
        try:
            postData = request.read()
            postData = json.loads(postData)
            #print postData
            
            if isinstance(postData, dict) and postData.has_key('id'):
                queryObj = OrderProduct.objects.filter(pk=postData['id'])
                if len(queryObj) == 0:
                    jsonObj = simplejson.dumps({"success": False})
                    #return HttpResponse(jsonObj, mimetype="application/json")
                    return HttpResponse(jsonObj)
                queryObj.delete()
                _calculateOrderTotal(postData['order_id'])
                
            elif isinstance(postData, list):
                for item in postData:
                    if item.has_key("id"):
                        queryObj = OrderProduct.objects.get(pk=item['id'])
                        queryObj.delete()
                        _calculateOrderTotal(item['order_id'])

            jsonObj = simplejson.dumps({"success": True, "data": []})
            #return HttpResponse(jsonObj, mimetype="application/json")
            return HttpResponse(jsonObj)
        
        except Exception, err:
            print err
    else:
        jsonObj = simplejson.dumps({"success": False})
        #return HttpResponse(jsonObj, mimetype="application/json")
        return HttpResponse(jsonObj)
    
    

@login_required
@csrf_exempt  
def exportOrderProductCsv(request):
    
    if not request.user.is_staff:
        return Http404
    
    try:
        orderId = request.path.split("=")[-1]
        order = Orders.objects.get(pk=orderId)
        products = OrderProduct.objects.filter(order = order)
        if len(products) > 0:
            make = makeCSV()
            csvFile = make.generateCSV(products)
            
            response = HttpResponse(csvFile.getvalue(), mimetype = "text/plain")
            response['Content-Disposition'] = 'attachment; filename=order-%s.csv' % str(datetime.datetime.now()).split('.')[0]
            
            return response
        
        jsonObj = simplejson.dumps({"success": True, "data": []})
        return HttpResponse(jsonObj)
            
    except Exception, err:
        print err
        return Http404
        
        
        

@login_required
@csrf_exempt    
def importOrderProductCsv(request):
    
    if not request.user.is_staff:
        return Http404
    
    if request.FILES.has_key("csvFile") and request.POST.has_key("orderId"):
        _file = importCSV()
        obj = _file.handleCSV(request.FILES['csvFile'], request.POST['orderId'])
        if obj:
            jsonObj = simplejson.dumps({"success": True})
            return HttpResponse(jsonObj)
    
    jsonObj = simplejson.dumps({"success": False})
    return HttpResponse(jsonObj)
    
    


@login_required
@csrf_exempt    
def updateProducts(request):
    
    if not request.user.is_staff:
        return Http404
    
    if request.method == "POST":
        
        tmp = request.read()
        tmp = json.loads(tmp)
        if isinstance(tmp, list):
            for item in tmp:
                try:
                    queryObj = Products.objects.filter(pk=item["id"])
                    item.pop("id")
                    queryObj.update(**item)
                except Exception, e:
                    print e
                    
        elif isinstance(tmp, dict):
            try:
                queryObj = Products.objects.filter(pk=tmp["id"])
                tmp.pop("id")
                queryObj.update(**tmp)
            except Exception, r:
                print e

    jsonObj = simplejson.dumps({"success": True, "data" : []})
    return HttpResponse(jsonObj, mimetype="application/json")


@login_required
@csrf_exempt 
def productCategoryRead(request):
    try:
        categories = ProductCategory.objects.all()
        data = {}
        tmpList = []
        if len(categories) > 0:
            for item in categories:
                x = model_to_dict(item)
                obj = {}

                for key in x.keys():
                    obj[key] = x[key]
                tmpList.append(obj)
            
            data['success'] = True
            data['data'] = tmpList
            
            return HttpResponse(simplejson.dumps(data), mimetype="application/json")
    except Exception, err:
        print err
        return Http404



@login_required
@csrf_exempt   
def companyRead(request):
	
	if request.is_ajax():
		try:
			#x = Company.objects.create(name = "SRL MintRubbing", address = Address.objects.create())
			company = Company.objects.all()
			
			if len(company) == 0:
				jsonObj = simplejson.dumps({"success": True, "data" : []})
				return HttpResponse(jsonObj, mimetype="application/json")
			
			tmpList = []
			tmpDict = {}
			for item in company:
				response = model_to_dict(item)
				#print "--" * 10
				obj = {}
				for key in response.keys():
					obj[key] = response[key]
					
				obj.pop('address')
				response = model_to_dict(item.address)
				for key in response.keys():
					obj[key] = response[key]
				
				tmpList.append(obj)
			
			tmpDict['data'] = tmpList
			tmpDict['success'] = True
			#print json.dumps(tmpDict, indent = 4)
			
			jsonObj = simplejson.dumps(tmpDict)
			return HttpResponse(jsonObj, mimetype = "application/json")
		
		except Exception, err:
			print err
			return Http404
		
	else:
		pass












   

