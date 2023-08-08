# from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from django.urls import path
from . import views

urlpatterns = [
    path('user/add-role/', views.add_role),
    path('user/authorization', views.authorize),
    path('user/add-author/', views.add_author),
    path('user/get-all-author', views.get_all_authors),
    path('user/get-all-genres', views.get_all_genres),
    path('user/add-genre/', views.add_genre),
    path('user/sign-up/', views.sign_up),
    path('user/sign-in/', views.sign_in),
    path('user/all-users', views.all_users),
    path('user/get-user/<pk>/', views.get_user),
    path('user/delete-user/<pk>/', views.delete_user),
    path('book/search', views.search),
    path('book/top-five-rated', views.top_five_rated),
    path('book/recently-added', views.recently_added),
    path('book/<slug>/', views.BookView.as_view()),
    path('book/', views.BookView.as_view()),
    path('order/<pk>/', views.OrderRecordView.as_view()),
    path('order', views.OrderRecordView.as_view())
]
