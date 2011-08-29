from django import forms
from django.forms import ModelForm
from models import ProductImage


class Login(forms.Form):
    
    username = forms.CharField(max_length = 20)
    password = forms.CharField(max_length = 20, widget=forms.PasswordInput)


class upload(ModelForm):
    
    class Meta:
        model = ProductImage


class passwordRecoveryForm(forms.Form):
    
    token = forms.CharField(max_length = 60)
    username = forms.CharField(max_length = 50)
    new_pwd = forms.CharField(max_length = 20, widget=forms.PasswordInput, label="New Password")
    conf_pwd = forms.CharField(max_length = 20, widget=forms.PasswordInput, label="Confirm")
    

class tokenRequestForm(forms.Form):
    
    username = forms.CharField(max_length = 50)
