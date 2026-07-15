"""
Migration 0003: Upgrade OTPVerification model
- Drops and recreates the otp_verifications table with the new secure schema
  (hashed OTP, expiry, attempt tracking, rate-limit timestamp).
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_otpverification_user_anniversary_and_more'),
    ]

    operations = [
        # Drop the old lightweight OTPVerification table
        migrations.DeleteModel(
            name='OTPVerification',
        ),

        # Recreate with the full secure schema
        migrations.CreateModel(
            name='OTPVerification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(db_index=True, max_length=254)),
                ('otp_hash', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField()),
                ('attempts', models.PositiveSmallIntegerField(default=0)),
                ('is_verified', models.BooleanField(default=False)),
                ('last_sent_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'otp_verifications',
                'ordering': ['-created_at'],
            },
        ),
    ]
