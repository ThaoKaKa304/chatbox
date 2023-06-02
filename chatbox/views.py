from django.shortcuts import render
from django.http import JsonResponse
from .models import Message
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



def chat_room(request):
    messages = Message.objects.all().order_by('-created_at')[:50]
    return render(request, 'chat.html', {'messages': messages})

@csrf_exempt
def send_message(request):
    sender = 'User'
    text = request.POST.get('text')
    if not text:
        return HttpResponse(json.dumps({'status': 'error', 'message': 'Text is required.'}), content_type='application/json')
    message = Message(sender=sender, text=text)
    message.save()

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'chat', {'type': 'chat.message', 'sender': sender, 'text': text, 'timestamp': message.created_at.strftime('%Y-%m-%d %H:%M:%S')}
    )

    return HttpResponse(json.dumps({'status': 'ok'}), content_type='application/json')