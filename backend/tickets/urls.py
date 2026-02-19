
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, StatsView, ClassifyView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tickets/stats/', StatsView.as_view(), name='ticket-stats'),
    path('tickets/classify/', ClassifyView.as_view(), name='ticket-classify'),
]
