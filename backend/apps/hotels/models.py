from django.db import models
from django.contrib.postgres.fields import ArrayField

class Hotel(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=255, blank=True, null=True)
    rating = models.CharField(max_length=10, default='5.0/5.0')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.CharField(max_length=255, blank=True, null=True)
    amenities = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'hotels'

    def __str__(self):
        return self.name
