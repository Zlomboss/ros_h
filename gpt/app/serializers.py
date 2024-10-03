from rest_framework import serializers
from .models import City, MobileTariff, TVTariff, HomeType

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']

class HomeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeType
        fields = ['id', 'name', 'in_name']

class MobileTariffSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source='city', write_only=True)

    class Meta:
        model = MobileTariff
        fields = ['id', 'name', 'provider', 'gb', 'sms', 'min', 'cost', 'additional_info', 'city', 'city_id']

class TVTariffSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source='city', write_only=True)
    tariff_type = HomeTypeSerializer(read_only=True)
    tariff_type_id = serializers.PrimaryKeyRelatedField(queryset=HomeType.objects.all(), source='tariff_type', write_only=True)

    class Meta:
        model = TVTariff
        fields = ['id', 'name', 'provider', 'speed', 'gb', 'sms', 'min', 'number_of_channels', 'cost', 'additional_info', 'city', 'city_id', 'tariff_type', 'tariff_type_id']

class TVTariffSerializerNEW(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source='city', write_only=True)
    tariff_type = HomeTypeSerializer(read_only=True)
    tariff_type_id = serializers.PrimaryKeyRelatedField(queryset=HomeType.objects.all(), source='tariff_type', write_only=True)

    class Meta:
        model = TVTariff
        fields = ['id', 'name', 'provider', 'number_of_channels', 'cost', 'additional_info', 'city', 'city_id', 'tariff_type', 'tariff_type_id']

class HomenetTariffSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source='city', write_only=True)
    tariff_type = HomeTypeSerializer(read_only=True)
    tariff_type_id = serializers.PrimaryKeyRelatedField(queryset=HomeType.objects.all(), source='tariff_type', write_only=True)

    class Meta:
        model = TVTariff
        fields = ['id', 'name', 'provider', 'speed', 'cost', 'additional_info', 'city', 'city_id', 'tariff_type', 'tariff_type_id']

class HomenetTVTariffSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source='city', write_only=True)
    tariff_type = HomeTypeSerializer(read_only=True)
    tariff_type_id = serializers.PrimaryKeyRelatedField(queryset=HomeType.objects.all(), source='tariff_type', write_only=True)

    class Meta:
        model = TVTariff
        fields = ['id', 'name', 'provider', 'speed', 'number_of_channels', 'cost', 'additional_info', 'city', 'city_id', 'tariff_type', 'tariff_type_id']

class HomeTVTariffSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), source='city', write_only=True)
    tariff_type = HomeTypeSerializer(read_only=True)
    tariff_type_id = serializers.PrimaryKeyRelatedField(queryset=HomeType.objects.all(), source='tariff_type', write_only=True)

    class Meta:
        model = TVTariff
        fields = ['id', 'name', 'provider', 'speed', 'gb', 'sms', 'min', 'number_of_channels', 'cost', 'additional_info', 'city', 'city_id', 'tariff_type', 'tariff_type_id']


class ProcessSelectionSerializer(serializers.Serializer):
    selected_mobile_tariff_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=True
    )
    selected_tv_tariff_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=True
    )
    user_text = serializers.CharField(max_length=500, allow_blank=False)