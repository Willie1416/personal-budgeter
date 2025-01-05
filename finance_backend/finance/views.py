from django.shortcuts import render, redirect
from rest_framework import viewsets, status
from .models import Transaction, User, Income
from .serializer import TransactionSerializer, IncomeSerializer

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

    print("Received data:", request.data)  # Check if the data is correctly received

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
            access_token = refresh.access_token
            login(request, user)
            return Response({"message": "User logged in successfully",'token': str(access_token)}, status=200)
        else:
            return Response({"message": "Invalid credentials"}, status=400)


@api_view(['POST'])
def income(request):
    print(request.data)
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
        print(incomes)
        # Use the serializer to format the response
        serializer = IncomeSerializer(incomes, many=True)
        print(serializer)
        return Response(serializer.data, status=200)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer







