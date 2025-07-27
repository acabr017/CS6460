from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.db import transaction


# Create your views here.
class UserViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ClassViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def create(self, request, *args, **kwargs):
        # Call the default create method
        response = super().create(request, *args, **kwargs)

        # Re-fetch the newly created instance with full related data
        instance = self.get_queryset().get(id=response.data["id"])
        data = self.get_serializer(instance).data

        return Response(data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        return Class.objects.prefetch_related("units").all()

    # def list(self, request):
    #     queryset = Class.objects.all()
    #     serializer = self.serializer_class(queryset, many=True)
    #     return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SchoolYearViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]  # change this later
    queryset = SchoolYear.objects.all()
    serializer_class = SchoolYearSerializer

    def list(self, request):
        queryset = SchoolYear.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user = self.request.user
        start_date = serializer.validated_data["start_date"]
        end_date = serializer.validated_data["end_date"]
        if SchoolYear.objects.filter(
            user=user, start_date=start_date, end_date=end_date
        ).exists():
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        "School Year already exists.",
                    ]
                }
            )
        serializer.save(user=user)

    def save_related_data(self, request, school_year):
        with transaction.atomic():
            # print("In Save Related Data")
            out_of_service_dates = request.data.get("out_of_service_dates", [])

            # print(f"{out_of_service_dates=}")
            for date in out_of_service_dates:
                OutOfServiceDay.objects.create(school_year=school_year, date=date)
            term_dates = request.data.get("terms", [])
            # print(f"{term_dates=}")
            for term in term_dates:
                Term.objects.create(
                    school_year=school_year,
                    name=term["name"],
                    start_date=term["start"],
                    end_date=term["end"],
                )


class UnitViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  # change this later
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

    def list(self, request):
        queryset = Unit.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
