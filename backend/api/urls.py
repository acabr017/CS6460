from django.contrib import admin
from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register("user", UserViewset, basename="user")
router.register("class", ClassViewset, basename="class")
router.register("schoolyear", SchoolYearViewset, basename="schoolyear")
router.register("unit", UnitViewset, basename="unit")


urlpatterns = router.urls
