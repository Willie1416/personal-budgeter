from rest_framework import serializers
from .models import Expenses, Income

class IncomeSerializer(serializers.ModelSerializer):
    # Use a custom format for the date field
    date = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta:
        model = Income
        fields = ['amount', 'date']
        
class ExpensesSerializer(serializers.ModelSerializer):

    date = serializers.DateTimeField(format="%Y-%m-%d")
    
    class Meta:
        model = Expenses
        fields = ['amount', 'category', 'date']

        