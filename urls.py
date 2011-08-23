from django.conf.urls.defaults import patterns, include, url
from grid.views import *
import settings

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    
    (r"^login/$", userLogin),
    (r"^logout/$", userLogout),
    (r'^$', index),
    (r"^import/", importDataBase),
    
    # products
    (r"^data/products", fetchProducts),
    (r"^data/updateProducts", updateProducts),
    (r"^data/productCategories", productCategoryRead),
    (r"^uploadProductImage", uploadProductImage),
    (r"^data/aProduct", fetchProduct),

    # orders
    (r"^data/orders", fetchOrders),
    (r"^data/updateorder", updateOrders),
    (r"^data/deleteorder", deleteOrder),
    (r"^data/createorder", createOrder),
    (r"^printOrder", printOrder),
    (r"^downloadOrder", downloadOrder),
    (r"^sendMail", sendMail),
    
    # order products 
    (r"^data/orderProducts", fetchOrderProducts),
    (r"^data/updateOrderProducts", updateOrderProducts),
    (r"^data/createOrderProduct", createOrderProduct),
    (r"^data/deleteOrderProduct", deleteOrderProduct),
    (r"^downloadCsv", exportOrderProductCsv),
    (r"^importOrderProductCsv", importOrderProductCsv),
    
    # company
    (r"^data/CompanyRead", companyRead),
    
)



if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_URL,
        }),
)
