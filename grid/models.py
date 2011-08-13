from django.db import models
    

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
    category = models.CharField(max_length = 1)
    notes = models.TextField()
    barCode = models.CharField(max_length = 13)
    
    
class OrderProduct(models.Model):
    
    product = models.ForeignKey("Products", related_name = "products")
    quantity = models.IntegerField()
    order = models.ForeignKey("Orders", related_name = "order_products")
    note = models.TextField()


class OrderStatuses(models.Model):
    
    status = models.CharField(max_length = 10)


class Orders(models.Model):
    
    timestamp = models.DateTimeField(auto_now_add = True)
    note = models.TextField()
    name = models.CharField(max_length = 50, blank = False, null = False)
    status = models.ForeignKey(OrderStatuses, related_name = "ordersStatus")
    

    
    




