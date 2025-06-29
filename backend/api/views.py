from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import *
from .models import *
from rest_framework.response import Response


# Create your views here.
class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ClassViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def list(self, request):
        queryset = Class.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class SchoolYearViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = SchoolYear.objects.all()
    serializer_class = SchoolYearSerializer

    def list(self, request):
        queryset = SchoolYear.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class UnitViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

    def list(self, request):
        queryset = Unit.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
