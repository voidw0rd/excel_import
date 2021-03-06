from django.conf.urls.defaults import patterns, include, url
from grid.views import *
import settings

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    
    (r'^$', index),
    (r"^login/$", userLogin),
    (r"^logout", userLogout),
    (r"^pwdRecovery/$", pwdRecovery),
    (r"^import/", importDataBase),
    (r"^resetPasswordToken/$", resetPasswordToken),
    
    # products
    (r"^data/productsRead",     productsRead),
    (r"^data/productsUpdate",   productsUpdate),
    (r"^data/productsCreate",   productsCreate),
    (r"^data/productsDelete",   productsDelete),
    (r"^data/productCategoriesRead", productCategoryRead),
    (r"^data/productCheckModified", productCheckModified),

    (r"^downloadProductImage", downloadProductImage),
    (r"^uploadProductImage",   uploadProductImage),

    # orders
    (r"^data/ordersRead",   ordersRead),
    (r"^data/ordersUpdate", ordersUpdate),
    (r"^data/ordersDelete", ordersDelete),
    (r"^data/ordersCreate", ordersCreate),
    
    (r"^printOrder",    printOrder),
    (r"^downloadOrder", downloadOrder),
    (r"^sendMail",      sendMail),
    
    # order products 
    (r"^data/orderProductsRead",   orderProductsRead),
    (r"^data/orderProductsUpdate", orderProductsUpdate),
    (r"^data/orderProductsCreate", orderProductsCreate),
    (r"^data/orderProductsDelete", orderProductsDelete),
    
    (r"^exportOrderProductCsv", exportOrderProductCsv),
    (r"^importOrderProductCsv", importOrderProductCsv),

    (r"^data/orderStatusesRead", orderStatusesRead),

    # company
    (r"^data/CompanyRead", companyRead),

    # users
    (r"^data/usersRead",     usersRead),
    (r"^data/usersUpdate",   usersUpdate),
    (r"^data/usersCreate",   usersCreate),
    (r"^data/usersDelete",   usersDelete),
    
)



if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_URL,
        }),
)
