from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()


class Account(models.Model):
    email = models.CharField(max_length=100, unique=True)
    pw_hash = models.CharField(max_length=500, unique=True)

    def __str__(self):
        return self.email


class SchoolYear(models.Model):
    schoolyear = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    weekends = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.schoolyear} ({self.user.email})"


class Term(models.Model):
    school_year = models.ForeignKey(
        SchoolYear, on_delete=models.CASCADE, related_name="terms"
    )
    name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.name} ({self.school_year.schoolyear})"


class OutOfServiceDay(models.Model):
    school_year = models.ForeignKey(
        SchoolYear, on_delete=models.CASCADE, related_name="out_of_service_days"
    )
    date = models.DateField()

    def __str__(self):
        return f"{self.date}"


class Class(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300, blank=True)
    school_year = models.ForeignKey(
        SchoolYear, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.name


class Unit(models.Model):
    class_obj = models.ForeignKey(
        Class, on_delete=models.SET_NULL, null=True, blank=True, related_name="units"
    )
    name = models.CharField(max_length=100)
    length = models.IntegerField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    color = models.CharField(max_length=7, blank=True, null=True)

    def __str__(self):
        return self.name
