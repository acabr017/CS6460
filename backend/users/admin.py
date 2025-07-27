# from django.contrib import admin
# from .models import *

# # Register your models here.
# admin.site.register(CustomUser)

from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()

# Avoid double-registration error
from django.contrib.admin.sites import AlreadyRegistered

try:
    admin.site.register(User)
except AlreadyRegistered:
    pass
