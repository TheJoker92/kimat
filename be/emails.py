import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import random, string


def sendTokenEmail(LOGIN_SENDER, PASSWORD_SENDER, data) :
  # Create message container - the correct MIME type is multipart/alternative.
  msg = MIMEMultipart('alternative')
  msg['Subject'] = "Dgt@ - Richiesta accesso al file"
  msg['From'] = LOGIN_SENDER
  msg['To'] = data["email"]

  # Create the body of the message (a plain-text and an HTML version).
  htmlString = """\
  <html>
    <head></head>
    <body>
      <p>Ciao {0}, Hai effettuato la richiesta di accesso al file. <br>
        di seguito il token da inserire è
      </p>
      <br>
      <strong>{1}</strong>
    </body>
  </html>
  """

  htmlString = htmlString.replace("{0}", data["firstName"]).replace("{1}", data["token"])

  # Record the MIME types of both parts - text/plain and text/html.

  htmlContent = MIMEText(htmlString, 'html')

  # Attach parts into message container.
  # According to RFC 2046, the last part of a multipart message, in this case
  # the HTML message, is best and preferred.
  msg.attach(htmlContent)

  # Send the message via local SMTP server.
  s = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=10)

  # sendmail function takes 3 arguments: sender's address, recipient's address
  # and message to send - here it is sent as one string.
  s.set_debuglevel(1)
  try:
      s.login(LOGIN_SENDER, PASSWORD_SENDER)
      s.sendmail(msg['From'], msg["To"], msg.as_string())
  finally:
      s.quit()


    