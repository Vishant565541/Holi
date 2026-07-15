from django.db import models
from django.contrib.postgres.fields import ArrayField

class Tour(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    tagline = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    duration = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    image = models.CharField(max_length=255, blank=True, null=True)
    inclusions = ArrayField(models.CharField(max_length=255), default=list, blank=True)
    exclusions = ArrayField(models.CharField(max_length=255), default=list, blank=True)
    itinerary = models.JSONField(default=list)   # list of day objects: [{"day": 1, "title": "...", "desc": "...", "stay": "...", "transport": "..."}]

    class Meta:
        db_table = 'tours'

    def __str__(self):
        return self.name
