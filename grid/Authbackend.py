from django.contrib.auth.models import User, check_password
from models import *


class ExcelAuthBackend(object):

    supports_object_permissions = False
    supports_anonymous_user = False
    supports_inactive_user = False
    
    
    def authenticate(self, username=None, password=None):
        #if username == "alin" and password == "test":
            #user = User.objects.create(username = username, password = password)
            #user = User.objects.get(username = username)
            #return user
        
        try:
            company = Company.objects.get(email = username, password = password)
            try:
                user = User.objects.get(username = company.email, password = company.password)
            except User.DoesNotExist:
                user = User(username = company.email, password=company.password)
                user.is_active = True
                user.save()
            return user
        except Exception, err:
            print err
            return None


    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
