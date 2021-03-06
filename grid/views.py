# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.db.models.query import QuerySet
from django.utils import simplejson
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext, Template, Context
from django.template.loader import get_template
from django.core.mail import send_mail
from models import *
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from settings import STATIC_FILE_PATH
from api import makePDF, makeCSV, importCSV, importImg
import cStringIO as StringIO
from forms import Login, upload, passwordRecoveryForm, tokenRequestForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from reversion.models import Version
import json
import csv
import datetime
import uuid
from django.core import serializers

import logging

class PisaNullHandler(logging.Handler):
    def emit(self, record):
        pass
logging.getLogger("ho.pisa").addHandler(PisaNullHandler())


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
                    data['status_id'] = tmp.status.id
                    data['status'] = {'id': tmp.status.id, 'name': tmp.status.name}
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
            username = form.cleaned_data['username']
            pwd = form.cleaned_data['password']

            user = authenticate(username = username, password = pwd)
            if user is not None:
                if user.is_active:
                    login(request, user)

                    return redirect(index)
                else:
                    form.non_field_errors = "Your account is suspended."
            else:
                form.non_field_errors = "Username or password invalid."
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

    jsonObj = simplejson.dumps({"success": True})
    return HttpResponse(jsonObj, mimetype="application/json")
    #return HttpResponseRedirect("/login/")


def pwdRecovery(request):

    if request.method == "POST":
        form = passwordRecoveryForm(request.POST)
        if form.is_valid():
            new = form.cleaned_data['new_pwd']
            conf = form.cleaned_data['conf_pwd']
            if new == conf:
                try:
                    token = passwordRecovery.objects.get(token = form.cleaned_data['token'])
                    user = Company.objects.get(pk=token.user.id)
                    if user.email == form.cleaned_data['username']:
                        user.password = new
                        user.save()
                        return HttpResponseRedirect("/")
                    else:
                        form.non_field_errors = "Couldn't validate your token"
                except Exception, err:
                    print err
                    form.non_field_errors = "Couldn't validate your token"
            else:
                form.non_field_errors = "Passwords dont match."

        else:
            form.non_field_errors = "Invalid data submited."

    else:
        form = passwordRecoveryForm()

    return render_to_response(
                              'passwordRecovery.html', 
                              {
                                'form': form
                              }, 
                              context_instance=RequestContext(request)
                             )


def resetPasswordToken(request):

    msg = ""
    if request.method == "POST":
        form = tokenRequestForm(request.POST)
        if form.is_valid():
            try:
                user = Company.objects.get(email = form.cleaned_data['username'])
                tokens = passwordRecovery.objects.filter(user = user)
                for obj in tokens:
                    obj.delete()
                token = passwordRecovery.objects.create(token = uuid.uuid4(), user = user)
                msg = "Am email has been send to your email address."
                # send an email with the token
                print token.token

            except Exception, err:
                print err
                form.non_field_errors = "Invalid username."
        else:
            form.non_field_errors = "Invalid data submited."
    else:
        form = tokenRequestForm()

    return render_to_response(  
                              'tokenRequest.html', 
                              {'form': form, "msg": msg}, 
                              context_instance=RequestContext(request)
                             )


@login_required
def index(request):    

    #send_mail('sendGrid - email', 'Greetz, this is just a test email ', 'admin@semluca.net', ['palin@info.uvt.ro', 'vladisac@gmail.com'], fail_silently=False)
    return render_to_response(
                              'index.html',
                              {"data":RequestContext(request).dicts[2]},
                              context_instance=RequestContext(request)
                             )

def importDataBase(request):

    import api
    api.generateCompany()
    api.generateOrders()
    api.genAdmins()
    api.genCategory()
    api.genProductImage()


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
        data["category"] = ProductCategory.objects.get(pk=row[17])
        data['notes'] = "Product notes"
        data['barCode'] = "11134ABNCCA"
        data['modified'] = False
        data['image'] = ProductImage.objects.get(pk=1)

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
def productsRead(request):

    #print request.GET

    try:
        excludes = []
        sort = []
        if request.GET.has_key("id") :
            productId = request.GET['id']
            products = Products.objects.filter(id = productId)
            total = products.count()
        else:
            required = ['start', 'limit', 'sort']
            for item in required:
                if not request.GET.has_key(item):
                    return None
            start = int(request.GET.get("start"))
            limit = int(request.GET.get("limit"))
            sort = json.loads(request.GET.get("sort"))
            sortstr = ''
            for s in sort:
                if s['direction'] == 'DESC': sortstr +='-'
                sortstr += s['property']
                break
            products = Products.objects.all().order_by(sortstr)
            total = products.count()

            if  request.GET.has_key("search"):
                search = request.GET["search"]
                products = Products.objects.filter(denumirePlic__icontains = search)
                total = products.count()

            if start > total:
                return None
            products = products[start:][:limit]

        requestDict = {}
        requestList = []

        for product in products:

            obj = Version.objects.get_for_object(product)
#            count = obj.count() - 1
            logList = []

#            while count > 0:
#                log = {}
#                log['user'] = str(obj[count].revision.user)
#                log['date'] = str(obj[count].revision.date_created).split(".")[0]
#                log['version'] = obj[count].revision_id
#                old = obj[count-1].field_dict
#                new = obj[count].field_dict
#                diff_str = unicode()
#                for key in old.keys():
#                    if old[key] == new[key]:
#                        pass
#                    else:
#                        diff_str += unicode(key) + " - " + unicode(new[key]) + "; "
#                log['diff'] = diff_str
#                print log
#                logList.append(log)
#                count -= 1
#

            prod = model_to_dict(product)
            data = {}
            for key in prod.keys():
                if key == "image":
                    data[key] = product.image.thumb.url
                    continue
                data[key] = prod[key]
            data['category_id'] = data['category']
            data['category'] = {'id': product.category.id, 'name': product.category.name}
            data['log'] = logList
            requestList.append(data)

        requestDict['data'] = requestList
        requestDict['success'] = True
        requestDict['total'] = total
        #print json.dumps(requestDict['data'], indent = 4)
        jsonObj = simplejson.dumps(requestDict, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")
    except Exception, err:
        print err


@login_required
@csrf_exempt
def productsCreate(request):

    try:
        if not request.user.is_staff:
            return Http404

        postData = json.loads(request.read())
        #print postData
        if isinstance(postData, dict) and postData.has_key("notes") and len(postData.get("notes")) > 0:
            postData['category'] = ProductCategory.objects.get(pk=1)
            postData['image'] = ProductImage.objects.get(pk=1)
            #postData['modified'] = True
            code = Products.objects.all().order_by('-cod')
            code = int(code[0].cod.split("PS")[-1:][0])
            if code < 99:
                postData['cod'] = "PS0" + str(code + 1)
            elif code < 999:
                postData['cod'] = "PS" + str(code + 1)
            else:
                return Http404
            for exclude in ['category_id', 'log', 'id']:
                postData.pop(exclude)

            newproduct = Products.objects.create(**postData)
            data = []
            data.append(model_to_dict(newproduct))


        else:
            return Http404

        jsonObj = simplejson.dumps({"success": True, "data":data})
        return HttpResponse(jsonObj, mimetype="application/json")
    except Exception, err:
        print '[ err ] Exception at productsCreate: \t',
        print err




@login_required
@csrf_exempt
def productsUpdate(request):

    if not request.user.is_staff:
        return Http404

    if request.method == "POST":
        excludes = ['id', 'image', 'category_id', 'log', 'cod']
        tmp = request.read()
        tmp = json.loads(tmp)
        if isinstance(tmp, list):
            for item in tmp:
                try:
                    queryObj = Products.objects.filter(pk=item["id"])
                    item['category'] = item['category_id']
                    for exclude in excludes:
                        item.pop(exclude)
                    item['modified'] = True
                    queryObj.update(**item)
                    queryObj[0].save()
                except Exception, e:
                    print e

        elif isinstance(tmp, dict):
            try:
                queryObj = Products.objects.filter(pk=tmp["id"])
                tmp['category'] = tmp['category_id']
                try:
                    number = int(tmp['notes'])
                    tmp['notes'] = "-"
                except:
                    pass

                for exclude in excludes:
                    tmp.pop(exclude)
                tmp['modified'] = True
                queryObj.update(**tmp)
                queryObj[0].save()
            except Exception, e:
                print e

    jsonObj = simplejson.dumps({"success": True})
    return HttpResponse(jsonObj, mimetype="application/json")


@login_required
@csrf_exempt
def productsDelete(request):

    if not request.user.is_staff:
        return HttpResponse(simplejson.dumps({"failure": True}), mimetype="application/json")
    try:
        postData = json.loads(request.read())
        if isinstance(postData, dict) and postData.has_key("id"):
            Products.objects.get(pk=postData['id']).delete()
        jsonObj = simplejson.dumps({"success": True})
        return HttpResponse(jsonObj, mimetype="application/json")

    except Exception, err:
        print err


#-----------------------------------------------------------------------
#   Orders related view functions 


@login_required
@csrf_exempt
def ordersRead(request):

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



    return HttpResponse(serializers.serialize('json4ext', orders, relations=('status','company')), mimetype="application/json")



@login_required
@csrf_exempt  
def ordersUpdate(request):

    try:
        postData = request.read()
        postData = json.loads(postData)
        print postData
        if isinstance(postData, list):
            for item in postData:
                queryObj = Orders.objects.filter(pk=item["id"])
                item.pop("id")
                item.pop("timestamp")
                #item['status'] = OrderStatuses.objects.create(status = "pending")

                if request.user.is_staff:
                    queryObj.update(**item)
                else:
                    queryObj.update(note = item['note'])

        elif isinstance(postData, dict) and postData.has_key("id"):
            queryObj = Orders.objects.filter(pk=postData['id'])
            postData['status'] = postData['status_id']
            postData.pop("id")
            postData.pop("timestamp")
            postData.pop("status_id")
            postData.pop("total")
            #postData['status'] = OrderStatuses.objects.create(status = "pending")
            print postData
            if request.user.is_staff:
                queryObj.update(**postData)
                queryObj[0].save()
            else:
                queryObj.update(note = postData['note'])
                queryObj[0].save()

        jsonObj = simplejson.dumps({"success": True, 'data': queryObj})
        return HttpResponse(jsonObj, mimetype="application/json")

    except Exception, e:
        print e
        jsonObj = simplejson.dumps({"success": False})
        return HttpResponse(jsonObj, mimetype="application/json")


@login_required
@csrf_exempt
def ordersCreate(request):

    if not request.user.is_staff:
        return Http404

    try:
        postData = request.read()
        postData = json.loads(postData)
        if isinstance(postData, dict) and postData.has_key("status"):
            neworder = Orders.objects.create(name="", note="", status=OrderStatuses.objects.get(id=postData["status"]))

        data = []
        data.append(model_to_dict(neworder))

        jsonObj = simplejson.dumps({"success": True, "data":data})
        return HttpResponse(jsonObj, mimetype="application/json")

    except Exception, err:
        print err
        return Http404


@csrf_exempt
def ordersDelete(request):
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
    orderInfo, data = _prepPrint(orderId)
    print data
    print orderInfo
    return render_to_response(
                              'printOrder.html',
                              {
                                "order": orderInfo,
                                "data": data
                              },
                              context_instance=RequestContext(request)
                             )


def _prepPrint(orderId):

    try:
        order = Orders.objects.get(pk=orderId)
        orderProducts = OrderProduct.objects.filter(order=order)
        printFileds = ['cod', 'quantity', 'denumirePlic', 'soi', 'notes', 'modified']
        total = 0
        orderInfo = {}
        data = []
        tmp = []
        x = 42
        orderInfo["name"] = order.name
        orderInfo['timestamp'] = str(order.timestamp).split('.')[0]
        orderInfo['company'] = order.company.name
        orderInfo['notes'] = order.note
        orderInfo['items'] = len(orderProducts)
        for product in orderProducts:
            obj = {}
            obj['quantity'] = product.quantity
            total += product.quantity
            prod = model_to_dict(product.product)
            for key in prod.keys():
                if key in printFileds:
                    obj[key] = prod[key]

            if len(tmp) < x:
                tmp.append(obj)
            elif len(tmp) == x:
                tmp.append(obj)
                data.append(tmp)
                tmp = []

                if x < 51: x = 51

        if len(tmp) > 0: data.append(tmp)

        orderInfo['total'] = total
        #print json.dumps(orderInfo, indent = 4)
        return orderInfo, data
    except Exception, err:
        print err
        return None







@login_required
@csrf_exempt
def downloadOrder(request):
    if not request.user.is_staff:
        return Http404

    try:
        #orderId = request.GET['orderId']
        orderId = request.path.split("=")[-1]
        order, data = _prepPrint(orderId)
        pdf = makePDF()
        resp = pdf.generatePDF(order, data)

        response = HttpResponse(resp.getvalue(), mimetype='application/pdf')

        response['Content-Disposition'] = 'attachment; filename=order-%s' % str(datetime.datetime.now()).split('.')[0]

        return response
    except Exception, err:
        print 'ERR:download Order :: %s' % err
        return Http404


@login_required
@csrf_exempt
def sendMail(request):

    if not request.user.is_staff:
        return Http404

    orderId = request.read().split("=")[-1]
    order = Orders.objects.get(pk=orderId)

    #tmpData = {"success": True, "email": order.company.email}
    #jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
    #return HttpResponse(jsonObj, mimetype="application/json")


    if _sendMail(order):
        tmpData = {"success": True, "email": order.company.email}
        jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")

    else:
        tmpData = {"email": order.company.email}
        jsonObj = simplejson.dumps(tmpData, encoding="utf-8")
        return HttpResponse(jsonObj, mimetype="application/json")




def _sendMail(order):
    try:
        t = get_template("order_notification_email_template.txt")
        c = Context({"orderName": order.name,
                     "orderUser": order.company.name})
        body = t.render(c)
        send_mail('Print Order notification - %s' % order.name,
                  body,
                  'info@sem-luca.ro',
                  [order.company.email],
                  fail_silently=False)

        #print "\n\n" + order.name + "\n\n"
        return True
    except Exception, err:
        print "[ xx ]Exception: "
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
        print order.total
        order.save()
        return True
    except Exception, err:
        print "[ err ] _calculateOrderTotal: ",
        print err
        return False


@login_required
@csrf_exempt
def orderProductsRead(request):

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
                    data['name']       = product.product.denumirePlic
                    data['cod']        = product.product.cod
                    data['soi']        = product.product.soi
                    data['printstatus']        = product.printstatus
                    #product = model_to_dict(product.product)
                    #product.pop("id")
                    #product.pop("modified")
                    #for key in product.keys():
                    #    if key == "denumirePlic":
                    #        data['name'] = product[key]
                    #    data[key] = product[key]
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
def orderProductsCreate(request):
    if not request.user.is_staff:
        return Http404

    if request.is_ajax():
        excludes = ['id', 'order_id', 'name', 'product_id', 'cod', 'soi']
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
def orderProductsUpdate(request):

    #if not request.user.is_staff:
    #    return Http404

    postData = request.read()
    postData = json.loads(postData)
    #print postData

    if isinstance(postData, dict) and postData.has_key("id"):
        try:
            data = []
            product = OrderProduct.objects.get(pk=postData['id'])

            if not request.user.is_staff:
                product.note     = postData['note']
                product.save()
                return HttpResponse(simplejson.dumps({"success": True}))

            product.quantity = postData['quantity']
            product.note     = postData['note']
            product.modified = postData['modified']
            product.printstatus = postData['printstatus']
            product.save()

            data.append(model_to_dict(product))
            _calculateOrderTotal(postData['order_id'])
            return HttpResponse(simplejson.dumps({"success": True, "data": data}))

        except Exception, err:
            print err
            return Http404

    elif isinstance(postData, list):
        data = []
        for obj in postData:
            if isinstance(obj, dict) and obj.has_key("id"):
                product = OrderProduct.objects.get(pk=obj['id'])

                if not request.user.is_staff:
                    product.note = obj['note']
                    product.save()
                    return HttpResponse(simplejson.dumps({"success": True}))

                product.quantity = obj['quantity']
                product.note = obj['note']
                product.modified = obj['modified']
                product.save()

                data.append(model_to_dict(product))
                _calculateOrderTotal(obj['order_id'])

        return HttpResponse(simplejson.dumps({"success": True, "data": data}))
    else:
        return Http404



@login_required
@csrf_exempt
def orderProductsDelete(request):

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
            try:
                _calculateOrderTotal(request.POST['orderId'])
                jsonObj = simplejson.dumps({"success": True})
                return HttpResponse(jsonObj)
            except Exception, err:
                print "[ err ] importOrderProductCsv\t",
                print err
    jsonObj = simplejson.dumps({"success": False})
    return HttpResponse(jsonObj)

@login_required
@csrf_exempt
def productCheckModified(request):

    try:
        if request.POST.has_key("id"):
            checkbox = request.POST.get("value")
            if checkbox == "false":
                checkbox = False
            else:
                checkbox = True
            product = Products.objects.get(pk=request.POST.get("id"))
            product.modified = checkbox
            product.save()

        jsonObj = simplejson.dumps({"success": True})
        return HttpResponse(jsonObj, mimetype="application/json")

    except Exception, err:
        print err
        return HttpResponse()


@login_required
@csrf_exempt
def orderStatusesRead(request):

    try:
        data = []
        statuses = OrderStatuses.objects.all()
        for status in statuses:
            data.append(model_to_dict(status))
        obj = {"success": True, "data": data}
        jsonObj = simplejson.dumps(obj)
        return HttpResponse(jsonObj, mimetype="application/json")

    except Exception, err:
        print err
        return HttpResponse()

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
            companies = Company.objects.all()

            return HttpResponse(serializers.serialize('json4ext',companies), mimetype = "application/json")

        except Exception, err:
            print 'Error:: CompanyRead::%s'%err
            raise Http404

    else:
        pass



@login_required
@csrf_exempt
def uploadProductImage(request):


    try:
        if request.FILES.has_key("photo") and request.POST.has_key("productId"):
            product = Products.objects.get(pk=request.POST.get("productId"))
            print product.id

            _file = ContentFile(request.FILES['photo'].read())
            image = ProductImage()
            image.image.save(request.FILES['photo'].name, _file)
            thumb = importImg()
            x = thumb.handleImage(request.FILES['photo'])
            x = ContentFile(x.read())
            image.thumb.save(request.FILES['photo'].name, x)


            product.image = image
            product.save()
        jsonObj = simplejson.dumps({'success': True, 'image': product.image.thumb.url})
        return HttpResponse(jsonObj)

    except Exception, err:
        print err
        return HttpResponse(simplejson.dumps({'success': False}))



@login_required
@csrf_exempt
def downloadProductImage(request):

    try:
        productId = request.path.split("=")[-1]
        product = Products.objects.get(pk=productId)
        image = open(product.image.image.path).read()
        response = HttpResponse(image)
        response['Content-Disposition'] = 'attachment; filename=%s' % product.image.image.name

        return response

        jsonObj = simplejson.dumps({"success": True, "data": []})
        return HttpResponse(jsonObj)

    except Exception, err:
        print err
        return Http404


@login_required
@csrf_exempt
def usersCreate(request):

    if not request.user.is_staff:
        raise Http404('Not authorized')

    response = {}
    try:
        userJson = json.loads(request.read())
        user = Company()
        user.saveFromJson(userJson)

        user = Company.objects.filter(pk = user.pk)
        response = serializers.serialize('json4ext', user)
    except Exception, err:
        print '[ err ] Exception at usersCreate: \t',
        print err.message

        response['data'] = []
        response['msg'] =  '%s ' % err
        response['success'] = False
        response = simplejson.dumps(response, use_decimal=True)

    return HttpResponse(response, mimetype='application/json')

@login_required
def usersRead(request):

    if not request.user.is_staff:
        raise Http404('Not authorized')

    companies = Company.objects.all()
    return HttpResponse(serializers.serialize('json4ext', companies), mimetype='application/json')



@login_required
@csrf_exempt
def usersUpdate(request):

    if not request.user.is_staff:
        raise Http404('Not authorized')

    print request.POST
    try:
        userJson = json.loads(request.read())
        user = Company.objects.get(pk = userJson['id'])
        user.saveFromJson(userJson)
    except Exception, err:
        print err

    user = Company.objects.filter(pk = user.pk)

    return HttpResponse(serializers.serialize('json4ext', user), mimetype="application/json")



@login_required
@csrf_exempt
def usersDelete(request):

    if not request.user.is_staff:
        raise Http404('Not authorized')

    response = {}
    response['data'] = []
    try:
        user = json.loads(request.read())
        user = Company.objects.get(pk = user['id'])
        user.delete()
        response['success'] = True
    except Exception, err:
        print err.message
        response['msg'] =  'Error @ user deletion'
        response['success'] = False

    return HttpResponse(simplejson.dumps(response), mimetype='application/json')

