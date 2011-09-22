from django.db import models
import reversion
from django.db import models
import reversion


class ProductCategory(models.Model):
    name = models.CharField(max_length = 20)
    

class ProductImage(models.Model):
    image = models.ImageField(upload_to='images/big/')
    thumb = models.ImageField(upload_to='images/thumb/')
    

class Products(models.Model):
    
    cod = models.CharField(max_length = 10)
    denumirePlic = models.CharField(max_length = 50)
    denumireOferta = models.CharField(max_length = 50)
    denumireLatina = models.CharField(max_length = 50)
    soi = models.CharField(max_length = 50)
    photoCode = models.CharField(max_length = 20)
    namesLanguages = models.CharField(max_length = 50)
    roDesc = models.TextField()
    enDesc = models.TextField()
    huDesc = models.TextField()
    sbDesc = models.TextField()
    ruDesc = models.TextField()
    stage1 = models.CharField(max_length = 10, blank = True)
    stage2 = models.CharField(max_length = 10)
    stage3 = models.CharField(max_length = 10)
    stage4 = models.CharField(max_length = 10)
    stage5 = models.CharField(max_length = 10)
    category = models.ForeignKey(ProductCategory, related_name="ProductsCategory")
    notes = models.TextField()
    barCode = models.CharField(max_length = 13)
    modified = models.BooleanField()
    image = models.ForeignKey(ProductImage, related_name="ProductsImage", null = True, blank = True)
    
    
class OrderProduct(models.Model):
    
    product = models.ForeignKey("Products", related_name = "products")
    quantity = models.IntegerField()
    order = models.ForeignKey("Orders", related_name = "order_products")
    note = models.TextField()
    modified = models.BooleanField()



class OrderStatuses(models.Model):
    
    status = models.CharField(max_length = 10)



class Address(models.Model):
    
    str = models.TextField()
    postalCode = models.CharField(max_length = 20)
    town = models.CharField(max_length = 20)
    country = models.CharField(max_length = 20)

    

class Company(models.Model):
    
    name = models.CharField(max_length = 20)
    address = models.ForeignKey(Address, related_name = "CompanyAddress")
    phone = models.CharField(max_length = 20)
    email = models.EmailField(max_length=75, unique = True)
    password = models.CharField(max_length = 20)
    note = models.TextField()
    type = models.CharField(max_length = 1)
    
    

class Orders(models.Model):
    
    timestamp = models.DateTimeField(auto_now_add = True)
    note = models.TextField()
    name = models.CharField(max_length = 50, blank = False, null = False)
    status = models.ForeignKey(OrderStatuses, related_name = "ordersStatus")
    company = models.ForeignKey(Company, related_name = "ordersCompany", blank = True, null = True)
    total = models.IntegerField(default = 0)

class Admins(models.Model):
    
    username = models.CharField(max_length = 20)
    password = models.CharField(max_length = 20)
    email = models.EmailField()


class passwordRecovery(models.Model):
    
    token = models.CharField(max_length = 20)
    user = models.ForeignKey(Company)


if not reversion.is_registered(Orders):
    reversion.register(Orders)
    reversion.register(Products)
