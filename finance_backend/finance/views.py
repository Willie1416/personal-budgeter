from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from .models import Expenses, User, Income
from .serializer import ExpensesSerializer, IncomeSerializer

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required




@login_required
def protected_route(request):
    return JsonResponse({"message": "You are authenticated!"})


@api_view(['POST'])
def register_user(request):

    if request.method == 'POST':
        # Data from frontend
        username = request.data.get('username')
        password = request.data.get('password')

        # Check if username and password are provided
        if not username or not password:
            return Response({"error": "Both username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user if it doesn't exist
        try:
            user = User.objects.create_user(username=username, password=password)
            return Response({"message": "User registered and logged in successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error Creating the user": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Login User
@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Log the user in and create a session
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })        
        else:
            return Response({"message": "Invalid credentials"}, status=400)


@api_view(['POST'])
def income(request):
    if request.method == 'POST':
        username = request.data.get('username')
        amount = request.data.get('amount')
        date = request.data.get('date')

        # Retrieve the user object using the username
        try:
            user = User.objects.get(username=username)  # Find the user by username
        except User.DoesNotExist:
            return Response({"error": f"User with username {username} does not exist."}, status=400)

        try:
            income = Income.objects.create(user=user, amount=amount, date=date)
            return Response({"message": f'{user} put in his new income of {amount} on {date}'})
        except Exception as e:
            return Response({f"error Inputing the new income for user {user} {str(e)}"}, status=400)

@api_view(['GET'])
def get_income(request):
    if request.method == 'GET':
        # Assuming you're using the request's authenticated user
        username = request.query_params.get('username')

        # Retrieve the user object using the username
        try:
            user = User.objects.get(username=username)  # Find the user by username
        except User.DoesNotExist:
            return Response({"error": f"User with username {username} does not exist."}, status=400)

        # Get the incomes for the logged-in user
        incomes = Income.objects.filter(user=user)

        # Use the serializer to format the response
        serializer = IncomeSerializer(incomes, many=True)
        return Response(serializer.data, status=200)

@api_view(['POST'])
def expense(request):
    if request.method == 'POST':
        username = request.data.get('username')
        amount = request.data.get('amount')
        category = request.data.get('category')
        date = request.data.get('date')

        # Retrieve the user object using the username
        try:
            user = User.objects.get(username=username)  # Find the user by username
        except User.DoesNotExist:
            return Response({"error": f"User with username {username} does not exist."}, status=400)

        try:
            income = Expenses.objects.create(user=user, category=category, amount=amount, date=date)
            return Response({"message": f'{user} put in his new expense of {amount} in category: {category} on {date}'})
        except Exception as e:
            return Response({f"error Inputing the new expense for user {user} {str(e)}"}, status=400)

@api_view(['GET'])
def get_expenses(request):
    if request.method == 'GET':
        # Assuming you're using the request's authenticated user
        username = request.query_params.get('username')

        # Retrieve the user object using the username
        try:
            user = User.objects.get(username=username)  # Find the user by username
        except User.DoesNotExist:
            return Response({"error": f"User with username {username} does not exist."}, status=400)

        # Get the expenses for the logged-in user
        expenses = Expenses.objects.filter(user=user)

        # Use the serializer to format the response
        serializer = ExpensesSerializer(expenses, many=True)
        return Response(serializer.data, status=200)









