from django.contrib.auth.models import User, check_password
from models import *


class ExcelAuthBackend(object):

    supports_object_permissions = False
    supports_anonymous_user = False
    supports_inactive_user = False
    
    
    def authenticate(self, username=None, password=None):

        try:
            usr = Admins.objects.get(username = username, password = password)
            user = self.get_usr(username, password)
            user.is_staff = True
            user.save()
            
            return user
        except Exception, err:
            print err
        
        try: 
            usr = Company.objects.get(email = username, password = password)
            user = self.get_usr(username, password)
            user.is_staff = False
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


    def get_usr(self, username, password):
        
        try:
            user = User.objects.get(username = username, password = password)
            return User
        except User.DoesNotExist:
            user = User(username = username, password = password)
            return user
