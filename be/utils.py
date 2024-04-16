import string
import random

def randomword(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

def setAuthToken(AUTHORIZED_TOKEN, data):
    AUTHORIZED_TOKEN[data["email"].replace("@", "")] = data["token"]

    return AUTHORIZED_TOKEN