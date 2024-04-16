import random

def randomword(length):
   letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
   return ''.join(random.choice(letters) for i in range(length))

def setAuthToken(AUTHORIZED_TOKEN, data):
    AUTHORIZED_TOKEN[data["email"].replace("@", "")] = data["token"]

    return AUTHORIZED_TOKEN