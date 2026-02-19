
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Avg, F
from django.db.models.functions import TruncDate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Ticket
from .serializers import TicketSerializer
from .utils import classify_ticket_description

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']

class StatsView(APIView):
    def get(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.exclude(status='closed').exclude(status='resolved').count()
        
        # Priority Breakdown
        priority_counts = Ticket.objects.values('priority').annotate(count=Count('id'))
        priority_breakdown = {item['priority']: item['count'] for item in priority_counts}
        
        # Ensure all keys exist
        for p in ['low', 'medium', 'high', 'critical']:
            priority_breakdown.setdefault(p, 0)
            
        # Category Breakdown
        category_counts = Ticket.objects.values('category').annotate(count=Count('id'))
        category_breakdown = {item['category']: item['count'] for item in category_counts}
        
        # Ensure all keys exist
        for c in ['billing', 'technical', 'account', 'general']:
            category_breakdown.setdefault(c, 0)

        # Avg tickets per day (Simple calculation based on date range or distinct dates)
        # Using aggregation to find count per day, then avg
        daily_counts = Ticket.objects.annotate(date=TruncDate('created_at')).values('date').annotate(count=Count('id')).aggregate(avg=Avg('count'))
        avg_tickets_per_day = daily_counts['avg'] if daily_counts['avg'] else 0.0

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets_per_day, 1),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown
        })

class ClassifyView(APIView):
    def post(self, request):
        description = request.data.get('description', '')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        suggestions = classify_ticket_description(description)
        return Response(suggestions)
