# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.utils import simplejson
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import Products, Orders, OrderProduct
from django.views.decorators.csrf import csrf_exempt
import json
import csv
import datetime




def index(request):    
    
    #x = Orders.objects.create(name="test-order", note="test - note ...")
    #x.save()
    
    return render_to_response(
                              'index.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )
    
@csrf_exempt
def fetch(request):
    
    
    if request.is_ajax():
    
        if request.method == "PUT":
            return HttpResponse(simplejson.dumps({"request": "PUT"}), mimetype="application/json")
        
        elif request.method == "POST":
            return HttpResponse(simplejson.dumps({"request": "POST"}), mimetype="application/json")
            
        elif request.method == "DELETE":
            return HttpResponse(simplejson.dumps({"request": "DELETE"}), mimetype="application/json")
            
        elif request.method == "GET":
            return HttpResponse(simplejson.dumps({"request": "GET"}), mimetype="application/json")
    
        
        return render_to_response(
                              'index.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )
    else:
        
        return render_to_response(
                              'index.html', 
                              { 
                              }, 
                              context_instance=RequestContext(request)
                             )
    

def importDataBase(request):
    
    
    #f = open("c:/python27/scripts/excel_import/static/excel_example.csv", 'r')
    #writer = open("c:/python27/scripts/excel_import/static/excel_example.csv", 'w')
    #tmp = f.readlines()

    #for line in tmp:
    #    x = line.replace("||", "|-|")
    #    writer.write(x)
        
    #f.close()
    #writer.close()
    
    
    #_file = open("c:/python27/scripts/excel_import/static/excel_example.csv", "rb")
    _file = open("/tmp/test.csv", "rb")
    reader = csv.reader(_file, delimiter='|', quotechar='|',dialect=csv.excel)
    
    for row in reader:
        data = {}
        print row[0]
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
def fetchExcel(request):
    
    obj = Products.objects.all()
    
    tmpData = {}
    tmpList = []
            
    for item in obj:
        data = {}
        
        data["id"] = item.id
        data["cod"] = item.cod
        data['denumirePlic'] = item.denumirePlic
        data['denumireOferta'] = item.denumireOferta
        data["denumireLatina"] = item.denumireLatina
        data["soi"] = item.soi
        data["photoCode"] = item.photoCode
        data["namesLanguages"] = item.namesLanguages
        data["roDesc"] = item.roDesc
        data["enDesc"] = item.enDesc
        data["huDesc"] = item.huDesc
        data["sbDesc"] = item.sbDesc
        data["ruDesc"] = item.ruDesc
        data["stage1"] = item.stage1
        data["stage2"] = item.stage2
        data["stage3"] = item.stage3
        data["stage4"] = item.stage4
        data["stage5"] = item.stage5
        data["category"] = item.category
        
        tmpList.append(data)
    
        
    tmpData['data'] = tmpList
    tmpData["success"] = True
    #print json.dumps(tmpData, indent = 3)
    jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
    

    return HttpResponse(jsonObj, mimetype="application/json")
    
#-----------------------------------------------------------------------
#   Orders related view functions 

@csrf_exempt
def fetchOrders(request):
    
    
    if request.is_ajax():
    #if request.method == "GET":
    
        try:
            obj = Orders.objects.all()
            tmpList = []
            tmpData = {}
            
            for x in obj:
                data = {}
                data["id"] = x.id
                data["name"] = x.name
                data["note"] = x.note
                time = str(x.timestamp)
                time = time.split(".")[0]
                data["timestamp"] = time
                tmpList.append(data)
            tmpData["data"] = tmpList
            tmpData["success"] = True
            jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
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
        print postData
        if isinstance(postData, list):
            for item in postData:
                queryObj = Orders.objects.filter(pk=item["id"])
                item.pop("id")
                item.pop("timestamp")
                queryObj.update(**item)
                
        elif isinstance(postData, dict) and postData.has_key("id"):
            queryObj = Orders.objects.filter(pk=postData['id'])
            postData.pop("id")
            postData.pop("timestamp")
            queryObj.update(**postData)
        
        jsonObj = simplejson.dumps({"success": True})
        return HttpResponse(jsonObj, mimetype="application/json")
    
    except Exception, e:
        print e
        jsonObj = simplejson.dumps({"success": False})
        return HttpResponse(jsonObj, mimetype="application/json")


def createOrder(request):
    
    postData = request.read()
    print postData
    
    jsonObj = simplejson.dumps({"success": True})
    return HttpResponse(jsonObj, mimetype="application/json")


@csrf_exempt    
def fetchOrderProducts(request):
    
    #if request.is_ajax():
    if request:
        tmpList = []
        tmpData = {}
        data = {}
        
        data["id"] = 1
        data["quantity"] = 10
        data["cod"] = "cod"
        data["name"] = "name"
        
        tmpList.append(data)
        tmpData["data"] = tmpList
        tmpData["success"] = True
        
        jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")
        
        
        
        
        try:
            obj = OrderProduct.objects.all()
            tmpList = []
            tmpData = {}
            
            for x in obj:
                data = {}
                
                data["id"] = x.id
                data["quantity"] = x.quantity
                data["note"] = x.note
                data["orderName"] = x.order.name
                time = str(x.order.timestamp)
                time = time.split(".")[0]
                data["timestamp"] = time
                data["productCode"] = x.product.cod
                data["productDenumite"] = x.product.denumirePlic
                
                tmpList.append(data)
                
            tmpData["data"] = tmpList
            jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
            return HttpResponse(jsonObj, mimetype="application/json")
            
        except Exception, err:
            print err
            jsonObj = simplejson.dumps({"success": False, "reason": err})
            return HttpResponse(jsonObj, mimetype="application/json")
    
    else:
        print "404"
        return Http404
    
    

@csrf_exempt   
def updateOrderProducts(request):

    postData = request.read()
    print postData

    jsonObj = simplejson.dumps({"success": False, "reason": err})
    return HttpResponse(jsonObj, mimetype="application/json")



@csrf_exempt   
def createOrderProduct(request):
    
    if request.is_ajax():
    
        try:
            
            postData = request.read()
            postData = json.loads(postData)
            print json.dumps(postData, indent=3)
     
            # todo: make the right extjs  model for the OrderProduct ...
            
     
            
            jsonObj = simplejson.dumps({"success": True})
            return HttpResponse(jsonObj, mimetype="application/json")
                
                
                
        except Exception, err:
            print err



    else:
        jsonObj = simplejson.dumps({"success": False, "reason": err})
        return HttpResponse(jsonObj, mimetype="application/json")



@csrf_exempt    
def deleteOrderProduct(request):
    
    if request.is_ajax():
        try:
            postData = request.read()
            postData = json.loads(postData)
            # todo: make the right extjs  model for the OrderProduct ...
            print json.dumps(postData, indent=3)
            
            
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
        
        print json.dumps(tmp, indent=3)
        
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
    

