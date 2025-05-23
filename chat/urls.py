from django.urls import path
from .views import RegisterView, LoginView, CreatePrivateChatView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('create-chat/', CreatePrivateChatView.as_view(), name='create_chat'),
    path('chat/<int:chat_id>/exists/', views.chat_exists),
    path('user-chats/', views.user_chats),
    path('chat/<int:chat_id>/delete/', views.delete_chat),
    path('chat/<int:chat_id>/messages/', views.get_chat_messages),
    path('chat/<int:chat_id>/partner/', views.get_chat_partner),
]
