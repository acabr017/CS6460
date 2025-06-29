from django.db import models

# Create your models here.


class User(models.Model):
    email = models.CharField(unique=True)
    pw_hash = models.CharField(unique=True)

    def __str__(self):
        return self.email


class SchoolYear(models.Model):
    schoolyear = models.CharField()
    start_date = models.DateField()
    end_date = models.DateField()
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.schoolyear


class Class(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField()
    description = models.CharField()

    def __str__(self):
        return self.name


class Unit(models.Model):
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    name = models.CharField()
    length = models.IntegerField()

    def __str__(self):
        return self.name
