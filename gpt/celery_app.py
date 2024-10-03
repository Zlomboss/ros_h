from celery import Celery
# from kombu import Exchange, Queue
from AI.giga import generate
import time

# Настройка Celery
app_AI = Celery('celery_AI', broker='amqp://guest:guest@localhost:5672//', backend='rpc://')

@app_AI.task()
def generate_res(stri, tar, t):
    result = generate(stri, tar, t)
    return result
