from django.db import models

class CareerApplication(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    qualification = models.CharField(max_length=255, blank=True, null=True)
    experience = models.CharField(max_length=255, blank=True, null=True)
    cv_file = models.CharField(max_length=255)
    photo_file = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'career_applications'

    def __str__(self):
        return f"{self.name} - {self.email}"
