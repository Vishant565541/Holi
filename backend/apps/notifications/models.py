from django.db import models

class Ticket(models.Model):
    STATUS_CHOICES = (
        ('Open', 'Open'),
        ('Resolved', 'Resolved'),
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    user_email = models.CharField(max_length=100)
    subject = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    date = models.CharField(max_length=50)
    messages = models.JSONField(default=list)  # list of objects: [{"sender": "user"|"support", "text": "...", "date": "..."}]

    class Meta:
        db_table = 'tickets'

    def __str__(self):
        return f"{self.id} - {self.subject} ({self.user_email})"
