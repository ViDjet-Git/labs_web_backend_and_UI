from django.core.serializers import serialize
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, MessageSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .models import Chat, Message
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
# Create your views here.

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'User created successfully', 'state':'success'}, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'message':'Welcome,', 'username': user.username, 'email':user.email, 'state':'success', 'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_partner(request, chat_id):
    try:
        chat = Chat.objects.get(id=chat_id)
        partner = chat.participants.exclude(id=request.user.id).first()
        return Response({'username': partner.username})
    except Chat.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, chat_id):
    try:
        chat = Chat.objects.get(id=chat_id, participants=request.user)
    except Chat.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=status.HTTP_404_NOT_FOUND)

    messages = Message.objects.filter(chat=chat).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_chat(request, chat_id):
    user = request.user
    try:
        chat = Chat.objects.get(id=chat_id)
    except Chat.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=status.HTTP_404_NOT_FOUND)

    if user in chat.participants.all():
        chat.delete()
        return Response({'success': 'Chat deleted'}, status=status.HTTP_204_NO_CONTENT)
    else:
        return Response({'error': 'You are not a participant of this chat'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_chats(request):
    user = request.user
    chats = Chat.objects.filter(participants=user)

    chat_list = []
    for chat in chats:
        other_users = chat.participants.exclude(id=user.id)
        other_usernames = [u.username for u in other_users]
        chat_list.append({
            'chat_id': chat.id,
            'participants': other_usernames,
        })

    return Response(chat_list)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_exists(request, chat_id):
    try:
        Chat.objects.get(id=chat_id)
        return Response({"exists": True})
    except Chat.DoesNotExist:
        return Response({"error": "Chat not found"}, status=404)

class CreatePrivateChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        target_user_id = request.data.get('user_id')

        if not target_user_id:
            return Response({'error': 'user_id is required'}, status=400)

        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        # Перевірка чи чат вже існує
        existing_chat = Chat.objects.filter(participants=request.user).filter(participants=target_user).first()
        if existing_chat:
            return Response({'chat_id': existing_chat.id, 'message': 'Chat already exists'})

        chat = Chat.objects.create()
        chat.participants.set([request.user, target_user])
        chat.save()

        return Response({'chat_id': chat.id, 'message': 'Chat created successfully'})
