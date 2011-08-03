from django.conf.urls.defaults import patterns, include, url
from grid.views import *
import settings

#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    #url(r'^admin/', include(admin.site.urls)),
    (r'^$', index),
    (r'^fetch-data/', fetch),
    (r"^import/", importDataBase),
    (r"^data/products", fetchExcel),
    (r"^fetchOrders", fetchOrders),
    (r"^fetchOrderProduct", fetchOrderProduct),
    (r"^data/updateProducts", updateProducts),
)



if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_URL,
        }),
)
