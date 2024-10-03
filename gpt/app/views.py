from rest_framework import viewsets, filters
# from .models import Tariff
# from .serializers import TariffSerializer
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets, filters
from .models import City, MobileTariff, TVTariff, HomeType
from .serializers import (CitySerializer, MobileTariffSerializer, TVTariffSerializer, HomenetTariffSerializer,
                          ProcessSelectionSerializer, HomeTypeSerializer)
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult
from celery_app import generate_res
import time
import requests

YANDEX_API_KEY =''

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HomeTypeViewSet(viewsets.ModelViewSet):
    queryset = HomeType.objects.all()
    serializer_class = HomeTypeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MobileTariffViewSet(viewsets.ModelViewSet):
    queryset = MobileTariff.objects.all()
    serializer_class = MobileTariffSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['cost', 'gb', 'sms', 'min']

    def get_queryset(self):
        queryset = super().get_queryset()
        city_id = self.request.query_params.get('city_id')
        if city_id:
            queryset = queryset.filter(city_id=city_id)
        return queryset

class TVTariffViewSet(viewsets.ModelViewSet):
    queryset = TVTariff.objects.all()
    serializer_class = TVTariffSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['cost', 'number_of_channels', 'speed', 'gb', 'sms', 'min']

    def get_queryset(self):
        queryset = super().get_queryset()
        city_id = self.request.query_params.get('city_id')
        if city_id:
            queryset = queryset.filter(city_id=city_id)
        return queryset

def index(request):
    return render(request, 'index.html')

@login_required
def admin_page(request):
    return render(request, 'admin_page.html')

def login_view(request):
    return auth_views.LoginView.as_view(template_name='login.html')(request)


@api_view(['POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def process_selection(request):
    serializer = ProcessSelectionSerializer(data=request.data)
    print(request.data)    
    if serializer.is_valid():
        selected_mobile_ids = serializer.validated_data.get('selected_mobile_tariff_ids', [])
        selected_tv_ids = serializer.validated_data.get('selected_tv_tariff_ids', [])
        user_text = serializer.validated_data.get('user_text')
    
    #     # Custom message based on user input
    #     custom_text = f"You entered: '{user_text}'. You have selected {len(selected_mobile_ids)} Mobile tariffs and {len(selected_tv_ids)} TV tariffs."

    #     # Retrieve selected tariffs
        mobile_tariffs = MobileTariff.objects.filter(id__in=selected_mobile_ids)
        tv_tariffs = TVTariff.objects.filter(id__in=selected_tv_ids)


    #     # Serialize tariffs
        mobile_serializer = MobileTariffSerializer(mobile_tariffs, many=True)
        tv_serializer = TVTariffSerializer(tv_tariffs, many=True)
        tariffs = ""
        tarif = {'t1':{},'t2':{}}
        # Количество гигабайт: {mob['gb']}\nКоличество СМС: {mob['sms']}\nКоличество минут: {mob['min']}\nДополнительная информация: {mob['additional_info']}\nСтоимость: {mob['cost']}
        for mob in mobile_serializer.data:
            tarif['t1'][mob['name']] = mob['id']
            t = f"Название тарифа: {mob['name']}\nПровайдер: {mob['provider']}\nКатегория тарифа: Мобильная связь\nКоличество гигабайт: {mob['gb']}\nКоличество СМС: {mob['sms']}\nКоличество минут: {mob['min']}\nДополнительная информация: {mob['additional_info']}\nСтоимость: {mob['cost']}"
            tariffs = tariffs + t + '\n' + '-------------' + '\n'
        for tv in tv_serializer.data:
            tarif['t2'][tv['name']] = tv['id']
            t = f"Название тарифа: {tv['name']}\nПровайдер: {tv['provider']}\nКатегория тарифа: {tv['tariff_type']['name']}\n"
            if tv['tariff_type']['in_name'] == 'homenet_tv_mobile_tariff':
                t = t + f"Количество гигабайт: {tv['gb']}\nКоличество СМС: {tv['sms']}\nКоличество минут: {tv['min']}\n"
            if tv['tariff_type']['in_name'] == 'homenet_tariff' or tv['tariff_type']['in_name'] == 'homenet_tv_tariff' or tv['tariff_type']['in_name'] == 'homenet_tv_mobile_tariff':
                t = t + f"Скрорость дошашнего соединения в Мбит/с: {tv['speed']}\n"
            if tv['tariff_type']['in_name'] == 'tv_tariff' or tv['tariff_type']['in_name'] == 'homenet_tv_mobile_tariff':
                t = t + f"Количество каналов: {tv['number_of_channels']}\n"
            t = t + f"Дополнительная информация: {tv['additional_info']}\nСтоимость: {tv['cost']}"
            tariffs = tariffs + t + '\n' + '-------------' + '\n'
        print(tariffs)
        print(tarif)
    #     # Combine serialized data
    #     tariffs = mobile_serializer.data + tv_serializer.data
    #     print(tariffs)
    #     response_data = {
    #         'custom_text': custom_text,
    #         'tariffs': tariffs,
    #     }
    result = generate_res.delay(user_text, tariffs, tarif)
    response_data = {
            # 'custom_text': custom_text,
            # 'tariffs': tariffs,
        'id':result.id
        }
    # time.sleep(10)
    return Response(response_data, status=status.HTTP_200_OK)

    #     return Response(response_data, status=status.HTTP_200_OK)
    # else:
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def check_status(request, id):
    # id = request.data.id
    print(id)
    result = AsyncResult(id)
    if result.ready():
        text, t = result.result
        mob = []
        tv = []
        for i in t['t1'].keys():
            if i in text:
                mob.append(int(t['t1'][i]))
        for i in t['t2'].keys():
            if i in text:
                tv.append(int(t['t2'][i]))
        mobile_tariffs = MobileTariff.objects.filter(id__in=mob)
        tv_tariffs = TVTariff.objects.filter(id__in=tv)
        mobile_serializer = MobileTariffSerializer(mobile_tariffs, many=True)
        tv_serializer = TVTariffSerializer(tv_tariffs, many=True)
        tariffs = mobile_serializer.data + tv_serializer.data
        print(tariffs)
        data = {
            "status": 'ready',
            "successful": result.successful(),
            'tariffs': tariffs,
            "custom_text": text,
        }
        return Response(data, status=status.HTTP_200_OK)
    else:
        data = {
            "status": 'processing'
        }
        return Response(data, status=status.HTTP_200_OK)
    # time.sleep(5)
    # custom_text= 'AAAAAAAAAABBBBBBBBBB'
    # response_data = {
    #         'custom_text': custom_text,
    #         'status': 'ready'
    #     }
    # return Response(response_data, status=status.HTTP_200_OK)
    # pass


@api_view(['POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def gps_check(request):
    lat = request.data['lat']
    lon = request.data['lon']
    geocoder_api_url = f"https://geocode-maps.yandex.ru/1.x/?format=json&geocode={lon},{lat}&apikey={YANDEX_API_KEY}"
    
    # Выполняем запрос к API
    response = requests.get(geocoder_api_url)
    if response.status_code == 200:
        geo_data = response.json()
        
        # Проверяем наличие данных в ответе
        if 'response' in geo_data and \
           'GeoObjectCollection' in geo_data['response'] and \
           geo_data['response']['GeoObjectCollection']['featureMember']:
            
            geo_object = geo_data['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']
            detailed_address = geo_object['metaDataProperty']['GeocoderMetaData']['text']
            print(detailed_address)
            detailed_address = detailed_address.split(',')[1].replace(' ', '')
            data = {'address':detailed_address}
            return  Response(data, status=status.HTTP_200_OK)
