from rest_framework import serializers
from .models import *
from datetime import timedelta


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "pw_hash")


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        exclude = ["school_year"]
        extra_kwargs = {
            "start_date": {"required": False},
            "end_date": {"required": False},
            "school_year": {"required": False},
        }


class OutOfServiceDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = OutOfServiceDay
        exclude = ["school_year"]
        extra_kwargs = {
            "start_date": {"required": False},
            "end_date": {"required": False},
            "school_year": {"required": False},
        }


class SchoolYearSerializer(serializers.ModelSerializer):
    terms = TermSerializer(many=True, required=False)
    out_of_service_days = OutOfServiceDaySerializer(many=True, required=False)

    class Meta:
        model = SchoolYear
        fields = [
            "id",
            "schoolyear",
            "start_date",
            "end_date",
            "weekends",
            "terms",
            "out_of_service_days",
        ]
        read_only_fields = ["user"]

    def create(self, validated_data):
        print(f"{validated_data=}")
        terms_data = validated_data.pop("terms", [])
        out_of_service_days_data = validated_data.pop("out_of_service_days", [])
        school_year = SchoolYear.objects.create(**validated_data)

        for term in terms_data:
            Term.objects.create(school_year=school_year, **term)

        for day in out_of_service_days_data:
            OutOfServiceDay.objects.create(school_year=school_year, **day)

        return school_year

    def update(self, instance, validated_data):
        # Pop nested data
        print(f"{validated_data=}")
        terms_data = validated_data.pop("terms", [])
        out_of_service_data = validated_data.pop("out_of_service_days", [])

        # Update base fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Clear and re-add terms
        instance.terms.all().delete()
        for term in terms_data:
            if term.get("start_date") and term.get("end_date"):  # Skip incomplete terms
                Term.objects.create(
                    school_year=instance,
                    name=term.get("name", "Unnamed Term"),
                    start_date=term["start_date"],
                    end_date=term["end_date"],
                )

        # Clear and re-add out-of-service days
        instance.out_of_service_days.all().delete()
        for day in out_of_service_data:
            OutOfServiceDay.objects.create(school_year=instance, **day)

        return instance


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = [
            "id",
            "name",
            "length",
            "class_obj",
            "start_date",
            "color",
            "end_date",
        ]

    def get_end_date(self, obj):
        if obj.start_date and obj.length:
            return obj.start_date + timedelta(days=obj.length - 1)
        return None


class ClassSerializer(serializers.ModelSerializer):
    units = UnitSerializer(many=True, read_only=True)

    class Meta:
        model = Class
        fields = ["id", "name", "description", "school_year", "units"]
        read_only_fields = ["user"]
        extra_kwargs = {"user_id": {"required": False}}

    def to_representation(self, instance):
        return super().to_representation(instance)

    # def create(self, validated_data):
    #     # If user isn’t in validated_data, fallback to context (optional)
    #     if "user" not in validated_data:
    #         validated_data["user"] = self.context["request"].user
    #     return super().create(validated_data)
