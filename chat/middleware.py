from urllib.parse import parse_qs
from rest_framework.authtoken.models import Token
from channels.middleware import BaseMiddleware
from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser

@sync_to_async
def get_user_from_token(token_key):
    try:
        return Token.objects.get(key=token_key).user
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token_key = query_string.get("token")

        if token_key:
            scope['user'] = await get_user_from_token(token_key[0])
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)