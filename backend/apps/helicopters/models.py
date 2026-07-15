from django.db import models
from django.contrib.postgres.fields import ArrayField

class Helicopter(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    tagline = models.CharField(max_length=200, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    capacity = models.IntegerField()
    speed = models.CharField(max_length=50, blank=True, null=True)
    range = models.CharField(max_length=50, blank=True, null=True)
    safety_rating = models.CharField(max_length=10, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    features = ArrayField(models.CharField(max_length=200), default=list, blank=True)
    specs = models.JSONField(default=dict)      # key-value specs
    schedules = ArrayField(models.CharField(max_length=100), default=list, blank=True)

    class Meta:
        db_table = 'helicopters'

    def __str__(self):
        return self.name
