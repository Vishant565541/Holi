from django.db import models

class Booking(models.Model):
    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Pending', 'Pending'),
        ('Cancelled', 'Cancelled'),
        ('In Flight', 'In Flight'),
    )
    
    id = models.CharField(max_length=50, primary_key=True)
    user_email = models.CharField(max_length=100)
    type = models.CharField(max_length=50) # 'helicopter', 'package', 'hotel', 'boat'
    name = models.CharField(max_length=100)
    details = models.TextField(blank=True, null=True)
    date = models.CharField(max_length=50)
    passengers = models.IntegerField(default=2)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Confirmed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bookings'

    def __str__(self):
        return f"{self.id} - {self.name} ({self.user_email})"
