from rest_framework import serializers
from .models import Transaction, Income

class IncomeSerializer(serializers.ModelSerializer):
    # Use a custom format for the date field
    date = serializers.DateTimeField(format="%Y-%m-%d")

    class Meta:
        model = Income
        fields = ['amount', 'date']
        
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

        