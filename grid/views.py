# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.db.models.query import QuerySet
from django.utils import simplejson
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Products, Orders, OrderProduct, OrderStatuses
from django.views.decorators.csrf import csrf_exempt
import json
import csv
import datetime
from django.forms.models import model_to_dict



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
        print json.dumps(requestDict, indent = 3)
        
        if len(excludes) > 0:
            for exclude in excludes:
                requestDict.pop(exclude)
        
        return requestDict
    except Exception, err:
        print err
        return Http404



def index(request):    

    #x = Orders.objects.create(name="test-order", note="test - note ...", status=OrderStatuses.objects.create(status="pending"))
    #x.save()
    
    return render_to_response(
                              'index.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )

def importDataBase(request):
    
    #_file = open("c:/python27/scripts/excel_import/static/excel_example.csv", "rb")
    _file = open("/home/void/workspace/extjs/gridtest/static/excel_example.csv", "rb")
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
        data["category"] = row[17]
        
        x = Products.objects.create(**data)
        
    
    _file.close()
    
    return render_to_response(
                              'index3.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )
    
    
@csrf_exempt
def fetchProducts(request):
    excludes = []
    products = Products.objects.all()
    response = getJsonFromModel(products, excludes)

    jsonObj = simplejson.dumps(response, encoding="utf-8")
    return HttpResponse(jsonObj, mimetype="application/json")
    
#-----------------------------------------------------------------------
#   Orders related view functions 

@csrf_exempt
def fetchOrders(request):
    excludes = []
    
    if request.is_ajax():
        try:
            orders = Orders.objects.all()
            response = getJsonFromModel(orders, excludes)
            jsonObj = simplejson.dumps(response, encoding="utf-8")
            return HttpResponse(jsonObj, mimetype="application/json")
            
        except Exception, err:
            jsonObj = simplejson.dumps({"success": False, "reason": err})
            return HttpResponse(jsonObj, mimetype="application/json")
    else:
        return Http404



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
                queryObj.update(**item)
                
        elif isinstance(postData, dict) and postData.has_key("id"):
            queryObj = Orders.objects.filter(pk=postData['id'])
            postData.pop("id")
            postData.pop("timestamp")
            #postData.pop("status")
            postData['status'] = OrderStatuses.objects.create(status = "pending")
            queryObj.update(**postData)
        
        jsonObj = simplejson.dumps({"success": True})
        return HttpResponse(jsonObj, mimetype="application/json")
    
    except Exception, e:
        print e
        jsonObj = simplejson.dumps({"success": False})
        return HttpResponse(jsonObj, mimetype="application/json")

@csrf_exempt    
def createOrder(request):

    postData = request.read()
    postData = json.loads(postData)
    if isinstance(postData, dict) and postData.has_key("status"):
        orderObj = Orders.objects.create(name="", note="", status=OrderStatuses.objects.create(status=postData['status']))
    
    jsonObj = simplejson.dumps({"success": True})
    return HttpResponse(jsonObj, mimetype="application/json")

@csrf_exempt  
def deleteOrder(request):
    
    postData = request.read()
    postData = json.loads(postData)
    
    if isinstance(postData, dict) and postData.has_key("id"):
        order = Orders.objects.filter(pk=postData['id'])
        order.delete()
    
    jsonObj = simplejson.dumps({"success": True})
    return HttpResponse(jsonObj, mimetype="application/json")



@csrf_exempt    
def fetchOrderProducts(request):
    
    get = request.GET
    if get.has_key("orderId"):
        orderId = get["orderId"]
        order = Orders.objects.get(pk=orderId)
        products = OrderProduct.objects.filter(order=order)
        if not products:
            jsonObj = simplejson.dumps({"success": True}, encoding="utf-8")
            return HttpResponse(jsonObj, mimetype="application/json")
        
        tmpList = []
        tmpData = {}
        for product in products.all():
            tmpProduct = product
            product = model_to_dict(product)
            data = {}
            data['product_id'] = tmpProduct.product.id
            data['order_id'] = tmpProduct.order.id
            for key in product.keys():
                data[key] = product[key]
                if key == "denumirePlic":
                    data['name'] = product[key]
            tmpList.append(data)
        
        tmpList.append(data)
        tmpData["data"] = tmpList
        tmpData["success"] = True
        
        jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")
    else:
        return Http404
    
    

@csrf_exempt   
def updateOrderProducts(request):
    excludes = ['product_id', 'order_id', 'name', 'id', 'cod']
    postData = request.read()
    postData = json.loads(postData)
    #print postData
    if isinstance(postData, dict) and postData.has_key("id"):
        product = OrderProduct.objects.get(pk=postData['id'])
        product.quantity = postData['quantity']
        product.note = postData['note']
        product.save()

    jsonObj = simplejson.dumps({"success": False})
    return HttpResponse(jsonObj, mimetype="application/json")



@csrf_exempt 
def createOrderProduct(request):
    
    if request.is_ajax():   
        try:
            postData = request.read()
            postData = json.loads(postData)
            print postData

            if isinstance(postData, dict) and postData.has_key("order_id"):
                excludes = ['id', 'order_id', 'name', 'product_id']
                
                product = Products.objects.get(pk=1)#postData['product_id'])
                order = Orders.objects.get(pk=postData['order_id'])                
                
                
                obj = model_to_dict(Products.objects.get(pk=postData['product_id']))#pk=1))
                for key in obj.keys():
                    postData[key] = obj[key]
                
                for exclude in excludes:
                    postData.pop(exclude)    
                postData["order"] = order
                postData['product'] = product
                postData["note"] = postData['note']
                product = OrderProduct.objects.create(**postData)
                
            jsonObj = simplejson.dumps({"success": True})
            return HttpResponse(jsonObj, mimetype="application/json")
            
        except Exception, err:
            print err

    else:
        jsonObj = simplejson.dumps({"success": False})
        return HttpResponse(jsonObj, mimetype="application/json")



@csrf_exempt    
def deleteOrderProduct(request):
    
    if request.is_ajax():
        try:
            postData = request.read()
            postData = json.loads(postData)
            print postData
            if isinstance(postData, dict) and postData.has_key('id'):
                queryObj = OrderProduct.objects.filter(pk=postData['id'])
                if len(queryObj) == 0:
                    jsonObj = simplejson.dumps({"success": False})
                    return HttpResponse(jsonObj, mimetype="application/json")
                queryObj.delete()
                
            elif isinstance(postData, list):
                for item in postData:
                    if item.has_key("id"):
                        queryObj = OrderProduct.objects.filter(pk=item['id'])
                        if len(queryObj) == 0:
                            jsonObj = simplejson.dumps({"success": False})
                            return HttpResponse(jsonObj, mimetype="application/json")
                        queryObj.delete()

            jsonObj = simplejson.dumps({"success": True, "data": []})
            return HttpResponse(jsonObj, mimetype="application/json")
        
        except Exception, err:
            print err
        
    else:
        jsonObj = simplejson.dumps({"success": False})
        return HttpResponse(jsonObj, mimetype="application/json")
    
    

@csrf_exempt    
def updateProducts(request):
    
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
    

