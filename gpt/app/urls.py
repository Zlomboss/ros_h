from django.urls import path, include
from .views import (
    CityViewSet, MobileTariffViewSet, TVTariffViewSet, HomeTypeViewSet,
    index, admin_page, login_view, process_selection, check_status, gps_check
)
from rest_framework import routers
from django.contrib.auth import views as auth_views

router = routers.DefaultRouter()
# router.register(r'tariffs', TariffViewSet)
router.register(r'home-types', HomeTypeViewSet)
router.register(r'cities', CityViewSet)
router.register(r'mobile-tariffs', MobileTariffViewSet)
router.register(r'tv-tariffs', TVTariffViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('', index, name='index'),
    path('admin-page/', admin_page, name='admin_page'),
    path('login/', login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('process-selection/', process_selection, name='process_selection'),
    path('check-status/<str:id>/', check_status, name='check_status'),
    path('gps-check/', gps_check, name='gps_check'),
]
