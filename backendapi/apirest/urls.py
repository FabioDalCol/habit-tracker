from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apirest import views

# Create a router and register our viewsets with it.
habit_list = views.HabitViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

habit_detail = views.HabitViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

user_detail = views.AccountViewSet.as_view({
    'post': 'create',
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('users/<str:pk>', user_detail, name='user-detail'),
    path('users/<str:uid>/habits/', habit_list, name='habit_list'),
    path('users/<str:uid>/habits/<str:pk>', habit_detail, name='habit_detail')
]


