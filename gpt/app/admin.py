from django.contrib import admin
from .models import City, MobileTariff, TVTariff

admin.site.register(City)
admin.site.register(MobileTariff)
admin.site.register(TVTariff)
# Register your models here.
