import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Chat, Message

User = get_user_model()
ONLINE_USERS = set()

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'
        self.user = self.scope["user"]

        if self.user.is_authenticated:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope["user"]

        #Save to DB
        chat = await database_sync_to_async(lambda: Chat.objects.get(id=self.chat_id))()
        await database_sync_to_async(Message.objects.create)(
            chat=chat,
            sender=user,
            content=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': user.username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))


class OnlineUserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_authenticated:
            print('WebSocket CONNECTED')
            ONLINE_USERS.add(self.user)
            await self.channel_layer.group_add("online_users", self.channel_name)
            await self.accept()
            await self.send_online_users()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated and self.user in ONLINE_USERS:
            print('WebSocket DISCONNECTED')
            ONLINE_USERS.remove(self.user)
            await self.channel_layer.group_discard("online_users", self.channel_name)
            await self.send_online_users()

    async def send_online_users(self):
        users_data = [
            {"id": user.id, "username": user.username}
            for user in ONLINE_USERS
        ]

        await self.channel_layer.group_send(
            "online_users",
            {
            "type": "online.users",
            "users": users_data,
            }
        )

        await self.send(text_data=json.dumps({
            "type": "current_user",
            "current_user_id": self.user.id,
        }))

    async def online_users(self, event):
        await self.send(text_data=json.dumps({
            "type": "online_users",
            "users": event["users"],
        }))