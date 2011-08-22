from django import forms
from django.forms import ModelForm
from models import ProductImage


class Login(forms.Form):
    
    username = forms.CharField(max_length = 20)
    password = forms.CharField(max_length = 20)


class upload(ModelForm):
    
    class Meta:
        model = ProductImage
