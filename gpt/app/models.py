from django.db import models
    
class City(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
    
class HomeType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    in_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class MobileTariff(models.Model):
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    gb = models.IntegerField()
    sms = models.IntegerField()
    min = models.IntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='mobile_tariffs')
    additional_info = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} - {self.provider}"

class TVTariff(models.Model):
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=255)
    speed = models.IntegerField()
    gb = models.IntegerField()
    sms = models.IntegerField()
    min = models.IntegerField()
    number_of_channels = models.IntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='tv_tariffs')
    tariff_type = models.ForeignKey(HomeType, on_delete=models.CASCADE, related_name='tv_tariffs')
    additional_info = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} - {self.provider}"


