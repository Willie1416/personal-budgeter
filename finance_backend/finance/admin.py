from django.contrib import admin

from .models import User, Income, Expenses, Budget

# Register your models here.

admin.site.register(User)
admin.site.register(Income)
admin.site.register(Expenses)
admin.site.register(Budget)