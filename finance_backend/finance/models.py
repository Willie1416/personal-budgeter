from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass


class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="income")
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user} inputed ${self.amount} on {self.date} to their income"

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    category = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} spent ${self.amount} on {self.category}."

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    date_set = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} set a budget of ${self.total_budget}."


#Method to calculate total incomes, total expenses, and remaining budget
def calculate_budget_summary(user):
    total_income = Income.objects.filter(use=user).aggregate(models.Sum('amount'))['amount__sum'] or 0

    total_expenses = Transaction.object.filter(user=user).aggregate(models.Sum('amount'))['amount__sum'] or 0

    user_budget = Budget.objects.filter(user=user.order_by('-date_set')).first()
    if user_budget:
        total_budget = user_budget.total_budget
        remaining_budget = total_budget - total_expenses

    else:
        total_budget = 0
        remaining_budget = 0

    return {
        'total_income': total_income,
        'total_expenses': total_expenses,
        'total_budget': total_budget,
        'remaining_budget': remaining_budget
    }
