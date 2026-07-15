from django.db import models
from django.contrib.postgres.fields import ArrayField

class Boat(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=100, blank=True, null=True)
    capacity = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.CharField(max_length=255, blank=True, null=True)
    schedules = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'boats'

    def __str__(self):
        return self.name
